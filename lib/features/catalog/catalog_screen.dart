import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/widgets/app_top_bar.dart';
import '../../core/widgets/catalog_card.dart';
import 'venue_detail_screen.dart';
import '../catalog/venues_data.dart';
import '../catalog/visited_store.dart';

class CatalogScreen extends StatefulWidget {
  const CatalogScreen({super.key});

  @override
  State<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends State<CatalogScreen> {
  final _search = TextEditingController();
  int _filter = 0;

  @override
  void dispose() {
    _search.dispose();
    super.dispose();
  }

  List<Venue> get _results {
    final q = _search.text.trim().toLowerCase();
    return venues.where((v) {
      final byType = _filter == 0 || v.types.contains(venueFilters[_filter]);
      final byText = q.isEmpty ||
          v.name.toLowerCase().contains(q) ||
          v.address.toLowerCase().contains(q);
      return byType && byText;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final results = _results;
    return Scaffold(
      appBar: const AppTopBar(badge: 'КАТАЛОГ'),
      body: ValueListenableBuilder<Set<String>>(
        valueListenable: VisitedStore.ids,
        builder: (context, visitedIds, _) => ListView(
          padding: const EdgeInsets.all(AppSpacing.normal),
          children: [
            TextField(
              controller: _search,
              onChanged: (_) => setState(() {}),
              decoration: InputDecoration(
                hintText: 'Пошук за назвою або адресою...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _search.text.isEmpty
                    ? null
                    : IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () => setState(_search.clear),
                      ),
                filled: true,
                fillColor: AppColors.field,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 40,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: venueFilters.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (_, i) => ChoiceChip(
                  label: Text(venueFilters[i]),
                  selected: _filter == i,
                  selectedColor: AppColors.mint,
                  onSelected: (_) => setState(() => _filter = i),
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.normal),
            if (results.isEmpty)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 48),
                child: Column(
                  children: [
                    Icon(Icons.search_off,
                        size: 48, color: AppColors.textSecondary),
                    SizedBox(height: 12),
                    Text('Нічого не знайдено. Змініть запит або фільтр.'),
                  ],
                ),
              ),
            for (final v in results) ...[
              CatalogCard(
                image: v.image,
                badge: v.badge,
                badgeIcon: v.badgeIcon,
                name: v.name,
                address: v.address,
                rating: v.rating,
                reviews: v.reviews,
                tags: v.tags,
                bookmarked: visitedIds.contains(v.id),
                onBookmark: () => VisitedStore.toggleWithFeedback(context, v),
                onDetails: () => Navigator.of(context).push(
                  MaterialPageRoute<void>(
                      builder: (_) => VenueDetailScreen(venue: v)),
                ),
              ),
              const SizedBox(height: AppSpacing.normal),
            ],
          ],
        ),
      ),
    );
  }
}
