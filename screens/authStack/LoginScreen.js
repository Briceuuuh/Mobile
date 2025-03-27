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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config";
import { BackGround } from "../../component/background";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("briceuh290@gmail.com");
  const [password, setPassword] = useState("Password");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("TabStack");
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
          Connexion
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
          }}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
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

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignUp");
            }}
          >
            <Text
              style={{
                width: "90%",
                alignSelf: "center",
                textAlign: "right",
                marginBottom: 10,
                textDecorationLine: "underline",
              }}
            >
              S'inscrire ?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogin}
            style={{
              width: "90%",
              height: 50,
              backgroundColor: "black",
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white" }}>Se connecter</Text>
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

export default LoginScreen;
