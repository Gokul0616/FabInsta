import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { font } from "../Theme";

const CustomDrawer = ({ options }) => {
  const groupedOptions = options.reduce((acc, option) => {
    acc[option.order] = acc[option.order] || [];
    acc[option.order].push(option);
    return acc;
  }, {});

  return (
    <View style={styles.drawerContainer}>
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
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
});

export default CustomDrawer;
