class Transaction {
  final int id;
  final int productId;
  final String productTitle;
  final double amount;
  final String status;
  final String? buyerUsername;
  final String? sellerUsername;
  final DateTime createdAt;

  Transaction({
    required this.id,
    required this.productId,
    required this.productTitle,
    required this.amount,
    required this.status,
    this.buyerUsername,
    this.sellerUsername,
    required this.createdAt,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'] ?? 0,
      productId: json['productId'] ?? 0,
      productTitle: json['productTitle'] ?? '',
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      status: json['status'] ?? '',
      buyerUsername: json['buyerUsername'],
      sellerUsername: json['sellerUsername'],
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
    );
  }
}
