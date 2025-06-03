import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Button } from "react-native";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db } from "../config";
import { onAuthStateChanged } from "firebase/auth";

const ProfileScreen = () => {
  const [basket, setBasket] = useState([]);
  const [user, setUser] = useState(null);

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

  return (
    <View style={styles.container}>
      <Text>Panier de l'utilisateur :</Text>
      <FlatList
        data={basket}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>
              {item.product_name || "Produit inconnu"} - {item.price || "0"}€
            </Text>
          </View>
        )}
      />
      <Button title="Delete panier" onPress={deleteBasket} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold" },
});

export default ProfileScreen;
