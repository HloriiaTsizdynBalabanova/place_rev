import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/widgets/app_buttons.dart';
import '../../core/widgets/app_top_bar.dart';
import '../../core/widgets/form_card.dart';
import '../catalog/venues_data.dart';
import '../catalog/visited_store.dart';

class VenueDetailScreen extends StatelessWidget {
  final Venue venue;

  const VenueDetailScreen({super.key, required this.venue});

  Future<void> _confirmRemove(BuildContext context) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Видалити з відвіданих?'),
        content: Text('«${venue.name}» зникне з вашого журналу візитів.'),
        actions: [
          TextButton(
              onPressed: () => Navigator.of(ctx).pop(false),
              child: const Text('Скасувати')),
          FilledButton(
              onPressed: () => Navigator.of(ctx).pop(true),
              child: const Text('Видалити')),
        ],
      ),
    );
    if (ok == true && context.mounted) {
      VisitedStore.toggleWithFeedback(context, venue);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AppTopBar(showBack: true),
      body: ValueListenableBuilder<Set<String>>(
        valueListenable: VisitedStore.ids,
        builder: (context, ids, _) {
          final visited = ids.contains(venue.id);
          return ListView(
            padding: const EdgeInsets.all(AppSpacing.normal),
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(AppSpacing.radius),
                child: Stack(
                  children: [
                    Image.asset(venue.image,
                        height: 220, width: double.infinity, fit: BoxFit.cover),
                    const Positioned.fill(
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [Colors.transparent, Color(0xCC000000)],
                          ),
                        ),
                      ),
                    ),
                    Positioned(
                      left: 16,
                      right: 16,
                      bottom: 16,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            venue.name,
                            style: const TextStyle(
                                color: Colors.white,
                                fontSize: 26,
                                fontWeight: FontWeight.w800),
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              const Icon(Icons.star,
                                  size: 18, color: Color(0xFFF5A623)),
                              const SizedBox(width: 4),
                              Text(
                                '${venue.rating.toStringAsFixed(1)} (${venue.reviews} відгуків)',
                                style: const TextStyle(color: Colors.white),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.normal),
              FormCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.location_on_outlined,
                            color: AppColors.primary),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            venue.address,
                            style: const TextStyle(
                                fontWeight: FontWeight.w700,
                                color: AppColors.textPrimary),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                          color: AppColors.field,
                          borderRadius: BorderRadius.circular(12)),
                      child: Text(venue.description),
                    ),
                    const SizedBox(height: 12),
                    Text(venue.tags,
                        style: const TextStyle(
                            fontWeight: FontWeight.w700, fontSize: 12)),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.normal),
              if (!visited)
                FormCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Швидка фіксація візиту',
                          style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w800,
                              color: AppColors.textPrimary)),
                      const SizedBox(height: 8),
                      const Text(
                          'Додайте заклад до власного щоденника досліджень для подальшого оцінювання.'),
                      const SizedBox(height: AppSpacing.normal),
                      PrimaryButton(
                        label: 'Додати до відвіданих',
                        icon: Icons.add_circle_outline,
                        onPressed: () =>
                            VisitedStore.toggleWithFeedback(context, venue),
                      ),
                    ],
                  ),
                )
              else
                FormCard(
                  color: const Color(0xFF7BF2D6),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.check_circle_outline,
                              color: AppColors.teal),
                          SizedBox(width: 8),
                          Text('Відвідано',
                              style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w800,
                                  color: AppColors.teal)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        venue.note ??
                            'Збережено в персональний журнал. Ви ще не залишили нотатку.',
                        style: const TextStyle(color: AppColors.teal),
                      ),
                      if (venue.userRating != null) ...[
                        const SizedBox(height: 8),
                        Text('Ваша оцінка: ${venue.userRating}',
                            style: const TextStyle(
                                fontWeight: FontWeight.w700,
                                color: AppColors.teal)),
                      ],
                      const SizedBox(height: AppSpacing.normal),
                      SecondaryButton(
                        label: 'Видалити з відвіданих',
                        icon: Icons.delete_outline,
                        onPressed: () => _confirmRemove(context),
                      ),
                    ],
                  ),
                ),
              const SizedBox(height: AppSpacing.normal),
              Align(
                alignment: Alignment.centerLeft,
                child: TextButton.icon(
                  onPressed: () => Navigator.of(context).pop(),
                  icon: const Icon(Icons.arrow_back, size: 18),
                  label: const Text('До каталогу'),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
