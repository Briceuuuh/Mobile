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
import { IconAcitivate, IconSvg, IconTopArrow } from "../icon";
import { Touchable } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Camera, CameraView } from "expo-camera";
import * as Device from "expo-device";
import { Picker } from "@react-native-picker/picker";
import { Path, Svg } from "react-native-svg";

const screenWidth = Dimensions.get("window").width;

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [basket, setBasket] = useState([]);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [isSimulator, setIsSimulator] = useState(false);
  const navigation = useNavigation();
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

  return (
    <View style={{ flex: 1, backgroundColor: "lightgray" }}>
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
            <Picker
              selectedValue={selectedStoreId}
              onValueChange={(itemValue) => setSelectedStoreId(itemValue)}
              style={{ height: 50, width: 200, marginBottom: 200 }}
            >
              {stores.map((store) => (
                <Picker.Item
                  key={store.id}
                  label={store.name || store.id}
                  value={store.id}
                />
              ))}
            </Picker>
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

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Svg height="110" width={screenWidth}>
          <Path
            d={`M0 50 Q${
              screenWidth / 2
            } -40 ${screenWidth} 50 L${screenWidth} 110 L0 110 Z`}
            fill="white"
          />
        </Svg>
        <View style={{ position: "absolute", top: 20, alignItems: "center" }}>
          <IconTopArrow />
          <Text style={{ fontSize: 10 }}>
            Votre panier contient {basket.length} article
            {basket.length > 1 ? "s" : ""}
          </Text>
          <Text style={{ fontSize: 25 }}>
            {basket.reduce((sum, item) => sum + item.price * item.quantity, 0)}€
          </Text>
          <Text style={{ fontSize: 10, color: "#FF3333", marginBottom: 10 }}>
            Auto-paiement à la sortie
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => setModalVisible(!true)}
            style={{
              width: "100%",
              alignItems: "center",
            }}
          >
            <Svg height="110" width={screenWidth}>
              <Path
                d={`M0 50 Q${
                  screenWidth / 2
                } -40 ${screenWidth} 50 L${screenWidth} 110 L0 110 Z`}
                fill="white"
              />
            </Svg>
            <View
              style={{
                position: "absolute",
                top: 20,
                alignItems: "center",
                width: "100%",
              }}
            >
              <TouchableOpacity
                onPress={deleteBasket}
                style={{
                  position: "absolute",
                  top: 20,
                  right: 40,
                  width: 77,
                  height: 35,
                  borderRadius: 17.5,
                  backgroundColor: "#EC263D",
                  alignItems: "center",
                }}
              >
                <IconAcitivate />
                <Text style={{ fontSize: 10, color: "white" }}>Abandon</Text>
              </TouchableOpacity>
              <View style={{ transform: [{ rotate: "180deg" }] }}>
                <IconTopArrow />
              </View>
              <Text style={{ fontSize: 10 }}>Votre panier</Text>
              <Text style={{ fontSize: 25 }}>
                {basket_bob.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                )}
                €
              </Text>
              <Text>{""}</Text>
              <View
                style={{
                  left: 0,
                  flexDirection: "row",
                  width: "95%",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 10, color: "#FF3333" }}>
                  Auto-paiement à la sortie
                </Text>
                <Text style={{ fontSize: 13 }}>
                  Nombre d'articles: {basket_bob.length}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <View
            style={{
              width: "100%",
              height: "70%",
              bottom: 0,
              backgroundColor: "white",
              borderTopWidth: 1,
              alignItems: "center",
            }}
          >
            <FlatList
              style={{ width: "100%" }}
              showsVerticalScrollIndicator={false}
              data={basket_bob}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <>
                  <View
                    style={{
                      backgroundColor: "#007A5E",
                      alignSelf: "center",
                      width: "90%",
                      marginTop: 15,
                      paddingTop: 3,
                      paddingBottom: 3,
                      paddingLeft: 3,
                      flexDirection: "row",
                      alignItems: "center",
                      borderRadius: 100,
                    }}
                  >
                    <View>
                      <Image
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 25,
                          backgroundColor: "white",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 10,
                        }}
                        source={require("./../assets/logo Ekart.png")}
                      />
                    </View>
                    <View
                      style={{
                        flex: 1,
                        // backgroundColor: "pink",
                        height: "100%",
                      }}
                    >
                      <Text
                        style={{
                          position: "absolute",
                          top: 0,
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        {item.product_name || "Produit inconnu"}
                      </Text>
                      <TouchableOpacity
                        style={{
                          position: "absolute",
                          bottom: 0,
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            textDecorationLine: "underline",
                          }}
                        >
                          Info nutrition
                        </Text>
                      </TouchableOpacity>

                      <View
                        style={{
                          position: "absolute",
                          right: 0,
                          height: 40,
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            backgroundColor: "white",
                            borderRadius: 10,
                            paddingHorizontal: 10,
                          }}
                        >
                          {item.price || "Produit inconnu"}€
                        </Text>
                      </View>
                    </View>
                  </View>
                </>
              )}
              ListFooterComponent={
                <View style={{ padding: 20, alignItems: "center" }}>
                  <Text style={{ color: "gray" }}>
                    Vous êtes arrivé en bas 🛒
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const basket_bob = [
  {
    product_id: "p1",
    product_name: "Bouteille d'eau Evian",
    quantity: 2,
    barcode: "1234567890123",
    brand: "Evian",
    price: 1.5,
  },
  {
    product_id: "p2",
    product_name: "Paquet de pâtes Barilla",
    quantity: 1,
    barcode: "9876543210987",
    brand: "Barilla",
    price: 2.3,
  },
  {
    product_id: "p3",
    product_name: "Tablette de chocolat Lindt",
    quantity: 3,
    barcode: "4567891234567",
    brand: "Lindt",
    price: 2.8,
  },
  {
    product_id: "p4",
    product_name: "Pack de yaourts Danone",
    quantity: 1,
    barcode: "7894561237894",
    brand: "Danone",
    price: 3.2,
  },
  {
    product_id: "p3",
    product_name: "Tablette de chocolat Lindt",
    quantity: 3,
    barcode: "4567891234567",
    brand: "Lindt",
    price: 2.8,
  },
  {
    product_id: "p4",
    product_name: "Pack de yaourts Danone",
    quantity: 1,
    barcode: "7894561237894",
    brand: "Danone",
    price: 3.2,
  },
  {
    product_id: "p3",
    product_name: "Tablette de chocolat Lindt",
    quantity: 3,
    barcode: "4567891234567",
    brand: "Lindt",
    price: 2.8,
  },
  {
    product_id: "p4",
    product_name: "Pack de yaourts Danone",
    quantity: 1,
    barcode: "7894561237894",
    brand: "Danone",
    price: 3.2,
  },
  {
    product_id: "p3",
    product_name: "Tablette de chocolat Lindt",
    quantity: 3,
    barcode: "4567891234567",
    brand: "Lindt",
    price: 2.8,
  },
  {
    product_id: "p4",
    product_name: "Pack de yaourts Danone",
    quantity: 1,
    barcode: "7894561237894",
    brand: "Danone",
    price: 3.2,
  },
  {
    product_id: "p3",
    product_name: "Tablette de chocolat Lindt",
    quantity: 3,
    barcode: "4567891234567",
    brand: "Lindt",
    price: 2.8,
  },
  {
    product_id: "p4",
    product_name: "Pack de yaourts Danone",
    quantity: 1,
    barcode: "7894561237894",
    brand: "Danone",
    price: 3.2,
  },
  {
    product_id: "p3",
    product_name: "Tablette de chocolat Lindt",
    quantity: 3,
    barcode: "4567891234567",
    brand: "Lindt",
    price: 2,
  },
  {
    product_id: "p4",
    product_name: "Pack de yaourts Danone",
    quantity: 1,
    barcode: "7894561237894",
    brand: "Danone",
    price: 3,
  },
];

export default HomeScreen;
