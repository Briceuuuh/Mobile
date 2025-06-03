import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
// import ProfileScreen, { app } from "./screens/ProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { Ionicons } from "@expo/vector-icons";
import LoginScreen from "./screens/authStack/LoginScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
import LostPassword from "./screens/authStack/LostPassword";
import SignUp from "./screens/authStack/SignUp";
import CheckForm from "./screens/CheckForm";
import { Text, View } from "react-native";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// const auth = getAuth(app);

export default function App() {
  const [initializing, setInitializing] = useState(false);
  const [user, setUser] = useState(null);

  if (initializing) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? "TabStack" : "Login"}
        screenOptions={{
          headerShown: true,
          headerStyle: {},
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LostPassword"
          component={LostPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CheckForm"
          component={CheckForm}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TabStack"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const TabStack = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};
