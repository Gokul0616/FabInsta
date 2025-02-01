import { CommonActions, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { Eye, EyeOff } from "react-native-feather";
import { common, storage } from "../../Common/Common";
import { FiButton } from "../../Common/FiButton";
import { FiInput } from "../../Common/FiInput";
import { font } from "../../Common/Theme";
import axiosInstance from "../../Service/api";
import AlertBox from "../../Common/AlertBox";
import api from "../../Service/api";

const AuthScreen = () => {
  const navigation = useNavigation();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isError, setIsError] = useState({
    message: "",
    heading: "",
    isRight: false,
    rightButtonText: "OK",
    triggerFunction: () => {},
    setShowAlert: () => {},
    showAlert: false,
  });
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const protectedRoutes = () => {
      const token = storage.getString("token");
      if (token) {
        clearStackAndNavigate();
      } else {
        navigation.navigate("Signin");
      }
    };

    protectedRoutes();
  }, []);
  const clearStackAndNavigate = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "Tabs",
          },
        ],
      })
    );
  };

  useEffect(() => {
    if (email) {
      setEmailError("");
    }
    if (password) {
      setPasswordError("");
    }
  }, [email, password]);

  const handleLogin = () => {
    let valid = true;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email) {
      setEmailError("Email is required.");
      valid = false;
      Vibration.vibrate(100);
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      Vibration.vibrate(100);

      valid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required.");
      Vibration.vibrate(100);
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      Vibration.vibrate(100);
      valid = false;
    } else {
      setPasswordError("");
    }

    if (valid) {
      fetchData();
    } else {
      Vibration.vibrate(100);
      console.log("Login Failed");
    }
  };

  const fetchData = async () => {
    try {
      Keyboard.dismiss();
      setLoading(true);
      const response = await api.post("/customer/login", {
        emailId: email,
        password: password,
      });
      const { companyId, token, userId } = response.response;
      storage.set("companyId", companyId == null ? "" : companyId);
      storage.set("token", token);
      storage.set("userId", userId);
       clearStackAndNavigate();
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsError({
        message: error.response.data.message,
        heading: "Error",
        isRight: false,
        rightButtonText: "OK",
        triggerFunction: () => {},
        setShowAlert: () => {
          isError.setShowAlert(false);
        },
        showAlert: true,
      });
    } finally {
      setLoading(false);
    }
  };
  const closeAlert = () => {
    setIsError((prev) => ({ ...prev, showAlert: false }));
  };

  const handleforgetpasswordClick = () => {
    setPasswordError("");
    setEmailError("");
    navigation.navigate("ForgotPassword");
  };

  const handleSignupClick = () => {
    navigation.navigate("Signup");
    setPasswordError("");
    setEmailError("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Log in to {common.title} </Text>
      <View style={styles.emailView}>
        <FiInput
          value={email}
          placeholder={"ex: example@gmail.com"}
          keyboardType={"email-address"}
          style={[styles.input, emailError ? styles.errorInput : null]}
          onChangeText={setEmail}
        />
        {emailError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{emailError}</Text>
          </View>
        ) : null}
      </View>
      <TouchableOpacity
        style={styles.forgotPasswordView}
        onPress={handleforgetpasswordClick}
      >
        <Text style={styles.forgotPassword}>Forgot your password?</Text>
      </TouchableOpacity>
      <View style={styles.passwordContainer}>
        <View
          style={[
            styles.passwordView,
            passwordError ? styles.errorInput : null,
          ]}
        >
          <FiInput
            style={[
              styles.passwordInput,
              passwordError ? styles.errorInput : null,
            ]}
            placeholder="Your Password"
            placeholderTextColor="#999"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? (
              <Eye width={16} height={16} color="#999" />
            ) : (
              <EyeOff width={16} height={16} color="#999" />
            )}
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{passwordError}</Text>
          </View>
        ) : null}
      </View>

      <FiButton
        style={styles.button}
        onPress={handleLogin}
        title={"Sign In"}
        titleStyle={styles.buttonText}
      />
      <TouchableOpacity
        onPress={handleSignupClick}
        style={styles.dontHaveAccountView}
      >
        <Text style={styles.dontHaveAccount}>Don't have an account yet? </Text>
        <View>
          <Text style={styles.signupButton}> Sign Up</Text>
        </View>
      </TouchableOpacity>

      {isLoading && (
        <View
          style={styles.loadingOverlay}
          pointerEvents="auto" // Ensures the focus is on the loading indicator
        >
          <ActivityIndicator size="large" color="#FF6F61" />
        </View>
      )}
      <AlertBox
        heading={isError.heading}
        message={isError.message}
        setShowAlert={closeAlert}
        showAlert={isError.showAlert}
        triggerFunction={isError.triggerFunction}
        isRight={isError.isRight}
        rightButtonText={isError.rightButtonText}
      />
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontFamily: font.light,
    fontSize: 30,
    fontWeight: "300",
    marginBottom: 45,
    color: "#000",
  },
  emailView: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    borderColor: "#ccc",
    marginBottom: 10,
  },
  passwordView: {
    width: "90%",
    maxWidth: 300,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
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
    fontFamily: font.regular,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    fontFamily: font.regular,
  },
  passwordContainer: {
    marginBottom: 10,
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#FF6F61",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    height: 40,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.2s",
  },
  buttonPressed: {
    backgroundColor: "#e05b54",
  },
  buttonText: {
    color: "#ffffff",
    fontFamily: font.regular,
    fontSize: 16,
  },
  forgotPassword: {
    fontFamily: font.regular,
    fontSize: 12,
    color: "#228BE6",
  },
  forgotPasswordView: {
    textAlign: "right",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "90%",
    maxWidth: 300,
    padding: 5,
  },
  dontHaveAccountView: {
    padding: 5,
    marginTop: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dontHaveAccount: {
    fontFamily: font.regular,
    fontSize: 12,
    color: "#999",
  },
  signupButton: {
    fontFamily: font.regular,
    color: "#228BE6",
  },
  errorInput: {
    borderColor: "red",
  },
  errorContainer: {
    width: "90%",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    fontFamily: font.regular,
  },
});
