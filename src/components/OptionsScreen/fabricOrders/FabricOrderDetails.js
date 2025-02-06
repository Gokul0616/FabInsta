import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import api from "../../../Service/api";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import { backendUrl, common } from "../../../Common/Common";
import { font } from "../../../Common/Theme";
import AlertBox from "../../../Common/AlertBox";
import { Checkbox } from "react-native-paper";
import Return from "../../../Common/Return";
import { useDisclosure } from "@mantine/hooks";

const FabricOrderDetails = ({ route }) => {
  const orderNo = route.params.orderNo;
  const [specificOrder, setSpecificOrder] = useState([]);
  const [isFullScreenLoading, setIsFullScreenLoading] = useState(false);
  const navigate = useNavigation();
  const steps = [
    {
      label: "Order Placed",
      description: "Your order has been placed.",
      note: "Your order is yet to be confirmed.",
    },
    {
      label: "Confirmed",
      description: "Order has been confirmed.",
      note: "Your order is confirmed.",
    },
    {
      label: "Shipped",
      description: "Your order is on the way.",
      note: "Your order is being shipped.",
    },
    {
      label: "Delivered",
      description: "Order has been delivered.",
      note: "Your order has been delivered.",
    },
  ];
  const [isError, setIsError] = useState({
    message: "",
    heading: "",
    isRight: false,
    rightButtonText: "OK",
    triggerFunction: () => {},
    setShowAlert: () => {},
    showAlert: false,
  });
  const closeAlert = () => {
    setIsError((prev) => ({ ...prev, showAlert: false }));
  };

  useEffect(() => {
    fetchSpecificData();
  }, []);
  const getActiveStep = () => {
    if (specificOrder?.orderStatus === "CANCELLED") return -1;
    if (specificOrder?.orderStatus === "DELIVERED") return 3;
    if (specificOrder?.orderStatus === "SHIPPED") return 2;
    if (
      ["CONFIRMED", "PACKED", "PAID", "INVOICED"].includes(
        specificOrder?.orderStatus
      )
    ) {
      return 1;
    }
    return 0;
  };

  const active = getActiveStep();

  const fetchSpecificData = async () => {
    try {
      setIsFullScreenLoading(true);
      const res = await api.get(`order/${orderNo}`);
      setSpecificOrder(res.response);
    } catch (error) {
      console.error("Error fetching fabricInquiry:", error);
    } finally {
      setIsFullScreenLoading(false);
    }
  };

  const BacktoPlaceOrder = () => {
    navigate(`/place-Orders`, {
      state: { activeTabFromLocation: currentpath },
    });
  };

  const [visible, setVisible] = useState(false);
  const [variantId, setVariantId] = useState("");
  const [returnStatus, setReturnStatus] = useState(false);

  const returnModalClose = () => {
    setVisible(false);
  };

  const comfirmReturn = async (item) => {
    const body = {
      orderNo: orderNo,
      variantSku: item?.productVariant?.variantSku,
      productName: item?.productVariant?.name,
      sellingPrice: item?.sellingPrice,
      noOfRolls:
        item?.pickList?.reduce(
          (total, item) => total + (parseInt(item?.returnedRolls) || 0),
          0
        ) || 0,
      pickListId: item?.pickList?.[0]?.pickListId || null,
      pickList: item?.pickList,
      reason: specificOrder?.reason,
      actualNoOfRolls:
        item?.pickList?.reduce(
          (total, item) => total + (item?.noOfRoll || 0),
          0
        ) || 0,
      invoicNo: specificOrder.invoice.invoiceNo, // Fallback to 0 if undefined
    };

    try {
      setIsFullScreenLoading(true);

      const response = await api.post(`return/save`, body);
      returnModalClose();
      fetchSpecificData();
    } catch (error) {
      console.error("Error during API call:", error);
      setIsError({
        message: error || "An Unexpected error occurred",
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
      setIsFullScreenLoading(false);
    }
  };

  const togglePaymentSummary = () => {
    setPaymentSummaryExpanded((prevState) => !prevState);
  };

  const formatCurrency = (amount) => {
    return amount ? `Rs. ${amount.toFixed(2)}` : "Rs. 0.00";
  };

  const formatDate = (date) => {
    return date ? new Date(date).toISOString().split("T")[0] : "";
  };

  useEffect(() => {
    setSpecificOrder((prev) => ({
      ...prev,
      returningRolls: 0,
      reason: "",
    }));
  }, [variantId]);
  const handleChange = (event, key) => {
    let val;
    if (event?.target?.type === "radio") {
      val = event?.target?.value;
    } else {
      val = event?.target?.value;
    }
    setSpecificOrder((prev) => ({
      ...prev,
      [key]: val,
    }));
  };
  const packingCharges = specificOrder?.packing?.packingCharges || 0;

  const getGrossTotal = useCallback(() => {
    if (specificOrder && specificOrder?.items) {
      let grossTotal = specificOrder?.items?.reduce(
        (acc, item) => acc + item.sellingPrice * item.qty,
        0
      );
      return grossTotal.toFixed(2);
    } else {
      return 0;
    }
  }, [specificOrder]);
  const VerticalStepper = ({ steps, activeStep }) => {
    return (
      <View style={styles.stepperContainer}>
        {steps.map((step, index) => {
          const completed = index <= activeStep;
          return (
            <View key={index} style={styles.stepContainer}>
              <View
                style={[
                  styles.iconContainer,
                  completed && styles.iconCompleted,
                ]}
              >
                {completed ? (
                  <Icon name="check" size={18} color="white" />
                ) : (
                  <Icon name="circle" size={14} color="gray" />
                )}
              </View>

              {/* Line Connector */}
              {/* {index !== steps.length - 1 && <View style={styles.stepLine} />}
               */}
              {index !== steps.length - 1 && (
                <View
                  style={[
                    styles.stepLine,
                    completed && {
                      // half: true,
                      backgroundColor: common.PRIMARY_COLOR,
                    },
                  ]}
                />
              )}
              <View style={styles.stepContent}>
                <Text
                  style={[
                    styles.stepLabel,
                    completed && styles.stepLabelCompleted,
                  ]}
                >
                  {step.label}
                </Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isFullScreenLoading && (
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
      <TouchableOpacity
        onPress={() => navigate.goBack()}
        style={{
          paddingVertical: 10,
          paddingHorizontal: 10,
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
      <View style={styles.deliveryContainer}>
        <Text
          style={[
            styles.deliveryContainerText,
            { fontFamily: font.semiBold, fontSize: 17 },
          ]}
        >
          Delivery Address
        </Text>
        <Text style={styles.deliveryContainerText}>
          {specificOrder?.shipLocation?.nickName}
        </Text>
        <Text style={styles.deliveryContainerText}>
          {specificOrder?.shipLocation?.email}
        </Text>
        <Text style={[styles.deliveryContainerText, { lineHeight: 20 }]}>
          {specificOrder?.shipLocation?.address1},{" "}
          {specificOrder?.shipLocation?.address2},{" "}
          {specificOrder?.shipLocation?.city} -{" "}
          {specificOrder?.shipLocation?.pincode},{" "}
          {specificOrder?.shipLocation?.state},{" "}
          {specificOrder?.shipLocation?.country}.
        </Text>
        <View style={{ gap: 5 }}>
          <Text
            style={[
              styles.deliveryContainerText,
              { fontFamily: font.semiBold },
            ]}
          >
            Phone Number
          </Text>
          <Text style={styles.deliveryContainerText}>
            {specificOrder?.shipLocation?.mobileNo}
          </Text>
        </View>
        <Text style={styles.deliveryContainerText}>
          This order is also tracked by{" "}
          <Text style={{ fontFamily: font.semiBold }}>
            {specificOrder?.shipLocation?.mobileNo}
          </Text>
        </Text>
      </View>
      <View style={styles.deliveryContainer}>
        {specificOrder?.items?.map((item, index) => (
          <View key={index} style={styles.contentContainer}>
            <Image
              source={{
                uri: `${backendUrl}${item?.image?.replace("/api", "")}`,
              }}
              style={styles.contentImage}
            />
            <Text style={styles.contentText}>{item?.productVariant?.name}</Text>
            <Text style={styles.contentColorText}>
              {specificOrder.orderType !== "SWATCH"
                ? "Color:"
                : "Product Name:"}{" "}
              {specificOrder.orderType !== "SWATCH"
                ? item.productVariant?.variants.filter(
                    (variant) => variant.type === "Colour"
                  )[0].value || "N/A"
                : item.productName || "N/A"}
            </Text>
            <Text style={styles.contentPriceText}>
              ₹
              {(
                (specificOrder?.grossTotal || 0) +
                (specificOrder?.shipmentCost || 0) +
                (specificOrder?.totalGst || 0) +
                (specificOrder?.packing?.packingCharges || 0)
              ).toFixed(2) || 0}
            </Text>
          </View>
        ))}
        {getActiveStep() == -1 ? (
          <Text
            style={{ fontFamily: font.regular, fontSize: 14, color: "red" }}
          >
            Your Order has been Cancelled.
          </Text>
        ) : (
          <>
            <VerticalStepper steps={steps} activeStep={active} />
            <Text
              style={{ fontFamily: font.regular, fontSize: 14, color: "green" }}
            >
              {steps[active].note}
            </Text>
          </>
        )}
      </View>
      {!["NEW", "CONFIRMED", "CANCELLED", "PACKED"].includes(
        specificOrder?.orderStatus
      ) && (
        <>
          <View style={{ gap: 20 }}>
            <View>
              <Text
                style={{
                  fontFamily: font.semiBold,
                  fontSize: 18,
                  paddingVertical: 16,
                }}
              >
                Order Details
              </Text>
            </View>
            <View style={styles.deliveryContainer}>
              {specificOrder?.packing && (
                <>
                  <View>
                    <Text style={styles.headerText}>Payment Summary</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",

                      alignItems: "center",
                      padding: 1,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: font.semiBold,

                        paddingVertical: 5,
                        alignSelf: "flex-start",
                      }}
                    >
                      Invoice No:
                    </Text>
                    <Text
                      style={{
                        backgroundColor: "#000",
                        color: "#fff",
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 5,
                        marginLeft: 5,
                      }}
                    >
                      {specificOrder?.invoice?.invoiceNo || "NOT YET INVOICED"}
                    </Text>
                  </View>
                  <View style={styles.tableContainer}>
                    <View style={styles.cellRow}>
                      <Text style={styles.cellRowLeftText}>
                        Products Total (Incl.Tax)
                      </Text>
                      <Text style={styles.cellRowRightText}>
                        {formatCurrency(
                          parseFloat(getGrossTotal()) +
                            parseFloat(specificOrder.totalGst || 0)
                        )}
                      </Text>
                    </View>
                    <View style={styles.cellRow}>
                      <Text style={styles.cellRowLeftText}>
                        Packing Charges
                      </Text>
                      <Text style={styles.cellRowRightText}>
                        {formatCurrency(packingCharges)}
                      </Text>
                    </View>
                    <View style={styles.cellRow}>
                      <Text style={styles.cellRowLeftText}>
                        Shipment Charges
                      </Text>
                      <Text style={styles.cellRowRightText}>
                        {formatCurrency(
                          parseFloat(specificOrder?.shipmentCost || 0)
                        )}
                      </Text>
                    </View>
                    <View style={styles.cellRow}>
                      <Text style={styles.cellRowLeftText}>Wallet Amount</Text>
                      <Text style={styles.cellRowRightText}>
                        {formatCurrency(parseFloat(specificOrder?.swatchPoint))}
                      </Text>
                    </View>
                    <View style={styles.cellRow}>
                      <Text style={styles.cellRowLeftText}>
                        Cone Weight Price
                      </Text>
                      <Text style={styles.cellRowRightText}>
                        {formatCurrency(
                          parseFloat(specificOrder?.grossConeWieghtPrice)
                        )}
                      </Text>
                    </View>
                    <View style={styles.cellRow}>
                      <Text style={styles.cellRowLeftText}>Other Charges</Text>
                      <Text style={styles.cellRowRightText}>
                        {formatCurrency(0)}
                      </Text>
                    </View>
                    <View style={styles.cellRow}>
                      <Text style={[styles.cellRowLeftText, { color: "blue" }]}>
                        Total Amount
                      </Text>
                      <Text
                        style={[styles.cellRowRightText, { color: "blue" }]}
                      >
                        {formatCurrency(
                          parseFloat(getGrossTotal()) +
                            parseFloat(packingCharges || 0) +
                            parseFloat(specificOrder.totalGst || 0) +
                            parseFloat(specificOrder?.shipmentCost || 0) -
                            parseFloat(
                              specificOrder?.grossConeWieghtPrice +
                                specificOrder?.swatchPoint || 0
                            )
                        )}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.paymentStatusContainer}>
                    <Text style={styles.paymentStatusText}>Payment Status</Text>
                    <View style={styles.paymentStatusValuePaid}>
                      <Text style={styles.paymentStatusValuePaidText}>
                        {specificOrder?.paymentStatus || "N/A"}
                      </Text>
                    </View>
                    <View style={styles.paymentStatusValueVerified}>
                      <Text style={styles.paymentStatusValueVerifiedText}>
                        {specificOrder?.paymentStatus === "PAID"
                          ? "VERIFIED"
                          : "NOT VERIFIED"}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <View>
                      <Text style={styles.headerText}>Payment Details</Text>
                    </View>
                    <View style={styles.paymentDeailsCellContainer}>
                      <Text style={styles.paymentDeailsCellHeader}>
                        Bank Name
                      </Text>
                      <View style={styles.paymentDeailsCellValue}>
                        <Text style={styles.paymentDeailsCellValueText}>
                          {specificOrder?.bankName || "N/A"}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.paymentDeailsCellContainer}>
                      <Text style={styles.paymentDeailsCellHeader}>
                        Deposit Amt.
                      </Text>
                      <View style={styles.paymentDeailsCellValue}>
                        <Text style={styles.paymentDeailsCellValueText}>
                          {formatCurrency(specificOrder?.depositAmount || 0)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.paymentDeailsCellContainer}>
                      <Text style={styles.paymentDeailsCellHeader}>UTR No</Text>
                      <View style={styles.paymentDeailsCellValue}>
                        <Text style={styles.paymentDeailsCellValueText}>
                          {specificOrder?.utrNo || "N/A"}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.paymentDeailsCellContainer}>
                      <Text style={styles.paymentDeailsCellHeader}>
                        Deposit Date
                      </Text>
                      <View style={styles.paymentDeailsCellValue}>
                        <Text style={styles.paymentDeailsCellValueText}>
                          {formatDate(specificOrder?.dateOfDeposit)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </>
              )}
            </View>
            <View style={styles.deliveryContainer}>
              <View
                style={{
                  flexDirection: "row",
                  padding: 1,
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.headerText}>Billed Products</Text>
                {specificOrder?.orderStatus !== "NEW" && variantId && (
                  <TouchableOpacity
                    onPress={() => {
                      setVisible(true);
                    }}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                      backgroundColor: "green",
                      borderRadius: 5,
                    }}
                  >
                    <Text style={{ color: "#fff", fontFamily: font.semiBold }}>
                      {returnStatus ? "View Returns" : "Process Return"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {specificOrder?.items?.map((row, index) => {
                return (
                  <View key={index}>
                    {specificOrder?.orderStatus === "DELIVERED" &&
                      specificOrder.orderType !== "SWATCH" &&
                      specificOrder.orderType !== "SAMPLE" && (
                        <Checkbox
                          status={
                            variantId === row?.id ? "checked" : "unchecked"
                          }
                          color={common.PRIMARY_COLOR}
                          onPress={() => {
                            setVariantId(row?.id);
                            setReturnStatus(row?.returnStatus);
                          }}
                        />
                      )}
                    <View style={styles.tableContainer}>
                      <View style={styles.cellRowBilledProducts}>
                        <View style={styles.cellRowLeftContainerBilledProducts}>
                          <Text style={styles.cellRowLeftTextBilledProducts}>
                            Product Name
                          </Text>
                        </View>
                        <Text style={styles.cellRowRightTextBilledProducts}>
                          {specificOrder.orderType !== "SWATCH"
                            ? row?.productVariant?.name
                            : row.productName}
                          {specificOrder.orderType !== "SWATCH"
                            ? `Order Kg: ${row.qty} kg`
                            : `Order Quantity: ${row.qty} point`}
                        </Text>
                      </View>
                      <View style={styles.cellRowBilledProducts}>
                        <View style={styles.cellRowLeftContainerBilledProducts}>
                          <Text style={styles.cellRowLeftTextBilledProducts}>
                            {specificOrder?.orderType !== "SWATCH"
                              ? "Rolls"
                              : "Points"}
                          </Text>
                        </View>

                        <Text style={styles.cellRowRightTextBilledProducts}>
                          {specificOrder.orderType !== "SWATCH"
                            ? row?.pickList
                              ? Math.ceil(
                                  row?.pickList
                                    ?.reduce(
                                      (total, item) =>
                                        total + (item?.noOfRoll || 0),
                                      0
                                    )
                                    .toFixed(2)
                                )
                              : "-"
                            : row.qty}
                        </Text>
                      </View>
                      <View style={styles.cellRowBilledProducts}>
                        <View style={styles.cellRowLeftContainerBilledProducts}>
                          <Text style={styles.cellRowLeftTextBilledProducts}>
                            Sell Price/Kg
                          </Text>
                        </View>
                        <Text style={styles.cellRowRightTextBilledProducts}>
                          Rs. {row.sellingPrice}
                        </Text>
                      </View>
                      <View style={styles.cellRowBilledProducts}>
                        <View style={styles.cellRowLeftContainerBilledProducts}>
                          <Text style={styles.cellRowLeftTextBilledProducts}>
                            Total Amt.
                          </Text>
                        </View>
                        <Text style={styles.cellRowRightTextBilledProducts}>
                          {(+row.qty * +row.sellingPrice).toFixed(2)}
                        </Text>
                      </View>
                      <View style={styles.cellRowBilledProducts}>
                        {specificOrder?.orderType !== "SWATCH" &&
                          specificOrder?.orderType !== "SAMPLE" && (
                            <View
                              style={styles.cellRowLeftContainerBilledProducts}
                            >
                              <Text
                                style={styles.cellRowLeftTextBilledProducts}
                              >
                                Return Status
                              </Text>
                            </View>
                          )}
                        {specificOrder?.orderType !== "SWATCH" &&
                          specificOrder?.orderType !== "SAMPLE" && (
                            <Text style={styles.cellRowRightTextBilledProducts}>
                              {row?.returnStatus ? "Returned" : "Not Returned"}
                            </Text>
                          )}
                      </View>
                    </View>
                  </View>
                );
              })}
              <View style={{ gap: 8, marginTop: 10 }}>
                <View style={styles.totalContainer}>
                  <Text style={styles.totalTextHeader}>TOTAL (Items):</Text>
                  <Text style={styles.totalTextDescription}>
                    {getGrossTotal() || 0}
                  </Text>
                </View>
                <View style={styles.totalContainer}>
                  <Text style={styles.totalTextHeader}>Packing Fee:</Text>
                  <Text style={styles.totalTextDescription}>
                    Rs.{packingCharges}
                  </Text>
                </View>
                <View style={styles.totalContainer}>
                  <Text style={styles.totalTextHeader}>Shipment Fee:</Text>
                  <Text style={styles.totalTextDescription}>
                    {specificOrder?.shipmentCost || 0}
                  </Text>
                </View>
                <View style={styles.totalContainer}>
                  <Text style={styles.totalTextHeader}>Wallet Amount:</Text>
                  <Text style={styles.totalTextDescription}>
                    {specificOrder?.swatchPoint || 0}
                  </Text>
                </View>
                <View style={styles.totalContainer}>
                  <Text style={styles.totalTextHeader}>Cone Weight Price:</Text>
                  <Text style={styles.totalTextDescription}>
                    {specificOrder?.grossConeWieghtPrice || 0}
                  </Text>
                </View>
                <View style={styles.totalContainer}>
                  <Text style={[styles.totalTextHeader, { color: "blue" }]}>
                    TOTAL(Excl.Taxes):
                  </Text>
                  <Text
                    style={[styles.totalTextDescription, { color: "blue" }]}
                  >
                    {(
                      parseFloat(getGrossTotal()) +
                      parseFloat(packingCharges) +
                      parseFloat(specificOrder?.shipmentCost || 0) -
                      parseFloat(
                        specificOrder?.grossConeWieghtPrice +
                          specificOrder?.swatchPoint || 0
                      )
                    ).toFixed(2)}
                  </Text>
                </View>
              </View>
              <View style={{ gap: 20, marginTop: 10 }}>
                <View style={styles.totalContainer}>
                  <Text style={styles.totalTextHeader}>IGST Charges:</Text>
                  <Text style={styles.totalTextDescription}>-</Text>
                </View>
                <View style={styles.totalContainer}>
                  <Text style={styles.totalTextHeader}>CGST Charges:</Text>
                  <Text style={styles.totalTextDescription}>
                    {(specificOrder?.totalGst / 2).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.totalContainer}>
                  <Text style={styles.totalTextHeader}>SGST Charges:</Text>
                  <Text style={styles.totalTextDescription}>
                    {(specificOrder?.totalGst / 2).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.totalContainer}>
                  <Text style={[styles.totalTextHeader, { color: "blue" }]}>
                    TOTAL AMOUNT:
                  </Text>
                  <Text
                    style={[styles.totalTextDescription, { color: "blue" }]}
                  >
                    {(
                      parseFloat(getGrossTotal()) +
                      parseFloat(packingCharges) +
                      parseFloat(specificOrder?.totalGst || 0) +
                      parseFloat(specificOrder?.shipmentCost || 0) -
                      parseFloat(
                        specificOrder?.grossConeWieghtPrice +
                          specificOrder?.swatchPoint || 0
                      )
                    ).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {
            <Modal
              visible={visible}
              animationType="slide"
              style={{ maxHeight: "75%" }}
              transparent={true}
              onRequestClose={() => setVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 5,
                    }}
                  >
                    <Text style={{ fontFamily: font.semiBold, fontSize: 18 }}>
                      Return DashBoard
                    </Text>
                    {/* Close Button */}
                    <TouchableOpacity
                      onPress={() => setVisible(false)}
                      style={styles.closeButton}
                    >
                      <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Return Component */}
                  <Return
                    item={
                      specificOrder?.items?.filter(
                        (i) => i.id === variantId
                      )?.[0]
                    }
                    setOrder={setSpecificOrder}
                    order={specificOrder}
                    handleChange={handleChange}
                    comfirmReturn={comfirmReturn}
                    returnModalClose={returnModalClose}
                  />
                </View>
              </View>
            </Modal>
          }
        </>
      )}
    </ScrollView>
  );
};

export default FabricOrderDetails;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 10,
    paddingBottom: 30,
    paddingHorizontal: 10,
    gap: 20,
  },
  headerContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: common.PRIMARY_COLOR,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 5,
  },
  deliveryContainerText: {
    fontFamily: font.regular,
    fontSize: 15,
  },
  deliveryContainer: {
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 15,
    gap: 10,
    paddingVertical: 20,
  } /** Stepper Styles */,
  stepperContainer: {
    marginTop: 10,
    marginLeft: 15,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    position: "relative",
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  iconCompleted: {
    backgroundColor: "green",
    borderColor: "green",
  },
  tableContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  stepLine: {
    position: "absolute",
    left: 11,
    top: 24,
    height: 40,
    width: 2,
    backgroundColor: "#ccc",
  },
  stepContent: {
    marginLeft: 15,
  },
  stepLabel: {
    fontSize: 16,
    fontFamily: font.semiBold,
    color: "gray",
  },
  stepLabelCompleted: {
    color: "black",
  },
  stepDescription: {
    fontSize: 14,
    fontFamilyL: font.regular,
    color: "gray",
    marginTop: 3,
  },
  contentImage: {
    height: 100,
    width: 100,
    borderRadius: 5,
  },
  contentContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  contentText: {
    width: "80%",
    fontFamily: font.regular,
    fontSize: 15,
  },
  contentColorText: {
    color: "#878787",
    fontFamily: font.semiBold,
    fontSize: 14,
  },
  contentPriceText: {
    fontFamily: font.medium,
    fontSize: 18,
  },
  cellRow: {
    flexDirection: "row",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    alignItems: "center",
    width: "100%",
    padding: 1,
  },
  cellRowBilledProducts: {
    flexDirection: "row",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    alignItems: "center",
    width: "100%",
  },
  cellRowLeftText: {
    padding: 10,
    alignSelf: "flex-start",
    maxWidth: "60%",
    minWidth: "60%",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    fontFamily: font.semiBold,
  },
  cellRowLeftContainerBilledProducts: {
    alignSelf: "flex-start",
    maxWidth: "40%",
    minWidth: "40%",
    fontFamily: font.regular,
  },
  cellRowLeftTextBilledProducts: {
    padding: 10,
    alignSelf: "flex-start",
    maxWidth: "100%",
    minWidth: "100%",
    fontFamily: font.semiBold,
  },
  cellRowRightText: {
    fontFamily: font.regular,
    padding: 10,
  },
  cellRowRightTextBilledProducts: {
    fontFamily: font.regular,
    padding: 10,
    borderLeftColor: "#ccc",
    borderLeftWidth: 1,
    width: "60%",
  },
  headerText: {
    fontFamily: font.regular,
    fontSize: 16,
  },
  paymentStatusText: {
    fontFamily: font.semiBold,
    fontSize: 16,
    paddingVertical: 10,
  },
  paymentStatusContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: "row",
  },
  paymentStatusValuePaid: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  paymentStatusValuePaidText: {
    fontFamily: font.semiBold,
    color: "#fff",
  },
  paymentStatusValueVerified: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#F4A261",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  paymentStatusValueVerifiedText: {
    fontFamily: font.semiBold,
    color: "#fff",
  },
  paymentDeailsCellContainer: {
    gap: 10,
    padding: 5,
  },
  billingProductsCellContainer: {
    gap: 10,
    padding: 5,
  },
  paymentDeailsCellValue: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
  },
  paymentDeailsCellHeader: {
    fontFamily: font.semiBold,
    fontSize: 16,
  },
  paymentDeailsCellValueText: {
    fontFamily: font.regular,
    fontSize: 16,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },
  totalTextDescription: {
    fontFamily: font.medium,
    fontSize: 16,
  },
  totalTextHeader: {
    fontFamily: font.semiBold,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: "90%",
    maxWidth: 600,
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
    shadowOpacity: 0.25, // iOS shadow
    shadowRadius: 3.5, // iOS shadow
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#ff4d4d",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
