import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthStack from "./src/Route/AuthStack";

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