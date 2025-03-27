import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../../config";
import { BackGround } from "../../component/background";
import { doc, getDoc, setDoc } from "firebase/firestore";

const SignUp = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("briceuh290@gmail.com");
  const [password, setPassword] = useState("Password");

  const handleSignUp = async () => {
    try {
      await signOut(auth);
      const val = await createUserWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, "client", val?.user?.uid);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        Alert.alert("Erreur", "L'email existe déjà");
        return;
      }
  
      const newUser = {
        email,
        created_at: new Date().toISOString(),
        current_kart: {
          idStore: "",
          kart: [],
        },
      };
  
      await setDoc(userRef, newUser);
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <BackGround />
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={styles.title}>E-kart</Text>
        <Text style={{ fontSize: 18, textAlign: "center", marginBottom: 18 }}>
          Inscription
        </Text>
        <Text style={{ width: "90%", alignSelf: "center" }}>Email</Text>
        <TextInput
          style={{
            width: "90%",
            backgroundColor: "white",
            alignSelf: "center",
            height: 50,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            paddingHorizontal: 16,
            marginBottom: 16,
          }}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={{ width: "90%", alignSelf: "center" }}>Mot de passe</Text>
        <TextInput
          style={{
            width: "90%",
            backgroundColor: "white",
            alignSelf: "center",
            height: 50,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            paddingHorizontal: 16,
            marginBottom: 16,
          }}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <Text style={{ width: "90%", alignSelf: "center" }}>
          Confirmez votre mot de passe
        </Text>
        <TextInput
          style={{
            width: "90%",
            backgroundColor: "white",
            alignSelf: "center",
            height: 50,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            paddingHorizontal: 16,
          }}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              handleSignUp();
            }}
            style={{
              width: "90%",
              height: 50,
              backgroundColor: "black",
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white" }}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});

export default SignUp;
