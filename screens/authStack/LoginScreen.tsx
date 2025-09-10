import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config";
import { BackGround } from "../../component/background";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StackNavigationProp } from "@react-navigation/stack";
import { IconEyeClose, IconEyeOpen } from "../../icon";

type AuthStackParamList = {
  TabStack: undefined;
  LostPassword: undefined;
  CheckForm: undefined;
  SignUp: undefined;
  Login: undefined;
  Settings: undefined;
  TicketsScreen: undefined;
  Profile: undefined;
};

export type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("briceuh290@gmail.com");
  const [password, setPassword] = useState("Password");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Erreur", "Veuillez remplir tous les champs.");
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      navigation.reset({
        index: 0,
        routes: [{ name: "TabStack" }],
      });
    } catch (error: any) {
      let message = "Une erreur est survenue. Veuillez réessayer.";

      console.log(error.code);

      switch (error.code) {
        case "auth/invalid-email":
          message = "L'adresse email est invalide.";
          break;
        case "auth/user-disabled":
          message = "Ce compte a été désactivé.";
          break;
        case "auth/user-not-found":
          message = "Aucun utilisateur trouvé avec cet email.";
          break;
        case "auth/invalid-credential":
          message = "L'adresse email est invalide ou mot de passe incorrect.";
          break;
        case "auth/too-many-requests":
          message = "Trop de tentatives. Réessayez plus tard.";
          break;
      }

      Alert.alert("Erreur de connexion", message);
    }
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <BackGround middle={false} />
      {/* <SafeAreaView style={{ flex: 1 }}> */}
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
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("LostPassword");
          }}
        >
          <Text
            style={{
              width: "90%",
              alignSelf: "center",
              textAlign: "right",
            }}
          >
            Mot de passe oublié ?
          </Text>
        </TouchableOpacity>
        <View style={{ width: "100%", alignItems: "center" }}>
          <TouchableOpacity
            onPress={handleLogin}
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
            <Text style={{ color: "white" }}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("SignUp");
        }}
      >
        <Text
          style={{
            alignSelf: "center",
            bottom: 20,
            position: "absolute",
            color: "white",
            textDecorationLine: "underline",
          }}
        >
          S'inscrire ?
        </Text>
      </TouchableOpacity>
      {/* </SafeAreaView> */}
    </View>
  );
};

export default LoginScreen;
