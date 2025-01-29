import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import { common } from "../../Common/Common";
import { font } from "../../Common/Theme";

const Stepper = ({ steps, activeStep = 0 }) => {
  return (
    <View style={styles.stepperContainer}>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          <View
            style={[
              styles.iconContainer,
              index <= activeStep ? styles.activeIcon : styles.inactiveIcon,
            ]}
          >
            <Icon
              name={step.icon}
              size={20}
              color={index <= activeStep ? "#fff" : "#ccc"}
            />
          </View>
          <Text
            style={[
              styles.stepLabel,
              index <= activeStep ? styles.activeLabel : styles.inactiveLabel,
            ]}
          >
            {step.label}
          </Text>
          {index < steps.length - 1 && (
            <View
              style={[
                styles.connector,
                index < activeStep
                  ? styles.activeConnector
                  : styles.inactiveConnector,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );
};

export default Stepper;

const styles = StyleSheet.create({
  stepperContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 75,
    paddingHorizontal: 16,
    marginTop: 0,
  },
  stepContainer: {
    alignItems: "center",
    position: "relative",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  activeIcon: {
    backgroundColor: common.PRIMARY_COLOR,
  },
  inactiveIcon: {
    backgroundColor: "#e0e0e0",
  },
  stepLabel: {
    fontSize: 12,
    textAlign: "center",
    fontFamily: font.regular,
  },
  activeLabel: {
    color: common.PRIMARY_COLOR,
    fontFamily: font.semiBold,
  },
  inactiveLabel: {
    color: "#ccc",
  },
  connector: {
    position: "absolute",
    top: 20,
    left: 50,
    width: 65,
    height: 2,
  },
  activeConnector: {
    backgroundColor: common.PRIMARY_COLOR,
  },
  inactiveConnector: {
    backgroundColor: "#e0e0e0",
  },
});
