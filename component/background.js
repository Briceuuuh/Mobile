import { Image, View } from "react-native";

export const BackGround = () => {
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          style={{ width: 350, height: 350 }}
          source={require("./../assets/logo Ekart.png")}
        />
      </View>
      <Image
        style={{
          width: "100%",
          position: "absolute",
          bottom: 0,
        }}
        source={require("./../assets/wave.png")}
      />
    </View>
  );
};
