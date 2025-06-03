import { Image, View } from "react-native";

export const BackGround = () => {
  return (
    <View
      style={{
        flex: 1,
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "white",
      }}
    >
      <Image
        style={{
          top: 0,
          left: 0,
        }}
        source={require("./../assets/Intersect.png")}
      />

      <Image
        style={{
          position: "absolute",
          bottom: 0,
        }}
        source={require("./../assets/Intersect_bottom.png")}
      />
    </View>
  );
};
