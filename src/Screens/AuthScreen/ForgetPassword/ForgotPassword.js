import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  Animated,
  Keyboard,
  Dimensions,
  TextInput,
} from "react-native";
import { font } from "../../../Common/Theme";
import Ionicons from "react-native-vector-icons/Ionicons";

import { FiInput } from "../../../Common/FiInput";
import { FiButton } from "../../../Common/FiButton";
import { CommonActions, useNavigation } from "@react-navigation/native";
import AlertBox from "../../../Common/AlertBox";
import { ActivityIndicator } from "react-native-paper";
import api from "../../../Service/api";
import OTPInputScreen from "./OTPInputScreen";
import PasswordEntry from "./PasswordEntry";

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [emailError, setEmailError] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAlert, setisAlert] = useState({
    message: "",
    heading: "",
    isRight: false,
    rightButtonText: "OK",
    triggerFunction: () => {},
    setShowAlert: () => {},
    showAlert: false,
    isLeft: true,
  });
  const [isPasswordField, setIsPasswordField] = useState(false);
  const [userData, setUserData] = useState();
  // Get screen width
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    if (email) {
      setEmailError("");
    }
    if (otp) {
      setOtpError("");
    }
  }, [email, otp]);

  const handleSendOtp = () => {
    let valid = true;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email) {
      setEmailError("Email is required.");
      valid = false;
      Vibration.vibrate(100);
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
      Vibration.vibrate(100);
    } else {
      setEmailError("");
    }

    if (valid) {
      fetchData();
    } else {
      Vibration.vibrate(100);
      console.log("Please enter a valid email address.");
    }
  };

  const fetchData = async () => {
    try {
      Keyboard.dismiss();
      setIsLoading(true);
      const response = await api.post("/reset/otp", null, {
        params: {
          email: email,
        },
      });
      // console.log(response);
      setisAlert({
        message: response.message,
        heading: "OTP Send",
        isRight: true,
        rightButtonText: "OK",
        triggerFunction: () => {
          setShowOtpScreen(true);
          slideToOtpScreen();
          closeAlert();
        },
        setShowAlert: () => {
          isAlert.setShowAlert(false);
        },
        showAlert: true,
        isLeft: false,
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

  const slideToOtpScreen = () => {
    setOtpError("");
    if (screenWidth > 500) {
      // Condition for wider screens
      Animated.timing(slideAnim, {
        toValue: -300, // Adjust for slide distance
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setShowOtpScreen(true); // Directly show OTP for smaller screens
    }
  };

  const slideToEmailScreen = () => {
    if (screenWidth > 500) {
      // Condition for wider screens
      setEmailError("");
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowOtpScreen(false);
        setEmail("");
      });
    } else {
      setShowOtpScreen(false); // Directly hide OTP screen for smaller screens
    }
  };

  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const slideAnim = useState(new Animated.Value(0))[0];
  const handleOtpVerify = () => {
    let valid = true;
    if (otp.length === 0) {
      setOtpError("OTP is required.");
      valid = false;
      Vibration.vibrate(100);
    } else if (otp.length < 6) {
      setOtpError("OTP must be 6 digits.");
      valid = false;
      Vibration.vibrate(100);
    } else {
      setOtpError("");
    }

    if (valid) {
      checkOtp();
    }
  };
  const checkOtp = () => {
    try {
      // Keyboard.dismiss();
      setIsLoading(true);
      const response = api
        .post("/reset/verify-otp", {
          email: email,
          otp: otp,
        })
        .then((response) => {
          setUserData(response.response);

          setIsPasswordField(true);
          setShowOtpScreen(false);
        })
        .catch((error) => {
          setOtpError(error.response?.data.message);
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
  const closeAlert = () => {
    setisAlert((prev) => ({ ...prev, showAlert: false }));
  };
  const handleSubmit = async (userData) => {
    try {
      Keyboard.dismiss();
      setIsLoading(true);
      const response = await api.post("/reset/password", userData);
      if (response.response === true) {
        setisAlert({
          message: "Password reset sucessfully, click login to continue",
          heading: "Success",
          isRight: true,
          rightButtonText: "Login",
          triggerFunction: () => {
            clearStackAndNavigate();
          },
          setShowAlert: () => {
            isAlert.setShowAlert(false);
          },
          showAlert: true,
          isLeft: true,
        });
      }
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
    <View style={styles.container}>
      {!showOtpScreen && !isPasswordField && (
        <>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>Enter your email to get OTP</Text>
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
          <FiButton
            style={styles.button}
            onPress={handleSendOtp}
            title={"Send OTP"}
            titleStyle={styles.buttonText}
          />
          <TouchableOpacity
            style={{ flexDirection: "row", padding: 15 }}
            onPress={() => {
              navigation.goBack();
              setEmailError("");
              setEmail("");
            }}
          >
            <Ionicons name="arrow-back" size={15} color="#999" />
            <Text style={styles.backText}>Back to the login page</Text>
          </TouchableOpacity>
        </>
      )}
      {showOtpScreen && (
        <OTPInputScreen
          otp={otp}
          setOtp={setOtp}
          slideToEmailScreen={slideToEmailScreen}
          otpError={otpError}
          slideAnim={slideAnim}
          sendOTP={fetchData}
          email={email}
          setOtpError={setOtpError}
          handleOtpVerify={handleOtpVerify}
        />
      )}
      {isPasswordField && (
        <PasswordEntry userData={userData} onSubmit={handleSubmit} />
      )}
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
        isLeft={isAlert.isLeft}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    textAlign: "center",
    display: "flex",
    padding: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  otpContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "absolute", // Ensure it's positioned correctly for animation
    backgroundColor: "#fff", // Optional for clarity
  },
  title: {
    fontFamily: font.light,
    fontSize: 30,
    fontWeight: "300",
    textAlign: "center",
    color: "#000",
  },
  otpTitle: {
    fontFamily: font.light,
    textAlign: "center",
    fontSize: 30,
    fontWeight: "300",
    color: "#000",
    padding: 15,
  },
  emailView: {
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
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    fontFamily: font.regular,
  },
  subtitle: {
    fontFamily: font.regular,
    textAlign: "center",
    fontSize: 12,
    color: "#999",
    padding: 15,
  },
  backText: {
    fontFamily: font.regular,
    fontSize: 12,
    color: "#999",
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
    marginTop: 10,
    alignItems: "flex-start",
  },
  errorText: {
    color: "red",
    fontFamily: font.regular,
    fontSize: 12,
  },
});

export default ForgotPassword;
