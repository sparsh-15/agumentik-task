const String PRODUCTION_URL = 'https://agumentik-task.onrender.com';
const String LOCAL_URL = 'http://10.0.2.2:5000';

const bool isDevelopment = true;

class ApiConfig {
  static String getBaseUrl() {
    return isDevelopment ? LOCAL_URL : PRODUCTION_URL;
  }

  static String getSocketUrl() {
    return getBaseUrl();
  }

  static String get health => '${getBaseUrl()}/api/health';
  static String get products => '${getBaseUrl()}/get/products';
  static String product(int id) => '${getBaseUrl()}/get/product/$id';
  static String get createOrder => '${getBaseUrl()}/create/order';
}
