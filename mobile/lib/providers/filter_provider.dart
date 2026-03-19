import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'product_provider.dart';

final searchQueryProvider = StateProvider<String>((ref) => '');
final categoryFilterProvider = StateProvider<String>((ref) => 'All');

final filteredProductsProvider = Provider((ref) {
  final searchQuery = ref.watch(searchQueryProvider).toLowerCase();
  final selectedCategory = ref.watch(categoryFilterProvider);
  final productsAsync = ref.watch(productsProvider);

  return productsAsync.whenData((products) {
    return products.where((product) {
      final matchesSearch = product.title.toLowerCase().contains(searchQuery);
      final matchesCategory = selectedCategory == 'All' || product.categoryName == selectedCategory;
      return matchesSearch && matchesCategory;
    }).toList();
  });
});
