import React from "react";
import { View, ScrollView, Image, Text, TouchableOpacity } from "react-native";
import { BackGround } from "../component/background";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  IconAccount,
  IconCard,
  IconMail,
  IconPhone,
  IconSettings,
  IconSvg,
  IconTickets,
} from "../icon";

const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1 }}>
      <BackGround middle={true} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ height: insets.top }} />
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 50,
          }}
        >
          <Image
            style={{
              top: 0,
              left: 0,
            }}
            source={require("./../assets/logo_account.png")}
          />

          <ProfileUser />
        </View>
      </ScrollView>
    </View>
  );
};

const ProfileUser = () => {
  return (
    <View style={{ alignItems: "center", width: "100%" }}>
      <View
        style={{
          height: 140,
          width: 140,
          borderRadius: 70,
          marginTop: 20,
          shadowOpacity: 0.5,
          shadowRadius: 3,
          marginBottom: 25,
          shadowOffset: {
            height: 0,
            width: 0,
          },
        }}
      >
        <Image
          style={{ width: "100%", height: "100%", borderRadius: 70 }}
          source={{
            uri: "https://meta-q.cdn.bubble.io/f1717102933566x753149416257430700/Random%20User%20Generator%20.webp",
          }}
        />
      </View>
      <ItemInfos icon={<IconAccount />} text={"Benjamin Maillot"} />
      <ItemInfos icon={<IconMail />} text={"benjamin.maillot@epitech.eu"} />
      <ItemInfos icon={<IconPhone />} text={"+262 692 78 23 78"} />
      <ItemInfos icon={<IconCard />} text={"1232 1232 3121 XX"} />
      <TouchableOpacity onPress={() => {}}>
        <Text
          style={{
            color: "white",
            textDecorationLine: "underline",
            shadowOpacity: 0.5,
            shadowRadius: 3,
            marginBottom: 25,
            shadowOffset: {
              height: 0,
              width: 0,
            },
          }}
        >
          Editer mes informations
        </Text>
      </TouchableOpacity>
      <ButtonParams />
    </View>
  );
};

const ButtonParams = () => {
  return (
    <View style={{ flexDirection: "row", marginTop: 70, marginBottom: 30 }}>
      <TouchableOpacity
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconTickets />
        <Text style={{ marginTop: 20 }}>Tickets</Text>
      </TouchableOpacity>

      <View style={{ width: 1, height: 200, borderWidth: 1 }} />
      <TouchableOpacity
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <IconSettings />
        <Text style={{ marginTop: 20 }}>Paramètres</Text>
      </TouchableOpacity>
    </View>
  );
};

const ItemInfos = ({ icon, text }) => {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
    >
      {icon}
      <View style={{ width: 10 }} />
      <View
        style={{
          width: "75%",
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 7,
          borderRadius: 10,
          shadowOpacity: 0.5,
          shadowRadius: 3,
          shadowOffset: {
            height: 0,
            width: 0,
          },
        }}
      >
        <Text>{text}</Text>
      </View>
    </View>
  );
};

export default SettingsScreen;
