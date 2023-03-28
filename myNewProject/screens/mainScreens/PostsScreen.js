import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CommentsScreen from "../nestedScreens/CommentsScreen";
import DefaultScreenPosts from "../nestedScreens/DefaultScreenPosts";
import MapScreen from "../nestedScreens/MapScreen";

const NestedNavigator = createNativeStackNavigator();

export default function PostsScreen() {
  return (
    <NestedNavigator.Navigator>
      <NestedNavigator.Screen
        name="DefaultScreenPosts"
        component={DefaultScreenPosts}
        options={{ headerShown: false }}
      />
      <NestedNavigator.Screen
        name="MapScreen"
        component={MapScreen}
        options={{
          title: "Карта",
          headerTitleAlign: "center",
        }}
      />
      <NestedNavigator.Screen
        name="CommentsScreen"
        component={CommentsScreen}
        options={{
          title: "Коментарі",
          headerTitleAlign: "center",
        }}
      />
    </NestedNavigator.Navigator>
  );
}
