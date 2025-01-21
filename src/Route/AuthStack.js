import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import MyTabs from "./BottomTabBar";
import AuthScreen from "../Screens/AuthScreen/LogInScreen";
import ForgotPassword from "../Screens/AuthScreen/ForgetPassword/ForgotPassword";
import SignUpScreen from "../Screens/AuthScreen/SignUpScreen";
import OTPInputScreen from "../Screens/AuthScreen/ForgetPassword/OTPInputScreen";
import MainProductPage from "../Common/Product/MainProductPage";

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Signin"
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
        <Stack.Screen
          name="Signin"
          component={AuthScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="OtpScreen" component={OTPInputScreen} />
        <Stack.Screen name="Signup" component={SignUpScreen} />
        <Stack.Screen name="MainProductPage" component={MainProductPage} />
        <Stack.Screen name="Tabs" component={MyTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthStack;
