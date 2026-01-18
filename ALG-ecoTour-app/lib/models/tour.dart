class Tour {
  final int id;
  final String title;
  final String? description;
  final String location;
  final double? latitude;
  final double? longitude;
  final double price;
  final int maxParticipants;
  final String? photoUrl;
  final DateTime createdAt;
  final DateTime updatedAt;

  Tour({
    required this.id,
    required this.title,
    this.description,
    required this.location,
    this.latitude,
    this.longitude,
    required this.price,
    required this.maxParticipants,
    this.photoUrl,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Tour.fromJson(Map<String, dynamic> json) {
    return Tour(
      id: json['id'] as int,
      title: json['title'] as String,
      description: json['description'] as String?,
      location: json['location'] as String,
      latitude: json['latitude'] != null ? (json['latitude'] as num).toDouble() : null,
      longitude: json['longitude'] != null ? (json['longitude'] as num).toDouble() : null,
      price: (json['price'] as num).toDouble(),
      maxParticipants: json['maxParticipants'] as int,
      photoUrl: json['photoURL'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'location': location,
      'latitude': latitude,
      'longitude': longitude,
      'price': price,
      'maxParticipants': maxParticipants,
      'photoURL': photoUrl,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}
