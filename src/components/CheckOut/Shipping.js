import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { font } from "../../Common/Theme";
import Icon from "react-native-vector-icons/Feather";
import FIDropdown from "../../Common/FIDropdown";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import api from "../../Service/api";
import { common, storage } from "../../Common/Common";

const Shipping = ({
  dropdownValues,
  setSelectedAddresses,
  selectedAddresses,
}) => {
  const [isSelectAddressModalVisible, setIsSelectAddressModalVisible] =
    useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [modalHeader, setModalHeader] = useState("");
  const [delivery, setDelivery] = useState("");
  const [loginUser, setLoginUser] = useState(storage.getString("userId"));
  const [lastOrderByCustomer, setLastOrderByCustomer] = useState([]);
  // Hardcoded address data
  const addressList = [
    {
      id: 1,
      nickName: "Home Address",
      address: "123 Main St, Tirupur, Tamilnadu",
    },
    {
      id: 2,
      nickName: "Office Address",
      address: "456 Office Rd, Tirupur, Tamilnadu",
    },
    {
      id: 3,
      nickName: "Warehouse",
      address: "789 Industrial Area, Tirupur, Tamilnadu",
    },
  ];

  const openSelectAddressModal = () => {
    setIsSelectAddressModalVisible(true);
  };

  const closeSelectAddressModal = () => {
    setIsSelectAddressModalVisible(false);
  };

  const fetchAllProfile = async () => {
    try {
      const res = await api.get(`/customer/profile`);
      setCustomer(res?.response || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const fetchAllAddresses = async () => {
    try {
      const res = await api.get(
        `locations/verified?picked=${delivery === "PICKED BY CUSTOMER"}`
      );

      const finalres = res.response?.filter((g) => g.isGstVerified);
      setAddresses(finalres || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const getLastCustomerOrder = async () => {
    try {
      const res = await api.get(`order/get-last-customer/${loginUser}`);
      setLastOrderByCustomer(res.response);
    } catch (e) {
      console.log("Fail to Fetch Last customer", e);
    }
  };
  const handleSave = async () => {
    if (!validateAddress()) return;
    try {
      const res = await api.post(`customer/location`, {
        json: formAddressData,
      });
      fetchAllAddresses();
      closeSecondModal();
    } catch (error) {
      console.error("Error on adding address:", error);
    }
  };
  useEffect(() => {
    fetchAllProfile();
    getLastCustomerOrder();
    fetchAllAddresses();
  }, []);
  const renderSelectAddressModal = () => {
    return (
      <Modal
        visible={isSelectAddressModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeSelectAddressModal}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, {}]}>
            <View
              style={{
                gap: 16,
                flexDirection: "column",
              }}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderText}>
                  {modalHeader === "billLocation"
                    ? "Bill Local Address"
                    : modalHeader === "shipLocation"
                    ? "Ship Local Address"
                    : "Error"}
                </Text>
                <TouchableOpacity onPress={closeSelectAddressModal}>
                  <Icon name="x" size={20} color="#000" />
                </TouchableOpacity>
              </View>
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                style={{ maxHeight: 500 }}
                keyboardShouldPersistTaps="handled"
              >
                {addresses.length > 0 || addresses ? (
                  addresses.map((add, index) => (
                    <View
                      key={index}
                      style={{
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: "#ccc",
                      }}
                    >
                      <View style={styles.modalAddressContainer}>
                        <View style={styles.modalHeader}>
                          <Text style={styles.addressHeaderText}>
                            {add?.nickName}
                          </Text>
                          {lastOrderByCustomer[0]?.[
                            modalHeader === "billLocation" ? 0 : 1
                          ] === add?.id && (
                            <View style={styles.lastUsedContainer}>
                              <Text style={styles.lastUsedText}>Last Used</Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <View style={{ paddingHorizontal: 16 }}>
                        <Text style={styles.addressText}>{add?.address1}</Text>
                        <Text style={styles.addressText}>{add?.address2}</Text>
                        <Text style={styles.addressText}>{add?.country}</Text>
                      </View>
                      <View style={styles.contactContainer}>
                        <View style={styles.contachView}>
                          <Text style={styles.contactHeading}>
                            Contact Name
                          </Text>
                          <Text style={styles.contactDetails}>
                            {add?.nickName}
                          </Text>
                        </View>
                        <View style={styles.contachView}>
                          <Text style={styles.contactHeading}>
                            Contact Phone
                          </Text>
                          <Text style={styles.contactDetails}>
                            {add?.mobileNo}
                          </Text>
                        </View>
                        <View style={styles.contachView}>
                          <Text style={styles.contactHeading}>
                            Contact Email
                          </Text>
                          <Text style={styles.contactDetails}>
                            {add?.email}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.editButton}>
                          <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.useAddressButton}
                          onPress={() => {
                            if (modalHeader === "shipLocation") {
                              setSelectedAddresses((prev) => ({
                                ...prev,
                                shipLocation: add,
                              }));
                            } else if (modalHeader === "billLocation") {
                              setSelectedAddresses((prev) => ({
                                ...prev,
                                billLocation: add,
                              }));
                            }
                            closeSelectAddressModal();
                          }}
                        >
                          <Text style={styles.useAddressButtonText}>
                            Use This Address
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.noAddressContainer}>
                    <Text style={styles.errorNoAddressText}>
                      Please contact the salesperson for address information.
                    </Text>
                    <Text style={styles.noAddressText}>
                      Name : {customer?.salesMan?.name}
                    </Text>
                    <Text style={styles.noAddressText}>
                      Phone Number : {customer?.salesMan?.mobile}
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={styles.container}
    >
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Shipping</Text>
      </View>
      <View style={[styles.termsContainer, { zIndex: 2 }]}>
        <View
          style={[
            styles.flexRow,
            {
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
              justifyContent: "space-between",
            },
          ]}
        >
          <Text style={styles.contentHeading}>Terms</Text>
          <Text style={styles.descriptionText}>
            Ships from Tirupur, Tamilnadu
          </Text>
        </View>
        <View style={[styles.flexRow]}>
          <View style={styles.deliveryMethodContainer}>
            <Text style={styles.deliveryText}>Delivery Method</Text>
            <View>
              <FIDropdown
                values={dropdownValues}
                defaultValue={dropdownValues[0]}
                onSelect={(value) => setDelivery(value)}
                dropdownTextStyle={{ fontFamily: font.regular, fontSize: 14 }}
                style={{ minWidth: 150, maxWidth: 150 }}
                dropdownListContainer={{ maxWidth: 150 }}
                optionsTextStyle={{ fontFamily: font.regular, fontSize: 12 }}
              />
            </View>
          </View>
        </View>
      </View>
      <View style={[styles.termsContainer, { zIndex: 1 }]}>
        <View
          style={[
            styles.flexRow,
            {
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
              justifyContent: "space-between",
            },
          ]}
        >
          <Text style={styles.contentHeading}>Addresses</Text>
        </View>
        <View
          style={[
            styles.flexRow,
            {
              gap: 16,
              flexDirection: "column",
            },
          ]}
        >
          <View style={styles.outerAddressContainer}>
            <Text style={styles.selectAddressText}>Billing</Text>
            <View style={styles.innerAddressContainer}>
              <TouchableOpacity
                onPress={() => {
                  openSelectAddressModal();
                  setModalHeader("billLocation");
                }}
                style={{ justifyContent: "center", alignItems: "center" }}
              >
                <View style={styles.iconContainer}>
                  <Icon name="plus" size={24} color="#fff" />
                </View>
                <Text style={styles.selectAddressText}>
                  {selectedAddress
                    ? selectedAddress.nickName
                    : "Select Address"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.outerAddressContainer}>
            <Text style={styles.selectAddressText}>Shipping</Text>
            <View style={styles.innerAddressContainer}>
              <TouchableOpacity
                onPress={() => {
                  openSelectAddressModal();
                  setModalHeader("shipLocation");
                }}
                style={{ justifyContent: "center", alignItems: "center" }}
              >
                <View style={styles.iconContainer}>
                  <Icon name="plus" size={24} color="#fff" />
                </View>
                <Text style={styles.selectAddressText}>Select Address</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {renderSelectAddressModal()}
    </ScrollView>
  );
};

export default Shipping;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 8,
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 16,
    gap: 16,
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: "row",
    paddingVertical: 16,
    alignItems: "center",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  headerText: {
    fontFamily: font.semiBold,
    fontSize: 22,
  },
  termsContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 1,
  },
  contentHeading: {
    fontFamily: font.semiBold,
    fontSize: 18,
  },
  descriptionText: {
    fontFamily: font.semiBold,
    color: "#788191",
    fontSize: 12,
  },
  deliveryText: {
    fontFamily: font.regular,
    fontSize: 14,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  deliveryMethodContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 15,
    justifyContent: "space-between",
    flex: 1,
  },
  addressContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  outerAddressContainer: {
    borderColor: "#ccc",
    paddingVertical: 5,
    width: "100%",
    minHeight: 200,
    gap: 16,
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  innerAddressContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    paddingVertical: 5,
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    minHeight: 200,
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  selectAddressText: {
    fontFamily: font.semiBold,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
    width: "90%",
    maxHeight: "80%",
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 20,
  },
  modalHeader: {
    fontFamily: font.semiBold,
    fontSize: 18,
    marginBottom: 10,
    flexDirection: "row",
    textAlign: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  addressText: {
    fontFamily: font.regular,
    fontSize: 16,
    width: "100%",
    color: "#333",
  },
  modalHeaderText: {
    fontFamily: font.semiBold,
    width: "90%",
    fontSize: 16,
  },
  modalAddressContainer: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  addressHeaderText: {
    fontFamily: font.semiBold,
    fontSize: 14,
    color: "#000",
  },
  lastUsedContainer: {
    borderWidth: 1,
    borderColor: "#327EDA",
    borderRadius: 5,
    padding: 2,
  },
  lastUsedText: {
    fontFamily: font.semiBold,
    fontSize: 12,
    color: "#327EDA",
  },
  contactContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  contachView: {
    flexDirection: "row",
  },
  contactHeading: {
    width: "45%",
    fontSize: 12,
    fontFamily: font.semiBold,
    color: "#989FAB",
  },
  contactDetails: {
    width: "55%",
    fontSize: 12,
    fontFamily: font.semiBold,
    color: "#000",
  },
  buttonContainer: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButton: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderColor: common.PRIMARY_COLOR,
    borderWidth: 1,
    borderRadius: 5,
    width: "45%",
  },
  editButtonText: {
    fontSize: 12,
    fontFamily: font.semiBold,
    color: "#989FAB",
    textAlign: "center",
  },
  useAddressButton: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderColor: common.PRIMARY_COLOR,
    borderWidth: 1,
    borderRadius: 5,
    width: "45%",
    backgroundColor: common.PRIMARY_COLOR,
  },
  useAddressButtonText: {
    fontSize: 12,
    fontFamily: font.semiBold,
    color: "#fff",
    textAlign: "center",
  },
  noAddressContainer: {
    paddingHorizontal: 10,
  },
  errorNoAddressText: {
    color: "red",
    fontFamily: font.semiBold,
    fontSize: 14,
  },
  noAddressText: {
    color: "#000",
    fontFamily: font.semiBold,
    fontSize: 14,
  },
});
