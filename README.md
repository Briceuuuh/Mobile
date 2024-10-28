
## Mobile

# Flutter Camera Object Detection App

Cette application Flutter utilise la caméra pour détecter des objets en temps réel à l'aide de Google ML Kit. L'utilisateur peut prendre une photo et l'envoyer à un serveur pour traitement.

## Prérequis

- Flutter SDK
- Dart
- Un environnement de développement (comme Android Studio ou VSCode)
- Un appareil Android ou un émulateur avec accès à la caméra

## Installation

1. **Installez les dépendances :**

   Ouvrez le terminal dans le répertoire du projet et exécutez :

   ```bash
   flutter pub get
   ```

2. **Ajoutez les permissions nécessaires :**

   Modifiez le fichier `AndroidManifest.xml` pour inclure les permissions d'accès à la caméra et à Internet :

   ```xml
   <uses-permission android:name="android.permission.CAMERA"/>
   <uses-permission android:name="android.permission.INTERNET"/>
   ```

## Utilisation de Ngrok

Pour exposer votre serveur local et permettre à l'application d'accéder à l'API, suivez ces étapes :

1. **Lancez votre serveur :**

   Assurez-vous que votre serveur fonctionne et écoute sur le port 3000.

2. **Téléchargez et installez Ngrok :**

   Si ce n'est pas déjà fait, téléchargez Ngrok depuis [le site officiel](https://ngrok.com/download) et installez-le.

3. **Démarrez Ngrok :**

   Ouvrez un terminal et exécutez la commande suivante pour exposer votre serveur local :

   ```bash
   ngrok http 3000
   ```

   Cela générera une URL publique que vous utiliserez pour accéder à votre API.

4. **Mettez à jour l'URL de l'API dans l'application :**

   Dans le fichier de code source, modifiez l'URL pour correspondre à l'URL générée par Ngrok. Par exemple :

   ```dart
   var uri = Uri.parse("https://votre-ngrok-url/api/check_product");
   ```

   Assurez-vous de remplacer `https://votre-ngrok-url` par l'URL que Ngrok a générée.

## Lancer l'application

1. **Exécutez l'application :**

   Utilisez la commande suivante dans le terminal :

   ```bash
   flutter run
   ```

2. **Tester l'application :**

   - Ouvrez l'application sur votre appareil ou émulateur.
   - Appuyez sur le bouton de la caméra pour prendre une photo.
   - Vérifiez que l'image est envoyée avec succès au serveur.

## Remarques

- Si vous fermez Ngrok ou si votre session expire, vous devrez relancer Ngrok et mettre à jour l'URL de l'API dans votre code.
- Assurez-vous que votre application dispose des autorisations nécessaires pour accéder à la caméra et à Internet.

## Contributions

Les contributions sont les bienvenues ! N'hésitez pas à soumettre des issues ou des pull requests.

## License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
