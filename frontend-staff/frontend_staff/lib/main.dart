import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/login_screen.dart';
import 'providers/cart_provider.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (ctx) => CartProvider(),
      child: MaterialApp(
        title: 'Staff Mobile App',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF2563EB),
            primary: const Color(0xFF2563EB),
            secondary: const Color(0xFF3B82F6),
          ),
          useMaterial3: true,
          scaffoldBackgroundColor: const Color(0xFFF8FAFC),
          appBarTheme: const AppBarTheme(
            backgroundColor: Color(0xFF2563EB),
            foregroundColor: Colors.white,
            elevation: 0,
          ),
        ),
        home: const LoginScreen(),
      ),
    );
  }
}
