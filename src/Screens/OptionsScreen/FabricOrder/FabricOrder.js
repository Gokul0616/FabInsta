import { StyleSheet, Text, View } from "react-native";
import React from "react";

const FabricOrder = () => {
  return (
    <View style={styles.container}>
      <Text>FabricOrder</Text>
    </View>
  );
};

export default FabricOrder;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 8,
    paddingVertical: 50,
    flex: 1,
  },
});
