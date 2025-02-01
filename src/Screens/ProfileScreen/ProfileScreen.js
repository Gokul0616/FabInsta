import {
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import api from "../../Service/api";
import { font } from "../../Common/Theme";
import { FiButton } from "../../Common/FiButton";
import { Avatar } from "react-native-paper";
import { common, storage } from "../../Common/Common";
import { FiInput } from "../../Common/FiInput";
import AlertBox from "../../Common/AlertBox";
import { CommonActions, useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const [profile, setProfile] = useState({});
  const [editprofile, setEditProfile] = useState(profile);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigation();
  const [isError, setIsError] = useState({
    message: "",
    heading: "",
    isRight: false,
    rightButtonText: "OK",
    triggerFunction: () => {},
    setShowAlert: () => {},
    showAlert: false,
  });
  useEffect(() => {
    fetchAllProfile();
  }, []);

  const fetchAllProfile = async () => {
    try {
      const res = await api.get(`customer/profile`);
      setProfile(res?.response || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const submitHandler = async () => {
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(editprofile.mobileNo)) {
      setIsError({
        message: "Please enter a valid mobile number (10 digits).",
        heading: "Error",
        isRight: false,
        rightButtonText: "OK",
        triggerFunction: () => {},
        setShowAlert: () => {
          isError.setShowAlert(false);
        },
        showAlert: true,
      });
      return;
    }

    try {
      const res = await api.post(`customer/save`, editprofile);
      fetchAllProfile();
      close();
    } catch (error) {
      console.error("Error submitting the form:", error);
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

  const close = () => {
    setIsModalVisible(false);
  };
  const clearStackAndNavigate = () => {
    navigate.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "Signin",
          },
        ],
      })
    );
    storage.delete("token");
  };
  const handleSignOut = () => {
    clearStackAndNavigate();
  };

  const handleEdit = () => {
    setEditProfile(profile);
    setIsModalVisible(true);
  };

  const renderModal = () => {
    return (
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={close}
      >
        <TouchableWithoutFeedback onPress={close}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Company Name:</Text>
              <FiInput
                style={styles.input}
                value={editprofile.companyName}
                onChangeText={(text) =>
                  setEditProfile({ ...editprofile, companyName: text })
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name:</Text>
              <FiInput
                style={styles.input}
                value={editprofile.name}
                onChangeText={(text) =>
                  setEditProfile({ ...editprofile, name: text })
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email:</Text>
              <FiInput
                style={styles.input}
                editable={false}
                value={editprofile.email}
                onChangeText={(text) =>
                  setEditProfile({ ...editprofile, email: text })
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mobile Number:</Text>
              <FiInput
                style={styles.input}
                value={editprofile.mobileNo}
                keyboardType={"numeric"}
                onChangeText={(text) =>
                  setEditProfile({ ...editprofile, mobileNo: text })
                }
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={submitHandler}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: "#fff",
                    borderWidth: 1,
                    borderColor: common.PRIMARY_COLOR,
                  },
                ]}
                onPress={close}
              >
                <Text
                  style={[styles.buttonText, { color: common.PRIMARY_COLOR }]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container} style={{ flex: 1 }}>
      {isModalVisible && renderModal()}
      <AlertBox
        heading={isError.heading}
        message={isError.message}
        setShowAlert={closeAlert}
        showAlert={isError.showAlert}
        triggerFunction={isError.triggerFunction}
        isRight={isError.isRight}
        rightButtonText={isError.rightButtonText}
      />
      <View>
        <View style={{ paddingVertical: 20 }}>
          <View style={styles.profileHeaderContainer}>
            <Text style={styles.profileHeaderText}>Profile</Text>
            <View style={styles.profileHeader}>
              <Text style={styles.profileStatusText}>
                {profile.approveStatus === "DRAFT"
                  ? "Verification Pending"
                  : profile.approveStatus}
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.profileDetailsContainer]}>
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileDetailsHeaderText}>Company Name</Text>
            <Text style={styles.profileDetailsText}>
              {profile?.companyName || "N/A"}
            </Text>
          </View>
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileDetailsHeaderText}>Name</Text>
            <Text style={styles.profileDetailsText}>
              {profile?.name || "N/A"}
            </Text>
          </View>
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileDetailsHeaderText}>Email</Text>
            <Text style={styles.profileDetailsText}>
              {profile?.email || "N/A"}
            </Text>
          </View>
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileDetailsHeaderText}>Mobile Number</Text>
            <Text style={styles.profileDetailsText}>
              {profile?.mobileNo || "N/A"}
            </Text>
          </View>
          <FiButton title={"Edit"} onPress={() => handleEdit()} />
        </View>
      </View>
      <View>
        <View style={{ paddingVertical: 20 }}>
          <View style={styles.profileHeaderContainer}>
            <Text style={[styles.profileHeaderText, { width: "100%" }]}>
              Sourcing Manager
            </Text>
          </View>
        </View>
        <View
          style={[styles.profileDetailsContainer, { backgroundColor: "#fff" }]}
        >
          <Text style={{ fontFamily: font.semiBold, fontSize: 16 }}>
            Hi {profile?.name || "N/A"},
          </Text>
          <View>
            <Text style={styles.salesmanDescriptionText}>
              My name is{" "}
              <Text
                style={[
                  styles.salesmanDescriptionText,
                  {
                    fontFamily: font.semiBold,
                  },
                ]}
              >
                {profile?.salesMan?.name}
              </Text>
            </Text>
            <Text style={styles.salesmanDescriptionText}>
              and I’m your personal sourcing manager at {common.title}.
            </Text>
          </View>
          <View>
            <Text style={styles.salesmanDescriptionText}>
              I’m here to help keep your sourcing simple and streamlined.
            </Text>
          </View>
          <Text style={styles.salesmanDescriptionText}>
            Feel free to contact me at any time!
          </Text>
          <View style={styles.profileImage}>
            <Image
              style={{ width: 100, height: 100, borderRadius: 50 }}
              source={{
                uri: "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg",
              }}
              alt={profile?.salesMan?.name}
            />
            <Text style={styles.salesmanName}>{profile?.salesMan?.name}</Text>
          </View>
          <View
            style={[
              styles.profileDetailsContainer,
              { backgroundColor: "#F6F7F8", gap: 10 },
            ]}
          >
            <TouchableOpacity style={{ paddingHorizontal: 20 }}>
              <Text
                style={[
                  styles.salesmanDescriptionText,
                  { fontFamily: font.semiBold },
                ]}
                onPress={() =>
                  Linking.openURL(`mailto:${profile?.salesMan?.email}`)
                }
              >
                {profile?.salesMan?.email || "N/A"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ paddingHorizontal: 20 }}
              onPress={() =>
                Linking.openURL(`tel:${profile?.salesMan?.mobile}`)
              }
            >
              <Text
                style={[
                  styles.salesmanDescriptionText,
                  {
                    fontFamily: font.semiBold,
                  },
                ]}
              >
                {profile?.salesMan?.mobile || "N/A"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ paddingHorizontal: 20 }}
              onPress={() =>
                Linking.openURL(
                  `https://api.whatsapp.com/send?phone=${profile?.salesMan?.mobile}&text=Hi!`
                )
              }
            >
              <Text
                style={[
                  styles.salesmanDescriptionText,
                  {
                    fontFamily: font.semiBold,
                    color: "#9fc253",
                  },
                ]}
              >
                Message me on WhatsApp!
              </Text>
            </TouchableOpacity>
            <Text
              style={[
                styles.salesmanDescriptionText,
                { fontSize: 12, color: "#aab0bb" },
              ]}
            >
              WhatsApp number is for text messaging only. Group chat is not
              supported.
            </Text>
          </View>
        </View>
      </View>
      <FiButton
        title={"Sign out"}
        onPress={() => handleSignOut()}
        style={styles.signoutButton}
        titleStyle={styles.signoutButtonText}
      />
    </ScrollView>
  );
};

