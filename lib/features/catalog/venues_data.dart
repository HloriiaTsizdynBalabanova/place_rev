import 'package:flutter/material.dart';

/// Модель закладу (hardcoded-дані замість відповіді сервера).
class Venue {
  final String id;
  final String name;
  final String address;
  final String image;
  final String badge;
  final IconData badgeIcon;
  final Set<String> types;
  final double rating;
  final int reviews;
  final String tags;
  final String description;
  final double? userRating;
  final String? note;

  const Venue({
    required this.id,
    required this.name,
    required this.address,
    required this.image,
    required this.badge,
    required this.badgeIcon,
    required this.types,
    required this.rating,
    required this.reviews,
    required this.tags,
    required this.description,
    this.userRating,
    this.note,
  });
}

const venueFilters = ['Усі', "Кав'ярні", 'Ресторани', 'Коворкінги'];

const venues = <Venue>[
  Venue(
    id: 'coffee_books',
    name: 'Coffee & Books Hub',
    address: 'вул. Володимирська, 45',
    image: 'assets/images/catalog1.jpg',
    badge: "Кав'ярня / Коворкінг",
    badgeIcon: Icons.local_cafe_outlined,
    types: {"Кав'ярні", 'Коворкінги'},
    rating: 4.9,
    reviews: 189,
    tags: 'Wi-Fi • Робочі місця',
    description:
        'Затишний простір з книгами та кавою для навчання й командної роботи.',
    userRating: 4,
    note: "Чудове місце для підготовки до лабораторних з комп'ютерних наук.",
  ),
  Venue(
    id: 'campus_green',
    name: 'Campus Green Cafe',
    address: 'вул. Ломоносова, 81',
    image: 'assets/images/catalog2.jpg',
    badge: 'Студентське кафе',
    badgeIcon: Icons.school_outlined,
    types: {"Кав'ярні"},
    rating: 4.8,
    reviews: 312,
    tags: 'Студ. меню • Робочі місця',
    description:
        'Світла оранжерея зі студентським меню та великими столами для груп.',
  ),
  Venue(
    id: 'cafe_svit',
    name: 'Кав\'ярня "Світ Кави"',
    address: 'вул. Сагайдачного, 12',
    image: 'assets/images/place1.jpg',
    badge: "Кав'ярня",
    badgeIcon: Icons.local_cafe_outlined,
    types: {"Кав'ярні"},
    rating: 4.9,
    reviews: 204,
    tags: 'Свіжа кава • Випічка',
    description: 'Обсмажування кави на місці та тиха атмосфера для роботи.',
    userRating: 5,
    note: '«Ідеальне місце для підготовки дипломної роботи»',
  ),
  Venue(
    id: 'bachevskykh',
    name: 'Ресторан "Бачевських"',
    address: 'вул. Шевченка, 8',
    image: 'assets/images/place2.jpg',
    badge: 'Ресторан',
    badgeIcon: Icons.restaurant_outlined,
    types: {'Ресторани'},
    rating: 4.7,
    reviews: 421,
    tags: 'Галицька кухня • Тераса',
    description: 'Ресторан із галицькою кухнею та зимовим садом-оранжереєю.',
    userRating: 4.8,
    note: '«Галицька кухня, неперевершена оранжерея»',
  ),
  Venue(
    id: 'urban_space',
    name: 'Urban Space 500',
    address: 'вул. Грінченка, 9',
    image: 'assets/images/place3.jpg',
    badge: 'Громадський ресторан',
    badgeIcon: Icons.groups_outlined,
    types: {'Ресторани', 'Коворкінги'},
    rating: 4.6,
    reviews: 530,
    tags: 'Wi-Fi • Великий зал',
    description: 'Просторий громадський заклад із відкритою кухнею та залами.',
  ),
];
