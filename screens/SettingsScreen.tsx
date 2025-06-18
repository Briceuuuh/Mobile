import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
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
import { useNavigation } from "@react-navigation/native";
import { LoginScreenNavigationProp } from "./authStack/LoginScreen";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config";
import { onAuthStateChanged } from "firebase/auth";

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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    card: "",
    profileImage:
      "https://meta-q.cdn.bubble.io/f1717102933566x753149416257430700/Random%20User%20Generator%20.webp",
  });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchUserInfo = async () => {
    if (!user?.uid) return;

    try {
      const docRef = doc(db, "client", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserInfo({
          name: userData.name || "Nom non renseigné",
          email: userData.email || user.email || "Email non renseigné",
          phone: userData.phone || "Téléphone non renseigné",
          card: userData.card || "Carte non renseignée",
          profileImage: userData.profileImage || userInfo.profileImage,
        });
      }
    } catch (error) {
      console.log("Erreur lors de la récupération des informations :", error);
      Alert.alert("Erreur", "Impossible de récupérer vos informations");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour mettre à jour les informations utilisateur
  const updateUserInfo = async () => {
    if (!user?.uid) return;

    try {
      const docRef = doc(db, "client", user.uid);
      await updateDoc(docRef, {
        name: editedInfo.name || userInfo.name,
        email: editedInfo.email || userInfo.email,
        phone: editedInfo.phone || userInfo.phone,
        card: editedInfo.card || userInfo.card,
        profileImage: editedInfo.profileImage || userInfo.profileImage,
        updatedAt: new Date().toISOString(),
      });

      // Mettre à jour l'état local
      setUserInfo((prev) => ({
        ...prev,
        ...editedInfo,
      }));

      setIsEditModalVisible(false);
      setEditedInfo({});
      Alert.alert("Succès", "Vos informations ont été mises à jour");
    } catch (error) {
      console.log("Erreur lors de la mise à jour :", error);
      Alert.alert("Erreur", "Impossible de mettre à jour vos informations");
    }
  };

  // Fonction inspirée de deleteBasket pour vider les informations
  const clearUserInfo = async () => {
    if (!user?.uid) return;

    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir effacer toutes vos informations ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer",
          style: "destructive",
          onPress: async () => {
            try {
              const docRef = doc(db, "client", user.uid);
              await updateDoc(docRef, {
                name: "",
                phone: "",
                card: "",
                profileImage: "",
                current_kart: {
                  idStore: "",
                  kart: [],
                },
              });

              setUserInfo({
                name: "Nom non renseigné",
                email: user.email || "Email non renseigné",
                phone: "Téléphone non renseigné",
                card: "Carte non renseignée",
                profileImage:
                  "https://meta-q.cdn.bubble.io/f1717102933566x753149416257430700/Random%20User%20Generator%20.webp",
              });

              Alert.alert("Succès", "Vos informations ont été effacées");
            } catch (error) {
              console.log("Erreur lors de l'effacement :", error);
              Alert.alert("Erreur", "Impossible d'effacer vos informations");
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchUserInfo();
  }, [user]);

  if (loading) {
    return (
      <View style={{ alignItems: "center", width: "100%", marginTop: 50 }}>
        <Text>Chargement...</Text>
      </View>
    );
  }

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
          source={{ uri: userInfo.profileImage }}
        />
      </View>

      <ItemInfos icon={<IconAccount />} text={userInfo.name} />
      <ItemInfos icon={<IconMail />} text={userInfo.email} />
      <ItemInfos icon={<IconPhone />} text={userInfo.phone} />
      {/* <ItemInfos icon={<IconCard />} text={userInfo.card} /> */}

      <TouchableOpacity onPress={() => setIsEditModalVisible(true)}>
        <Text
          style={{
            color: "black",
            textDecorationLine: "underline",
          }}
        >
          Editer mes informations
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={clearUserInfo} style={{ marginTop: 10 }}>
        <Text
          style={{
            color: "red",
            textDecorationLine: "underline",
          }}
        >
          Effacer mes informations
        </Text>
      </TouchableOpacity>

      {/* Modal d'édition */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: "90%",
              padding: 20,
              borderRadius: 10,
              maxHeight: "80%",
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}
            >
              Modifier mes informations
            </Text>

            <ScrollView>
              <View style={{ marginBottom: 15 }}>
                <Text style={{ marginBottom: 5 }}>Nom :</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 10,
                    borderRadius: 5,
                  }}
                  value={
                    editedInfo.name !== undefined
                      ? editedInfo.name
                      : userInfo.name
                  }
                  onChangeText={(text) =>
                    setEditedInfo((prev) => ({ ...prev, name: text }))
                  }
                  placeholder="Votre nom"
                />
              </View>

              <View style={{ marginBottom: 15 }}>
                <Text style={{ marginBottom: 5 }}>Email :</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 10,
                    borderRadius: 5,
                  }}
                  value={
                    editedInfo.email !== undefined
                      ? editedInfo.email
                      : userInfo.email
                  }
                  onChangeText={(text) =>
                    setEditedInfo((prev) => ({ ...prev, email: text }))
                  }
                  placeholder="Votre email"
                  keyboardType="email-address"
                />
              </View>

              <View style={{ marginBottom: 15 }}>
                <Text style={{ marginBottom: 5 }}>Téléphone :</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 10,
                    borderRadius: 5,
                  }}
                  value={
                    editedInfo.phone !== undefined
                      ? editedInfo.phone
                      : userInfo.phone
                  }
                  onChangeText={(text) =>
                    setEditedInfo((prev) => ({ ...prev, phone: text }))
                  }
                  placeholder="Votre téléphone"
                  keyboardType="phone-pad"
                />
              </View>

              {/* <View style={{ marginBottom: 15 }}>
                <Text style={{ marginBottom: 5 }}>Carte :</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 10,
                    borderRadius: 5,
                  }}
                  value={
                    editedInfo.card !== undefined
                      ? editedInfo.card
                      : userInfo.card
                  }
                  onChangeText={(text) =>
                    setEditedInfo((prev) => ({ ...prev, card: text }))
                  }
                  placeholder="Numéro de carte"
                />
              </View> */}
            </ScrollView>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setIsEditModalVisible(false);
                  setEditedInfo({});
                }}
                style={{
                  flex: 1,
                  padding: 15,
                  backgroundColor: "#ccc",
                  borderRadius: 5,
                  marginRight: 10,
                }}
              >
                <Text style={{ textAlign: "center" }}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={updateUserInfo}
                style={{
                  flex: 1,
                  padding: 15,
                  backgroundColor: "#007bff",
                  borderRadius: 5,
                  marginLeft: 10,
                }}
              >
                <Text style={{ textAlign: "center", color: "white" }}>
                  Sauvegarder
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ButtonParams />
    </View>
  );
};

const ButtonParams = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  return (
    <View style={{ flexDirection: "row", marginTop: 70, marginBottom: 30 }}>
      <TouchableOpacity
        onPress={() => navigation.navigate("TicketsScreen")}
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
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        }}
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
