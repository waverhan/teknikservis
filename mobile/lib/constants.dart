class Constants {
  // Use http://10.0.2.2:3000 for Android Emulator
  // Use http://localhost:3000 for iOS Simulator
  static const String apiUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://localhost:3000',
  );
}
