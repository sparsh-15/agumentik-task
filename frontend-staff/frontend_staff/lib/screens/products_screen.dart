import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:socket_io_client/socket_io_client.dart' as io;
import 'package:provider/provider.dart';
import '../providers/cart_provider.dart';
import '../config/api_config.dart';
import '../models/product.dart';
import '../services/notification_service.dart';
import '../widgets/product_card.dart';
import '../widgets/notification_sheet.dart';
import '../utils/app_colors.dart';
import 'cart_screen.dart';
import 'login_screen.dart';

class ProductsScreen extends StatefulWidget {
  final String? userName;
  final String? userEmail;
  final String? token;

  const ProductsScreen({super.key, this.userName, this.userEmail, this.token});

  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  late Future<List<Product>> futureProducts;
  late io.Socket socket;
  late NotificationService notificationService;
  List<Product> products = [];
  bool isConnected = false;

  @override
  void initState() {
    super.initState();
    notificationService = NotificationService();
    futureProducts = fetchProducts();
    connectSocket();
  }

  void connectSocket() {
    socket = io.io(
      ApiConfig.getSocketUrl(),
      io.OptionBuilder()
          .setTransports(['websocket'])
          .enableAutoConnect()
          .build(),
    );

    socket.on('connect', (_) {
      setState(() => isConnected = true);
    });

    socket.on('disconnect', (_) {
      setState(() => isConnected = false);
    });

    socket.on('stockUpdate', (data) {
      setState(() {
        products = (data as List)
            .map((json) => Product.fromJson(json))
            .toList();
      });
      _handleNotification('Stock levels updated', 'info', playSound: false);
    });

    socket.on('orderPlaced', (data) {
      final productName = data['productName'];
      final quantity = data['quantity'];
      _handleNotification(
        'Order placed: $quantity x $productName',
        'success',
        playSound: true,
      );
    });

    socket.on('outOfStock', (data) {
      final productName = data['productName'];
      _handleNotification(
        '$productName is now out of stock',
        'warning',
        playSound: true,
      );
    });
  }

  void _handleNotification(
    String message,
    String type, {
    bool playSound = false,
  }) {
    setState(() {
      notificationService.addNotification(message, type, playSound: playSound);
    });
    notificationService.showSnackbar(context, message, type);
  }

  @override
  void dispose() {
    socket.dispose();
    notificationService.dispose();
    super.dispose();
  }

  Future<List<Product>> fetchProducts() async {
    try {
      final response = await http.get(Uri.parse(ApiConfig.products));
      if (response.statusCode == 200) {
        List<dynamic> jsonData = jsonDecode(response.body);
        return jsonData.map((json) => Product.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load products');
      }
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  void _showNotifications() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => NotificationSheet(
        notifications: notificationService.notifications,
        onClearAll: () {
          setState(() => notificationService.clearAll());
          Navigator.pop(context);
        },
      ),
    );
  }

  void _logout() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text(
          'Logout',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(builder: (context) => const LoginScreen()),
                (route) => false,
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: const Text('Logout'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final cart = Provider.of<CartProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: _buildAppBar(cart),
      body: Column(
        children: [
          _buildConnectionIndicator(),
          Expanded(child: _buildBody()),
        ],
      ),
    );
  }

  PreferredSizeWidget _buildAppBar(CartProvider cart) {
    return AppBar(
      elevation: 0,
      backgroundColor: AppColors.primary,
      foregroundColor: Colors.white,
      title: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Products',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          if (widget.userName != null)
            Text(
              'Hello, ${widget.userName}',
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w400),
            ),
        ],
      ),
      actions: [
        _buildNotificationButton(),
        _buildCartButton(cart),
        if (widget.userName != null) _buildLogoutButton(),
      ],
    );
  }

  Widget _buildNotificationButton() {
    return Stack(
      children: [
        IconButton(
          icon: const Icon(Icons.notifications_outlined),
          onPressed: _showNotifications,
        ),
        if (notificationService.notifications.isNotEmpty)
          Positioned(
            right: 8,
            top: 8,
            child: Container(
              padding: const EdgeInsets.all(4),
              decoration: const BoxDecoration(
                color: AppColors.error,
                shape: BoxShape.circle,
              ),
              constraints: const BoxConstraints(minWidth: 18, minHeight: 18),
              child: Text(
                '${notificationService.notifications.length}',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildCartButton(CartProvider cart) {
    return Stack(
      children: [
        IconButton(
          icon: const Icon(Icons.shopping_bag_outlined),
          onPressed: () {
            Navigator.of(
              context,
            ).push(MaterialPageRoute(builder: (context) => const CartScreen()));
          },
        ),
        if (cart.itemCount > 0)
          Positioned(
            right: 8,
            top: 8,
            child: Container(
              padding: const EdgeInsets.all(4),
              decoration: const BoxDecoration(
                color: AppColors.error,
                shape: BoxShape.circle,
              ),
              constraints: const BoxConstraints(minWidth: 18, minHeight: 18),
              child: Text(
                '${cart.itemCount}',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildLogoutButton() {
    return IconButton(icon: const Icon(Icons.logout), onPressed: _logout);
  }

  Widget _buildConnectionIndicator() {
    return Container(
      height: 3,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: isConnected
              ? [AppColors.success, const Color(0xFF059669)]
              : [AppColors.error, const Color(0xFFDC2626)],
        ),
      ),
    );
  }

  Widget _buildBody() {
    if (products.isEmpty) {
      return FutureBuilder<List<Product>>(
        future: futureProducts,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(color: AppColors.primary),
            );
          } else if (snapshot.hasError) {
            return _buildErrorState(snapshot.error.toString());
          } else if (snapshot.hasData) {
            products = snapshot.data!;
            return _buildProductList();
          } else {
            return const Center(child: Text('No products available'));
          }
        },
      );
    }
    return _buildProductList();
  }

  Widget _buildErrorState(String error) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error_outline, size: 64, color: AppColors.error),
          const SizedBox(height: 16),
          Text('Error: $error'),
        ],
      ),
    );
  }

  Widget _buildProductList() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: products.length,
      itemBuilder: (context, index) => ProductCard(product: products[index]),
    );
  }
}
