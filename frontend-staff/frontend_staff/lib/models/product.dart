class Product {
  final int id;
  final String name;
  final int stock;
  final int price;

  Product({
    required this.id,
    required this.name,
    required this.stock,
    required this.price,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] as int,
      name: json['name'] as String,
      stock: json['stock'] as int,
      price: json['price'] as int,
    );
  }

  bool get isOutOfStock => stock == 0;
  bool get isLowStock => stock > 0 && stock <= 3;
}
