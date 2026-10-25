import 'package:flutter/material.dart';
import 'venues_data.dart';

/// Спільний стан «відвіданих» закладів (у пам'яті, без бекенду).
class VisitedStore {
  VisitedStore._();

  static final ValueNotifier<Set<String>> ids = ValueNotifier<Set<String>>({
    'coffee_books',
    'cafe_svit',
    'bachevskykh',
  });

  static bool contains(String id) => ids.value.contains(id);

  static void toggle(String id) {
    final next = Set<String>.of(ids.value);
    if (!next.add(id)) next.remove(id);
    ids.value = next;
  }

  /// Змінює статус і показує повідомлення з можливістю скасувати дію.
  static void toggleWithFeedback(BuildContext context, Venue venue) {
    final wasVisited = contains(venue.id);
    toggle(venue.id);
    final messenger = ScaffoldMessenger.of(context);
    messenger.hideCurrentSnackBar();
    messenger.showSnackBar(
      SnackBar(
        content: Text(
          wasVisited
              ? '«${venue.name}» видалено з відвіданих'
              : '«${venue.name}» додано до відвіданих',
        ),
        action: SnackBarAction(
            label: 'Скасувати', onPressed: () => toggle(venue.id)),
      ),
    );
  }
}
