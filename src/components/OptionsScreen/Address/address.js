import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { font } from "../../../Common/Theme";
import Icon from "react-native-vector-icons/Feather";
import AlertBox from "../../../Common/AlertBox";
import api from "../../../Service/api";
import { common } from "../../../Common/Common";
import { Picker } from "@react-native-picker/picker";
import { Checkbox } from "react-native-paper";
import { FiInput } from "../../../Common/FiInput";
import statesAndDistricts from "../../../Common/StatesAndDistricts.json";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const Address = () => {
  const [data, setData] = useState([]);
  const [isFullScreenLoading, setIsFullScreenLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [isError, setIsError] = useState({
    message: "",
    heading: "",
    isRight: false,
    rightButtonText: "OK",
    triggerFunction: () => {},
    setShowAlert: () => {},
    showAlert: false,
  });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const initialState = {
    nickName: "",
    mobileNo: "",
    email: "",
    pincode: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    gstNo: "",
    isGstVerified: false,
  };
  const [address, setAddress] = useState(initialState);
  const [editAddress, setEditAddress] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [errors, setErrors] = useState({});
  const handleStateChange = (state) => {
    if (editAddress == null) {
      setSelectedState(state);
      setSelectedDistrict("");
      setAddress({ ...address, state });
    } else {
      setSelectedState(state);
      setSelectedDistrict("");
      setEditAddress({ ...editAddress, state });
    }
  };

  useEffect(() => {
    const clearError = (fieldName, fieldValue) => {
      if (fieldValue) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [fieldName]: "",
        }));
      }
    };
    if (editAddress === null) {
      Object.keys(address).forEach((fieldName) => {
        clearError(fieldName, address[fieldName]);
      });
    } else {
      Object.keys(editAddress).forEach((fieldName) => {
        clearError(fieldName, editAddress[fieldName]);
      });
    }
  }, [address, editAddress]);
  const handleDistrictChange = (city) => {
    if (editAddress == null) {
      setSelectedDistrict(city);
      setAddress({ ...address, city });
    } else {
      setSelectedDistrict(city);
      setEditAddress({ ...editAddress, city });
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const changePrimaryAddress = async (id) => {
    try {
      await api.get(`/locations/primary/${id}`);
      fetchData();
    } catch (error) {
      console.error("Failed to change primary address:", error);
      setIsError({
        message: err.response?.data?.message || "An Unexpected error occurred",
        heading: "Error",
        isRight: false,
        rightButtonText: "OK",
        triggerFunction: () => {},
        setShowAlert: () => {
          isError.setShowAlert(false);
        },
        showAlert: true,
      });
    }
  };
  const deletedAddress = async (id) => {
    try {
      await api.delete(`/locations/delete/${id}`);
      fetchData();
    } catch (error) {
      console.error("Failed to delete address:", error);
      setIsError({
        message: err.response?.data?.message || "An Unexpected error occurred",
        heading: "Error",
        isRight: false,
        rightButtonText: "OK",
        triggerFunction: () => {},
        setShowAlert: () => {
          isError.setShowAlert(false);
        },
        showAlert: true,
      });
    }
  };
  const closeAlert = () => {
    setIsError((prev) => ({ ...prev, showAlert: false }));
  };
  const fetchData = async () => {
    try {
      setIsFullScreenLoading(true);

      const res = await api.get("/locations/customer");
      const sortedData = (res.response || []).sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      setData(sortedData);
    } catch (err) {
      console.log("Error at Fetching Data :", err);
      setIsError({
        message: err.response?.data?.message || "An Unexpected error occurred",
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
  const openEditModal = (address) => {
    if (address) {
      setIsEditModalVisible(true);
      setEditAddress(address);
    }
    setIsEditModalVisible(true);
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setAddress(initialState);
    setEditAddress(null);
    setErrors({});
  };
  const saveAddress = async () => {
    let valid = true;

    // if (editAddress === null) {
    valid = validateAddress();
    // }

    if (!valid) return;

    try {
      const addressData = editAddress || address;
      await api.post(`/customer/location`, addressData);
      fetchData();
      closeEditModal();
    } catch (error) {
      console.error("Failed to update address:", error);
      handleError(error);
    }
  };

  const validateAddress = () => {
    const newErrors = {};
    if (editAddress === null) {
      if (!address.nickName) newErrors.nickName = "Nickname is required";
      if (!/^[a-zA-Z\s]+$/.test(address.nickName))
        newErrors.nickName = "Nickname must contain only letters";
      if (!address.address1) newErrors.address1 = "Street address is required";
      if (!address.city) newErrors.city = "City is required";
      if (!/^[a-zA-Z\s]+$/.test(address.city))
        newErrors.city = "City must contain only letters";
      if (!address.state) newErrors.state = "State is required";
      if (!/^[a-zA-Z\s]+$/.test(address.state))
        newErrors.state = "State must contain only letters";
      if (!address.pincode || !/^\d{5,9}$/.test(address.pincode))
        newErrors.pincode = "Valid postal code is required";
      if (!address.country) newErrors.country = "Country is required";
      if (!/^[a-zA-Z\s]+$/.test(address.country))
        newErrors.country = "Country must contain only letters";
      if (
        !address.mobileNo ||
        !/^\+?\d{10,15}$/.test(address.mobileNo) ||
        address.mobileNo.length < 10 ||
        address.mobileNo.length > 10
      )
        newErrors.mobileNo = "Valid phone number is required";
      if (!address.email || !/\S+@\S+\.\S+/.test(address.email))
        newErrors.email = "Valid email is required";
      if (!address.gstNo || !address.isGstVerified)
        newErrors.gstNo = "Enter Valid GST number";
    } else {
      if (!editAddress.nickName) newErrors.nickName = "Nickname is required";
      if (!/^[a-zA-Z\s]+$/.test(editAddress.nickName))
        newErrors.nickName = "Nickname must contain only letters";
      if (
        !editAddress.mobileNo ||
        !/^\+?\d{10,15}$/.test(editAddress.mobileNo) ||
        editAddress.mobileNo.length < 10 ||
        editAddress.mobileNo.length > 10
      )
        newErrors.mobileNo = "Valid phone number is required";
      if (!editAddress.email || !/\S+@\S+\.\S+/.test(editAddress.email))
        newErrors.email = "Valid email is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const checkAndSetGstNo = async (value) => {
    if (value?.length > 15) return;
    if (!value || value.length !== 15) {
      setAddress((prev) => ({ ...prev, gstNo: value, isGstVerified: false }));
      return;
    }
    setLoading(true);
    setAddress((prev) => ({ ...prev, gstNo: value }));
    try {
      const res = await axios.get(
        `http://sheet.gstincheck.co.in/check/b1fe6c473486db147eec1efebc90f698/${value}`
      );

      setCompanyName(res.data.data.tradeNam);
      setAddress((prev) => ({
        ...prev,
        isGstVerified: res.data.flag,
      }));
    } catch (error) {
      console.error("Error fetching GSTIN:", error);
      setAddress((prev) => ({
        ...prev,
        isGstVerified: false,
      }));
    } finally {
      setLoading(false);
    }
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
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { maxHeight: "80%" }]}>
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.modalHeader}>Edit Address</Text>
                <View style={{ marginBottom: 10 }}>
                  <>
                    <Text style={styles.inputLabel}>Nickname</Text>
                    <FiInput
                      style={[
                        styles.input,
                        errors.nickName && styles.errorInput,
                      ]}
                      value={editAddress?.nickName || address.nickName}
                      onChangeText={(text) => {
                        if (editAddress == null) {
                          setAddress({ ...address, nickName: text });
                        } else {
                          setEditAddress({ ...editAddress, nickName: text });
                        }
                      }}
                      placeholder="Nickname"
                    />
                  </>
                  {errors.nickName && (
                    <Text style={styles.errorText}>{errors.nickName}</Text>
                  )}
                </View>
                <View style={{ marginBottom: 10 }}>
                  <>
                    <Text style={styles.inputLabel}>Nickname</Text>
                    <FiInput
                      style={[
                        styles.input,
                        errors.country && styles.errorInput,
                      ]}
                      editable={editAddress == null ? true : false}
                      value={editAddress?.country || address.country}
                      onChangeText={(text) => {
                        if (editAddress == null) {
                          setAddress({ ...address, country: text });
                        } else {
                          setEditAddress({ ...editAddress, country: text });
                        }
                      }}
                      placeholder="country"
                    />
                  </>
                  {errors.country && (
                    <Text style={styles.errorText}>{errors.country}</Text>
                  )}
                </View>

                {editAddress !== null ? (
                  <View style={{ marginBottom: 10 }}>
                    <Text style={styles.inputLabel}>State</Text>
                    <View style={styles.dropdown}>
                      <Picker
                        selectedValue={selectedState}
                        style={{ borderWidth: 1 }}
                        enabled={false}
                      >
                        <Picker.Item
                          label={
                            selectedState ||
                            editAddress?.state ||
                            "Select a State"
                          }
                          value={selectedState || editAddress?.state || ""}
                        />
                      </Picker>
                    </View>

                    <Text style={styles.inputLabel}>District</Text>
                    <View style={styles.dropdown}>
                      <Picker
                        selectedValue={selectedDistrict}
                        style={{ borderWidth: 1 }}
                        enabled={false}
                      >
                        <Picker.Item
                          label={
                            selectedDistrict ||
                            editAddress?.city ||
                            "Select a District"
                          }
                          value={selectedDistrict || editAddress?.city || ""}
                        />
                      </Picker>
                    </View>
                  </View>
                ) : (
                  <View style={{ marginBottom: 10 }}>
                    <Text style={styles.inputLabel}>State</Text>
                    <View
                      style={[
                        styles.dropdown,
                        errors.state && styles.errorInput,
                      ]}
                    >
                      <Picker
                        selectedValue={selectedState}
                        onValueChange={handleStateChange}
                      >
                        <Picker.Item label="Select a State" value="" />
                        {Object.keys(statesAndDistricts).map((state, index) => (
                          <Picker.Item
                            key={index}
                            label={state}
                            value={state}
                          />
                        ))}
                      </Picker>
                    </View>
                    {errors.state && (
                      <Text style={styles.errorText}>{errors.state}</Text>
                    )}
                    <Text style={styles.inputLabel}>District</Text>
                    <View
                      style={[
                        styles.dropdown,
                        errors.city && styles.errorInput,
                      ]}
                    >
                      <Picker
                        selectedValue={selectedDistrict}
                        onValueChange={handleDistrictChange}
                        enabled={!!selectedState}
                      >
                        <Picker.Item label="Select a District" value="" />
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
                    {errors.city && (
                      <Text style={styles.errorText}>{errors.city}</Text>
                    )}
                  </View>
                )}

                <View style={{ marginBottom: 10 }}>
                  <>
                    <Text style={styles.inputLabel}>Street 1</Text>
                    <FiInput
                      style={[
                        styles.input,
                        errors.address1 && styles.errorInput,
                      ]}
                      value={editAddress?.address1 || address.address1}
                      editable={editAddress == null ? true : false}
                      onChangeText={(text) => {
                        if (editAddress == null) {
                          setAddress({ ...address, address1: text });
                        } else {
                          setEditAddress({ ...editAddress, address1: text });
                        }
                      }}
                      placeholder="Street 1"
                    />
                  </>
                  {errors.address1 && (
                    <Text style={styles.errorText}>{errors.address1}</Text>
                  )}
                </View>

                <View style={{ marginBottom: 10 }}>
                  <>
                    <Text style={styles.inputLabel}>Street 2</Text>
                    <FiInput
                      style={[
                        styles.input,
                        errors.address2 && styles.errorInput,
                      ]}
                      value={editAddress?.address2 || address.address2}
                      editable={editAddress == null ? true : false}
                      onChangeText={(text) => {
                        if (editAddress == null) {
                          setAddress({ ...address, address2: text });
                        } else {
                          setEditAddress({ ...editAddress, address2: text });
                        }
                      }}
                      placeholder="Street 2"
                    />
                  </>
                  {errors.address2 && (
                    <Text style={styles.errorText}>{errors.address2}</Text>
                  )}
                </View>

                <View style={{ marginBottom: 10 }}>
                  <>
                    <Text style={styles.inputLabel}>Postal Code</Text>
                    <FiInput
                      style={[
                        styles.input,
                        errors.pincode && styles.errorInput,
                      ]}
                      value={editAddress?.pincode || address.pincode}
                      editable={editAddress == null ? true : false}
                      onChangeText={(text) => {
                        if (editAddress == null) {
                          setAddress({ ...address, pincode: text });
                        } else {
                          setEditAddress({ ...editAddress, pincode: text });
                        }
                      }}
                      placeholder="Postal Code"
                    />
                  </>
                  {errors.pincode && (
                    <Text style={styles.errorText}>{errors.pincode}</Text>
                  )}
                </View>
                <View style={{ marginBottom: 10 }}>
                  <>
                    <Text style={styles.inputLabel}>Contact Phone</Text>
                    <FiInput
                      style={[
                        styles.input,
                        errors.mobileNo && styles.errorInput,
                      ]}
                      value={editAddress?.mobileNo || address.mobileNo}
                      keyboardType={"phone-pad"}
                      onChangeText={(text) => {
                        if (editAddress == null) {
                          setAddress({ ...address, mobileNo: text });
                        } else {
                          setEditAddress({ ...editAddress, mobileNo: text });
                        }
                      }}
                      placeholder="Contact Phone"
                    />
                  </>
                  {errors.mobileNo && (
                    <Text style={styles.errorText}>{errors.mobileNo}</Text>
                  )}
                </View>
                <View style={{ marginBottom: 10 }}>
                  <>
                    <Text style={styles.inputLabel}>Contact Email</Text>
                    <FiInput
                      style={[styles.input, errors.email && styles.errorInput]}
                      value={editAddress?.email || address.email}
                      keyboardType={"email-address"}
                      onChangeText={(text) => {
                        if (editAddress == null) {
                          setAddress({ ...address, email: text });
                        } else {
                          setEditAddress({ ...editAddress, email: text });
                        }
                      }}
                      placeholder="Contact Email"
                    />
                  </>
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>
                <View style={{ marginBottom: 10 }}>
                  <>
                    <Text style={styles.inputLabel}>Gst No</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <FiInput
                        style={[
                          styles.input,
                          { width: "90%" },
                          errors.gstNo && styles.errorInput,
                        ]}
                        value={editAddress?.gstNo || address.gstNo}
                        autoCapitalize="characters"
                        editable={editAddress == null ? true : false}
                        onChangeText={(text) => {
                          const uppercasedText = text.toUpperCase();
                          if (editAddress == null) {
                            setAddress({ ...address, gstNo: uppercasedText });
                            checkAndSetGstNo(uppercasedText);
                          } else {
                            setEditAddress({
                              ...editAddress,
                              gstNo: uppercasedText,
                            });
                          }
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
                              editAddress?.isGstVerified ||
                              address.isGstVerified
                                ? "check-circle"
                                : "x-circle"
                            }
                            size={20}
                            color={
                              editAddress?.isGstVerified ||
                              address.isGstVerified
                                ? "green"
                                : "red"
                            }
                            style={styles.icon}
                          />
                        )}
                      </View>
                    </View>
                  </>
                  {errors.gstNo && (
                    <Text style={styles.errorText}>{errors.gstNo}</Text>
                  )}
                </View>
                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={saveAddress}>
                    <Text style={styles.saveButton}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={closeEditModal}>
                    <Text style={styles.cancelButton}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    );
  };
  const renderAddress = (data) => {
    return (
      <View style={[styles.addressContainer]} key={data.id}>
        <View>
          <View style={styles.addressHeaderRow}>
            <Text style={styles.nameText}>{data.nickName}</Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {!data.isPrimary && (
                <TouchableOpacity onPress={() => deletedAddress(data.id)}>
                  <Icon name="trash" size={20} color={common.PRIMARY_COLOR} />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => openEditModal(data)}>
                <Icon name="edit" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.addressTextContainer}>
            <Text style={styles.addressText}>{data.address1}</Text>
            {data.address2?.length > 0 && (
              <Text style={styles.addressText}>{data.address2}</Text>
            )}
            <Text style={styles.addressText}>
              {data.city}, {data.state} {data.pincode}
            </Text>
            <Text style={styles.addressText}>{data.country}</Text>
          </View>

          <View style={styles.addressTextContainer}>
            <View style={styles.flexRow}>
              <Text style={styles.addressTextCredentials}>Mobile No</Text>
              <Text style={styles.addressTextCredentialsText}>
                {data.mobileNo}
              </Text>
            </View>
            <View style={styles.flexRow}>
              <Text style={styles.addressTextCredentials}>Email</Text>
              <Text style={styles.addressTextCredentialsText}>
                {data.email}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.flexRow}
          onPress={() => changePrimaryAddress(data.id)}
        >
          <Checkbox
            status={data.isPrimary ? "checked" : "unchecked"}
            color={common.PRIMARY_COLOR}
          />
          <Text style={styles.addressText}>Set as Primary</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const navigate = useNavigation();
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
      <View>
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
        <View style={styles.innerContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>Addresses</Text>
          </View>
          <View style={styles.addAddressContainer}>
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => openEditModal()}
            >
              <View style={styles.iconContainer}>
                <Icon name="plus" size={24} color="#fff" />
              </View>
              <Text style={styles.addAddressText}>Add Address</Text>
            </TouchableOpacity>
          </View>
          {data.length > 0 ? (
            data.map((item) => renderAddress(item))
          ) : (
            <Text style={styles.noAddressText}>No addresses found</Text>
          )}
        </View>
      </View>
      {isEditModalVisible && renderEditModal()}
    </ScrollView>
  );
};

export default Address;

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },
  innerContainer: {
    gap: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 8,
  },
  innerContainer: {
    gap: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  headerContainer: {},
  headerRow: {
    flexDirection: "row",
    paddingVertical: 16,
    alignItems: "center",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontFamily: font.semiBold,
    fontSize: 22,
  },
  addAddressContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    minHeight: 200,
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    flexShrink: 0,
  },
  noAddressContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
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
  addAddressText: {
    textAlign: "center",
    fontFamily: font.medium,
    fontSize: 16,
  },
  nameText: {
    fontFamily: font.semiBold,
    fontSize: 16,
  },
  addressContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    justifyContent: "space-between",
    minHeight: 200,
  },
  addressHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addressText: {
    fontFamily: font.regular,
    fontSize: 14,
  },
  addressTextContainer: {
    paddingVertical: 5,
    gap: 3,
  },
  addressTextCredentials: {
    fontFamily: font.semiBold,
    color: "#858794",
    fontSize: 14,
    width: 120,
  },
  addressTextCredentialsText: {
    fontFamily: font.regular,
    fontSize: 12,
  },
  noAddressText: {
    textAlign: "center",
    fontFamily: font.medium,
    fontSize: 16,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    fontFamily: font.semiBold,
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    fontFamily: font.regular,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: common.PRIMARY_COLOR,
    color: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    textAlign: "center",
    fontFamily: font.semiBold,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    color: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    textAlign: "center",
    fontFamily: font.semiBold,
  },
  inputLabel: {
    fontFamily: font.semiBold,
    fontSize: 14,
    paddingVertical: 5,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  pickerStyle: {
    height: 50,
    width: "100%",
    color: "#333",
  },
  errorText: {
    padding: 5,
    color: "red",
    fontFamily: font.regular,
    fontSize: 12,
  },
  errorInput: {
    borderColor: "red",
  },
});
