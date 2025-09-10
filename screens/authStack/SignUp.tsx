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
  ScrollView,
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
import { Image } from "react-native";
import MyHeader from "../../component/my_header";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LoginScreenNavigationProp } from "./LoginScreen";
import { IconEyeClose, IconEyeOpen } from "../../icon";

const SignUp = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("briceuh290@gmail.com");
  const [password, setPassword] = useState("Password");
  const [confirmPassword, setConfirmPassword] = useState("Password");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    try {
      if (!email || !password || !confirmPassword) {
        Alert.alert("Erreur", "Veuillez remplir tous les champs.");
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
        return;
      }

      await signOut(auth); // pour éviter un conflit si quelqu'un est connecté
      const val = await createUserWithEmailAndPassword(auth, email, password);

      const userRef = doc(db, "client", val?.user?.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        Alert.alert("Erreur", "Un compte existe déjà avec cet email.");
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

      Alert.alert("Succès", "Votre compte a été créé avec succès !");
      navigation.navigate("Login");
    } catch (error: any) {
      let message = "Une erreur est survenue. Veuillez réessayer.";

      switch (error.code) {
        case "auth/email-already-in-use":
          message = "Cette adresse email est déjà utilisée.";
          break;
        case "auth/invalid-email":
          message = "L'adresse email est invalide.";
          break;
        case "auth/weak-password":
          message = "Le mot de passe est trop faible (minimum 6 caractères).";
          break;
      }

      Alert.alert("Erreur", message);
    }
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <BackGround middle={false} />
      <MyHeader />
      <ScrollView>
        <View style={{ height: insets.top }} />
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 80,
          }}
        >
          <Image
            style={{
              top: 0,
              left: 0,
            }}
            source={require("./../../assets/logo_long.png")}
          />
        </View>
        <TextInput
          style={{
            width: "90%",
            backgroundColor: "white",
            alignSelf: "center",
            marginTop: 20,
            paddingHorizontal: 16,
            paddingVertical: 17,
            borderRadius: 18,
            shadowOpacity: 0.5,
            shadowRadius: 3,
            shadowOffset: {
              height: 0,
              width: 0,
            },
          }}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            alignSelf: "center",
            marginTop: 20,
            borderRadius: 18,
            marginBottom: 16,
            shadowOpacity: 0.5,
            shadowRadius: 3,
            shadowOffset: { height: 0, width: 0 },
          }}
        >
          <TextInput
            style={{
              flex: 1,
              paddingHorizontal: 16,
              paddingVertical: 17,
            }}
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ paddingHorizontal: 12 }}
          >
            {showPassword ? <IconEyeOpen /> : <IconEyeClose />}
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            alignSelf: "center",
            // marginTop: 20,
            borderRadius: 18,
            marginBottom: 16,
            shadowOpacity: 0.5,
            shadowRadius: 3,
            shadowOffset: { height: 0, width: 0 },
          }}
        >
          <TextInput
            style={{
              flex: 1,
              paddingHorizontal: 16,
              paddingVertical: 17,
            }}
            placeholder="Mot de passe"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              handleSignUp();
            }}
            style={{
              padding: 12,
              marginTop: 20,
              width: 175,
              height: 45,
              backgroundColor: "#007A5E",
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              shadowOpacity: 0.5,
              shadowRadius: 3,
              shadowColor: "rgba(0,122,84, 1)",
              shadowOffset: {
                height: 0,
                width: 0,
              },
            }}
          >
            <Text style={{ color: "white" }}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUp;
