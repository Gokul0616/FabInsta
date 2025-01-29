import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Stepper from "./Stepper";
import Shipping from "./Shipping";
import Policy from "./Policy";
import ReviewOrder from "./ReviewOrder";

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0); // State to manage active step

  const [setSelectedAddresses, selectedAddresses] = useState([]);
  const stepperData = {
    steps: [
      { label: "Shipping", icon: "shipping-fast" },
      { label: "Policy", icon: "file" },
      { label: "Review Order", icon: "clipboard-list" },
    ],
  };
  const dropdownValues = [
    "Select Delivery Mode",
    "PICKED BY CUSTOMER",
    "DELIVERED TO CUSTOMER",
  ];

  return (
    <View style={styles.container}>
      <Stepper
        steps={stepperData.steps}
        activeStep={activeStep}
        closeSelectAddressModal
      />
      {activeStep === 0 && (
        <Shipping
          dropdownValues={dropdownValues}
          setSelectedAddresses={setSelectedAddresses}
          selectedAddresses={selectedAddresses}
        />
      )}
      {activeStep === 1 && <Policy />}
      {activeStep === 2 && <ReviewOrder />}
    </View>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 8,
    paddingTop: 50,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    padding: 10,
    backgroundColor: "#007BFF",
    color: "#fff",
    borderRadius: 5,
  },
});
