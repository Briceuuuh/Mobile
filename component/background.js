import { Image, View } from "react-native";

export const BackGround = ({ middle }) => {
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

      {middle ? (
        <View
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            right: 0,
            left: 0,
            justifyContent: "center",
          }}
        >
          <Image
            style={{
              width: "100%",
              marginTop: 80,
            }}
            source={require("./../assets/Intersect_account.png")}
          />
        </View>
      ) : (
        <Image
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            left: 0,
            width: "100%",
          }}
          source={require("./../assets/Intersect_bottom.png")}
        />
      )}
    </View>
  );
};
