import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { Path, Svg } from "react-native-svg";
import { IconAcitivate, IconTopArrow } from "../icon";

const screenWidth = Dimensions.get("window").width;

export const ModalList = ({
  modalVisible,
  setModalVisible,
  deleteBasket,
  basket,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => setModalVisible(!true)}
          style={{
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
          <View
            style={{
              position: "absolute",
              top: 20,
              alignItems: "center",
              width: "100%",
            }}
          >
            <TouchableOpacity
              onPress={deleteBasket}
              style={{
                position: "absolute",
                top: 20,
                right: 40,
                width: 77,
                height: 35,
                borderRadius: 17.5,
                backgroundColor: "#EC263D",
                alignItems: "center",
              }}
            >
              <IconAcitivate />
              <Text style={{ fontSize: 10, color: "white" }}>Abandon</Text>
            </TouchableOpacity>
            <View style={{ transform: [{ rotate: "180deg" }] }}>
              <IconTopArrow />
            </View>
            <Text style={{ fontSize: 10 }}>Votre panier</Text>
            <Text style={{ fontSize: 25 }}>
              {basket.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              )}
              €
            </Text>
            <Text>{""}</Text>
            <View
              style={{
                left: 0,
                flexDirection: "row",
                width: "95%",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 10, color: "#FF3333" }}>
                Auto-paiement à la sortie
              </Text>
              <Text style={{ fontSize: 13 }}>
                Nombre d'articles: {basket.length}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={{
            width: "100%",
            height: "70%",
            bottom: 0,
            backgroundColor: "white",
            borderTopWidth: 1,
            alignItems: "center",
          }}
        >
          <FlatList
            style={{ width: "100%" }}
            showsVerticalScrollIndicator={false}
            data={basket}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <>
                <View
                  style={{
                    backgroundColor: "#007A5E",
                    alignSelf: "center",
                    width: "90%",
                    marginTop: 15,
                    paddingTop: 3,
                    paddingBottom: 3,
                    paddingLeft: 3,
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 100,
                  }}
                >
                  <View>
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 25,
                        backgroundColor: "white",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 10,
                      }}
                      source={require("./../assets/logo Ekart.png")}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      // backgroundColor: "pink",
                      height: "100%",
                    }}
                  >
                    <Text
                      style={{
                        position: "absolute",
                        top: 0,
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {item.product_name || "Produit inconnu"}
                    </Text>
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        bottom: 0,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          textDecorationLine: "underline",
                        }}
                      >
                        Info nutrition
                      </Text>
                    </TouchableOpacity>

                    <View
                      style={{
                        position: "absolute",
                        right: 0,
                        height: 40,
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          backgroundColor: "white",
                          borderRadius: 10,
                          paddingHorizontal: 10,
                        }}
                      >
                        {item.price || "Produit inconnu"}€
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            )}
            ListFooterComponent={
              <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: "gray" }}>
                  Vous êtes arrivé en bas 🛒
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
};
