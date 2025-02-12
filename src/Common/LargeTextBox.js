import React from "react";
import { StyleSheet, TextInput } from "react-native";
import { font } from "./Theme";
let heights = 0;
const LargeTextBox = ({ placeholder, value, onChangeText, height }) => {
  return (
    <TextInput
      style={[styles.textBox, { height: height }]}
      placeholder={placeholder || "Enter your text here..."}
      multiline={true}
      numberOfLines={6}
      value={value}
      onChangeText={onChangeText}
      textAlignVertical="top"
    />
  );
};

export default LargeTextBox;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  textBox: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    fontFamily: font.regular,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fff",
    fontSize: 14,
  },
});
