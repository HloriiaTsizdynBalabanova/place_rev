/// Hardcoded-дані для демонстрації інтерфейсу (без бекенду).
class MockPlace {
  final String image;
  final String category;
  final String name;
  final String address;
  final double rating;
  final String ratingLabel;
  final bool visited;
  final String? note;

  const MockPlace({
    required this.image,
    required this.category,
    required this.name,
    required this.address,
    required this.rating,
    required this.ratingLabel,
    this.visited = false,
    this.note,
  });
}

const mockPlaces = <MockPlace>[
  MockPlace(
    image: 'assets/images/place1.jpg',
    category: "Кав'ярні",
    name: 'Кав\'ярня "Світ Кави"',
    address: 'вул. Сагайдачного, 12',
    rating: 5.0,
    ratingLabel: 'Оцінка користувача',
    visited: true,
    note: '«Ідеальне місце для підготовки дипломної роботи»',
  ),
  MockPlace(
    image: 'assets/images/place2.jpg',
    category: 'Ресторани',
    name: 'Ресторан "Бачевських"',
    address: 'вул. Шевченка, 8',
    rating: 4.8,
    ratingLabel: 'Оцінка користувача',
    visited: true,
    note: '«Галицька кухня, неперевершена оранжерея»',
  ),
  MockPlace(
    image: 'assets/images/place3.jpg',
    category: 'Громадський ресторан',
    name: 'Urban Space 500',
    address: 'вул. Грінченка, 9',
    rating: 4.6,
    ratingLabel: 'Загальний рейтинг',
  ),
];
