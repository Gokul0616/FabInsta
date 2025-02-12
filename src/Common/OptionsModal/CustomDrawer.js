import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { font } from "../Theme";

const CustomDrawer = ({ options, closeDrawer, profile }) => {
  const groupedOptions = options.reduce((acc, option) => {
    acc[option.order] = acc[option.order] || [];
    acc[option.order].push(option);
    return acc;
  }, {});
  const navigate = useNavigation();
  return (
    <View style={styles.drawerContainer}>
      <Pressable
        style={styles.userHeader}
        onPress={() => {
          closeDrawer(),
            setTimeout(() => {
              navigate.navigate("Tabs", {
                screen: "Profile",
              });
            }, 100);
        }}
      >
        <Image
          source={{
            uri: "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg",
          }}
          style={styles.userImage}
        />

        <View style={styles.userInfo}>
          <Text style={styles.greeting}>Welcome,</Text>
          <Text style={styles.userName}>{profile.name}</Text>
        </View>
      </Pressable>

      <View style={styles.separator} />

      {Object.keys(groupedOptions).map((orderKey, orderIndex) => {
        const items = groupedOptions[orderKey];
        return (
          <View key={orderKey}>
            {items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.optionItem}
                onPress={item.onPress}
              >
                {item.icon && <Icon name={item.icon} size={18} color="#333" />}
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
            {orderIndex < Object.keys(groupedOptions).length - 1 && (
              <View style={styles.separator} />
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30, // Makes the image circular
    marginRight: 15,
  },
  userInfo: {
    flexDirection: "column",
  },
  greeting: {
    fontSize: 14,
    color: "#777",
    fontFamily: font.regular,
  },
  userName: {
    fontSize: 18,
    color: "#333",
    fontFamily: font.bold,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
    fontFamily: font.semiBold,
  },
});

export default CustomDrawer;
