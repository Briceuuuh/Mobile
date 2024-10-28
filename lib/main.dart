import 'dart:typed_data';
import 'package:path_provider/path_provider.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:io';
import 'package:path/path.dart' as path;

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:google_ml_kit/google_ml_kit.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final cameras = await availableCameras();
  final firstCamera = cameras.first;
  runApp(MyApp(camera: firstCamera));
}

class MyApp extends StatelessWidget {
  final CameraDescription camera;
  const MyApp({super.key, required this.camera});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Camera Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: MyHomePage(camera: camera),
    );
  }
}

class MyHomePage extends StatefulWidget {
  final CameraDescription camera;
  const MyHomePage({super.key, required this.camera});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  late CameraController _cameraController;
  bool _isDetecting = false;
  late ObjectDetector _objectDetector;

  @override
  void initState() {
    super.initState();
    final ObjectDetectorOptions options = ObjectDetectorOptions(
      classifyObjects: true,
      trackMutipleObjects: true,
    );
    _objectDetector = GoogleMlKit.vision.objectDetector(options);
    _cameraController = CameraController(
      widget.camera,
      ResolutionPreset.high,
    );
    _cameraController.initialize().then((_) {
      if (!mounted) {
        return;
      }
      setState(() {});
      _cameraController.startImageStream((image) {
        if (!_isDetecting) {
          _isDetecting = true;
          // _detectObject(image);
        }
      });
    });
  }

  Future<void> _takePicture() async {
    try {
      final image = await _cameraController.takePicture();
      await _uploadImage(File(image.path));
      print('Photo taken and saved at: ${image.path}');
    } catch (e) {
      print("Error while taking the picture: $e");
    }
  }

  Future<void> _uploadImage(File imageFile) async {
    try {
      var uri = Uri.parse(
          "https://eae3-109-255-48-69.ngrok-free.app/api/check_product");
      var request = http.MultipartRequest('POST', uri);

      request.files.add(
        await http.MultipartFile.fromPath(
          'image',
          imageFile.path,
          filename: path.basename(imageFile.path), // Nom de fichier
        ),
      );

      var response = await request.send();

      if (response.statusCode == 201) {
        print("Image envoyée avec succès");
        var responseData = await response.stream.bytesToString();
        var decodedData = json.decode(responseData);
        print("Réponse du serveur: ${decodedData['message']}");

        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: const Text('Succès'),
              content: const Text('Image envoyée au serveur avec succès !'),
              actions: <Widget>[
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                  child: const Text('OK'),
                ),
              ],
            );
          },
        );
      } else {
        print("Erreur lors de l'envoi de l'image: ${response.statusCode}");
      }
    } catch (e) {
      print("Erreur lors de l'envoi de l'image: $e");
    }
  }

  @override
  void dispose() {
    _cameraController.dispose();
    _objectDetector.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!_cameraController.value.isInitialized) {
      return const Center(child: CircularProgressIndicator());
    }
    return Scaffold(
      appBar: AppBar(title: const Text("Détection d'objet")),
      body: CameraPreview(_cameraController),
      floatingActionButton: FloatingActionButton(
        onPressed: _takePicture,
        child: const Icon(Icons.camera),
      ),
    );
  }
}
