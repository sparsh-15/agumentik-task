import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/product.dart';
import '../providers/cart_provider.dart';
import '../utils/app_colors.dart';

class ProductCard extends StatelessWidget {
  final Product product;

  const ProductCard({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    final cart = Provider.of<CartProvider>(context, listen: false);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          _buildProductImage(),
          const SizedBox(width: 16),
          Expanded(child: _buildProductInfo()),
          const SizedBox(width: 12),
          _buildAddButton(context, cart),
        ],
      ),
    );
  }

  Widget _buildProductImage() {
    return Container(
      width: 70,
      height: 70,
      decoration: BoxDecoration(
        gradient: AppColors.primaryGradient,
        borderRadius: BorderRadius.circular(14),
      ),
      child: const Icon(
        Icons.inventory_2_rounded,
        size: 32,
        color: Colors.white,
      ),
    );
  }

  Widget _buildProductInfo() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          product.name.toUpperCase(),
          style: const TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.bold,
            letterSpacing: 0.5,
            color: AppColors.textPrimary,
          ),
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
        ),
        const SizedBox(height: 4),
        // Category badge
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
          decoration: BoxDecoration(
            color: AppColors.primary.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(6),
            border: Border.all(
              color: AppColors.primary.withValues(alpha: 0.2),
              width: 1,
            ),
          ),
          child: Text(
            product.category,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: AppColors.primary,
            ),
          ),
        ),
        const SizedBox(height: 6),
        Text(
          '₹${product.price}',
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.primary,
          ),
        ),
        const SizedBox(height: 8),
        _buildStockBadge(),
      ],
    );
  }

  Widget _buildStockBadge() {
    Color bgColor;
    Color textColor;
    IconData icon;
    String text;

    if (product.isOutOfStock) {
      bgColor = AppColors.errorLight;
      textColor = AppColors.error;
      icon = Icons.remove_circle_outline;
      text = 'Out of Stock';
    } else if (product.isLowStock) {
      bgColor = AppColors.warningLight;
      textColor = AppColors.warning;
      icon = Icons.warning_amber;
      text = 'Only ${product.stock} left';
    } else {
      bgColor = AppColors.successLight;
      textColor = AppColors.success;
      icon = Icons.check_circle;
      text = '${product.stock} in stock';
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: textColor),
          const SizedBox(width: 5),
          Text(
            text,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: textColor,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAddButton(BuildContext context, CartProvider cart) {
    final isAvailable = product.stock > 0;

    return SizedBox(
      width: 80,
      child: ElevatedButton(
        onPressed: isAvailable
            ? () {
                cart.addItem(product.id, product.name, product.price);
                ScaffoldMessenger.of(context).hideCurrentSnackBar();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Row(
                      children: [
                        const Icon(
                          Icons.check_circle,
                          color: Colors.white,
                          size: 18,
                        ),
                        const SizedBox(width: 10),
                        Text('Added ${product.name}'),
                      ],
                    ),
                    duration: const Duration(seconds: 1),
                    backgroundColor: AppColors.success,
                  ),
                );
              }
            : null,
        style: ElevatedButton.styleFrom(
          backgroundColor: isAvailable
              ? AppColors.primary
              : AppColors.background,
          foregroundColor: isAvailable ? Colors.white : AppColors.textMuted,
          padding: const EdgeInsets.symmetric(vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          elevation: 0,
        ),
        child: Text(
          isAvailable ? 'Add' : 'Sold Out',
          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
        ),
      ),
    );
  }
}
