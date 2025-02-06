import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ProfileScreen from "../../Screens/ProfileScreen/ProfileScreen";

const Stack = createStackNavigator();

const ProfileLayout = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProfileScreen"
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
        cardStyleInterpolator: ({ current, next, inverted, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default ProfileLayout;
