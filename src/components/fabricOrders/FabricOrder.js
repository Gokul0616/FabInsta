import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { font } from "../../Common/Theme";
import Icon from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import api from "../../Service/api";
import _ from 'lodash';
import { backendUrl } from "../../Common/Common";

const FabricOrder = () => {
  const orderOptions = ["NEW", "CONFIRMED", "PACKED", "PAID", "INVOICED", "SHIPPED", "DELIVERED", "CANCELLED"];
  const [orderStatus, setOrderStatus] = useState(orderOptions[0]);
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded]);
  const buttonRef = useRef(null);
  const [orders, setOrders] = useState([]);
  const [modalOpened, setModalOpened] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState({
    bankName: '',
    utrNo: '',
    depositAmount: '',
    dateOfDeposit: null,
    customerOrderNo: ''
  })
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

  // const handleRowClick = (orderNo) => {
  //   navigation(`/order-Details?orderNo=${orderNo}`, { state: orderStatus });
  // };

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
                        <View style={styles.dropdownItemContainer}>
                          <Text style={styles.dropdownItemLabelText}>{item}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
          <View style={styles.fabricDetailsContainer}>
            <ScrollView>
              {Object.keys(groupList).length > 0 ? (
                Object.keys(groupList).map(orderNo => (
                  <View key={orderNo} style={{ marginTop: '2rem' }}>
                    <Text style={styles.orderNumber}>{orderNo}</Text>
                    {
                      groupList[orderNo].map(order => (
                        order.items.map((item, index) => (
                          <View key={index} style={styles.fabricOrderDetails}>
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
                                <Text style={styles.fabricStatusText}>Your item has been confirmed</Text>
                              </View>
                            </View>
                          </View>
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
      </View >
    </View >
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
    marginBottom: 80,
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
    padding: 10,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 15,
  },
  dropdownItemContainer: {
    gap: 5,
  },
  dropdownItemLabelText: {
    fontSize: 16,
    fontFamily: font.medium,
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
  orderNotFound:{
    fontSize: 18,
    fontFamily: font.medium,
  }
});
