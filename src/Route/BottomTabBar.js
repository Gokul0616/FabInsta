import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DrawerLayout } from "react-native-gesture-handler";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useRef } from "react";
import { Animated, Dimensions, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { common, storage } from "../Common/Common";
import CartTabLayout from "../components/layout/CartTabLayout";
import ProfileLayout from "../components/layout/ProfileLayout";
import Header from "../Screens/Header";
import HomeTabLayout from "../Screens/HomeScreen/HomeTabLayout";
import CustomDrawer from "../Common/OptionsModal/CustomDrawer";

const Tab = createBottomTabNavigator();

function MyTabs() {
  const navigate = useNavigation();
  const scrollY = new Animated.Value(0);
  const drawerRef = useRef(null);

  const openDrawer = () => {
    if (drawerRef.current) {
      drawerRef.current.openDrawer();
    }
  };

  const closeDrawer = () => {
    if (drawerRef.current) {
      drawerRef.current.closeDrawer();
    }
  };

  const clearStackAndNavigate = () => {
    navigate.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Signin" }],
      })
    );
    storage.delete("token");
  };
  const options = [
    {
      order: 1,
      displayOrder: 1,
      label: "Fabric Inquiries",
      onPress: () => {
        closeDrawer();
        setTimeout(() => {
          navigate.navigate("FabricInqiries");
        }, 100);
      },
    },
    {
      order: 1,
      displayOrder: 2,
      label: "Order Inquiries",
      onPress: () => {
        closeDrawer();
        setTimeout(() => {
          console.log("Option 1 selected");
        }, 100);
      },
    },
    {
      order: 1,
      displayOrder: 3,
      label: "Bulk Quotes",
      onPress: () => {
        closeDrawer();
        setTimeout(() => {
          console.log("Option 2 selected");
        }, 100);
      },
    },
    {
      order: 1,
      displayOrder: 4,
      label: `My ${common.title}`,
      onPress: () => {
        closeDrawer();
        setTimeout(() => {
          console.log("Option 3 selected");
        }, 100);
      },
    },
    {
      order: 1,
      displayOrder: 5,
      label: "WishList",
      onPress: () => {
        closeDrawer();
        setTimeout(() => {
          navigate.navigate("wishList-Details");
        }, 100);
      },
    },
    {
      order: 2,
      displayOrder: 1,
      label: "Fabric Orders",
      onPress: () => {
        closeDrawer();
        setTimeout(() => {
          navigate.navigate("Fabric-Orders");
        }, 100);
      },
    },
    {
      order: 3,
      displayOrder: 1,
      label: "Addresses",
      onPress: () => {
        closeDrawer();
        setTimeout(() => {
          navigate.navigate("Address");
        }, 100);
      },
    },
    {
      order: 4,
      displayOrder: 1,
      label: "Logout",
      onPress: () => {
        closeDrawer();
        setTimeout(() => {
          clearStackAndNavigate();
        }, 50);
      },
    },
  ];

  return (
    <DrawerLayout
      ref={drawerRef}
      drawerWidth={Dimensions.get("window").width / 1.5}
      drawerPosition="left"
      renderNavigationView={() => (
        <CustomDrawer options={options} closeDrawer={closeDrawer} />
      )}
    >
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            header: () => (
              <Header scrollY={scrollY} onOptionsPress={() => openDrawer()} />
            ),
            tabBarIcon: ({ color, size }) => {
              let iconName =
                route.name === "Home"
                  ? "home"
                  : route.name === "Profile"
                  ? "user"
                  : "shopping-bag";
              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#FF6F61",
            tabBarInactiveTintColor: "#999",
          })}
          initialRouteName="Home"
          screenListeners={({ navigation, route }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: route.name }],
                })
              );
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeTabLayout} />
          <Tab.Screen name="Cart" component={CartTabLayout} />
          <Tab.Screen name="Profile" component={ProfileLayout} />
        </Tab.Navigator>
      </View>
    </DrawerLayout>
  );
}

export default MyTabs;
