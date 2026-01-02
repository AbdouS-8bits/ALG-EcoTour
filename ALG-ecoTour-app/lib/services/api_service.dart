import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/tour.dart';

class ApiService {
  // CHANGE THIS TO YOUR BACKEND URL
  // For Android Emulator: http://10.0.2.2:3000
  // For iOS Simulator: http://localhost:3000
  // For Real Phone: http://YOUR_COMPUTER_IP:3000
  // For Production: https://your-domain.com
  static const String baseUrl = 'http://localhost:3000';
  
  static String? _authToken;

  // Login
  static Future<bool> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/signin'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        _authToken = data['token'];
        return true;
      }
      return false;
    } catch (e) {
      print('Login error: $e');
      return false;
    }
  }

  // Signup
  static Future<bool> signup(String name, String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/signup'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': name,
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 201) {
        return await login(email, password);
      }
      return false;
    } catch (e) {
      print('Signup error: $e');
      return false;
    }
  }

  // Get all tours
  static Future<List<Tour>> getTours() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/admin/tours'),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => Tour.fromJson(json)).toList();
      }
      throw Exception('Failed to load tours');
    } catch (e) {
      print('Get tours error: $e');
      rethrow;
    }
  }

  // Get single tour
 static Future<Tour> getTour(String id) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/tours/$id'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return Tour.fromJson(data);
      }
      throw Exception('Failed to load tour');
    } catch (e) {
      print('Get tour error: $e');
      rethrow;
    }
  }
  

  // Create booking
  static Future<bool> createBooking({
    required int tourId,
    required String guestName,
    required String guestEmail,
    required String guestPhone,
    required int participants,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/bookings'),
        headers: {
          'Content-Type': 'application/json',
          if (_authToken != null) 'Authorization': 'Bearer $_authToken',
        },
        body: jsonEncode({
          'tourId': tourId,
          'guestName': guestName,
          'guestEmail': guestEmail,
          'guestPhone': guestPhone,
          'participants': participants,
        }),
      );

      return response.statusCode == 201;
    } catch (e) {
      print('Create booking error: $e');
      return false;
    }
  }

  // Logout
  static void logout() {
    _authToken = null;
  }

  // Check if logged in
  static bool isLoggedIn() {
    return _authToken != null;
  }
}
