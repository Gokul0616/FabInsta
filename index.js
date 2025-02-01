// App.js or your main component file
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native"; // Import NavigationContainer
import { NavigationProvider } from "./src/Service/Context/NavigationContext";
import { navigationRef } from "./src/Service/Hook/navigationRef";

const Main = () => {
  return (
    <PaperProvider>
      <NavigationContainer ref={navigationRef}>
        <NavigationProvider>
          <App />
        </NavigationProvider>
      </NavigationContainer>
    </PaperProvider>
  );
};

AppRegistry.registerComponent(appName, () => Main);
