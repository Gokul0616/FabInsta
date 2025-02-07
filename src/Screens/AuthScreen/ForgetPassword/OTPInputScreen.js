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
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { font } from "../../../Common/Theme";
import { FiButton } from "../../../Common/FiButton";

const CELL_COUNT = 6;

const OTPInputScreen = ({
  otp,
  setOtp,
  slideToEmailScreen,
  otpError,
  setOtpError,
  sendOTP,
  slideAnim,
  email,
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
    return () => clearInterval(timer); // Cleanup on unmount or timer reset
  }, [resendTimer, isResendDisabled, setOtpError]);

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

  // Hook from the package for auto-blur when all cells are filled
  const ref = useBlurOnFulfill({ value: otp, cellCount: CELL_COUNT });
  // Hook for managing focus and clearing cells
  const [codeFieldProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otp,
    setValue: setOtp,
  });

  return (
    <Animated.View
      style={[styles.otpContainer, { transform: [{ translateX: slideAnim }] }]}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.otpTitle}>Enter OTP</Text>
        <Text style={styles.otpSubTitle}>We sent a code to {email}</Text>
      </View>

      {/* OTP Input using react-native-confirmation-code-field */}
      <CodeField
        ref={ref}
        {...codeFieldProps}
        value={otp}
        onChangeText={setOtp}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <View
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}
          >
            <Text style={styles.cellText}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
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
        style={styles.backContainer}
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
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    padding: 15,
  },
  otpTitle: {
    fontFamily: font.light,
    fontSize: 30,
    fontWeight: "300",
    color: "#000",
  },
  otpSubTitle: {
    fontSize: 14,
    fontFamily: font.semiBold,
    color: "#8a9096",
  },
  codeFieldRoot: {
    marginVertical: 20,
  },
  cell: {
    width: 40,
    height: 50,
    lineHeight: 38,
    marginHorizontal: 5,
    fontSize: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    textAlign: "center",
    fontFamily: font.regular,
    justifyContent: "center",
    alignItems: "center",
  },
  focusCell: {
    borderColor: "#FF6F61",
  },
  cellText: {
    fontSize: 20,
    textAlign: "center",
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
  backContainer: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
  },
  backText: {
    fontFamily: font.regular,
    fontSize: 12,
    color: "#999",
    marginLeft: 5,
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
