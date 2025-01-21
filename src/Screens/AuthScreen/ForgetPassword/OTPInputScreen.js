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

const OTPInputScreen = ({
  otp,
  setOtp,
  slideToEmailScreen,
  otpError,
  setOtpError,
  sendOTP,
  slideAnim,
  handleOtpVerify,
}) => {
  const [resendTimer, setResendTimer] = useState(30); // Countdown timer in seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    let timer;
    if (isResendDisabled && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setIsResendDisabled(false);
    }
    if (resendTimer === 0) {
      setOtpError("");
    }
    return () => clearInterval(timer); // Cleanup the interval on unmount or timer reset
  }, [resendTimer, isResendDisabled]);

  const handleResendOtp = () => {
    if (isResendDisabled) {
      setOtpError(`Wait for ${resendTimer} sec to resend OTP`);
      Vibration.vibrate(100);
    } else {
      setIsResendDisabled(true);
      setResendTimer(30);
      setOtpError("");
      sendOTP();
    }
  };

  return (
    <Animated.View
      style={[styles.otpContainer, { transform: [{ translateX: slideAnim }] }]}
    >
      <Text style={styles.otpTitle}>Enter OTP</Text>
      <FiInput
        style={[styles.input, otpError ? styles.errorInput : null]}
        placeholder={"Enter OTP"}
        keyboardType={"numeric"}
        maxLength={6}
        onChangeText={setOtp}
        value={otp}
      />

      {otpError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{otpError}</Text>
        </View>
      ) : null}

      <FiButton
        style={[styles.resendButton, isResendDisabled && styles.disabledButton]}
        onPress={handleResendOtp}
        disabled={isResendDisabled}
        title={
          isResendDisabled ? `Resend OTP in ${resendTimer}s` : "Resend OTP"
        }
        titleStyle={[
          styles.resendButtonText,
          isResendDisabled && styles.disabledButtonText,
        ]}
      />

      <FiButton
        style={styles.button}
        onPress={handleOtpVerify}
        title={"Verify OTP"}
        titleStyle={styles.buttonText}
      />
      <TouchableOpacity
        style={{ flexDirection: "row", padding: 15 }}
        onPress={slideToEmailScreen}
      >
        <Ionicons name="arrow-back" size={15} color="#999" />
        <Text style={styles.backText}>Back to email form</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default OTPInputScreen;

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
    fontFamily: font.regular,
  },
  resendButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 25,
    height: 40,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#e0e0e0",
  },
  resendButtonText: {
    color: "#FF6F61",
    fontFamily: font.regular,
    fontSize: 16,
  },
  disabledButtonText: {
    color: "#aaa",
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
  backText: {
    fontFamily: font.regular,
    fontSize: 12,
    color: "#999",
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
