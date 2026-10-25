import 'package:flutter_test/flutter_test.dart';
import 'package:place_rev/main.dart';

void main() {
  testWidgets('Екран авторизації відображається', (tester) async {
    await tester.pumpWidget(const PlaceRevApp());
    expect(find.text('Авторизація'), findsOneWidget);
  });
}
