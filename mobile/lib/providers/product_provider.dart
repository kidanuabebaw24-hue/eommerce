import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/product_model.dart';

final productsProvider = FutureProvider<List<Product>>((ref) async {
  // Simulate API delay
  await Future.delayed(const Duration(seconds: 1));
  
  return [
    Product(
      id: 1,
      title: 'Premium Wireless Headphones',
      description: 'Experience crystal clear sound with our latest noise-canceling technology. Perfect for music lovers and professionals alike.',
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
      description: 'A timeless piece for any occasion. Genuine leather strap and scratch-resistant glass.',
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
    Product(
      id: 3,
      title: 'Smart Home Hub',
      description: 'Control your entire home with one device. Compatible with all major smart home ecosystems.',
      price: 89.99,
      location: 'Berlin, Germany',
      status: 'AVAILABLE',
      ownerId: 101,
      ownerUsername: 'TechMaster',
      categoryId: 1,
      categoryName: 'Electronics',
      imageUrls: ['https://images.unsplash.com/photo-1558002038-1055907df827?w=500'],
      createdAt: DateTime.now(),
    ),
    Product(
      id: 4,
      title: 'Organic Cotton T-Shirt',
      description: 'Soft, breathable, and sustainably made. The perfect everyday staple.',
      price: 35.00,
      location: 'Paris, France',
      status: 'AVAILABLE',
      ownerId: 102,
      ownerUsername: 'StyleHub',
      categoryId: 2,
      categoryName: 'Fashion',
      imageUrls: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
      createdAt: DateTime.now(),
    ),
  ];
});

final myProductsProvider = FutureProvider<List<Product>>((ref) async {
  final products = await ref.watch(productsProvider.future);
  // Assume the seller owns the first and third items
  return [products[0], products[2]];
});

final productDetailsProvider = FutureProvider.family<Product, int>((ref, id) async {
  final products = await ref.watch(productsProvider.future);
  return products.firstWhere((p) => p.id == id);
});
