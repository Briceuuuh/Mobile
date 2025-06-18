import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth, db, store } from "../config";
import { BackGroundCamera } from "../component/background_camera";
import { Camera, CameraView } from "expo-camera";
import * as Device from "expo-device";
import base64 from "react-native-base64";

import * as FileSystem from "expo-file-system";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const CheckForm = () => {
  const [image, setImage] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [isSimulator, setIsSimulator] = useState(false);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");

      const isDeviceSimulator =
        !Device.isDevice || Device.modelName.includes("Simulator");
      setIsSimulator(isDeviceSimulator);
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setImage(photo.uri); // tu peux le garder si tu veux voir l’image dans l’UI
      Alert.alert("Vérification", `Voulez-vous envoyer l'image ?`, [
        {
          text: "Oui",
          onPress: () => {
            sendImage(photo.uri);
          },
        },
        {
          text: "Non",
        },
      ]);
    }
  };

  const sendImageFire = async (uri) => {
    try {
      const file = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const blob = await fetch(`data:image/jpeg;base64,${file}`).then((res) =>
        res.blob()
      );

      const storage = getStorage();
      const imageRef = ref(storage, `wrongImage/${Date.now()}.jpg`);

      await uploadBytes(imageRef, blob);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'image :", error);
      Alert.alert("Erreur", "Impossible d'envoyer l'image");
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const sendImage = async (imageUri) => {
    if (!imageUri) {
      Alert.alert("Erreur", "Aucune image sélectionnée");
      return;
    }

    const fileType = imageUri.split(".").pop();
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      name: `image.${fileType}`,
      type: `image/${fileType}`,
    });

    try {
      const response = await fetch(
        "https://Briceuh-fast-api.hf.space/predict/",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = await response.json();
      console.log("Réponse de l'API :", result);

      Alert.alert(
        "Vérification",
        `L'image est-elle correcte selon la prédiction : ${
          result?.predictions[0]?.label || "Inconnue"
        } (${(result?.predictions[0]?.confidence * 100).toFixed(1)}%) ?`,
        [
          {
            text: "Oui",
            onPress: () => {
              console.log("Image validée");
            },
          },
          {
            text: "Non",
            onPress: async () => {
              console.log("Image non validée, sauvegarde...");
              try {
                await sendImageFire(imageUri);
                Alert.alert(
                  "Image sauvegardée",
                  `L'image a été enregistrée dans la galerie "wrongImage"`
                );
              } catch (error) {
                console.error(
                  "Erreur lors de la sauvegarde de l'image :",
                  error
                );
                Alert.alert("Erreur", "Impossible de sauvegarder l'image.");
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'image :", error);
      Alert.alert("Erreur", "L'envoi de l'image a échoué");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <BackGroundCamera />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <>
          <>
            {!isSimulator ? (
              <CameraView
                style={{ flex: 1, width: "100%" }}
                ref={(ref) => setCameraRef(ref)}
              >
                <View
                  style={{
                    flex: 1,
                    width: "100%",
                    backgroundColor: "transparent",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <Image
                      style={{
                        width: "100%",
                        top: -30,
                        position: "absolute",
                      }}
                      source={require("./../assets/wave_top.png")}
                    />
                  </View>
                  <Button title="Prendre une photo" onPress={takePicture} />
                  <View style={{ height: 50 }} />
                </View>
              </CameraView>
            ) : (
              <>
                <Button title="Pick an image" onPress={pickImage} />
                {image && (
                  <>
                    <Image source={{ uri: image }} style={styles.image} />
                    <Button title="Send Image" onPress={sendImage} />
                  </>
                )}
              </>
            )}
          </>
        </>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    marginVertical: 16,
    borderRadius: 8,
  },
  openButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    height: "70%",
    backgroundColor: "#F8C471",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
});

export default CheckForm;
