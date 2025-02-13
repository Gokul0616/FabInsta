import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthStack from "./src/Route/AuthStack";
import { initializeNotification } from "./src/Service/Notification";

const App = () => {
  useEffect(() => {
    initializeNotification();
  }, []);

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
