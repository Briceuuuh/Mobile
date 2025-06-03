import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { BackGround } from "../component/background";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config";
import { IconSvg } from "../icon";

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
          <View
            style={{
              height: 100,
              width: 100,
              borderRadius: 50,
              backgroundColor: "pink",
            }}
          ></View>
          <Text>Email : {user?.email}</Text>
          <Text>Prénom</Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <ListButton />
        </View>
      </SafeAreaView>
    </View>
  );
};

const ListButton = () => {
  const navigation = useNavigation();
  return (
    <View style={{ width: "90%", alignItems: "center", alignSelf: "center" }}>
      <ButtonAction
        title={"Ceci est un test"}
        action={() => alert("bonjour")}
        icon={<IconSvg />}
      />
      <ButtonAction
        title={"Ceci est un test"}
        action={() => alert("bonjour")}
        icon={<IconSvg />}
      />
      <ButtonAction
        title={"Ceci est un test"}
        action={() => alert("bonjour")}
        icon={<IconSvg />}
      />
      <ButtonAction
        title={"Ceci est un test"}
        action={() => alert("bonjour")}
        icon={<IconSvg />}
      />
      <Button title="Disconnect" onPress={() => navigation.navigate("Login")} />
    </View>
  );
};

const ButtonAction = ({ title, icon, action }) => {
  return (
    <TouchableOpacity
      style={{
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
      }}
      onPress={action}
    >
      {icon}
      <Text style={{ fontSize: 20 }}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold" },
});

export default SettingsScreen;
