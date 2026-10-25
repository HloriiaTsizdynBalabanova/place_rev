/// Прості правила валідації форм (без бекенду).
class Validators {
  Validators._();

  static String? required(String? v, String label) {
    if (v == null || v.trim().isEmpty) return 'Введіть $label';
    return null;
  }

  static String? email(String? v) {
    final s = v?.trim() ?? '';
    if (s.isEmpty) return 'Введіть електронну пошту';
    final re = RegExp(r'^[\w.+-]+@([\w-]+\.)+[\w-]{2,}$');
    if (!re.hasMatch(s)) {
      return 'Введіть коректний email у форматі name@domain.com';
    }
    return null;
  }

  static String? name(String? v, String label) {
    final s = v?.trim() ?? '';
    if (s.isEmpty) return 'Введіть $label';
    if (s.length < 2) return 'Мінімум 2 символи';
    final re = RegExp(r"^[\p{L}'’\- ]+$", unicode: true);
    if (!re.hasMatch(s)) return 'Дозволені лише літери';
    return null;
  }

  static String? password(String? v) {
    final s = v ?? '';
    if (s.isEmpty) return 'Введіть пароль';
    if (s.length < 8) return 'Мінімум 8 символів';
    if (!s.contains(RegExp(r'\p{L}', unicode: true)) ||
        !s.contains(RegExp(r'\d'))) {
      return 'Пароль має містити літери та цифри';
    }
    return null;
  }

  static String? confirm(String? password, String? confirm) {
    if (confirm == null || confirm.isEmpty) return 'Підтвердіть пароль';
    if (password != confirm) return 'Паролі не співпадають';
    return null;
  }

  /// Телефон необов'язковий, але якщо введений - має бути коректним.
  static String? phone(String? v) {
    final s = v?.trim() ?? '';
    if (s.isEmpty) return null;
    if (!RegExp(r'^\+?[\d\s()-]+$').hasMatch(s)) {
      return 'Телефон може містити лише цифри, пробіли та +';
    }
    final digits = s.replaceAll(RegExp(r'\D'), '');
    if (digits.length < 10 || digits.length > 13) {
      return 'Введіть коректний номер телефону';
    }
    return null;
  }
}
