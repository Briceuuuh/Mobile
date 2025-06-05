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
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { BackGroundCamera } from "../component/background_camera";
import { IconAcitivate, IconLocation, IconSvg, IconTopArrow } from "../icon";
import { Touchable } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Camera, CameraView } from "expo-camera";
import * as Device from "expo-device";
import { Picker } from "@react-native-picker/picker";
import { Path, Svg } from "react-native-svg";
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ModalList } from "../component/modal_list";
import { ButtonOpenModal } from "../component/button_open_modal";
import { LoginScreenNavigationProp } from "./authStack/LoginScreen";

const screenWidth = Dimensions.get("window").width;

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [basket, setBasket] = useState([]);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [isSimulator, setIsSimulator] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);

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
      setImage(photo.uri);
      sendImage();
    }
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const storesCollection = collection(db, "commerce");
        const storesSnapshot = await getDocs(storesCollection);
        const storesList = storesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStores(storesList);
        if (storesList.length > 0) {
          setSelectedStoreId(storesList[0].id);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des magasins :", error);
      }
    };
    fetchStores();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    const docRef = doc(db, "client", user.uid);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const basketData = docSnapshot.data()?.current_kart?.kart || [];
          setBasket(basketData);
          // console.log(basketData);
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

    const docRef = doc(db, "client", user.uid);
    try {
      await updateDoc(docRef, {
        current_kart: {
          idStore: "",
          kart: [],
        },
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

  const sendImage = async () => {
    if (!image) {
      Alert.alert("Erreur", "Aucune image sélectionnée");
      return;
    }

    const fileType = image.split(".").pop();
    const formData = new FormData();
    formData.append("image", {
      uri: image,
      name: `image.${fileType}`,
      type: `image/${fileType}`,
    });

    try {
      const response = await fetch(
        `http://141.94.105.29:3000/client/checkProduct/${selectedStoreId}/${user?.uid}`,
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
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'image :", error);
      Alert.alert("Erreur", "L'envoi de l'image a échoué");
    }
  };
  // console.log(JSON.stringify(basket,null,2));

  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: "lightgray" }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {user ? (
          <>
            <View
              style={{
                width: "90%",
                height: 50,
                borderRadius: 100,
                backgroundColor: "white",
                position: "absolute",
                flexDirection: "row",
                zIndex: 999,
                top: insets.top + 10,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Image
                  source={require("../assets/E-VertClair.png")}
                  style={{
                    width: 40,
                    height: 40,
                    marginVertical: 16,
                    borderRadius: 8,
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Changer de magasin",
                    "Quel magasin souhaitez-vous choisir ?",
                    stores.map((store) => ({
                      text: store.name || store.id,
                      onPress: () => setSelectedStoreId(store.id),
                    }))
                  );
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <IconLocation />
                  <Text>{selectedStoreId}</Text>
                </View>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 10,
                    color: "#007A5E",
                    textDecorationLine: "underline",
                  }}
                >
                  Changer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Settings");
                }}
              >
                <Image
                  source={{
                    uri: "https://meta-q.cdn.bubble.io/f1717102933566x753149416257430700/Random%20User%20Generator%20.webp",
                  }}
                  style={{
                    width: 50,
                    height: 50,
                    marginVertical: 16,
                    borderRadius: 25,
                  }}
                />
              </TouchableOpacity>
            </View>

            <>
              {!isSimulator ? (
                <CameraView
                  style={{ flex: 1, width: "100%" }}
                  ref={(ref) => setCameraRef(ref)}
                >
                  <View
                    style={{
                      // flex: 1,
                      width: "100%",
                      backgroundColor: "transparent",
                      position: "absolute",
                      top: 2,
                      justifyContent: "flex-end",
                      alignItems: "center",
                      // marginBottom: 20,
                    }}
                  >
                    <Button title="Prendre une photo" onPress={takePicture} />
                    {/* <View style={{ height: 50 }} /> */}
                  </View>
                </CameraView>
              ) : (
                <>
                  <Button title="Pick an image" onPress={pickImage} />
                  {image && (
                    <>
                      <Image
                        source={{ uri: image }}
                        style={{
                          width: 200,
                          height: 200,
                          marginVertical: 16,
                          borderRadius: 8,
                        }}
                      />
                      <Button title="Send Image" onPress={sendImage} />
                    </>
                  )}
                </>
              )}
            </>
          </>
        ) : (
          <Text>
            Veuillez vous connecter pour voir votre panier et envoyer des
            images.
          </Text>
        )}
      </View>

      <ButtonOpenModal basket={basket} setModalVisible={setModalVisible} />

      <ModalList
        basket={basket}
        deleteBasket={deleteBasket}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
};

export default HomeScreen;
