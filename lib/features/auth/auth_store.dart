/// Імітація сховища користувачів у пам'яті (замість бекенду).
class AuthStore {
  AuthStore._();

  static const demoEmail = 'student.v24@univ.edu.ua';
  static const demoPassword = 'Lab2024#Secret';

  static final Map<String, String> _users = {demoEmail: demoPassword};
  static String? currentEmail;

  static String _key(String email) => email.trim().toLowerCase();

  static bool emailExists(String email) => _users.containsKey(_key(email));

  static bool login(String email, String password) {
    final ok = _users[_key(email)] == password;
    if (ok) currentEmail = _key(email);
    return ok;
  }

  static void register(String email, String password) {
    _users[_key(email)] = password;
    currentEmail = _key(email);
  }

  static bool checkPassword(String password) =>
      currentEmail != null && _users[currentEmail] == password;

  static void changePassword(String newPassword) {
    if (currentEmail != null) _users[currentEmail!] = newPassword;
  }

  static void logout() => currentEmail = null;
}
