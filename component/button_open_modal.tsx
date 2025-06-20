import { TouchableOpacity, View, Text, Dimensions } from "react-native";
import { Path, Svg } from "react-native-svg";
import { IconTopArrow } from "../icon";

const screenWidth = Dimensions.get("window").width;

export const ButtonOpenModal = ({ setModalVisible, basket }) => {
  const totalAmount = basket.reduce((sum, item) => {
    const price = parseFloat(item?.price);
    const quantity = item?.quantity || 1;

    if (!isNaN(price)) {
      return sum + price * quantity;
    }

    return sum;
  }, 0);
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
        <Text style={{ fontSize: 25 }}>{totalAmount}€</Text>
        <Text style={{ fontSize: 10, color: "#FF3333", marginBottom: 10 }}>
          Auto-paiement à la sortie
        </Text>
      </View>
    </TouchableOpacity>
  );
};
