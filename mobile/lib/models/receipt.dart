class BusinessModel {
  final String id;
  final String name;
  final String? phone;
  final String? address;

  BusinessModel({
    required this.id,
    required this.name,
    this.phone,
    this.address,
  });

  factory BusinessModel.fromJson(Map<String, dynamic> json) {
    return BusinessModel(
      id: json['id'] as String,
      name: json['name'] as String,
      phone: json['phone'] as String?,
      address: json['address'] as String?,
    );
  }
}

class CustomerModel {
  final String id;
  final String name;
  final String phone;

  CustomerModel({
    required this.id,
    required this.name,
    required this.phone,
  });

  factory CustomerModel.fromJson(Map<String, dynamic> json) {
    return CustomerModel(
      id: json['id'] as String,
      name: json['name'] as String,
      phone: json['phone'] as String,
    );
  }
}

class ServiceRequestModel {
  final String id;
  final String description;
  final String? notes;
  final String status;
  final CustomerModel customer;
  final DateTime createdAt;

  ServiceRequestModel({
    required this.id,
    required this.description,
    this.notes,
    required this.status,
    required this.customer,
    required this.createdAt,
  });

  factory ServiceRequestModel.fromJson(Map<String, dynamic> json) {
    return ServiceRequestModel(
      id: json['id'] as String,
      description: json['description'] as String,
      notes: json['notes'] as String?,
      status: json['status'] as String,
      customer: CustomerModel.fromJson(json['customer'] as Map<String, dynamic>),
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }
}

class ReceiptModel {
  final String id;
  final double price;
  final ServiceRequestModel serviceRequest;
  final BusinessModel business;
  final DateTime createdAt;

  ReceiptModel({
    required this.id,
    required this.price,
    required this.serviceRequest,
    required this.business,
    required this.createdAt,
  });

  factory ReceiptModel.fromJson(Map<String, dynamic> json) {
    return ReceiptModel(
      id: json['id'] as String,
      price: double.parse(json['price'].toString()),
      serviceRequest: ServiceRequestModel.fromJson(
        json['serviceRequest'] as Map<String, dynamic>,
      ),
      business: BusinessModel.fromJson(json['business'] as Map<String, dynamic>),
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }
}
