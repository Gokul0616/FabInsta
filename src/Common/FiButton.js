import { Text, TouchableOpacity } from "react-native";

export const FiButton = ({ style, title, onPress, titleStyle }) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Text style={titleStyle}>{title}</Text>
    </TouchableOpacity>
  );
};
