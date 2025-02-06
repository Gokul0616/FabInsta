import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import AuthStack from "./src/Route/AuthStack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const App = () => {
  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <AuthStack />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});