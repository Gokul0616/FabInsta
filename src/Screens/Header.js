import React from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { common } from "../Common/Common";
import { font } from "../Common/Theme";

const Header = ({ scrollY, onOptionsPress, isOptionsVisible }) => {
  const translateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -60],
    extrapolate: "clamp",
  });

  return (
    <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
      <View style={styles.headerContent}>
        <Text style={styles.logoText}>{common.title}</Text>
        <TouchableOpacity onPress={() => onOptionsPress()}>
          {isOptionsVisible ? (
            <Icon name="x" size={28} />
          ) : (
            <Icon name="menu" size={28} />
          )}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "#fff",
    zIndex: 1000,
    elevation: 5,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  logoText: {
    fontSize: 25,
    color: "#333",
    fontFamily: font.medium,
  },
  menuIcon: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
