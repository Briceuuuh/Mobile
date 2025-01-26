import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { BackGroundCamera } from "../component/background_camera";
import { IconSvg } from "../icon";
import { Touchable } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Camera, CameraView } from "expo-camera";
import * as Device from "expo-device";

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [basket, setBasket] = useState([]);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [isSimulator, setIsSimulator] = useState(false);
  const navigation = useNavigation();

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");

      const isDeviceSimulator = !Device.isDevice || Device.modelName.includes("Simulator");
      setIsSimulator(isDeviceSimulator);
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setImage(photo.uri);
      sendImage();
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    const docRef = doc(db, "current_kart", user.uid);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const basketData = docSnapshot.data()?.basket || [];
          setBasket(basketData);
        } else {
          setBasket([]);
        }
      },
      (err) => {
        console.log("Error listening to document:", err);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const deleteBasket = async () => {
    if (!user?.uid) return;

    const docRef = doc(db, "current_kart", user.uid);
    try {
      await updateDoc(docRef, {
        basket: [],
      });
      setBasket([]);
    } catch (error) {
      console.log("Erreur lors de la suppression du panier :", error);
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

  const sendImage = () => {
    if (!image) return;

    const formData = new FormData();
    const uriParts = image.split(".");
    const fileType = uriParts[uriParts.length - 1];
    const file = {
      uri: image,
      name: `image.${fileType}`,
      type: `image/${fileType}`,
    };

    formData.append("image", file);
    formData.append("id_user", user.uid);

    const requestOptions = {
      method: "POST",
      body: formData,
      redirect: "follow",
    };

    fetch("https://api-ekart.netlify.app/api/checkProduct", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  return (
    <View style={{ flex: 1 }}>
      <BackGroundCamera />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Settings");
          }}
          style={{
            zIndex: 999,
            position: "absolute",
            right: 30,
            top: 60,
            width: 40,
            height: 40,
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
          }}
        >
          <IconSvg />
        </TouchableOpacity>
        {user ? (
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
        ) : (
          <Text>
            Veuillez vous connecter pour voir votre panier et envoyer des
            images.
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "#F8C471",
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          bottom: 0,
          paddingBottom: 10,
          alignSelf: "center",
          width: "80%",
          flexDirection: "row",
        }}
        onPress={() => setModalVisible(true)}
      >
        <Image
          style={{ width: 50, height: 50 }}
          source={require("./../assets/logo Ekart.png")}
        />

        <Text style={{ marginLeft: 10, fontWeight: "bold" }}>
          {basket.length} article{basket.length > 1 ? "s" : ""}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Panier !</Text>
            <FlatList
              style={{ width: "100%" }}
              showsVerticalScrollIndicator={false}
              data={basket}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View
                  style={{
                    backgroundColor: "white",
                    marginBottom: 10,
                    padding: 10,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{
                      width: 40,
                      height: 40,
                      borderRightWidth: 1,
                      paddingRight: 10,
                      marginRight: 10,
                    }}
                    source={require("./../assets/logo Ekart.png")}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, fontWeight: "12" }}>
                      {item.product_name || "Produit inconnu"} -{" "}
                      {item.price || "0"}€
                    </Text>
                  </View>
                </View>
              )}
            />
            {basket.length > 0 && (
              <Button title="Delete panier" onPress={deleteBasket} />
            )}
            <Button title="Fermer" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

/* const HomeScreens = () => {
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [basket, setBasket] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    const docRef = doc(db, "current_kart", user.uid);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const basketData = docSnapshot.data()?.basket || [];
          setBasket(basketData);
        } else {
          setBasket([]);
        }
      },
      (err) => {
        console.log("Error listening to document:", err);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const deleteBasket = async () => {
    if (!user?.uid) return;

    const docRef = doc(db, "current_kart", user.uid);
    try {
      await updateDoc(docRef, {
        basket: [],
      });
      setBasket([]);
    } catch (error) {
      console.log("Erreur lors de la suppression du panier :", error);
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

  const sendImage = () => {
    if (!image) return;

    const formData = new FormData();
    const uriParts = image.split(".");
    const fileType = uriParts[uriParts.length - 1];
    const file = {
      uri: image,
      name: `image.${fileType}`,
      type: `image/${fileType}`,
    };

    formData.append("image", file);
    formData.append("id_user", user.uid);

    const requestOptions = {
      method: "POST",
      body: formData,
      redirect: "follow",
    };

    fetch("https://api-ekart.netlify.app/api/checkProduct", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <View style={{ width: "100%" }}>
            <Text>Panier de l'utilisateur : {user.email}</Text>
            <Button title="Delete panier" onPress={deleteBasket} />
          </View>
          <FlatList
            style={{ width: "90%" }}
            data={basket}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{}}>
                <Text style={{ fontSize: 20, fontWeight: "800" }}>
                  {item.product_name || "Produit inconnu"} - {item.price || "0"}
                  €
                </Text>
              </View>
            )}
          />
          <Button title="Pick an image" onPress={pickImage} />
          {image && (
            <>
              <Image source={{ uri: image }} style={styles.image} />
              <Button title="Send Image" onPress={sendImage} />
            </>
          )}
        </>
      ) : (
        <Text>
          Veuillez vous connecter pour voir votre panier et envoyer des images.
        </Text>
      )}
    </View>
  );
}; */

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

export default HomeScreen;
