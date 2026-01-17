class CartItem {
  final int productId;
  final String productName;
  final int price;
  int quantity;

  CartItem({
    required this.productId,
    required this.productName,
    required this.price,
    required this.quantity,
  });

  int get totalPrice => price * quantity;

  Map<String, dynamic> toJson() {
    return {'productId': productId, 'quantity': quantity};
  }
}
