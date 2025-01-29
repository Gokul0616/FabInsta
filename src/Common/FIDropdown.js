import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { font } from "./Theme";

const FIDropdown = ({
  dropdownTextStyle,
  values,
  onSelect,
  style,
  defaultValue,
  optionsTextStyle,
  dropdownListContainer,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);

  const handleSelect = (item) => {
    setSelectedValue(item);
    onSelect(item);
    setIsVisible(false);
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        onPress={() => setIsVisible(!isVisible)}
        style={[styles.dropdownButton, style]}
      >
        <Text style={[dropdownTextStyle || styles.dropdownText]}>
          {selectedValue || defaultValue || "Select an option"}
        </Text>
        <Icon name="chevron-down" size={20} color="#000" />
      </TouchableOpacity>

      {isVisible && (
        <View style={[dropdownListContainer, styles.dropdownListContainer]}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled"
          >
            {values.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelect(item)}
                style={styles.option}
              >
                <Text style={[optionsTextStyle || styles.optionText]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};
export default FIDropdown;

const styles = StyleSheet.create({
  dropdownContainer: {
    marginVertical: 10,
    width: "100%",
  },
  dropdownButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: font.medium,
    color: "#333",
  },
  dropdownListContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    maxHeight: 150,
    overflow: "hidden",
    zIndex: 1000,
  },
  scrollView: {
    maxHeight: 150,
  },
  scrollViewContent: {
    paddingBottom: 10,
  },
  option: {
    padding: 10,
  },
  optionText: {
    fontSize: 16,
    fontFamily: font.regular,
    color: "#333",
  },
});
