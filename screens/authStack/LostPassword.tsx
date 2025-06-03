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
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../config";
import { BackGround } from "../../component/background";
import MyHeader from "../../component/my_header";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LostPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("briceuh29@gmail.com");

  const insets = useSafeAreaInsets();

  const handleLostPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <BackGround />
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
        <View style={{ width: "100%", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              handleLostPassword();
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
            <Text style={{ color: "white" }}>Envoyer un code</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default LostPassword;
