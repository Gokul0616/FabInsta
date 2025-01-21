import React, { useEffect, useState } from "react";
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Vibration,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { FiInput } from "../../../Common/FiInput";
import { font } from "../../../Common/Theme";
import { FiButton } from "../../../Common/FiButton";
import { CommonActions, useNavigation } from "@react-navigation/native";

const PasswordEntry = ({ userData, onSubmit }) => {
  const navigation = useNavigation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    setError("");
  }, [newPassword, confirmPassword]);
  const handleSubmit = () => {
    // Clear any previous errors
    setError("");

    // Validate the passwords
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      Vibration.vibrate(100);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      Vibration.vibrate(100);
      return;
    }
    userData.newPassword = newPassword;
    onSubmit(userData);
  };
  const clearStackAndNavigate = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "Signin",
          },
        ],
      })
    );
  };
  return (
    <Animated.View style={[styles.otpContainer]}>
      <Text style={styles.otpTitle}>Enter New Password</Text>
      <FiInput
        style={styles.input}
        placeholder={"Email"}
        value={userData.email}
        editable={false}
      />
      <FiInput
        style={[styles.input, error ? styles.errorInput : null]}
        placeholder={"New Password"}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <FiInput
        style={[styles.input, error ? styles.errorInput : null]}
        placeholder={"Confirm Password"}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <FiButton
        style={styles.button}
        onPress={handleSubmit}
        title={"Change Password"}
        titleStyle={styles.buttonText}
      />
      <TouchableOpacity
        style={{ flexDirection: "row", padding: 15 }}
        onPress={() => {
          clearStackAndNavigate();
        }}
      >
        <Ionicons name="arrow-back" size={15} color="#999" />
        <Text style={styles.backText}>Back to the login page</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default PasswordEntry;

const styles = StyleSheet.create({
  otpContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    backgroundColor: "#fff",
  },
  otpTitle: {
    fontFamily: font.light,
    fontSize: 30,
    fontWeight: "300",
    color: "#000",
    padding: 15,
  },
  input: {
    width: "90%",
    maxWidth: 300,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginBottom: 15,
    fontFamily: font.regular,
  },
  button: {
    backgroundColor: "#FF6F61",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 25,
    height: 40,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontFamily: font.regular,
    fontSize: 16,
  },
  errorContainer: {
    width: "90%",
    marginTop: 10,
    alignItems: "flex-start",
  },
  errorText: {
    color: "red",
    fontFamily: font.regular,
    fontSize: 12,
  },
  errorInput: {
    borderColor: "red",
  },
  backText: {
    fontFamily: font.regular,
    fontSize: 12,
    color: "#999",
  },
});
