import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { font } from "./Theme";

export const FiButton = ({
  style,
  title,
  onPress,
  titleStyle,
  disabled = false,
}) => {
  const handlePress = () => {
    if (disabled) return;
    onPress();
  };
  return (
    <TouchableOpacity
      style={style ? style : styles.container}
      onPress={handlePress}
    >
      <Text style={titleStyle ? titleStyle : styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF6F61",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    height: 40,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.2s",
  },
  buttonText: {
    color: "#ffffff",
    fontFamily: font.semiBold,
    fontSize: 16,
  },
});
