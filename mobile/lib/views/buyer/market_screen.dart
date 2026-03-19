import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import '../../core/theme/app_colors.dart';
import '../../providers/product_provider.dart';
import '../../providers/filter_provider.dart';
import '../../widgets/product_card.dart';
import '../../widgets/skeleton_loader.dart';

class MarketScreen extends ConsumerStatefulWidget {
  const MarketScreen({super.key});

  @override
  ConsumerState<MarketScreen> createState() => _MarketScreenState();
}

class _MarketScreenState extends ConsumerState<MarketScreen> {
  final TextEditingController _searchController = TextEditingController();
  bool _isSearchVisible = false;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final productsAsync = ref.watch(filteredProductsProvider);
    final selectedCategory = ref.watch(categoryFilterProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FB),
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          _buildSliverAppBar(),
          SliverToBoxAdapter(
            child: Column(
              children: [
                _buildSearchAndFilterHeader(selectedCategory),
                const SizedBox(height: 12),
              ],
            ),
          ),
          productsAsync.when(
            data: (products) {
              if (products.isEmpty) {
                return SliverFillRemaining(child: _buildEmptyState());
              }

              return SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                sliver: AnimationLimiter(
                  child: SliverGrid(
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      mainAxisSpacing: 20,
                      crossAxisSpacing: 20,
                      childAspectRatio: 0.68,
                    ),
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        return AnimationConfiguration.staggeredGrid(
                          position: index,
                          duration: const Duration(milliseconds: 600),
                          columnCount: 2,
                          child: FadeInUp(
                            delay: Duration(milliseconds: 100 * index),
                            child: ProductCard(product: products[index]),
                          ),
                        );
                      },
                      childCount: products.length,
                    ),
                  ),
                ),
              );
            },
            loading: () => _buildSliverSkeletonGrid(),
            error: (err, stack) => SliverToBoxAdapter(child: Center(child: Text('Error: $err'))),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }

  Widget _buildSliverAppBar() {
    return SliverAppBar(
      expandedHeight: 80,
      backgroundColor: Colors.white,
      elevation: 0,
      floating: true,
      pinned: false,
      title: const Text(
        'Marketplace',
        style: TextStyle(fontWeight: FontWeight.w900, fontSize: 26, letterSpacing: -1, color: AppColors.textMain),
      ),
      actions: [
        Padding(
          padding: const EdgeInsets.only(right: 16),
          child: _buildRoundActionButton(
            icon: _isSearchVisible ? LucideIcons.x : LucideIcons.search,
            onTap: () => setState(() => _isSearchVisible = !_isSearchVisible),
          ),
        ),
      ],
    );
  }

  Widget _buildSearchAndFilterHeader(String selectedCategory) {
    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(bottom: Radius.circular(36)),
      ),
      child: Column(
        children: [
          if (_isSearchVisible)
            FadeInDown(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 0, 24, 20),
                child: Container(
                  height: 56,
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1F4FF),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    children: [
                      const Icon(LucideIcons.search, color: AppColors.primary, size: 20),
                      const SizedBox(width: 12),
                      Expanded(
                        child: TextField(
                          controller: _searchController,
                          autofocus: true,
                          onChanged: (val) => ref.read(searchQueryProvider.notifier).state = val,
                          decoration: const InputDecoration(
                            hintText: 'Search products...',
                            border: InputBorder.none,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          _buildFilterChips(selectedCategory),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _buildFilterChips(String selectedCategory) {
    final categories = ['All', 'Electronics', 'Fashion', 'Home', 'Services'];
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 24),
      physics: const BouncingScrollPhysics(),
      child: Row(
        children: categories.map((cat) {
          final isSelected = selectedCategory == cat;
          return Padding(
            padding: const EdgeInsets.only(right: 12),
            child: GestureDetector(
              onTap: () => ref.read(categoryFilterProvider.notifier).state = cat,
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.primary : Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: isSelected ? AppColors.primary : Colors.grey.shade100),
                  boxShadow: isSelected
                      ? [BoxShadow(color: AppColors.primary.withOpacity(0.2), blurRadius: 10, offset: const Offset(0, 4))]
                      : [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 2))],
                ),
                child: Text(
                  cat,
                  style: TextStyle(
                    color: isSelected ? Colors.white : AppColors.textMain,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(LucideIcons.shoppingBag, size: 80, color: Colors.grey.shade300),
          const SizedBox(height: 24),
          const Text('Market is Quiet', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 24)),
          const SizedBox(height: 12),
          const Text('No products found matching your search', style: TextStyle(color: AppColors.textMuted)),
        ],
      ),
    );
  }

  Widget _buildSliverSkeletonGrid() {
    return SliverPadding(
      padding: const EdgeInsets.all(24),
      sliver: SliverGrid(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          mainAxisSpacing: 20,
          crossAxisSpacing: 20,
          childAspectRatio: 0.68,
        ),
        delegate: SliverChildBuilderDelegate(
          (context, index) => const SkeletonLoader(),
          childCount: 6,
        ),
      ),
    );
  }

  Widget _buildRoundActionButton({required IconData icon, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 15, offset: const Offset(0, 5))],
        ),
        child: Icon(icon, color: AppColors.textMain, size: 20),
      ),
    );
  }
}
