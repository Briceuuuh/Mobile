import { Image, View } from "react-native";

export const BackGroundCamera = () => {
  return (
    <View
      style={{
        flex: 1,
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "#D9D9D9",
      }}
    >
      <Image
        style={{
          width: "100%",
          top: -20,
          position: "absolute",
        }}
        source={require("./../assets/wave_top.png")}
      />
    </View>
  );
};
