import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import '../../providers/core_providers.dart';
import '../../core/theme/app_colors.dart';
import '../../providers/product_provider.dart';
import '../../models/product_model.dart';
import '../../providers/wishlist_provider.dart';

class ProductDetailsScreen extends ConsumerWidget {
  final int productId;
  const ProductDetailsScreen({super.key, required this.productId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final productAsync = ref.watch(productDetailsProvider(productId));
    final wishlist = ref.watch(wishlistProvider);
    final isFavorite = wishlist.contains(productId);

    return Scaffold(
      backgroundColor: Colors.white,
      body: productAsync.when(
        data: (product) => _buildContent(context, ref, product, isFavorite),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
      bottomNavigationBar: productAsync.when(
        data: (product) => _buildBottomBar(context, ref, product),
        loading: () => const SizedBox.shrink(),
        error: (err, stack) => const SizedBox.shrink(),
      ),
    );
  }

  Widget _buildContent(BuildContext context, WidgetRef ref, Product product, bool isFavorite) {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          expandedHeight: 400,
          pinned: true,
          backgroundColor: Colors.transparent,
          flexibleSpace: FlexibleSpaceBar(
            background: Stack(
              fit: StackFit.expand,
              children: [
                CachedNetworkImage(
                  imageUrl: product.imageUrls.isNotEmpty ? product.imageUrls.first : 'https://via.placeholder.com/600',
                  fit: BoxFit.cover,
                ),
                Positioned(
                  bottom: 0,
                  left: 0,
                  right: 0,
                  child: Container(
                    height: 80,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Colors.transparent, Colors.white.withValues(alpha: 0.8), Colors.white],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          leading: Padding(
            padding: const EdgeInsets.all(8.0),
            child: CircleAvatar(
              backgroundColor: Colors.white,
              child: IconButton(
                icon: const Icon(LucideIcons.arrowLeft, color: AppColors.textMain, size: 20),
                onPressed: () => Navigator.pop(context),
              ),
            ),
          ),
          actions: [
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: CircleAvatar(
                backgroundColor: Colors.white,
                child: IconButton(
                  icon: const Icon(LucideIcons.share2, color: AppColors.textMain, size: 20),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Sharing functionality coming soon!')),
                    );
                  },
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: CircleAvatar(
                backgroundColor: Colors.white,
                child: IconButton(
                  icon: Icon(
                    isFavorite ? Icons.favorite : Icons.favorite_border,
                    color: isFavorite ? AppColors.error : AppColors.textMain,
                    size: 20,
                  ),
                  onPressed: () {
                    ref.read(wishlistProvider.notifier).toggleFavorite(product.id);
                    ScaffoldMessenger.of(context).hideCurrentSnackBar();
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(isFavorite ? 'Removed from wishlist!' : 'Added to wishlist!'),
                        duration: const Duration(seconds: 1),
                        behavior: SnackBarBehavior.floating,
                        backgroundColor: isFavorite ? AppColors.textMain : AppColors.success,
                      ),
                    );
                  },
                ),
              ),
            ),
          ],
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                FadeInUp(
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.primaryLight,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          product.categoryName,
                          style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 12),
                        ),
                      ),
                      const Spacer(),
                      const Icon(Icons.star, color: Colors.amber, size: 18),
                      const Text(' 4.8 ', style: TextStyle(fontWeight: FontWeight.bold)),
                      const Text('(120 reviews)', style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                FadeInUp(
                  delay: const Duration(milliseconds: 100),
                  child: Text(
                    product.title,
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w900, letterSpacing: -1),
                  ),
                ),
                const SizedBox(height: 8),
                FadeInUp(
                  delay: const Duration(milliseconds: 200),
                  child: Row(
                    children: [
                      const Icon(LucideIcons.mapPin, size: 16, color: AppColors.textMuted),
                      const SizedBox(width: 4),
                      Text(product.location, style: const TextStyle(color: AppColors.textMuted, fontWeight: FontWeight.w500)),
                    ],
                  ),
                ),
                const SizedBox(height: 32),
                FadeInUp(
                  delay: const Duration(milliseconds: 300),
                  child: Text(
                    'Description',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900),
                  ),
                ),
                const SizedBox(height: 12),
                FadeInUp(
                  delay: const Duration(milliseconds: 400),
                  child: Text(
                    product.description,
                    style: const TextStyle(color: AppColors.textMuted, height: 1.6, fontSize: 16),
                  ),
                ),
                const SizedBox(height: 32),
                FadeInUp(
                  delay: const Duration(milliseconds: 500),
                  child: Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: AppColors.background,
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Row(
                      children: [
                        const CircleAvatar(
                          radius: 25,
                          backgroundImage: NetworkImage('https://via.placeholder.com/100'),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                product.ownerUsername,
                                style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16),
                              ),
                              const Text('Pro Seller', style: TextStyle(color: AppColors.textMuted, fontSize: 13)),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: const Icon(LucideIcons.messageSquare, color: AppColors.primary),
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Chat functionality coming soon!')),
                            );
                          },
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 40),
                const Text('Reviews', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 22)),
                const SizedBox(height: 16),
                // Review items placeholder
                _buildReviewItem('John Doe', 'Amazing product! Exactly what I was looking for.', 5),
                _buildReviewItem('Sarah Smith', 'Good quality, but shipping took a bit longer.', 4),
                const SizedBox(height: 40),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildReviewItem(String name, String comment, double rating) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.shade100),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
              RatingBarIndicator(
                rating: rating,
                itemBuilder: (context, index) => const Icon(Icons.star, color: Colors.amber),
                itemCount: 5,
                itemSize: 16,
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(comment, style: const TextStyle(color: AppColors.textMuted, fontSize: 14)),
        ],
      ),
    );
  }

  Widget _buildBottomBar(BuildContext context, WidgetRef ref, Product product) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 20,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: SafeArea(
        child: Row(
          children: [
            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Price', style: TextStyle(color: AppColors.textMuted, fontWeight: FontWeight.bold)),
                Text(
                  '\$${product.price.toStringAsFixed(2)}',
                  style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.w900, fontSize: 24),
                ),
              ],
            ),
            const SizedBox(width: 32),
            Expanded(
              child: ElevatedButton(
                onPressed: () async {
                  try {
                    await ref.read(transactionRepositoryProvider).createTransaction({
                      'productId': product.id,
                      'amount': product.price,
                      'paymentMethod': 'CHAPA',
                    });
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Purchase successful!')),
                      );
                    }
                  } catch (e) {
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Failed to purchase: $e')),
                      );
                    }
                  }
                },
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 20),
                ),
                child: const Text('Buy Now'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
