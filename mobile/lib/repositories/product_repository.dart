import 'package:dio/dio.dart';
import '../models/product_model.dart';

class ProductRepository {
  ProductRepository();

  Future<List<Product>> getAllProducts() async {
    await Future.delayed(const Duration(milliseconds: 500));
    return _mockProducts;
  }

  Future<Product> getProductById(int id) async {
    await Future.delayed(const Duration(milliseconds: 500));
    return _mockProducts.firstWhere((p) => p.id == id);
  }

  Future<List<Product>> getMyProducts() async {
    await Future.delayed(const Duration(milliseconds: 500));
    // Simulate seller owning some products
    return [_mockProducts[0], _mockProducts[2]];
  }

  Future<void> createProduct(FormData formData) async {
    await Future.delayed(const Duration(seconds: 1));
    // Mock success
  }

  final List<Product> _mockProducts = [
    Product(
      id: 1,
      title: 'Premium Wireless Headphones',
      description: 'Experience crystal clear sound with our latest noise-canceling technology.',
      price: 299.99,
      location: 'New York, USA',
      status: 'AVAILABLE',
      ownerId: 101,
      ownerUsername: 'TechMaster',
      categoryId: 1,
      categoryName: 'Electronics',
      imageUrls: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
      createdAt: DateTime.now(),
    ),
    Product(
      id: 2,
      title: 'Minimalist Leather Watch',
      description: 'A timeless piece for any occasion.',
      price: 150.00,
      location: 'London, UK',
      status: 'AVAILABLE',
      ownerId: 102,
      ownerUsername: 'StyleHub',
      categoryId: 2,
      categoryName: 'Fashion',
      imageUrls: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
      createdAt: DateTime.now(),
    ),
  ];
}
