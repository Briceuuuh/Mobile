import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, Button, SafeAreaView } from "react-native";
import { BackGround } from "../component/background";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config";

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <BackGround />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text>Email : {user?.email}</Text>
        </View>

        <Button
          title="Disconnect"
          onPress={() => navigation.navigate("Login")}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold" },
});

export default SettingsScreen;
