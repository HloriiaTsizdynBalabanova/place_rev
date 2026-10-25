import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';

/// Картка закладу для каталогу: фото, бейдж, рейтинг, закладка, «Детальніше».
class CatalogCard extends StatelessWidget {
  final String image;
  final String badge;
  final IconData badgeIcon;
  final String name;
  final String address;
  final double rating;
  final int reviews;
  final String tags;
  final bool bookmarked;
  final VoidCallback onBookmark;
  final VoidCallback onDetails;

  const CatalogCard({
    super.key,
    required this.image,
    required this.badge,
    required this.badgeIcon,
    required this.name,
    required this.address,
    required this.rating,
    required this.reviews,
    required this.tags,
    required this.bookmarked,
    required this.onBookmark,
    required this.onDetails,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppSpacing.radius),
        boxShadow: const [
          BoxShadow(
              color: Color(0x14243591), blurRadius: 12, offset: Offset(0, 4)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              Image.asset(image,
                  height: 200, width: double.infinity, fit: BoxFit.cover),
              Positioned(
                left: 12,
                top: 12,
                child: _Pill(
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(badgeIcon, size: 16, color: AppColors.primary),
                      const SizedBox(width: 6),
                      Text(badge,
                          style: const TextStyle(
                              fontWeight: FontWeight.w700, fontSize: 13)),
                    ],
                  ),
                ),
              ),
              Positioned(
                right: 12,
                bottom: 12,
                child: _Pill(
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.star,
                          size: 16, color: Color(0xFFF5A623)),
                      const SizedBox(width: 4),
                      Text(
                        rating.toStringAsFixed(1),
                        style: const TextStyle(
                            fontWeight: FontWeight.w800, fontSize: 13),
                      ),
                      Text(' ($reviews)', style: const TextStyle(fontSize: 12)),
                    ],
                  ),
                ),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.all(AppSpacing.normal),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                        child: Text(name,
                            style: Theme.of(context).textTheme.titleMedium)),
                    IconButton.filled(
                      tooltip: bookmarked
                          ? 'Видалити з відвіданих'
                          : 'Додати до відвіданих',
                      onPressed: onBookmark,
                      icon: Icon(
                          bookmarked ? Icons.bookmark : Icons.bookmark_border,
                          size: 20),
                      style: IconButton.styleFrom(
                        backgroundColor:
                            bookmarked ? AppColors.primary : AppColors.infoBg,
                        foregroundColor:
                            bookmarked ? Colors.white : AppColors.primary,
                      ),
                    ),
                  ],
                ),
                Row(
                  children: [
                    const Icon(Icons.location_on_outlined,
                        size: 18, color: AppColors.primary),
                    const SizedBox(width: 4),
                    Expanded(
                        child: Text(address, overflow: TextOverflow.ellipsis)),
                  ],
                ),
                const SizedBox(height: AppSpacing.normal),
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 8),
                        decoration: BoxDecoration(
                          color: AppColors.field,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          tags,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                              fontSize: 11, fontWeight: FontWeight.w700),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    FilledButton(
                      onPressed: onDetails,
                      style: FilledButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10)),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text('Детальніше',
                              style: TextStyle(fontWeight: FontWeight.w700)),
                          SizedBox(width: 4),
                          Icon(Icons.chevron_right, size: 18),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Pill extends StatelessWidget {
  final Widget child;
  const _Pill({required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: const Color(0xF2FFFFFF),
        borderRadius: BorderRadius.circular(20),
      ),
      child: child,
    );
  }
}
