import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/widgets/app_top_bar.dart';
import '../../core/widgets/place_card.dart';
import 'mock_places.dart';

class HomeScreen extends StatefulWidget {
  /// Перемикає вкладку нижньої навігації (1 - Каталог, 2 - Відвідані).
  final ValueChanged<int> onOpenTab;

  const HomeScreen({super.key, required this.onOpenTab});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  static const _filters = ['Всі нещодавні', "Кав'ярні (5)", 'Ресторани (6)'];
  int _selectedFilter = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AppTopBar(badge: 'ГОЛОВНА'),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.normal),
        children: [
          TextField(
            decoration: InputDecoration(
              hintText: "Пошук закладів, кав'ярень, ресторанів",
              prefixIcon: const Icon(Icons.search),
              suffixIcon: const Icon(Icons.tune),
              filled: true,
              fillColor: AppColors.field,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(14),
                borderSide: BorderSide.none,
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.normal),
          Row(
            children: [
              Expanded(
                child: _QuickCard(
                  icon: Icons.storefront_outlined,
                  title: 'Каталог закладів',
                  subtitle: '128 закладів',
                  onTap: () => widget.onOpenTab(1),
                ),
              ),
              const SizedBox(width: AppSpacing.normal),
              Expanded(
                child: _QuickCard(
                  icon: Icons.bookmark_added_outlined,
                  title: 'Мої відвідані',
                  subtitle: '14 збережено',
                  onTap: () => widget.onOpenTab(2),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.normal),
          Align(
            alignment: Alignment.centerLeft,
            child: SizedBox(
              width: 200,
              child: Material(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(16),
                child: InkWell(
                  borderRadius: BorderRadius.circular(16),
                  onTap: () {},
                  child: const Padding(
                    padding: EdgeInsets.all(AppSpacing.normal),
                    child: Row(
                      children: [
                        Icon(Icons.rate_review_outlined, color: Colors.white),
                        SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Додати відгук',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                              Text(
                                '+ ЕКСПРЕС',
                                style: TextStyle(
                                  color: Colors.white70,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.normal),
          SizedBox(
            height: 40,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: _filters.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (_, i) => ChoiceChip(
                label: Text(_filters[i]),
                selected: _selectedFilter == i,
                selectedColor: AppColors.mint,
                onSelected: (_) => setState(() => _selectedFilter = i),
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.normal),
          Row(
            children: [
              Expanded(
                child: Text(
                  'Нещодавно відвідані заклади',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              ),
              TextButton(
                onPressed: () => widget.onOpenTab(2),
                child: const Text('Всі (14)'),
              ),
            ],
          ),
          for (final p in mockPlaces) ...[
            PlaceCard(
              image: p.image,
              category: p.category,
              name: p.name,
              address: p.address,
              rating: p.rating,
              ratingLabel: p.ratingLabel,
              visited: p.visited,
              note: p.note,
            ),
            const SizedBox(height: AppSpacing.normal),
          ],
        ],
      ),
    );
  }
}

class _QuickCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _QuickCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: AppColors.surface,
      elevation: 1,
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.normal),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Icon(icon, color: AppColors.primary),
                  const Icon(Icons.arrow_forward, size: 18),
                ],
              ),
              const SizedBox(height: AppSpacing.normal),
              Text(title, style: Theme.of(context).textTheme.titleMedium),
              Text(
                subtitle,
                style: const TextStyle(
                  color: AppColors.teal,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
