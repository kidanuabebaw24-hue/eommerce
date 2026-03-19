import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:animate_do/animate_do.dart';
import '../../core/theme/app_colors.dart';
import '../../providers/auth_provider.dart';
import '../../providers/product_provider.dart';
import '../../models/product_model.dart';

class SellerDashboard extends ConsumerWidget {
  const SellerDashboard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authProvider).user;
    final myProductsAsync = ref.watch(myProductsProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FB),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(context, user?.username ?? 'Partner'),
              const SizedBox(height: 32),
              myProductsAsync.when(
                data: (products) => _buildStatGrid(products.length),
                loading: () => _buildSkeletonStats(),
                error: (err, stack) => Center(child: Text('Error: $err')),
              ),
              const SizedBox(height: 32),
              _buildSectionTitle('Performance Overview'),
              const SizedBox(height: 16),
              _buildAnalyticsCard(),
              const SizedBox(height: 32),
              _buildSectionTitle('Inventory Pulse'),
              const SizedBox(height: 16),
              myProductsAsync.when(
                data: (products) => products.isEmpty
                    ? _buildEmptyInventory()
                    : Column(
                        children: products.take(4).map((p) => _InventoryListItem(product: p)).toList(),
                      ),
                loading: () => const SizedBox.shrink(),
                error: (err, stack) => const SizedBox.shrink(),
              ),
              const SizedBox(height: 100),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context, String name) {
    return FadeInDown(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      'Seller Hub',
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                            fontWeight: FontWeight.w900,
                            color: AppColors.textMain,
                            letterSpacing: -1,
                          ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.green.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(width: 6, height: 6, decoration: const BoxDecoration(color: Colors.green, shape: BoxShape.circle)),
                          const SizedBox(width: 4),
                          const Text('Active', style: TextStyle(color: Colors.green, fontSize: 10, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  ],
                ),
                Text(
                  'Manage your empire, $name',
                  style: const TextStyle(color: AppColors.textMuted, fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ),
          _buildCircleAction(LucideIcons.bell),
        ],
      ),
    );
  }

  Widget _buildStatGrid(int totalItems) {
    return FadeInUp(
      child: GridView.count(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        crossAxisCount: 2,
        mainAxisSpacing: 16,
        crossAxisSpacing: 16,
        childAspectRatio: 1.1, // Fixed to prevent vertical overflow
        children: [
          _StatCard(
            title: 'Revenue',
            value: '\$4,250',
            icon: LucideIcons.dollarSign,
            color: const Color(0xFF6366F1),
          ),
          _StatCard(
            title: 'Inventory',
            value: totalItems.toString(),
            icon: LucideIcons.package,
            color: const Color(0xFFF59E0B),
          ),
          const _StatCard(
            title: 'Success Rate',
            value: '98.5%',
            icon: LucideIcons.trendingUp,
            color: Color(0xFF10B981),
          ),
          const _StatCard(
            title: 'Active Orders',
            value: '12',
            icon: LucideIcons.shoppingBag,
            color: Color(0xFFEC4899),
          ),
        ],
      ),
    );
  }

  Widget _buildAnalyticsCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(32),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 20, offset: const Offset(0, 8)),
        ],
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Monthly Sales', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.textMain)),
              const Icon(LucideIcons.moreHorizontal, color: AppColors.textMuted),
            ],
          ),
          const SizedBox(height: 32),
          SizedBox(
            height: 100,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: List.generate(7, (index) {
                final height = [30, 60, 45, 80, 50, 90, 70][index];
                return Container(
                  width: 12,
                  height: height.toDouble(),
                  decoration: BoxDecoration(
                    color: index == 5 ? AppColors.primary : AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(4),
                  ),
                );
              }),
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Keep up the great work!',
            style: TextStyle(color: AppColors.textMuted, fontSize: 13, fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.textMain, letterSpacing: -0.5),
    );
  }

  Widget _buildEmptyInventory() {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
      child: const Center(child: Text('Add your first product to start selling!', style: TextStyle(color: AppColors.textMuted))),
    );
  }

  Widget _buildCircleAction(IconData icon) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        shape: BoxShape.circle,
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
      ),
      child: Icon(icon, color: AppColors.textMain, size: 20),
    );
  }

  Widget _buildSkeletonStats() {
    return const Center(child: CircularProgressIndicator());
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;

  const _StatCard({required this.title, required this.value, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(28),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 15, offset: const Offset(0, 5)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(14)),
            child: Icon(icon, color: color, size: 20),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                value,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppColors.textMain, letterSpacing: -1),
              ),
              const SizedBox(height: 2),
              Text(
                title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textMuted),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _InventoryListItem extends StatelessWidget {
  final Product product;
  const _InventoryListItem({required this.product});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Row(
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              image: DecorationImage(
                image: NetworkImage(product.imageUrls.isNotEmpty ? product.imageUrls.first : 'https://via.placeholder.com/150'),
                fit: BoxFit.cover,
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(product.title, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 2),
                Text(
                  '\$${product.price}',
                  style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.w900, fontSize: 13),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(color: const Color(0xFFF1F4FF), borderRadius: BorderRadius.circular(8)),
            child: const Text('In Stock', style: TextStyle(color: AppColors.primary, fontSize: 10, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
