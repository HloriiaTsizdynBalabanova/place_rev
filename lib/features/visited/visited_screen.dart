import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/widgets/app_buttons.dart';
import '../../core/widgets/app_top_bar.dart';
import '../../core/widgets/place_card.dart';
import '../catalog/venue_detail_screen.dart';
import '../catalog/venues_data.dart';
import '../catalog/visited_store.dart';

class VisitedScreen extends StatelessWidget {
  /// Перехід до вкладки «Каталог» (коли список порожній).
  final VoidCallback onOpenCatalog;

  const VisitedScreen({super.key, required this.onOpenCatalog});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AppTopBar(badge: 'ВІДВІДАНІ'),
      body: ValueListenableBuilder<Set<String>>(
        valueListenable: VisitedStore.ids,
        builder: (context, ids, _) {
          final visited = venues.where((v) => ids.contains(v.id)).toList();

          if (visited.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.medium),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.bookmark_border,
                        size: 56, color: AppColors.textSecondary),
                    const SizedBox(height: 12),
                    Text('Ще немає відвіданих закладів',
                        style: Theme.of(context).textTheme.titleMedium),
                    const SizedBox(height: 8),
                    const Text(
                      'Додайте заклади з каталогу, щоб вести журнал візитів.',
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: AppSpacing.normal),
                    PrimaryButton(
                      label: 'Перейти до каталогу',
                      icon: Icons.menu_book_outlined,
                      onPressed: onOpenCatalog,
                    ),
                  ],
                ),
              ),
            );
          }

          return ListView(
            padding: const EdgeInsets.all(AppSpacing.normal),
            children: [
              Text('Мої відвідані',
                  style: Theme.of(context).textTheme.headlineMedium),
              const SizedBox(height: 4),
              Text('Збережено закладів: ${visited.length}',
                  style: const TextStyle(
                      color: AppColors.teal, fontWeight: FontWeight.w700)),
              const SizedBox(height: AppSpacing.normal),
              for (final v in visited) ...[
                GestureDetector(
                  onTap: () => Navigator.of(context).push(
                    MaterialPageRoute<void>(
                        builder: (_) => VenueDetailScreen(venue: v)),
                  ),
                  child: PlaceCard(
                    image: v.image,
                    category: v.badge,
                    name: v.name,
                    address: v.address,
                    rating: v.userRating ?? v.rating,
                    ratingLabel: v.userRating != null
                        ? 'Оцінка користувача'
                        : 'Загальний рейтинг',
                    visited: true,
                    note: v.note,
                  ),
                ),
                const SizedBox(height: AppSpacing.normal),
              ],
            ],
          );
        },
      ),
    );
  }
}
