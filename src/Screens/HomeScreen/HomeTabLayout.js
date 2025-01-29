import { createStackNavigator } from "@react-navigation/stack";
import WishListDetails from "../../components/WishListDetails";
import ProductDetails from "../../components/product/ProductDetails";
import Checkout from "../../components/CheckOut/Checkout";
import Address from "../OptionsScreen/Address/address";
import FabricInqiries from "../OptionsScreen/FabricEnquiry/FabricInqiries";
import FabricInquiryDetails from "../OptionsScreen/FabricEnquiry/FabricInquiryDetails";
import NewInquiryScreen from "../OptionsScreen/FabricEnquiry/NewInquiryScreen";
import HomeScreen from "./HomeScreen";

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
      <Stack.Screen name="fabrics" component={ProductDetails} />
      <Stack.Screen name="FabricInqiries" component={FabricInqiries} />
      <Stack.Screen name="NewInquiryScreen" component={NewInquiryScreen} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="Address" component={Address} />
      <Stack.Screen name="wishList-Details" component={WishListDetails} />

      <Stack.Screen
        name="FabricInquiryDetails"
        component={FabricInquiryDetails}
      />
    </Stack.Navigator>
  );
};

export default HomeTabLayout;