export default ProfileScreen;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 15,
    paddingVertical: 50,
    gap: 20,
  },
  profileDetailsText: {
    fontFamily: font.semiBold,
    fontSize: 16,
  },
  profileDetailsHeaderText: {
    fontFamily: font.semiBold,
    fontSize: 16,
    color: "#aab0bb",
  },
  profileDetailsContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 15,
    gap: 20,
  },
  profileStatusText: {
    color: "#fff",
    fontFamily: font.semiBold,
    alignSelf: "center",
  },
  profileHeader: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#228BE6",
    borderRadius: 10,
    width: "30%",
  },
  profileTextContainer: {
    gap: 5,
  },
  profileHeaderText: {
    fontFamily: font.semiBold,
    fontSize: 20,
    width: "20%",
  },
  profileHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 5,
  },
  salesmanDescriptionText: {
    fontFamily: font.regular,
    fontSize: 14,
  },
  profileImage: {
    alignItems: "center",
  },
  salesmanName: {
    fontFamily: font.semiBold,
    fontSize: 16,
  },
  signoutButton: {
    backgroundColor: "#f5f1fd",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    height: 40,
    width: "100%",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 0.5,
    justifyContent: "center",
    transition: "0.2s",
  },
  signoutButtonText: {
    color: common.PRIMARY_COLOR,
    fontFamily: font.semiBold,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5, // Adds shadow for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: font.semiBold,
    marginBottom: 15,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: font.semiBold,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 14,
    fontFamily: font.regular,
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  button: {
    backgroundColor: common.PRIMARY_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontFamily: font.semiBold,
    fontSize: 16,
  },
});
