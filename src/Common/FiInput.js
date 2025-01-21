import { TextInput } from "react-native-gesture-handler";
import { common } from "./Common";

export const FiInput = ({
  style,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  ref,
  maxLength,
  editable,
}) => {
  return (
    <TextInput
      ref={ref}
      style={style}
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
