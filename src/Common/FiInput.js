import { TextInput } from "react-native-gesture-handler";
import { common } from "./Common";
import { StyleSheet } from "react-native";

export const FiInput = ({
  style,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  ref,
  maxLength,
  editable = true,
}) => {
  return (
    <TextInput
      ref={ref}
      style={[styles.input, style, !editable && styles.disabled]}
      placeholder={placeholder}
      placeholderTextColor="#999"
      value={value}
      maxLength={maxLength}
      cursorColor={common.PRIMARY_COLOR}
      keyboardType={keyboardType}
      editable={editable}
      secureTextEntry={secureTextEntry}
      onChangeText={onChangeText}
    />
  );
};
const styles = StyleSheet.create({
  disabled: {
    backgroundColor: "#f0f0f0",
  },
});