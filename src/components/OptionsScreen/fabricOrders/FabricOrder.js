import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { font } from "../../../Common/Theme";
import Icon from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import api from "../../../Service/api";
import _ from 'lodash';
import { backendUrl } from "../../../Common/Common";
import { TextInput } from "react-native-paper";

const FabricOrder = () => {
  const initialTransaction = {
    bankName: '',
    utrNo: '',
    depositAmount: '',
    dateOfDeposit: null,
    customerOrderNo: ''
  }
  const orderOptions = ["NEW", "CONFIRMED", "PACKED", "PAID", "INVOICED", "SHIPPED", "DELIVERED", "CANCELLED"];
  const [orderStatus, setOrderStatus] = useState(orderOptions[0]);
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded]);
  const buttonRef = useRef(null);
  const [orders, setOrders] = useState([]);
  const [modalOpened, setModalOpened] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(initialTransaction);
  const [count, setCount] = useState(0);
  const [isTransactionUploaded, setIsTransactionUploaded] = useState({})
  const [activeCancelOrder, setActiveCancelOrder] = useState(null);
  const [editOrder, setEditOrder] = useState({});
  const [groupList, setGrouplist] = useState({});
  const navigation = useNavigation();

  const onSelect = (item) => {
    setOrderStatus(item);
    setExpanded(false);
  };


  useEffect(() => {
    fetchAllOrders();
    fetchCountInvoice();
  }, [orderStatus]);

  const fetchAllOrders = async () => {
    try {
      const res = await api.get('order/all');
      const filteredData = res?.response?.filter(order => order?.orderStatus === orderStatus) || [];
      const sorted = _.sortBy(filteredData, 'createdDate').reverse();
      setOrders(sorted);
      setGrouplist(_.groupBy(sorted, "orderNo"));
      const pack = res?.response?.filter(order => order?.orderStatus === 'PACKED' || order?.orderStatus === 'CONFIRMED') || [];
      pack.forEach(order => setIsTransactionUploaded(prev => ({
        ...prev, orderNo: order?.bankName && order?.utrNo && order?.depositAmount && order?.dateOfDeposit
      })));
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchCountInvoice = async () => {
    const res = await api.get(`order/payment-pending`);
    setCount(res?.response);
  }

  const getDeliveryStatusMessage = (status) => {
    switch (status) {
      case 'NEW':
        return 'Your item has been placed';
      case 'CONFIRMED':
        return 'Your item has been confirmed';
      case 'PACKED':
        return 'Your item has been packed';
      case 'PAID':
        return 'Your payment has been paid';
      case 'INVOICED':
        return 'Your item has been invoiced';
      case 'SHIPPED':
        return 'Your item has been shipped';
      case 'DELIVERED':
        return 'Your item has been delivered';
      case 'CANCELLED':
        return 'Your item has been cancelled';
      default:
        return 'Status not available';
    }
  };

  const handleRowClick = (orderNo) => {
    // navigation(`/order-Details?orderNo=${orderNo}`, { state: orderStatus });
    console.log('hi');

  };

  const handleTrackingIdSubmit = async () => {
    const { bankName, utrNo, depositAmount, dateOfDeposit } = transactionDetails;
    if (!bankName || !utrNo || !depositAmount || !dateOfDeposit) return;

    editOrder.bankName = bankName
    editOrder.utrNo = utrNo
    editOrder.depositAmount = depositAmount
    editOrder.dateOfDeposit = dateOfDeposit

    try {
      await api.post('order/update-payment', editOrder);
      setModalOpened(false);
      await fetchAllOrders();
      fetchCountInvoice();
      setTransactionDetails(initialTransaction);
    } catch (error) {
      console.error('Error updating order details:', error);
    }
  };

  const transactionFields = [
    { label: 'Bank Name', name: 'bankName', placeholder: 'Enter bank name' },
    { label: 'UTR No', name: 'utrNo', placeholder: 'Enter UTR no' },
    { label: 'Deposit Amount', name: 'depositAmount', placeholder: 'Enter deposit amount', disabled: true },
  ];

  const handleOrderCancelClick = (orderNo) => {
    setActiveCancelOrder(orderNo);
  };

  const handleConfirmCancel = async (orderNo) => {
    try {
      await api.post("order/confirm-order", { orderNo: orderNo, orderStatus: "CANCELLED" });
      setActiveCancelOrder(null);
      fetchAllOrders();
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  const handleCloseCancelPopup = () => {
    setActiveCancelOrder(null);
  };

  const handleTransactionDetailChange = (name, value) => {
    setTransactionDetails(prevDetails => ({
      ...prevDetails, [name]: value
    }))
  }

  return (
    <View style={styles.fabricContainer}>
      <View style={styles.fabricInnerContainer}>
        <Text style={styles.fabricHeader}>Fabric Orders</Text>
        <View style={styles.fabricMainContainer}>
          <View style={styles.fabricDropdownContainer}>
            <Text style={styles.fabricOrderLabel}>{orderStatus}</Text>
            <View style={styles.dropdownInputContainer} ref={buttonRef}>
              <TouchableOpacity
                style={styles.dropdownSelectField}
                activeOpacity={0.8}
                onPress={toggleExpanded}
              >
                <Text style={styles.dropdownPlaceholderText}>{orderStatus}</Text>
                <Icon style={styles.dropdownPlaceholderText} name={expanded ? 'caretup' : 'caretdown'} />
              </TouchableOpacity>
              {expanded && (
                <View style={styles.dropdownMenuContainer}>
                  <ScrollView nestedScrollEnabled>
                    {orderOptions?.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={0.8}
                        onPress={() => onSelect(item)}
                        style={styles.dropdownItem}
                      >
                        <View style={orderStatus === item ? [styles.dropdownItemContainer, { backgroundColor: '#ffcbc6', }] : styles.dropdownItemContainer}>
                          <Text style={orderStatus === item ? [styles.dropdownItemLabelText, { color: '#ff6f61' }] : styles.dropdownItemLabelText}>{item}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
          {count > 0 && (
            <Text style={styles.packedInfo}>
              {count} orders are awaiting Packing. Please review the Packed details and click 'Upload Transaction' to enter the payment details.
            </Text>
          )}
          <View style={styles.fabricDetailsContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {Object.keys(groupList).length > 0 ? (
                Object.keys(groupList).map(orderNo => (
                  <View key={orderNo} style={{ marginTop: '2rem' }}>
                    {groupList[orderNo].map(order => (
                      order.items.map((item, itemIndex) => (
                        order.orderStatus === 'PACKED' && itemIndex === 0 && (
                          <View key={order.orderNo}>
                            <Modal
                              visible={activeCancelOrder === order.orderNo}
                              transparent={true}
                              animationType="slide"
                              onRequestClose={handleCloseCancelPopup}
                            >
                              <View style={styles.modalBackground}>
                                <View style={styles.modalContainer}>
                                  <View style={styles.header}>
                                    <Text style={styles.editHeaderLabel}>Are you sure you want to cancel?</Text>
                                    <Icon name="close" size={24} onPress={handleCloseCancelPopup} />
                                  </View>
                                  <Text style={styles.modalMessage}>
                                    Are you sure you want to cancel this order? Once canceled, this action cannot be undone.
                                  </Text>
                                  <View style={styles.buttonsContainer}>
                                    <TouchableOpacity style={styles.cancelButton} onPress={handleCloseCancelPopup}>
                                      <Text style={styles.buttonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.confirmButton} onPress={() => handleConfirmCancel(order.orderNo)}>
                                      <Text style={styles.buttonText}>Confirm</Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                            </Modal>
                          </View>
                        )
                      ))
                    ))}
                    <Text style={styles.orderNumber}>{orderNo}</Text>
                    {
                      groupList[orderNo].map(order => (
                        order.items.map((item, index) => (
                          <TouchableOpacity key={index} style={styles.fabricOrderDetails} onPress={() => handleRowClick(orderNo)}>
                            <View style={styles.fabricOrderInfo}>
                              <Image source={{ uri: `${backendUrl}${item?.image?.replace("/api", "")}` }} alt={item?.productVariant?.name} style={styles.fabricImage} />
                              <View style={styles.fabricOrderVariantInfo}>
                                <Text style={styles.fabricOrderVariantName}>{item?.productVariant?.name}</Text>
                                <Text style={styles.fabricOrderType}>{order?.orderType}</Text>
                                <Text style={styles.fabricOrderText}>{order?.orderType !== 'SWATCH' ? 'Color' : 'Product Name'} : {order?.orderType !== 'SWATCH' ? `${item?.productVariant?.variants.filter(variant => variant?.type === 'Colour')[0]?.value || 'N/A'}` : `${item?.productName || 'N/A'}`}</Text>
                              </View>
                            </View>
                            <View style={{ borderWidth: 0.5, borderColor: 'silver', marginTop: 15, }} />
                            <View style={styles.fabricOrderPriceInfo}>
                              <Text style={styles.fabricPrice}>₹ {(order?.grossTotal + (order?.shipmentCost || 0) + order?.totalGst + (order?.packing?.packingCharges || 0)).toFixed(2) || 0}</Text>
                              <View style={styles.fabricOrderStatusContainer}>
                                <View style={styles.statusContainer}>
                                  <View style={styles.statusIcon} />
                                  <Text style={styles.fabricOrderStatus}>{order?.orderStatus}</Text>
                                </View>
                                <Text style={styles.fabricStatusText}>{getDeliveryStatusMessage(order?.orderStatus)}</Text>
                              </View>
                            </View>
                            {groupList[orderNo].map((order, index) => (
                              ((order.orderStatus === 'CONFIRMED' && order.paymentBefore === true) || order.orderStatus === 'PACKED')
                              && (
                                <View style={styles.orderConfirmBtnContainer} key={index}>
                                  <TouchableOpacity style={styles.orderCancelButton} onPress={() => handleOrderCancelClick(order?.orderNo)}>
                                    <Text style={styles.orderConfirmBtnText}>Cancel Order</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity style={order?.utrNo ? [styles.orderConfirmButton, { backgroundColor: '#e3e3e3' }] : styles.orderConfirmButton}
                                    onPress={() => {
                                      setEditOrder(order);
                                      setModalOpened(true);
                                      setTransactionDetails(prevDetails => ({
                                        ...prevDetails, depositAmount: Number(order?.grossTotal) + Number(order.packing?.packingCharges || 0) + Number(order?.totalGst) + Number(order?.shipmentCost)
                                      }))
                                    }}
                                    disabled={order?.utrNo ? true : false}
                                  >
                                    <Text style={styles.orderConfirmBtnText}>{isTransactionUploaded[orderNo] ? "Transaction Uploaded" : "Upload Transaction"}</Text>
                                  </TouchableOpacity>
                                </View>
                              )
                            ))}
                          </TouchableOpacity>
                        ))
                      ))
                    }
                  </View>
                ))
              ) : (
                <Text style={styles.orderNotFound}>No orders found for {orderStatus} status.</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalOpened}
        onRequestClose={() => {
          setTransactionDetails(initialTransaction);
          setModalOpened(false);
          handleCloseCancelPopup();
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.editHeaderLabel}>Upload Transaction Details</Text>
              <Icon name="close" size={24} onPress={() => { setModalOpened(false) }} />
            </View>
            {transactionFields.map((field, index) => (
              <View key={index} style={styles.inputFieldContainer}>
                <Text style={styles.inputFieldText}>{field.label}</Text>
                <TextInput
                  key={field.name}
                  placeholder={field.placeholder}
                  disabled={field.disabled}
                  value={field.name === 'depositAmount' ? parseFloat(transactionDetails[field.name]).toFixed(2) : transactionDetails[field.name]}
                  onChangeText={(value) => handleTransactionDetailChange(field.name, value)}
                  mt="xs"
                  style={styles.inputField}
                />
              </View>
            ))}
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputFieldText}>Deposit of Date</Text>
              <TextInput
                value={transactionDetails?.dateOfDeposit || ''}
                onChangeText={(value) => handleTransactionDetailChange('dateOfDeposit', value)}
                max={new Date().toISOString().split('T')[0]}
                style={styles.inputField}
              />
            </View>
            <TouchableOpacity style={
              (!transactionDetails?.bankName ||
                !transactionDetails?.utrNo ||
                !transactionDetails?.depositAmount ||
                !transactionDetails?.dateOfDeposit) ?
                [styles.confirmButton, {
                  backgroundColor: "#e3e3e3"
                }] : styles.confirmButton}
              onPress={() => handleTrackingIdSubmit()}
              disabled={
                !transactionDetails?.bankName ||
                !transactionDetails?.utrNo ||
                !transactionDetails?.depositAmount ||
                !transactionDetails?.dateOfDeposit
              }
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FabricOrder;

const styles = StyleSheet.create({
  fabricContainer: {
    backgroundColor: "#F8F8F8",
    paddingVertical: 50,
    flex: 1,
  },
  fabricInnerContainer: {
    padding: 15,
    paddingBottom: 60,
  },
  fabricHeader: {
    fontSize: 26,
    fontFamily: font.bold,
  },
  fabricMainContainer: {
    marginTop: 20,
    marginBottom: 90,
    flexDirection: 'column',
  },
  fabricDropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fabricOrderLabel: {
    width: '40%',
    fontSize: 18,
    fontFamily: font.bold,
  },
  dropdownInputContainer: {
    width: '60%',
  },
  dropdownSelectField: {
    height: 50,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 15,
  },
  dropdownPlaceholderText: {
    fontSize: 18,
    color: '#ccc',
    opacity: 0.8,
    fontFamily: font.bold,
  },
  dropdownMenuContainer: {
    position: 'absolute',
    top: 53,
    zIndex: 999,
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownItemContainer: {
    gap: 5,
    padding: 15,
    borderRadius: 8,
  },
  dropdownItemLabelText: {
    fontSize: 16,
    fontFamily: font.semiBold,
  },
  packedInfo: {
    fontSize: 18,
    fontFamily: font.regular,
    lineHeight: 25,
    marginTop: 20,
  },
  fabricDetailsContainer: {
    marginVertical: 20,
    flexDirection: 'column',
  },
  orderNumber: {
    fontSize: 18,
    fontFamily: font.bold,
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  fabricOrderDetails: {
    padding: 10,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: 'silver',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 10,
    marginVertical: 10,
  },
  fabricOrderInfo: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  fabricImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  fabricOrderVariantInfo: {
    gap: 8,
  },
  fabricOrderVariantName: {
    fontSize: 16,
    flexWrap: 'wrap',
    fontFamily: font.bold,
    width: '70%',
    lineHeight: 20,
  },
  fabricOrderType: {
    color: '#c67f06',
    fontSize: 14,
    fontFamily: font.semiBold,
  },
  fabricOrderText: {
    color: '#878787',
    fontSize: 14,
    fontFamily: font.regular,
  },
  fabricOrderPriceInfo: {
    flexDirection: 'row',
    gap: 5,
    paddingVertical: 10,
  },
  fabricPrice: {
    width: '38%',
    fontSize: 14,
    fontFamily: font.regular,
  },
  fabricOrderStatusContainer: {
    flexDirection: 'column',
    gap: 5,
    width: '62%',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  statusIcon: {
    backgroundColor: 'green',
    width: 10,
    height: 10,
    borderRadius: 25,
  },
  fabricOrderStatus: {
    fontSize: 14,
    fontFamily: font.semiBold,
  },
  fabricStatusText: {
    fontSize: 14,
    fontFamily: font.regular,
  },
  orderNotFound: {
    fontSize: 18,
    fontFamily: font.medium,
  },


  // Modal Styles
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    gap: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  editHeaderLabel: {
    fontSize: 18,
    fontFamily: font.bold,
    color: '#333',
  },
  modalMessage: {
    marginVertical: 15,
    fontSize: 16,
    fontFamily: font.regular,
    color: '#555',
    textAlign: 'center',
  },
  inputField: {
    height: 50,
    width: '94%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  inputFieldContainer: {
    gap: 10,
  },
  inputFieldText: {
    fontSize: 16,
    fontFamily: font.semiBold,
  },


  //Button styles
  // modal one btn styles
  buttonsContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#228BE6',
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF0000',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: font.bold,
  },

  // modal two btn styles
  orderConfirmBtnContainer: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  orderCancelButton: {
    padding: 10,
    backgroundColor: '#FF0000',
    borderRadius: 5,
    marginTop: 10,
  },
  orderConfirmButton: {
    padding: 10,
    backgroundColor: '#228BE6',
    borderRadius: 5,
    marginTop: 10,
  },
  orderConfirmBtnText: {
    color: 'white',
    fontSize: 16,
    fontFamily: font.bold,
  },
});
