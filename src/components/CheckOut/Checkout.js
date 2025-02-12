import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import AlertBox from "../../Common/AlertBox";
import { font } from "../../Common/Theme";
import api from "../../Service/api";
import Policy from "./Policy";
import ReviewOrder from "./ReviewOrder";
import Shipping from "./Shipping";
import Stepper from "./Stepper";

const Checkout = () => {
  const route = useRoute();
  const {
    cartItem = [],
    priceSlab = {},
    combo = false,
    amount = 0,
  } = route.params || {};
  const [policyAccept, setPolicyAccept] = useState(false);
  const [isFullscreenLoading, setIsFullscreenLoading] = useState(false);
  const [delivery, setDelivery] = useState("");
  const [payment, setPayment] = useState("bank-transfer");
  const [walletChecked, setWalletChecked] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isError, setIsError] = useState({
    message: "",
    heading: "",
    isRight: false,
    rightButtonText: "OK",
    triggerFunction: () => { },
    setShowAlert: () => { },
    showAlert: false,
  });
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [cartInfo, setCartInfo] = useState({
    subTotal: 0,
    total: 0.0,
  });
  const [shippingCost, setShippingCost] = useState(0);
  const [addedWallet, setAddedWallet] = useState(0);

  useEffect(() => {
    if (Array.isArray(cartItem) && cartItem.length > 0) {
      const subTotal = cartItem.length;
      let total = 0;

      if (!combo) {
        total = cartItem.reduce((initial, current) => {
          const sellingPrice =
            (current.sellingPrice || 0) *
            (1 - (priceSlab[current.pimVariantId]?.[0]?.discount || 0) / 100);
          return initial + sellingPrice * (current.quantity || 1);
        }, 0);
      } else {
        total = cartItem.reduce((initial, current) => {
          if (!current.combo) return initial;
          const sellingPrice =
            (current.combo.sellingPrice || 0) *
            (1 - (priceSlab[current.pimVariantId]?.[0]?.discount || 0) / 100);
          return (
            initial +
            sellingPrice *
            (current.combo.quantity || 1) *
            (current?.variants?.length || 1)
          );
        }, 0);
      }

      setCartInfo({
        subTotal,
        total: total.toFixed(2),
      });
    }
  }, [cartItem, combo, priceSlab]);

  const [selectedAddresses, setSelectedAddresses] = useState({
    billLocation: null,
    shipLocation: null,
  });

  const stepperData = {
    steps: [
      { label: "Shipping", icon: "shipping-fast" },
      { label: "Policy", icon: "file" },
      { label: "Review Order", icon: "clipboard-list" },
    ],
  };

  const handlePlaceOrder = async () => {
    setIsFullscreenLoading(true);

    try {
      const items = cartItem.map((item) => {
        const kg = combo
          ? item?.combo?.quantity * item.variants.length
          : item.quantity || 0;

        const discount = priceSlab[item.pimVariantId]?.[0]?.discount || 0;
        const totalAmount =
          (combo ? item.combo.sellingPrice : item.sellingPrice) *
          (1 - discount / 100) *
          kg;
        return {
          pimVariantId: item.pimVariantId || "",
          kg,
          totalAmount,
        };
      });

      const totalAmount = items.reduce(
        (sum, item) => sum + item.totalAmount,
        0
      );

      let updatedCartData = {};
      if (combo) {
        updatedCartData = cartItem.map((item) => {
          return item.combo;
        });
      } else {
        updatedCartData = cartItem.map((item) => {
          const discount = priceSlab[item.pimVariantId]?.[0]?.discount || 0;
          const updatedSelectionPrice =
            item.sellingPrice * (1 - discount / 100);
          return {
            ...item,
            sellingPrice: updatedSelectionPrice,
          };
        });
      }
      // Prepare the order object
      const order = {
        billLocation: selectedAddresses.billLocation,
        shipLocation: selectedAddresses.shipLocation,
        paymentMode: payment,
        // shippingDate: futuredate.add(5, 'days').format('MMM DD, YYYY'), // Uncomment and use if needed
        grossTotal: totalAmount,
        items: updatedCartData,
        deliveryMode: delivery,
        swatchPoint: walletChecked ? addedWallet : 0,
        shipmentCost: shippingCost,
      };
      const response = await api.post("order/save", order);
      navigation.navigate("Fabric-Orders");

      // Call this function after navigating to Fabric-Orders
      // setOrderPlaced(true);
    } catch (error) {
      console.error("Error placing order:", error);
      setIsError({
        message: error || "An Unexpected error occurred",
        heading: "Error",
        isRight: false,
        rightButtonText: "OK",
        triggerFunction: () => { },
        setShowAlert: () => {
          isError.setShowAlert(false);
        },
        showAlert: true,
      });
    } finally {
      setIsFullscreenLoading(false);
    }
  };
  const closeAlert = () => {
    setIsError((prev) => ({ ...prev, showAlert: false }));
  };
  const calculateShippingCharge = () => {
    const shippingCost =
      selectedAddresses?.shipLocation?.transporterCharges?.charges;
    let totalAmount;
    if (combo) {
      totalAmount = cartItem.reduce(
        (sum, item) => sum + item.combo.quantity * item.variants.length,
        0
      );
    } else {
      totalAmount = cartItem.reduce(
        (sum, item) =>
          sum +
          (item.cartType === "SWATCH" ? item.quantity * 0.5 : item.quantity),
        0
      );
    }

    const res = (shippingCost * totalAmount).toFixed(2);
    return res;
  };
  const handleWalletCheckChange = () => {
    setWalletChecked((prev) => !prev);
  };
  const handleNextStep = () => {
    setActiveStep((current) => (current < 2 ? current + 1 : current));
  };
  const valueOption = ["PICKED BY CUSTOMER", "DELIVERED TO CUSTOMER"];

  console.log(cartInfo, "cartInfo");
  const dropdownValues = [
    "Select Delivery Mode",
    "PICKED BY CUSTOMER",
    "DELIVERED TO CUSTOMER",
  ];
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigate.goBack()}
        style={{
          paddingVertical: 10,
          paddingHorizontal: 5,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Icon name="arrow-left" size={24} color="#333" />
        <Text
          style={{ color: "#000", fontFamily: font.semiBold, fontSize: 18 }}
        >
          Back
        </Text>
      </TouchableOpacity>
      {isFullscreenLoading && (
        <View style={styles.loadingOverlay}>
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
      <>
        <Stepper
          steps={stepperData.steps}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
        {activeStep === 0 && (
          <Shipping
            dropdownValues={dropdownValues}
            setSelectedAddresses={setSelectedAddresses}
            cartData={cartItem}
            combo={combo}
            delivery={delivery}
            setDelivery={setDelivery}
            cartInfo={cartInfo}
            handleNextStep={handleNextStep}
            selectedAddresses={selectedAddresses}
          />
        )}
        {activeStep === 1 && (
          <Policy
            cartData={cartItem}
            policyAccept={policyAccept}
            setPolicyAccept={setPolicyAccept}
            handleNextStep={handleNextStep}
            cartInfo={cartInfo}
            combo={combo}
          />
        )}
        {activeStep === 2 && (
          <ReviewOrder
            payment={payment}
            delivery={delivery}
            setPayment={setPayment}
            cartInfo={cartInfo}
            cartData={cartItem}
            priceSlab={priceSlab}
            handlePlaceOrder={handlePlaceOrder}
            selectedAddresses={selectedAddresses}
            isLoading={isLoading}
            activeStep={2}
            handleNextStep={() => handleNextStep()}
            combo={combo}
            calculateShippingCharge={calculateShippingCharge()}
            valueOption={valueOption}
            walletChecked={walletChecked}
            amount={amount}
            handleWalletCheck={handleWalletCheckChange}
            setAddedWallet={setAddedWallet}
          />
        )}
      </>
    </View>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 8,
    paddingVertical: 10,
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
});
