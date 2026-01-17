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
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            _buildProductImage(),
            const SizedBox(width: 16),
            Expanded(child: _buildProductInfo()),
            const SizedBox(width: 8),
            _buildAddButton(context, cart),
          ],
        ),
      ),
    );
  }

  Widget _buildProductImage() {
    return Container(
      width: 80,
      height: 80,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppColors.primaryLight, AppColors.primary],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(12),
      ),
      child: const Icon(Icons.shopping_basket, size: 40, color: Colors.white),
    );
  }

  Widget _buildProductInfo() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          product.name.toUpperCase(),
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            letterSpacing: 0.5,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          '₹${product.price}',
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: AppColors.primary,
          ),
        ),
        const SizedBox(height: 8),
        _buildStockBadge(),
      ],
    );
  }

  Widget _buildStockBadge() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: product.isOutOfStock
            ? AppColors.errorLight
            : product.isLowStock
            ? AppColors.warningLight
            : AppColors.successLight,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            product.isOutOfStock
                ? Icons.remove_circle_outline
                : product.isLowStock
                ? Icons.warning_amber
                : Icons.check_circle,
            size: 16,
            color: product.isOutOfStock
                ? AppColors.error
                : product.isLowStock
                ? AppColors.warning
                : AppColors.success,
          ),
          const SizedBox(width: 6),
          Text(
            product.isOutOfStock
                ? 'Out of Stock'
                : product.isLowStock
                ? 'Only ${product.stock} left'
                : '${product.stock} in stock',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: product.isOutOfStock
                  ? AppColors.error
                  : product.isLowStock
                  ? AppColors.warning
                  : AppColors.success,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAddButton(BuildContext context, CartProvider cart) {
    return SizedBox(
      width: 100,
      child: ElevatedButton(
        onPressed: product.stock > 0
            ? () {
                cart.addItem(product.id, product.name, product.price);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Row(
                      children: [
                        const Icon(
                          Icons.check_circle,
                          color: Colors.white,
                          size: 20,
                        ),
                        const SizedBox(width: 12),
                        Text('Added ${product.name}'),
                      ],
                    ),
                    duration: const Duration(seconds: 1),
                    behavior: SnackBarBehavior.floating,
                    backgroundColor: AppColors.success,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    margin: const EdgeInsets.all(16),
                  ),
                );
              }
            : null,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 0,
        ),
        child: Text(
          product.stock > 0 ? 'Add' : 'Sold Out',
          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
        ),
      ),
    );
  }
}
