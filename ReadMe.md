
# E-commerce App - Home Screen with User Authentication and Image Upload

## Description
This mobile application allows users to authenticate via Firebase, manage their shopping cart, and upload product images to an API. The app integrates Firebase Firestore to manage cart items and uses the Expo Image Picker to allow users to select images from their device.

## Features
- **User Authentication**: The app uses Firebase Authentication to handle user sign-in and sign-out.
- **Shopping Cart**: Users can view their shopping cart, which is stored in Firebase Firestore, and delete all items from the cart.
- **Image Upload**: Users can pick an image from their device and send it to an external API for processing.
- **Responsive Design**: The app is designed to be responsive and user-friendly, with a simple layout and intuitive navigation.

## Technologies Used
- **React Native**: For building the mobile application.
- **Firebase**: For authentication and Firestore database to store user data.
- **Expo Image Picker**: For selecting images from the user's device.
- **Firebase Firestore**: For storing the user's shopping cart data.
- **Fetch API**: To send images to an external API for processing.

## Prerequisites

To run this project locally, make sure you have the following tools installed:

- **Node.js**: Version 16.x or later
- **Expo CLI**: You can install it globally by running:
  ```bash
  npm install -g expo-cli
  ```
- **Firebase Account**: You need to set up Firebase Authentication and Firestore to use this app.

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone git@github.com:E-Kart-Corp/Mobile.git
   cd Mobile
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Firebase**:
   - Go to the [Firebase Console](https://console.firebase.google.com/), create a new project, and set up Firebase Authentication and Firestore.
   - Add Firebase credentials to your app:
     - In the Firebase console, navigate to your project settings.
     - Copy the Firebase configuration object from the Firebase console.
     - Replace the `config` file in your app with your Firebase credentials.

   Example of Firebase configuration in your app:
   ```js
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';
   import { getFirestore } from 'firebase/firestore';

   const firebaseConfig = {
     apiKey: 'YOUR_API_KEY',
     authDomain: 'YOUR_AUTH_DOMAIN',
     projectId: 'YOUR_PROJECT_ID',
     storageBucket: 'YOUR_STORAGE_BUCKET',
     messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
     appId: 'YOUR_APP_ID',
   };

   const app = initializeApp(firebaseConfig);
   const auth = getAuth(app);
   const db = getFirestore(app);
   ```

4. **Run the App**:
   To start the app, use the following command:
   ```bash
   expo start
   ```

   This will open a new browser window with the Expo developer tools. You can then scan the QR code with the Expo Go app on your mobile device or use an emulator.

## Usage

### Authentication
- Users can log in using their Firebase credentials.
- Once authenticated, the user can view their shopping cart (stored in Firebase Firestore) and delete the items if needed.

### Shopping Cart
- The app fetches the user's shopping cart data from Firebase Firestore in real-time.
- The user can delete all items from the cart by pressing the "Delete panier" button.

### Image Upload
- Users can pick an image from their device's gallery and send it to an API for processing (for example, product identification or product verification).
- The API endpoint used is `https://api-ekart.netlify.app/api/checkProduct`.

## Contribution
Feel free to fork this repository and create pull requests. Contributions are always welcome!
