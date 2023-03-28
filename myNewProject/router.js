import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Feather,
  SimpleLineIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { View, Platform, StyleSheet } from "react-native";
import PostsScreen from "./screens/mainScreens/PostsScreen";
import ProfileScreen from "./screens/mainScreens/ProfileScreen";
import RegistrationScreen from "./screens/auth/RegistrationScreen";
import LoginScreen from "./screens/auth/LoginScreen";
import CreatePostsScreen from "./screens/mainScreens/CreatePostsScreen";

const AuthStack = createNativeStackNavigator();
const MainTab = createBottomTabNavigator();

function HomeStack() {
  return (
    <MainTab.Navigator
      barStyle={{ paddingBottom: 34 }}
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          elevation: 0,
          borderRadius: 15,
          backgroundColor: "#fff",
          ...Platform.select({
            android: {
              height: 65,
              bottom: 0,
            },
            ios: {
              height: 83,
              bottom: 25,
            },
          }),
          ...styles.shadow,
        },
      }}
    >
      <MainTab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <SimpleLineIcons
              name="grid"
              size={24}
              color="rgba(33, 33, 33, 0.8)"
            />
          ),
        }}
        name="PostsScreen"
        component={PostsScreen}
      />
      <MainTab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View>
              {!focused ? (
                <View
                  style={{
                    width: 70,
                    height: 40,
                    backgroundColor: "#FF6C00",
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Feather name="plus" size={24} color="#ffffff" />
                </View>
              ) : (
                <View
                  style={{
                    width: 70,
                    height: 40,
                    backgroundColor: "#F6F6F6",
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="trash-can-outline"
                    size={24}
                    color="#DADADA"
                  />
                </View>
              )}
            </View>
          ),
        }}
        name="CreatePostsScreen"
        component={CreatePostsScreen}
      />
      <MainTab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Feather name="user" size={24} color="rgba(33, 33, 33, 0.8)" />
          ),
        }}
        name="ProfileScreen"
        component={ProfileScreen}
      />
    </MainTab.Navigator>
  );
}

function AuthHome() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="LoginScreen"
        component={LoginScreen}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="RegistrationScreen"
        component={RegistrationScreen}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={HomeStack}
      />
    </AuthStack.Navigator>
  );
}

export default function useRoute(isAuth) {
  if (!isAuth) {
    return <AuthHome />;
  }
  return <HomeStack />;
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
