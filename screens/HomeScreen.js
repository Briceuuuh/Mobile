import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Image, FlatList } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

const HomeScreen = () => {
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 16,
    borderRadius: 8,
  },
});

export default HomeScreen;
