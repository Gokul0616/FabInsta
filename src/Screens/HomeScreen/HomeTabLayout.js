import { createStackNavigator } from "@react-navigation/stack";
import ProductDetails from "../../components/product/ProductDetails";
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
    </Stack.Navigator>
  );
};

export default HomeTabLayout;
