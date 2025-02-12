import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Checkout from "../components/CheckOut/Checkout";
import Address from "../components/OptionsScreen/Address/address";
import FabricInquiries from "../components/OptionsScreen/FabricEnquiry/FabricInqiries";
import FabricInquiryDetails from "../components/OptionsScreen/FabricEnquiry/FabricInquiryDetails";
import NewInquiryScreen from "../components/OptionsScreen/FabricEnquiry/NewInquiryScreen";
import FabricOrder from "../components/OptionsScreen/fabricOrders/FabricOrder";
import FabricOrderDetails from "../components/OptionsScreen/fabricOrders/FabricOrderDetails";
import WishListDetails from "../components/WishListDetails";
import ForgotPassword from "../Screens/AuthScreen/ForgetPassword/ForgotPassword";
import OTPInputScreen from "../Screens/AuthScreen/ForgetPassword/OTPInputScreen";
import AuthScreen from "../Screens/AuthScreen/LogInScreen";
import SignUpScreen from "../Screens/AuthScreen/SignUpScreen";
import LogoutHandler from "../Service/LogoutHandler";
import MyTabs from "./BottomTabBar";

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
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
      <Stack.Screen name="Tabs" component={MyTabs} />
      <Stack.Screen name="Logout" component={LogoutHandler} />

      <Stack.Screen name="FabricInqiries" component={FabricInquiries} />
      <Stack.Screen name="NewInquiryScreen" component={NewInquiryScreen} />
      <Stack.Screen name="Address" component={Address} />
      <Stack.Screen name="wishList-Details" component={WishListDetails} />

      <Stack.Screen name="checkout" component={Checkout} />
      <Stack.Screen name="Fabric-Orders" component={FabricOrder} />
      <Stack.Screen
        name="Fabric-Orders-Details"
        component={FabricOrderDetails}
      />
      <Stack.Screen
        name="FabricInquiryDetails"
        component={FabricInquiryDetails}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
