import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/utils/validators.dart';
import '../../core/widgets/app_buttons.dart';
import '../../core/widgets/app_text_field.dart';
import '../../core/widgets/app_top_bar.dart';
import '../../core/widgets/form_card.dart';
import '../auth/auth_store.dart';
import '../auth/login_screen.dart';
import 'change_password_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  // Hardcoded-дані користувача замість відповіді сервера.
  static const _firstName = 'Олександр';
  static const _lastName = 'Шевченко';
  static const _email = 'o.shevchenko@univ.edu.ua';
  static const _phone = '+380 67 123 45 67';
  static const _city = 'Київ';

  final _firstNameCtrl = TextEditingController(text: _firstName);
  final _lastNameCtrl = TextEditingController(text: _lastName);
  final _emailCtrl = TextEditingController(text: _email);
  final _phoneCtrl = TextEditingController(text: _phone);
  final _cityCtrl = TextEditingController(text: _city);

  String? _firstNameError;
  String? _lastNameError;
  String? _emailError;
  String? _phoneError;

  // Збережені значення, до яких повертає кнопка «Скасувати».
  String _savedFirst = _firstName;
  String _savedLast = _lastName;
  String _savedEmail = _email;
  String _savedPhone = _phone;
  String _savedCity = _city;

  @override
  void dispose() {
    for (final c in [
      _firstNameCtrl,
      _lastNameCtrl,
      _emailCtrl,
      _phoneCtrl,
      _cityCtrl
    ]) {
      c.dispose();
    }
    super.dispose();
  }

  void _save() {
    final firstErr = Validators.name(_firstNameCtrl.text, "ім'я");
    final lastErr = Validators.name(_lastNameCtrl.text, 'прізвище');
    final emailErr = Validators.email(_emailCtrl.text);
    final phoneErr = Validators.phone(_phoneCtrl.text);

    setState(() {
      _firstNameError = firstErr;
      _lastNameError = lastErr;
      _emailError = emailErr;
      _phoneError = phoneErr;
    });
    if (firstErr != null ||
        lastErr != null ||
        emailErr != null ||
        phoneErr != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Виправте помилки у формі')),
      );
      return;
    }

    setState(() {
      _savedFirst = _firstNameCtrl.text.trim();
      _savedLast = _lastNameCtrl.text.trim();
      _savedEmail = _emailCtrl.text.trim();
      _savedPhone = _phoneCtrl.text.trim();
      _savedCity = _cityCtrl.text.trim();
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Дані профілю збережено')),
    );
  }

  void _cancel() {
    setState(() {
      _firstNameCtrl.text = _savedFirst;
      _lastNameCtrl.text = _savedLast;
      _emailCtrl.text = _savedEmail;
      _phoneCtrl.text = _savedPhone;
      _cityCtrl.text = _savedCity;
      _firstNameError = null;
      _lastNameError = null;
      _emailError = null;
      _phoneError = null;
    });
  }

  Future<void> _logout() async {
    // Підтвердження незворотної дії (запобігання помилковому виходу).
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Вийти із системи?'),
        content: const Text('Ви повернетеся на екран авторизації.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('Скасувати'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            child: const Text('Вийти'),
          ),
        ],
      ),
    );
    if (confirmed != true || !mounted) return;

    AuthStore.logout();
    Navigator.of(context, rootNavigator: true).pushAndRemoveUntil(
      MaterialPageRoute<void>(builder: (_) => const LoginScreen()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AppTopBar(badge: 'ПРОФІЛЬ'),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.normal),
        children: [
          FormCard(
            child: Column(
              children: [
                Row(
                  children: [
                    const CircleAvatar(
                      radius: 40,
                      backgroundImage: AssetImage('assets/images/avatar.jpg'),
                    ),
                    const SizedBox(width: AppSpacing.normal),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '$_savedFirst $_savedLast',
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                          Text(_savedEmail),
                          const SizedBox(height: 4),
                          const Text(
                            'ФАКУЛЬТЕТ КІБЕРНЕТИКИ • КНУ',
                            style: TextStyle(
                                fontSize: 11, fontWeight: FontWeight.w700),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.normal),
                const Row(
                  children: [
                    Expanded(
                        child: _Stat(
                            value: '14',
                            label: 'Відвідано закладів',
                            color: AppColors.infoBg)),
                    SizedBox(width: 12),
                    Expanded(
                        child: _Stat(
                            value: '12',
                            label: 'Особистих відгуків',
                            color: AppColors.amberBg)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.normal),
          FormCard(
            child: Column(
              children: [
                const Row(
                  children: [
                    Icon(Icons.badge_outlined, color: AppColors.primary),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Дані профілю',
                        style: TextStyle(
                            fontSize: 18, fontWeight: FontWeight.w800),
                      ),
                    ),
                    Text('ID: USR-8492', style: TextStyle(fontSize: 11)),
                  ],
                ),
                const SizedBox(height: AppSpacing.normal),
                AppTextField(
                  label: "Ім'я",
                  isRequired: true,
                  tag: 'Тільки літери',
                  icon: Icons.person_outline,
                  controller: _firstNameCtrl,
                  errorText: _firstNameError,
                  onChanged: (_) => setState(() => _firstNameError = null),
                ),
                const SizedBox(height: AppSpacing.normal),
                AppTextField(
                  label: 'Прізвище',
                  isRequired: true,
                  tag: "Обов'язково",
                  icon: Icons.badge_outlined,
                  controller: _lastNameCtrl,
                  errorText: _lastNameError,
                  onChanged: (_) => setState(() => _lastNameError = null),
                ),
                const SizedBox(height: AppSpacing.normal),
                AppTextField(
                  label: 'Електронна адреса',
                  isRequired: true,
                  tag: 'SSO валідовано',
                  icon: Icons.mail_outline,
                  controller: _emailCtrl,
                  keyboardType: TextInputType.emailAddress,
                  errorText: _emailError,
                  onChanged: (_) => setState(() => _emailError = null),
                ),
                const SizedBox(height: AppSpacing.normal),
                AppTextField(
                  label: 'Номер телефону',
                  icon: Icons.phone_outlined,
                  controller: _phoneCtrl,
                  keyboardType: TextInputType.phone,
                  errorText: _phoneError,
                  onChanged: (_) => setState(() => _phoneError = null),
                ),
                const SizedBox(height: AppSpacing.normal),
                AppTextField(
                  label: 'Місто',
                  icon: Icons.location_city,
                  controller: _cityCtrl,
                ),
                const SizedBox(height: AppSpacing.medium),
                Row(
                  children: [
                    Expanded(
                      child: PrimaryButton(
                        label: 'Зберегти',
                        icon: Icons.save_outlined,
                        onPressed: _save,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: SecondaryButton(
                        label: 'Скасувати',
                        icon: Icons.close,
                        onPressed: _cancel,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.normal),
          SecondaryButton(
            label: 'Змінити пароль',
            icon: Icons.lock_outline,
            onPressed: () => Navigator.of(context).push(
              MaterialPageRoute<void>(
                  builder: (_) => const ChangePasswordScreen()),
            ),
          ),
          const SizedBox(height: 12),
          SecondaryButton(
              label: 'Вийти із системи',
              icon: Icons.logout,
              onPressed: _logout),
          const SizedBox(height: AppSpacing.normal),
        ],
      ),
    );
  }
}

class _Stat extends StatelessWidget {
  final String value;
  final String label;
  final Color color;

  const _Stat({required this.value, required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration:
          BoxDecoration(color: color, borderRadius: BorderRadius.circular(12)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(value,
              style:
                  const TextStyle(fontSize: 24, fontWeight: FontWeight.w800)),
          Text(label, style: const TextStyle(fontSize: 12)),
        ],
      ),
    );
  }
}
