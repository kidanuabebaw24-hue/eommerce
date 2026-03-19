class Product {
  final int id;
  final String title;
  final String description;
  final double price;
  final String location;
  final String status;
  final int ownerId;
  final String ownerUsername;
  final int categoryId;
  final String categoryName;
  final List<String> imageUrls;
  final DateTime? createdAt;

  Product({
    required this.id,
    required this.title,
    required this.description,
    required this.price,
    required this.location,
    required this.status,
    required this.ownerId,
    required this.ownerUsername,
    required this.categoryId,
    required this.categoryName,
    required this.imageUrls,
    this.createdAt,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] ?? 0,
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      location: json['location'] ?? '',
      status: json['status'] ?? '',
      ownerId: json['ownerId'] ?? 0,
      ownerUsername: json['ownerUsername'] ?? '',
      categoryId: json['categoryId'] ?? 0,
      categoryName: json['categoryName'] ?? '',
      imageUrls: List<String>.from(json['imageUrls'] ?? []),
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
    );
  }
}
