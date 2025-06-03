import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MyHeader = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  return (
    <View
      style={{
        zIndex: 999,
        width: "90%",
        alignSelf: "center",
        position: "absolute",
        top: insets.top + 10,
      }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>← Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MyHeader;
