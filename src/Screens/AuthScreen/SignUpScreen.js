import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  Vibration,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { FiInput } from "../../Common/FiInput";
import { FiButton } from "../../Common/FiButton";
import { font } from "../../Common/Theme";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { Eye, EyeOff } from "react-native-feather";
import { Checkbox } from "react-native-paper";
import { common, storage, title } from "../../Common/Common";
import { ScrollView } from "react-native-gesture-handler";
import AlertBox from "../../Common/AlertBox";
import api from "../../Service/api";

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isAlert, setisAlert] = useState({
    message: "",
    heading: "",
    isRight: false,
    rightButtonText: "OK",
    triggerFunction: () => {},
    setShowAlert: () => {},
    showAlert: false,
  });

  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [companyNameError, setCompanyNameError] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    if (companyName) {
      setCompanyNameError("");
    }
    if (name) {
      setNameError("");
    }
    if (phoneNumber) {
      setPhoneNumberError("");
    }
    if (email) {
      setEmailError("");
    }
    if (password) {
      setPasswordError("");
    }
  }, [companyName, name, phoneNumber, email, password]);
  const closeAlert = () => {
    setisAlert((prev) => ({ ...prev, showAlert: false }));
  };
  const handleSignUp = () => {
    let isValid = true;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\d{10}$/;

    if (!companyName) {
      setCompanyNameError("Company Name is required.");
      isValid = false;
      Vibration.vibrate(100);
    } else {
      setCompanyNameError("");
    }

    if (!name) {
      setNameError("Name is required.");
      Vibration.vibrate(100);
      isValid = false;
    } else {
      setNameError("");
    }

    if (!phoneNumber) {
      setPhoneNumberError("Phone Number is required.");
      Vibration.vibrate(100);
      isValid = false;
    } else if (!phoneRegex.test(phoneNumber)) {
      setPhoneNumberError("Phone Number must be 10 digits.");
      Vibration.vibrate(100);
      isValid = false;
    } else {
      setPhoneNumberError("");
    }

    if (!email) {
      setEmailError("Email is required.");
      Vibration.vibrate(100);
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      Vibration.vibrate(100);
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required.");
      Vibration.vibrate(100);
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      Vibration.vibrate(100);
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (isValid) {
      fetchData();
    } else {
      Vibration.vibrate(100);

      console.log("Error", "Please fill in all the required fields.");
    }
  };
  const fetchData = async () => {
    try {
      Keyboard.dismiss();
      setIsLoading(true);
      const response = await api.post("/customer/signup", {
        email: email,
        companyName: companyName,
        name: name,
        mobileNo: phoneNumber,
        password: password,
      });
      setisAlert({
        message: response.message,
        heading: "Success",
        isRight: true,
        rightButtonText: "Login",
        triggerFunction: () => {
          navigation.navigate("Signin");
        },
        setShowAlert: () => {
          isAlert.setShowAlert(false);
        },
        showAlert: true,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setisAlert({
        message: error.response.data.message,
        heading: "Error",
        isRight: false,
        rightButtonText: "OK",
        triggerFunction: () => {},
        setShowAlert: () => {
          isAlert.setShowAlert(false);
        },
        showAlert: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  //Use this for logout
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>Create a new account</Text>
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Company Name</Text>
          </View>
          <FiInput
            style={[styles.input, companyNameError ? styles.errorInput : null]}
            value={companyName}
            onChangeText={setCompanyName}
            error={companyNameError}
          />
          {companyNameError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{companyNameError}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Name</Text>
          </View>
          <FiInput
            style={[styles.input, nameError ? styles.errorInput : null]}
            value={name}
            onChangeText={setName}
            error={nameError}
          />
          {nameError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{nameError}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Mobile Number</Text>
          </View>
          <FiInput
            style={[styles.input, phoneNumberError ? styles.errorInput : null]}
            value={phoneNumber}
            keyboardType={"numeric"}
            onChangeText={setPhoneNumber}
            error={phoneNumberError}
          />
          {phoneNumberError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{phoneNumberError}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Email</Text>
          </View>
          <FiInput
            style={[styles.input, emailError ? styles.errorInput : null]}
            value={email}
            onChangeText={setEmail}
            keyboardType={"email-address"}
            error={emailError}
          />
          {emailError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{emailError}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Create Password</Text>
        </View>
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
              placeholder=""
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
        <View style={styles.newsletterContainer}>
          <Checkbox
            color="#FF6F61"
            status={isChecked ? "checked" : "unchecked"}
            onPress={() => setIsChecked(!isChecked)}
          />
          <Text style={styles.termsText}>
            Get emails from {common.title} about product updates, industry news,
            and events
          </Text>
        </View>
        <FiButton
          style={styles.button}
          title="Sign Up"
          onPress={handleSignUp}
          titleStyle={styles.buttonText}
        />
        <TouchableOpacity
          onPress={clearStackAndNavigate}
          style={styles.alreadyHaveaccContainer}
        >
          <Text style={styles.alreadyHaveacc}>Have an account? </Text>
          <Text style={styles.siginupButton}>Sign in</Text>
        </TouchableOpacity>
      </ScrollView>
      {isLoading && (
        <View
          style={styles.loadingOverlay}
          pointerEvents="auto" // Ensures the focus is on the loading indicator
        >
          <ActivityIndicator size="large" color="#FF6F61" />
        </View>
      )}
      <AlertBox
        heading={isAlert.heading}
        message={isAlert.message}
        setShowAlert={closeAlert}
        showAlert={isAlert.showAlert}
        triggerFunction={isAlert.triggerFunction}
        isRight={isAlert.isRight}
        rightButtonText={isAlert.rightButtonText}
      />
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  scrollContentContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1, // Ensures that content is vertically centered even with fewer items
  },

  title: {
    fontFamily: font.light,
    fontSize: 30,
    fontWeight: "300",
    color: "#000",
  },
  subtitle: {
    fontFamily: font.regular,
    fontSize: 12,
    color: "#999",
    paddingVertical: 15,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "90%",
    marginBottom: 5,
  },
  label: {
    fontFamily: font.regular,
    fontSize: 16,
    color: "#000",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    borderColor: "#ccc",
    marginBottom: 10,
  },
  input: {
    width: "90%",
    maxWidth: 300,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
    fontFamily: font.regular,
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
  passwordInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    color: "#000",
    fontFamily: font.regular,
  },
  passwordContainer: {
    marginBottom: 10,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    borderColor: "#ccc",
    justifyContent: "space-between",
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
  buttonText: {
    color: "#ffffff",
    fontFamily: font.regular,
    fontSize: 16,
  },
  errorInput: {
    borderColor: "red",
  },

  errorContainer: {
    width: "90%",
    alignItems: "flex-start",
  },
  errorText: {
    color: "red",
    fontFamily: font.regular,
    fontSize: 12,
  },
  alreadyHaveaccContainer: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  alreadyHaveacc: {
    fontFamily: font.regular,
    fontSize: 12,
    color: "#999",
  },
  siginupButton: {
    fontFamily: font.regular,
    color: "#228BE6",
  },
  termsText: {
    fontFamily: font.regular,
    fontSize: 12,
    color: "#999",
    width: "90%",
  },
  newsletterContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
