import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useRef, useState } from "react";
import { Animated } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { common, storage } from "../Common/Common";
import OptionsModal from "../Common/OptionsModal/OptionsModal";
import CartTabLayout from "../components/layout/CartTabLayout";
import ProfileLayout from "../components/layout/ProfileLayout";
import Header from "../Screens/Header";
import HomeTabLayout from "../Screens/HomeScreen/HomeTabLayout";

const Tab = createBottomTabNavigator();

function MyTabs() {
  const navigate = useNavigation();
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const clearStackAndNavigate = () => {
    navigate.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "Signin",
          },
        ],
      })
    );
    storage.delete("token");
  };
  const options = [
    {
      order: 1,
      displayOrder: 1,
      label: "Fabric Inquiries",
      onPress: () =>
        navigate.navigate("Tabs", {
          screen: "Home",
          params: { screen: "FabricInqiries" },
        }),
    },
    {
      order: 1,
      displayOrder: 2,
      label: "Order Inquiries",
      onPress: () => console.log("Option 1 selected"),
    },
    {
      order: 1,
      displayOrder: 3,
      label: "Bulk Quotes",
      onPress: () => console.log("Option 1 selected"),
    },
    {
      order: 1,
      displayOrder: 4,
      label: `My ${common.title}`,
      onPress: () => console.log("Option 2 selected"),
    },
    {
      order: 1,
      displayOrder: 5,
      label: "WishList",
      onPress: () =>
        navigate.navigate("Tabs", {
          screen: "Home",
          params: { screen: "wishList-Details" },
        }),
    },
    {
      order: 2,
      displayOrder: 1,
      label: "Fabric Orders",
      onPress: () => console.log("Option 2 selected"),
    },
    {
      order: 3,
      displayOrder: 1,
      label: "Addresses",
      onPress: () =>
        navigate.navigate("Tabs", {
          screen: "Home",
          params: { screen: "Address" },
        }),
    },
    {
      order: 4,
      displayOrder: 1,
      label: "Logout",
      onPress: () => clearStackAndNavigate(),
    },
  ];
  return (
    <>
      <Header
        scrollY={scrollY}
        onOptionsPress={() => {
          setIsOptionsVisible(true);
        }}
        isOptionsVisible={isOptionsVisible}
      />
      <OptionsModal
        isVisible={isOptionsVisible}
        onClose={() => setIsOptionsVisible(false)}
        options={options}
      />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Profile") {
              iconName = "user";
            } else if (route.name === "Cart") {
              iconName = "shopping-bag";
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#FF6F61",
          tabBarInactiveTintColor: "#999",
        })}
        initialRouteName="Home"
      >
        <Tab.Screen name="Home" component={HomeTabLayout} />
        <Tab.Screen name="Cart" component={CartTabLayout} />
        <Tab.Screen name="Profile" component={ProfileLayout} />
      </Tab.Navigator>
    </>
  );
}

export default MyTabs;
