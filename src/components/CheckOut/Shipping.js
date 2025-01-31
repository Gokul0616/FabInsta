import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import AlertBox from "../../Common/AlertBox";
import { common, storage } from "../../Common/Common";
import { FiButton } from "../../Common/FiButton";
import FIDropdown from "../../Common/FIDropdown";
import { FiInput } from "../../Common/FiInput";
import { font } from "../../Common/Theme";
import api from "../../Service/api";
import statesAndDistricts from "../../Common/StatesAndDistricts.json";
import axios from "axios";

const Shipping = ({
  dropdownValues,
  setSelectedAddresses,
  cartData,
  handleNextStep,
  delivery,
  setDelivery,
  combo,
  cartInfo,
  selectedAddresses,
}) => {
  const [isSelectAddressModalVisible, setIsSelectAddressModalVisible] =
    useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedAddressEdit, setSelectedAddressEdit] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [customer, setCustomer] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [loginUser, setLoginUser] = useState(storage.getString("userId"));
  const [isFullScreenLoading, setIsFullScreenLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [lastOrderByCustomer, setLastOrderByCustomer] = useState([]);
  const [errorsEditAddress, setErrorsEditAddress] = useState({});

  const [errors, setErrors] = useState({
    billLocation: "",
    shipLocation: "",
    deliveryMethod: "",
  });
  const [isError, setIsError] = useState({
    message: "",
    heading: "",
    isRight: false,
    rightButtonText: "OK",
    triggerFunction: () => {},
    setShowAlert: () => {},
    showAlert: false,
  });
  const handleStateChange = (state) => {
    setSelectedState(state);
    setSelectedDistrict("");
    setSelectedAddressEdit({ ...selectedAddressEdit, state });
  };
  const handleDistrictChange = (city) => {
    setSelectedDistrict(city);
    setSelectedAddressEdit({ ...selectedAddressEdit, city });
  };
  const closeAlert = () => {
    setIsError((prev) => ({ ...prev, showAlert: false }));
  };
  const validateAddress = () => {
    const newErrors = {};

    if (!selectedAddressEdit?.nickName)
      newErrors.nickName = "Nickname is required";
    if (!/^[a-zA-Z\s]+$/.test(selectedAddressEdit?.nickName))
      newErrors.nickName = "Nickname must contain only letters";
    if (!selectedAddressEdit?.address1)
      newErrors.address1 = "Street address is required";
    if (!selectedAddressEdit?.city) newErrors.city = "City is required";
    if (!/^[a-zA-Z\s]+$/.test(selectedAddressEdit?.city))
      newErrors.city = "City must contain only letters";
    if (!selectedAddressEdit?.state) newErrors.state = "State is required";
    if (!/^[a-zA-Z\s]+$/.test(selectedAddressEdit?.state))
      newErrors.state = "State must contain only letters";
    if (
      !selectedAddressEdit?.pincode ||
      !/^\d{5,9}$/.test(selectedAddressEdit?.pincode)
    )
      newErrors.pincode = "Valid postal code is required";
    if (!selectedAddressEdit?.country)
      newErrors.country = "Country is required";
    if (!/^[a-zA-Z\s]+$/.test(selectedAddressEdit?.country))
      newErrors.country = "Country must contain only letters";
    if (
      !selectedAddressEdit?.mobileNo ||
      !/^\+?\d{10,15}$/.test(selectedAddressEdit?.mobileNo) ||
      selectedAddressEdit?.mobileNo.length !== 10
    )
      newErrors.mobileNo = "Valid phone number is required";
    if (
      !selectedAddressEdit?.email ||
      !/\S+@\S+\.\S+/.test(selectedAddressEdit?.email)
    )
      newErrors.email = "Valid email is required";
    if (!selectedAddressEdit?.gstNo || !selectedAddressEdit?.isGstVerified)
      newErrors.gstNo = "Enter Valid GST number";

    setErrorsEditAddress({ ...newErrors });

    return Object.keys(newErrors).length === 0;
  };

  const checkAndSetGstNo = async (value) => {
    if (value?.length > 15) return;
    if (!value || value.length !== 15) {
      setSelectedAddressEdit((prev) => ({
        ...prev,
        gstNo: value,
        isGstVerified: false,
      }));
      return;
    }
    setLoading(true);
    setSelectedAddressEdit((prev) => ({ ...prev, gstNo: value }));
    try {
      const res = await axios.get(
        `http://sheet.gstincheck.co.in/check/b1fe6c473486db147eec1efebc90f698/${value}`
      );
      setCompanyName(res.data.data.tradeNam);
      setSelectedAddressEdit((prev) => ({
        ...prev,
        isGstVerified: res.data.flag,
      }));
    } catch (error) {
      console.error("Error fetching GSTIN:", error);
      setSelectedAddressEdit((prev) => ({
        ...prev,
        isGstVerified: false,
      }));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (selectedAddresses.billLocation) {
      setErrors((prev) => ({ ...prev, billLocation: "" }));
    }

    if (selectedAddresses.shipLocation) {
      setErrors((prev) => ({ ...prev, shipLocation: "" }));
    }

    if (delivery) {
      setErrors((prev) => ({ ...prev, deliveryMethod: "" }));
    }
  }, [
    selectedAddresses.billLocation,
    selectedAddresses.shipLocation,
    delivery,
  ]);

  const closeSelectAddressModal = () => {
    setIsSelectAddressModalVisible(false);
  };
  const fetchAllProfile = async () => {
    try {
      setIsFullScreenLoading(true);
      const res = await api.get(`/customer/profile`);
      setCustomer(res?.response || []);
    } catch (error) {
      setIsError({
        message:
          error.response?.data?.message || "An Unexpected error occurred",
        heading: "Error",
        isRight: false,
        rightButtonText: "OK",
        triggerFunction: () => {},
        setShowAlert: () => {
          isError.setShowAlert(false);
        },
        showAlert: true,
      });
      console.error("Error fetching products:", error);
    } finally {
      setIsFullScreenLoading(false);
    }
  };
  const fetchAllAddresses = async () => {
    try {
      setIsFullScreenLoading(true);

      const res = await api.get(
        `locations/verified?picked=${delivery === "PICKED BY CUSTOMER"}`
      );
      const finalres = res.response?.filter((g) => g.isGstVerified);
      setAddresses(finalres || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setIsError({
        message:
          error.response?.data?.message || "An Unexpected error occurred",
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

  const getLastCustomerOrder = async () => {
    try {
      setIsFullScreenLoading(true);

      const res = await api.get(`order/get-last-customer/${loginUser}`);
      setLastOrderByCustomer(res.response);
    } catch (e) {
      console.log("Fail to Fetch Last customer", e);
      setIsError({
        message:
          error.response?.data?.message || "An Unexpected error occurred",
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
  const handleSave = async () => {
    if (!validateAddress()) return;

    try {
      setIsFullScreenLoading(true);

      const res = await api.post(`customer/location`, selectedAddressEdit);
      fetchAllAddresses();
      closeEditModal();
    } catch (error) {
      console.error("Error on adding address:", error);
      setIsError({
        message:
          error.response?.data?.message || "An Unexpected error occurred",
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

  const getCartType = () => {
    if (cartData[0]?.cartType === "SAMPLE") {
      return "Sample Cart";
    } else if (cartData[0]?.cartType === "SWATCH") {
      return "Swatch Cart";
    } else if (combo) {
      return "Combo Cart";
    } else {
      return "Wholesale Cart";
    }
  };
  const handlePress = () => {
    let valid = true;
    if (delivery === dropdownValues[0] || !delivery) {
      valid = false;
      setErrors((prev) => ({
        ...prev,
        deliveryMethod: "Delivery Method is Required",
      }));
    }
    if (selectedAddresses.billLocation === null) {
      valid = false;
      setErrors((prev) => ({
        ...prev,
        billLocation: "Billing Location is Required",
      }));
    }
    if (selectedAddresses.shipLocation === null) {
      valid = false;
      setErrors((prev) => ({
        ...prev,
        shipLocation: "Shipping Location is Required",
      }));
    }
    if (valid) {
      handleNextStep();
    }
  };
  useEffect(() => {
    fetchAllProfile();
    getLastCustomerOrder();
    fetchAllAddresses();
  }, []);

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setSelectedAddressEdit(null);
    setErrorsEditAddress({});
  };
  const renderEditModal = () => {
    return (
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}>
        <Modal
          visible={isEditModalVisible}
          transparent
          animationType="slide"
          style={{
            flex: 1,
            maxHeight: "80%",
          }}
          onRequestClose={closeEditModal}
        >
          <View style={styles.modalContainer2}>
            <View style={[styles.modalContent2, { maxHeight: "80%" }]}>
              <ScrollView
                contentContainerStyle={styles.scrollContent2}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.modalHeader2}>Edit Address</Text>
                <View style={{ marginBottom: 10 }}>
                  <>
                    <Text style={styles.inputLabel2}>Nickname</Text>
                    <FiInput
                      style={[
                        styles.input2,
                        errorsEditAddress.nickName && styles.errorInput2,
                      ]}
                      value={selectedAddressEdit?.nickName}
                      onChangeText={(text) => {
                        setSelectedAddressEdit({
                          ...selectedAddressEdit,
                          nickName: text,
                        });
                      }}
                      placeholder="Nickname"
                    />
                  </>
                  {errorsEditAddress.nickName && (
                    <Text style={styles.errorText2}>
                      {errorsEditAddress.nickName}
                    </Text>
                  )}
                </View>
                <View style={{ marginBottom: 10 }}>
                  <>
                    <Text style={styles.inputLabel2}>Nickname</Text>
                    <FiInput
                      style={[
                        styles.input2,
                        errorsEditAddress.country && styles.errorInput2,
                      ]}
                      value={selectedAddressEdit?.country}
                      onChangeText={(text) => {
                        setSelectedAddressEdit({
                          ...selectedAddressEdit,
                          country: text,
                        });
                      }}
                      placeholder="country"
                    />
                  </>
                  {errorsEditAddress.country && (
                    <Text style={styles.errorText2}>
                      {errorsEditAddress.country}
                    </Text>
                  )}
                </View>

                <View style={{ marginBottom: 10 }}>
                  <Text style={styles.inputLabel2}>State</Text>
                  <View
                    style={[
                      styles.dropdown2,
                      errorsEditAddress.state && styles.errorInput2,
                    ]}
                  >
                    <Picker
                      selectedValue={selectedState}
                      onValueChange={handleStateChange}
                    >
                      <Picker.Item
                        value={selectedAddressEdit?.state}
                        label={selectedAddressEdit?.state}
                      />
                      {Object.keys(statesAndDistricts).map((state, index) => (
                        <Picker.Item key={index} label={state} value={state} />
                      ))}
                    </Picker>
                  </View>
                  {errorsEditAddress.state && (
                    <Text style={styles.errorText2}>
                      {errorsEditAddress.state}
                    </Text>
                  )}
                  <Text style={styles.inputLabel2}>District</Text>
                  <View
                    style={[
                      styles.dropdown2,
                      errorsEditAddress.city && styles.errorInput2,
                    ]}
                  >
                    <Picker
                      selectedValue={selectedDistrict}
                      onValueChange={handleDistrictChange}
                    >
                      <Picker.Item
                        value={selectedAddressEdit?.city}
                        label={selectedAddressEdit?.city}
                      />
                      {(statesAndDistricts[selectedState] || []).map(
                        (district, index) => (
                          <Picker.Item
                            key={index}
                            label={district}
                            value={district}
                          />
                        )
                      )}
                    </Picker>
                  </View>
                  {errorsEditAddress.city && (
                    <Text style={styles.errorText2}>
                      {errorsEditAddress.city}
                    </Text>
                  )}
                </View>

                <View style={{ marginBottom: 10 }}>
                  <>
                    <Text style={styles.inputLabel2}>Street 1</Text>
                    <FiInput
                      style={[
                        styles.input2,
                        errorsEditAddress.address1 && styles.errorInput2,
                      ]}
                      value={selectedAddressEdit?.address1}
                      onChangeText={(text) => {
                        if (selectedAddressEdit == null) {
                          setAddress({ ...address, address1: text });
                        } else {
                          setSelectedAddressEdit({
                            ...selectedAddressEdit,
                            address1: text,
                          });
                        }
                      }}
                      placeholder="Street 1"
                    />
                  </>
                  {errorsEditAddress.address1 && (
                    <Text style={styles.errorText2}>
                      {errorsEditAddress.address1}
                    </Text>
                  )}
                </View>

                <View style={{ marginBottom: 10 }}>
                  <>
                    <Text style={styles.inputLabel2}>Street 2</Text>
                    <FiInput
                      style={[
                        styles.input2,
                        errorsEditAddress.address2 && styles.errorInput2,
                      ]}
                      value={selectedAddressEdit?.address2}
                      onChangeText={(text) => {
                        if (selectedAddressEdit == null) {
                          setAddress({ ...address, address2: text });
                        } else {
                          setSelectedAddressEdit({
                            ...selectedAddressEdit,
                            address2: text,
                          });
                        }
                      }}
                      placeholder="Street 2"
                    />
                  </>
                  {errorsEditAddress.address2 && (
                    <Text style={styles.errorText2}>
                      {errorsEditAddress.address2}
                    </Text>
                  )}
                </View>

                <View style={{ marginBottom: 10 }}>
                  <>
                    <Text style={styles.inputLabel2}>Postal Code</Text>
                    <FiInput
                      style={[
                        styles.input2,
                        errorsEditAddress.pincode && styles.errorInput2,
                      ]}
                      value={selectedAddressEdit?.pincode}
                      onChangeText={(text) => {
                        if (selectedAddressEdit == null) {
                          setAddress({ ...address, pincode: text });
                        } else {
                          setSelectedAddressEdit({
                            ...selectedAddressEdit,
                            pincode: text,
                          });
                        }
                      }}
                      placeholder="Postal Code"
                    />
                  </>
                  {errorsEditAddress.pincode && (
                    <Text style={styles.errorText2}>
                      {errorsEditAddress.pincode}
                    </Text>
                  )}
                </View>
                <View style={{ marginBottom: 10 }}>
                  <>
                    <Text style={styles.inputLabel2}>Contact Phone</Text>
                    <FiInput
                      style={[
                        styles.input2,
                        errorsEditAddress.mobileNo && styles.errorInput2,
                      ]}
                      value={selectedAddressEdit?.mobileNo}
                      keyboardType={"phone-pad"}
                      onChangeText={(text) => {
                        if (selectedAddressEdit == null) {
                          setAddress({ ...address, mobileNo: text });
                        } else {
                          setSelectedAddressEdit({
                            ...selectedAddressEdit,
                            mobileNo: text,
                          });
                        }
                      }}
                      placeholder="Contact Phone"
                    />
                  </>
                  {errorsEditAddress.mobileNo && (
                    <Text style={styles.errorText2}>
                      {errorsEditAddress.mobileNo}
                    </Text>
                  )}
                </View>
                <View style={{ marginBottom: 10 }}>
                  <>
                    <Text style={styles.inputLabel2}>Contact Email</Text>
                    <FiInput
                      style={[
                        styles.input2,
                        errorsEditAddress.email && styles.errorInput2,
                      ]}
                      value={selectedAddressEdit?.email}
                      keyboardType={"email-address"}
                      onChangeText={(text) => {
                        if (selectedAddressEdit == null) {
                          setAddress({ ...address, email: text });
                        } else {
                          setSelectedAddressEdit({
                            ...selectedAddressEdit,
                            email: text,
                          });
                        }
                      }}
                      placeholder="Contact Email"
                    />
                  </>
                  {errorsEditAddress.email && (
                    <Text style={styles.errorText2}>
                      {errorsEditAddress.email}
                    </Text>
                  )}
                </View>
                <View style={{ marginBottom: 10 }}>
                  <>
                    <Text style={styles.inputLabel2}>Gst No</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <FiInput
                        style={[
                          styles.input2,
                          { width: "90%" },
                          errorsEditAddress.gstNo && styles.errorInput2,
                        ]}
                        value={selectedAddressEdit?.gstNo}
                        autoCapitalize="characters"
                        onChangeText={(text) => {
                          const uppercasedText = text.toUpperCase();

                          checkAndSetGstNo(uppercasedText);
                          setSelectedAddressEdit({
                            ...selectedAddressEdit,
                            gstNo: uppercasedText,
                          });
                        }}
                        placeholder="GST No"
                      />
                      <View>
                        {loading ? (
                          <ActivityIndicator
                            size="small"
                            color={common.PRIMARY_COLOR}
                          />
                        ) : (
                          <Icon
                            name={
                              selectedAddressEdit?.isGstVerified
                                ? "check-circle"
                                : "x-circle"
                            }
                            size={20}
                            color={
                              selectedAddressEdit?.isGstVerified
                                ? "green"
                                : "red"
                            }
                            style={styles.icon2}
                          />
                        )}
                      </View>
                    </View>
                  </>
                  {errorsEditAddress.gstNo && (
                    <Text style={styles.errorText2}>
                      {errorsEditAddress.gstNo}
                    </Text>
                  )}
                </View>
                <View style={styles.modalButtons2}>
                  <TouchableOpacity onPress={() => handleSave()}>
                    <Text style={styles.saveButton2}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={closeEditModal}>
                    <Text style={styles.cancelButton2}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    );
  };
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
                <TouchableOpacity onPress={() => closeSelectAddressModal()}>
                  <Icon name="x" size={20} color="#000" />
                </TouchableOpacity>
              </View>
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                style={{ maxHeight: 500 }}
                keyboardShouldPersistTaps="handled"
              >
                {addresses.length > 0 && addresses ? (
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
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() => {
                            setSelectedAddressEdit(add);
                            setIsEditModalVisible(true);
                          }}
                        >
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
                defaultValue={!delivery ? dropdownValues[0] : delivery}
                onSelect={(value) => setDelivery(value)}
                dropdownTextStyle={{ fontFamily: font.regular, fontSize: 14 }}
                style={[
                  { minWidth: 150, maxWidth: 150 },
                  errors.deliveryMethod && { borderColor: "red" },
                ]}
                dropdownListContainer={{ maxWidth: 150 }}
                optionsTextStyle={{ fontFamily: font.regular, fontSize: 12 }}
              />
              {errors.deliveryMethod && (
                <Text style={styles.errorText}>{errors.deliveryMethod}</Text>
              )}
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
            <TouchableOpacity
              style={[
                styles.innerAddressContainer,
                errors.billLocation && { borderColor: "red" },
              ]}
              onPress={() => {
                setModalHeader("billLocation");
                setIsSelectAddressModalVisible(true);
              }}
            >
              {selectedAddresses?.billLocation ? (
                <View
                  style={{
                    flex: 1,
                    width: "100%",
                    gap: 10,
                    justifyContent: "center",
                  }}
                >
                  <View style={[styles.modalHeader, { paddingHorizontal: 5 }]}>
                    <Text style={styles.modalHeaderText}>
                      {selectedAddresses?.billLocation?.nickName}
                    </Text>
                  </View>
                  <View style={{ paddingHorizontal: 5 }}>
                    <Text style={styles.addressText}>
                      {selectedAddresses?.billLocation?.address1}
                    </Text>
                    <Text style={styles.addressText}>
                      {selectedAddresses?.billLocation?.address2}
                    </Text>
                    <Text style={styles.addressText}>
                      {selectedAddresses?.billLocation?.country}
                    </Text>
                  </View>
                  <View style={{ paddingHorizontal: 5, paddingVertical: 10 }}>
                    <View style={styles.contachView}>
                      <Text style={styles.contactHeading}>Contact Name</Text>
                      <Text style={styles.contactDetails}>
                        {selectedAddresses?.billLocation?.nickName}
                      </Text>
                    </View>
                    <View style={styles.contachView}>
                      <Text style={styles.contactHeading}>Contact Phone</Text>
                      <Text style={styles.contactDetails}>
                        {selectedAddresses?.billLocation?.mobileNo}
                      </Text>
                    </View>
                    <View style={styles.contachView}>
                      <Text style={styles.contactHeading}>Contact Email</Text>
                      <Text style={styles.contactDetails}>
                        {selectedAddresses?.billLocation?.email}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <View
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
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.outerAddressContainer}>
            <Text style={styles.selectAddressText}>Shipping</Text>
            <TouchableOpacity
              style={[
                styles.innerAddressContainer,
                errors.shipLocation && { borderColor: "red" },
              ]}
              onPress={() => {
                setModalHeader("shipLocation");
                setIsSelectAddressModalVisible(true);
              }}
            >
              {selectedAddresses?.shipLocation ? (
                <View
                  style={{
                    flex: 1,
                    width: "100%",
                    gap: 10,
                    justifyContent: "center",
                  }}
                >
                  <View style={[styles.modalHeader, { paddingHorizontal: 5 }]}>
                    <Text style={styles.modalHeaderText}>
                      {selectedAddresses?.shipLocation?.nickName}
                    </Text>
                  </View>
                  <View style={{ paddingHorizontal: 5 }}>
                    <Text style={styles.addressText}>
                      {selectedAddresses?.shipLocation?.address1}
                    </Text>
                    <Text style={styles.addressText}>
                      {selectedAddresses?.shipLocation?.address2}
                    </Text>
                    <Text style={styles.addressText}>
                      {selectedAddresses?.shipLocation?.country}
                    </Text>
                  </View>
                  <View style={{ paddingHorizontal: 5, paddingVertical: 10 }}>
                    <View style={styles.contachView}>
                      <Text style={styles.contactHeading}>Contact Name</Text>
                      <Text style={styles.contactDetails}>
                        {selectedAddresses?.shipLocation?.nickName}
                      </Text>
                    </View>
                    <View style={styles.contachView}>
                      <Text style={styles.contactHeading}>Contact Phone</Text>
                      <Text style={styles.contactDetails}>
                        {selectedAddresses?.shipLocation?.mobileNo}
                      </Text>
                    </View>
                    <View style={styles.contachView}>
                      <Text style={styles.contactHeading}>Contact Email</Text>
                      <Text style={styles.contactDetails}>
                        {selectedAddresses?.shipLocation?.email}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <View style={styles.iconContainer}>
                    <Icon name="plus" size={24} color="#fff" />
                  </View>
                  <Text style={styles.selectAddressText}>Select Address</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
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
          <Text style={styles.contentHeading}>{getCartType()}</Text>
        </View>
        <View
          style={[
            styles.flexRow,
            {
              borderBottomWidth: 1,
              borderColor: "#ccc",
              flexDirection: "column",
            },
          ]}
        >
          <Text style={styles.cartHeading}>
            Subtotal ({cartInfo.subTotal} Items)
          </Text>
          <Text style={[styles.cartDataText, { fontSize: 14 }]}>
            ₹ {cartInfo.total}
          </Text>
        </View>
        <View
          style={[
            styles.flexRow,
            {
              flexDirection: "column",
            },
          ]}
        >
          <Text style={styles.cartHeading}>Total</Text>
          <Text style={styles.cartDataText}>₹ {cartInfo.total}</Text>
        </View>
      </View>
      <FiButton title={"Continue to policy"} onPress={() => handlePress()} />
      {isSelectAddressModalVisible && renderSelectAddressModal()}
      {isEditModalVisible && renderEditModal()}
      <AlertBox
        heading={isError.heading}
        message={isError.message}
        setShowAlert={closeAlert}
        showAlert={isError.showAlert}
        triggerFunction={isError.triggerFunction}
        isRight={isError.isRight}
        rightButtonText={isError.rightButtonText}
      />
      {isFullScreenLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FF6F61" />
        </View>
      )}
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
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
    padding: 5,
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    minHeight: 200,
    flex: 1,
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
  cartHeading: {
    fontFamily: font.semiBold,
    color: "#727272",
    padding: 5,
  },
  cartDataText: {
    fontFamily: font.bold,
    fontSize: 18,
  },
  errorText: {
    fontSize: 12,
    color: "red",
  },
  modalContainer2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10000,
  },
  modalContent2: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10000,
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader2: {
    fontFamily: font.semiBold,
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  input2: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    fontFamily: font.regular,
  },
  modalButtons2: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  saveButton2: {
    backgroundColor: common.PRIMARY_COLOR,
    color: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    textAlign: "center",
    fontFamily: font.semiBold,
  },
  cancelButton2: {
    backgroundColor: "#ccc",
    color: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    textAlign: "center",
    fontFamily: font.semiBold,
  },
  inputLabel2: {
    fontFamily: font.semiBold,
    fontSize: 14,
    paddingVertical: 5,
  },
  inputWrapper2: {
    marginBottom: 15,
  },
  dropdown2: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  pickerStyle2: {
    height: 50,
    width: "100%",
    color: "#333",
  },
  errorText2: {
    padding: 5,
    color: "red",
    fontFamily: font.regular,
    fontSize: 12,
  },
  errorInput2: {
    borderColor: "red",
  },
});
