class Product {
  final String id;
  final String name;
  final int stock;
  final double price;
  final String category;
  final String? description;
  final String? sku;
  final bool isActive;
  final int lowStockThreshold;
  final DateTime createdAt;
  final DateTime updatedAt;

  Product({
    required this.id,
    required this.name,
    required this.stock,
    required this.price,
    required this.category,
    this.description,
    this.sku,
    required this.isActive,
    required this.lowStockThreshold,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['_id'] as String,
      name: json['name'] as String,
      stock: json['stock'] as int,
      price: (json['price'] as num).toDouble(),
      category: json['category'] as String? ?? 'General',
      description: json['description'] as String?,
      sku: json['sku'] as String?,
      isActive: json['isActive'] as bool? ?? true,
      lowStockThreshold: json['lowStockThreshold'] as int? ?? 5,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  bool get isOutOfStock => stock == 0;
  bool get isLowStock => stock > 0 && stock <= lowStockThreshold;

  String get stockStatus {
    if (isOutOfStock) return 'Out of Stock';
    if (isLowStock) return 'Low Stock';
    return 'In Stock';
  }

  String get formattedPrice => '₹${price.toStringAsFixed(0)}';
}
