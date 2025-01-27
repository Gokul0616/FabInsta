import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import MainProductPage from "../../Common/Product/MainProductPage";
import FabricInqiries from "../OptionsScreen/FabricInqiries";
import HomeScreen from "./HomeScreen";
import FabricInquiryDetails from "../OptionsScreen/FabricInquiryDetails";
import NewInquiryScreen from "../OptionsScreen/NewInquiryScreen";

const Stack = createStackNavigator();

const HomeTabLayout = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
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
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="MainProductPage" component={MainProductPage} />
      <Stack.Screen name="FabricInqiries" component={FabricInqiries} />
      <Stack.Screen name="NewInquiryScreen" component={NewInquiryScreen} />

      <Stack.Screen
        name="FabricInquiryDetails"
        component={FabricInquiryDetails}
      />
    </Stack.Navigator>
  );
};

export default HomeTabLayout;
