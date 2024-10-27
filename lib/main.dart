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
  // Obtenir la liste des caméras disponibles
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

    // Initialise les options dans initState
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
      // Capture the image
      final image = await _cameraController.takePicture();
      // Show alert when the photo is taken
      await _uploadImage(File(image.path));
      // Optionally, you can save or process the image file
      print('Photo taken and saved at: ${image.path}');
    } catch (e) {
      print("Error while taking the picture: $e");
    }
  }
  Future<void> _uploadImage(File imageFile) async {
    try {
      // Crée un formulaire multipart
      var uri = Uri.parse("http://10.143.232.106:3000/upload"); // Remplace par l'IP ou l'adresse de ton serveur
      var request = http.MultipartRequest('POST', uri);

      // Ajoute l'image dans le corps de la requête
      request.files.add(
        await http.MultipartFile.fromPath(
          'image',
          imageFile.path,
          filename: path.basename(imageFile.path), // Nom de fichier
        ),
      );

      // Envoie la requête
      var response = await request.send();

      // Vérifie la réponse du serveur
      if (response.statusCode == 200) {
        print("Image envoyée avec succès");
        var responseData = await response.stream.bytesToString();
        var decodedData = json.decode(responseData);
        print("Réponse du serveur: ${decodedData['message']}");

        // Affiche un message de confirmation
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