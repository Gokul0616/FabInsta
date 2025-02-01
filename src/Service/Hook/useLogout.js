import { CommonActions, useNavigation } from "@react-navigation/native";
import { storage } from "../../Common/Common";

export const useLogout = () => {
  const navigation = useNavigation();

  const logout = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Signin" }],
      })
    );
    storage.delete("token");
  };

  return logout;
};
