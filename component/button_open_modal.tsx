import {
  TouchableOpacity,
  View,
  Text,
  Dimensions,
} from "react-native";
import { Path, Svg } from "react-native-svg";
import { IconTopArrow } from "../icon";

const screenWidth = Dimensions.get("window").width;

export const ButtonOpenModal = ({ setModalVisible, basket }) => {
  return (
    <TouchableOpacity
      onPress={() => setModalVisible(true)}
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        alignItems: "center",
      }}
    >
      <Svg height="110" width={screenWidth}>
        <Path
          d={`M0 50 Q${
            screenWidth / 2
          } -40 ${screenWidth} 50 L${screenWidth} 110 L0 110 Z`}
          fill="white"
        />
      </Svg>
      <View style={{ position: "absolute", top: 20, alignItems: "center" }}>
        <IconTopArrow />
        <Text style={{ fontSize: 10 }}>
          Votre panier contient {basket.length} article
          {basket.length > 1 ? "s" : ""}
        </Text>
        <Text style={{ fontSize: 25 }}>
          {basket.reduce(
            (sum: any, item: any) => sum + item.price * item.quantity,
            0
          )}
          €
        </Text>
        <Text style={{ fontSize: 10, color: "#FF3333", marginBottom: 10 }}>
          Auto-paiement à la sortie
        </Text>
      </View>
    </TouchableOpacity>
  );
};
