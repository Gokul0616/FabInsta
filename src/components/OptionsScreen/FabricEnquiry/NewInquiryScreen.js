import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { Checkbox } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import AlertBox from "../../../Common/AlertBox";
import { backendUrl, common, storage } from "../../../Common/Common";
import { FiButton } from "../../../Common/FiButton";
import FIDropdown from "../../../Common/FIDropdown";
import { FiInput } from "../../../Common/FiInput";
import LargeTextBox from "../../../Common/LargeTextBox";
import { font } from "../../../Common/Theme";
const initialState = {
  endUse: "",
  season: "",
  fabricType: "",
  fiberComposition: "",
  weightMin: "",
  weightMax: "",
  priceMin: "",
  priceMax: "",
  finishOrPerformance: "",
  expectedOrderAmount: "",
  note: "",
};
const NewInquiryScreen = () => {
  const seasonOptions = ["S/S", "F/W", "SeasonLess"];
  const [isFullScreenLoading, setIsFullScreenLoading] = useState(false);
  const [isCheckedConfirm, setIsCheckedConfirm] = useState(false);
  const [endUse, setEndUse] = useState("");
  const [season, setSeason] = useState("");
  const [fabricType, setFabricType] = useState("");
  const [fiberComposition, setFiberComposition] = useState("");
  const [weightMin, setWeightMin] = useState("");
  const [weightMax, setWeightMax] = useState("");
  const [finishPerformance, setFinishPerformance] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [expectedOrderAmount, setExpectedOrderAmount] = useState("");
  const [note, setNote] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [text, setText] = useState("");
  const navigate = useNavigation();
  const [errors, setErrors] = useState({
    endUse: "",
    season: "",
    fabricType: "",
    fiberComposition: "",
    weightMin: "",
    weightMax: "",
    priceMin: "",
    priceMax: "",
    finishOrPerformance: "",
    selectedImage: "",
    expectedOrderAmount: "",
  });
  const [isError, setIsError] = useState({
    message: "",
    heading: "",
    isRight: false,
    rightButtonText: "OK",
    triggerFunction: () => { },
    setShowAlert: () => { },
    showAlert: false,
  });
  const handleSeasonSelect = (value) => {
    setSeason(value);
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
    clearError("endUse", endUse);
    clearError("season", season);
    clearError("fabricType", fabricType);
    clearError("fiberComposition", fiberComposition);
    clearError("weightMin", weightMin);
    clearError("weightMax", weightMax);
    clearError("priceMin", priceMin);
    clearError("priceMax", priceMax);
    clearError("finishOrPerformance", finishPerformance);
    clearError("expectedOrderAmount", expectedOrderAmount);
    clearError("selectedImage", selectedImage);
  }, [
    endUse,
    season,
    fabricType,
    fiberComposition,
    weightMin,
    weightMax,
    finishPerformance,
    priceMin,
    priceMax,
    expectedOrderAmount,
    selectedImage,
  ]);

  const handleImageSelect = () => {
    launchImageLibrary({ mediaType: "photo", quality: 0.5 }, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorCode);
        setIsError({
          message: response.errorCode || "An Unexpected error occurred",
          heading: "Error",
          isRight: false,
          rightButtonText: "OK",
          triggerFunction: () => { },
          setShowAlert: () => {
            isError.setShowAlert(false);
          },
          showAlert: true,
        });
      } else {
        setSelectedImage(response.assets[0]);
      }
    });
  };
  const closeAlert = () => {
    setIsError((prev) => ({ ...prev, showAlert: false }));
  };

  const handleSubmit = async () => {
    const newErrors = {
      endUse: "",
      season: "",
      fabricType: "",
      fiberComposition: "",
      weightMin: "",
      weightMax: "",
      priceMin: "",
      priceMax: "",
      finishOrPerformance: "",
      selectedImage: "",
      expectedOrderAmount: "",
    };

    let isValid = true;

    if (!endUse.trim()) {
      newErrors.endUse = "End use is required.";
      isValid = false;
    }

    if (!season) {
      newErrors.season = "Please select a season.";
      isValid = false;
    }

    if (!fabricType) {
      newErrors.fabricType = "Fabric type is required.";
      isValid = false;
    }

    if (!fiberComposition.trim()) {
      newErrors.fiberComposition = "Fiber composition is required.";
      isValid = false;
    }

    if (!weightMin || isNaN(weightMin)) {
      newErrors.weightMin = "Weight min must be a valid number.";
      isValid = false;
    }
    if (!weightMax || isNaN(weightMax)) {
      newErrors.weightMax = "Weight max must be a valid number.";
      isValid = false;
    }
    if (
      weightMin &&
      weightMax &&
      parseFloat(weightMin) > parseFloat(weightMax)
    ) {
      newErrors.weightMin = "Min weight cannot exceed max weight.";
      newErrors.weightMax = "Max weight cannot be less than min weight.";
      isValid = false;
    }

    if (!finishPerformance.trim()) {
      newErrors.finishOrPerformance = "Finish or performance is required.";
      isValid = false;
    }

    if (!priceMin || isNaN(priceMin)) {
      newErrors.priceMin = "Target price min must be a valid number.";
      isValid = false;
    }
    if (!priceMax || isNaN(priceMax)) {
      newErrors.priceMax = "Target price max must be a valid number.";
      isValid = false;
    }
    if (priceMin && priceMax && parseFloat(priceMin) > parseFloat(priceMax)) {
      newErrors.priceMin = "Min target price cannot exceed max target price.";
      newErrors.priceMax =
        "Max target price cannot be less than min target price.";
      isValid = false;
    }

    if (!expectedOrderAmount || isNaN(expectedOrderAmount)) {
      newErrors.expectedOrderAmount = "Order amount must be a valid number.";
      isValid = false;
    }
    if (!selectedImage) {
      newErrors.selectedImage = "Image required";
      isValid = false;
    }
    setErrors(newErrors);
    if (isValid) {
      setIsFullScreenLoading(true);

      const formDataToSubmit = new FormData();

      formDataToSubmit.append(
        "fabricInquiry",

        JSON.stringify({
          endUse,
          season,
          fabricType,
          fiberComposition,
          weightMin,
          weightMax,
          priceMin,
          priceMax,
          finishPerformance,
          expectedOrderAmount,
          note,
        })
      );

      if (selectedImage) {
        formDataToSubmit.append("image", {
          uri: selectedImage.uri,
          name: selectedImage.fileName || "image.jpg",
          type: selectedImage.type || "image/jpeg",
        });
      }

      const token = storage.getString("token");

      try {
        const res = await axios.post(
          `${backendUrl}/fabricInquiry`,
          formDataToSubmit,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res) {
          setIsError({
            message: res.data.message || "Fabric Added Successfully",
            heading: "Success",
            isRight: true,
            rightButtonText: "OK",
            triggerFunction: () => {
              navigate.goBack();
            },
            setShowAlert: () => {
              isError.setShowAlert(false);
            },
            showAlert: true,
          });
          setEndUse("");
          setSeason("");
          setFabricType("");
          setFiberComposition("");
          setWeightMin("");
          setWeightMax("");
          setFinishPerformance("");
          setPriceMin("");
          setPriceMax("");
          setExpectedOrderAmount("");
          setNote("");
          setSelectedImage(null);
          setText("");
        }
      } catch (error) {
        console.error("Error submitting the form:", error);
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
        if (error.res) {
          console.error("Response error:", error.res.data);
          setIsError({
            message: error.res.data || "An Unexpected error occurred",
            heading: "Error",
            isRight: false,
            rightButtonText: "OK",
            triggerFunction: () => { },
            setShowAlert: () => {
              isError.setShowAlert(false);
            },
            showAlert: true,
          });
        } else if (error.request) {
          console.error("Request error:", error.request);
          setIsError({
            message: error.request || "An Unexpected error occurred",
            heading: "Error",
            isRight: false,
            rightButtonText: "OK",
            triggerFunction: () => { },
            setShowAlert: () => {
              isError.setShowAlert(false);
            },
            showAlert: true,
          });
        } else {
          console.error("General error:", error.message);
          setIsError({
            message: error.message || "An Unexpected error occurred",
            heading: "Error",
            isRight: false,
            rightButtonText: "OK",
            triggerFunction: () => { },
            setShowAlert: () => {
              isError.setShowAlert(false);
            },
            showAlert: true,
          });
        }
      } finally {
        setIsFullScreenLoading(false);
      }
    }
  };
  const renderForm = () => {
    return (
      <View style={styles.formContainerMain}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>End Use</Text>
          <FiInput
            style={[
              styles.fullsizeTextInput,
              errors.endUse ? styles.errorInput : null,
            ]}
            placeholder={"Dress"}
            value={endUse}
            onChangeText={(val) => setEndUse(val)}
          />
          {errors.endUse && (
            <Text style={styles.errorText}>{errors.endUse}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Season</Text>
          <FIDropdown
            values={seasonOptions}
            onSelect={handleSeasonSelect}
            style={errors.season ? styles.errorInput : null}
          />
          {errors.season && (
            <Text style={styles.errorText}>{errors.season}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fabric Type</Text>
          <FiInput
            value={fabricType}
            onChangeText={(val) => setFabricType(val)}
            style={[
              styles.fullsizeTextInput,
              errors.fabricType ? styles.errorInput : null,
            ]}
            placeholder={"Single Jersey, Denim or French terry etc."}
          />
          {errors.fabricType && (
            <Text style={styles.errorText}>{errors.fabricType}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fiber Composition</Text>
          <FiInput
            value={fiberComposition}
            onChangeText={(val) => setFiberComposition(val)}
            style={[
              styles.fullsizeTextInput,
              errors.fiberComposition ? styles.errorInput : null,
            ]}
            placeholder={"Linen 70% / Cotton 30%"}
          />
          {errors.fiberComposition && (
            <Text style={styles.errorText}>{errors.fiberComposition}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Weight</Text>
          <Text
            style={[styles.noteDescriptionText, { fontSize: 12, padding: 5 }]}
          >
            Entering either the season or weight range helps us narrow down the
            fabrics that are appropriate for your use.
          </Text>
          <View style={styles.twoInputStyle}>
            <FiInput
              value={weightMin}
              keyboardType={"numeric"}
              onChangeText={(val) => {
                setWeightMin(val);
              }}
              style={[
                styles.halfsizeTextInput,
                errors.weightMin ? styles.errorInput : null,
              ]}
              placeholder={"min"}
            />
            <Text style={styles.betweenTextStyle}>-</Text>
            <FiInput
              value={weightMax}
              keyboardType={"numeric"}
              onChangeText={(val) => {
                setWeightMax(val);
              }}
              style={[
                styles.halfsizeTextInput,
                errors.weightMax ? styles.errorInput : null,
              ]}
              placeholder={"max"}
            />
            <Text style={styles.betweenTextStyle}>gsm</Text>
          </View>
          {(errors.weightMin || errors.weightMax) && (
            <Text style={styles.errorText}>
              {errors.weightMin || errors.weightMax}
            </Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Finish or Performance</Text>
          <FiInput
            value={finishPerformance}
            onChangeText={(val) => setFinishPerformance(val)}
            style={[
              styles.fullsizeTextInput,
              errors.finishOrPerformance ? styles.errorInput : null,
            ]}
            placeholder={"Brushed"}
          />
          {errors.finishOrPerformance && (
            <Text style={styles.errorText}>{errors.finishOrPerformance}</Text>
          )}
          <Text
            style={[
              styles.noteDescriptionText,
              { color: "grey", fontSize: 12 },
            ]}
          >
            e.g. Brushed or pleated, foil etc.
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Target Price</Text>
          <View style={styles.twoInputStyle}>
            <FiInput
              keyboardType={"numeric"}
              value={priceMin}
              onChangeText={(val) => {
                setPriceMin(val);
              }}
              style={[
                styles.halfsizeTextInput,
                errors.priceMin ? styles.errorInput : null,
              ]}
              placeholder={"min"}
            />
            <Text style={styles.betweenTextStyle}>-</Text>
            <FiInput
              keyboardType={"numeric"}
              value={priceMax}
              onChangeText={(val) => {
                setPriceMax(val);
              }}
              style={[
                styles.halfsizeTextInput,
                errors.priceMax ? styles.errorInput : null,
              ]}
              placeholder={"max"}
            />
            <Text style={styles.betweenTextStyle}>$</Text>
          </View>
          {(errors.priceMin || errors.weightMax) && (
            <Text style={styles.errorText}>
              {errors.priceMin || errors.priceMax}
            </Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Expected Order Amount</Text>
          <View style={styles.twoInputStyle}>
            <FiInput
              value={expectedOrderAmount}
              keyboardType={"numeric"}
              onChangeText={(val) => setExpectedOrderAmount(val)}
              style={[
                styles.fullsizeTextInput,
                { width: "80%" },
                errors.expectedOrderAmount ? styles.errorInput : null,
              ]}
              placeholder={"0"}
            />

            <Text style={[styles.betweenTextStyle, { fontSize: 14 }]}>
              yards
            </Text>
          </View>
          {errors.expectedOrderAmount && (
            <Text style={styles.errorText}>{errors.expectedOrderAmount}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Reference Images</Text>
          <Text
            style={[styles.noteDescriptionText, { fontSize: 12, padding: 5 }]}
          >
            Please share any fabric/inspirational images that we can reference.
          </Text>
          <TouchableOpacity
            style={[
              styles.uploadImage,
              errors.selectedImage && styles.errorInput,
            ]}
            onPress={() => handleImageSelect()}
          >
            <Icon name="image" size={20} color={common.PRIMARY_COLOR} />
            <Text style={styles.uploadText}>Upload Image</Text>
          </TouchableOpacity>
        </View>
        {errors.selectedImage && (
          <Text style={styles.errorText}>{errors.selectedImage}</Text>
        )}
        {selectedImage && (
          <View style={styles.imageViewContainer}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage.uri }} style={styles.image} />
              <TouchableOpacity
                onPress={() => setSelectedImage(null)}
                style={styles.closeButton}
              >
                <Icon name="x" size={14} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.imageDetailsContainer}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: font.semiBold,
                  marginVertical: 5,
                }}
              >
                'Where did you find this image?'
              </Text>
              <LargeTextBox
                height={70}
                value={text}
                onChangeText={(val) => {
                  if (val.length <= 85) {
                    setText(val);
                  }
                }}
                placeholder={
                  "Being as descriptive as possible about the source of this image can help us narrow down our fabric selection"
                }
              />
              <Text
                style={[
                  styles.noteDescriptionText,
                  { color: "grey", fontSize: 12, textAlign: "right" },
                ]}
              >
                {text.length}/85
              </Text>
              <Text
                style={[
                  styles.noteDescriptionText,
                  { color: "grey", fontSize: 12 },
                ]}
              >
                e.g. website link, brand, etc.
              </Text>
            </View>
          </View>
        )}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Note</Text>
          <LargeTextBox
            placeholder="Share any information that will help us find the fabrics you need."
            height={100}
            value={note}
            onChangeText={(val) => {
              if (val.length <= 1000) {
                setNote(val);
              }
            }}
          />
          <Text
            style={[
              styles.noteDescriptionText,
              { color: "grey", fontSize: 12, textAlign: "right" },
            ]}
          >
            {note.length}/1000
          </Text>
        </View>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setIsCheckedConfirm(!isCheckedConfirm)}
        >
          <Checkbox
            status={isCheckedConfirm ? "checked" : "unchecked"}
            color={common.PRIMARY_COLOR}
          />
          <Text
            style={[
              styles.noteDescriptionText,
              { fontSize: 12, padding: 5, width: "90%" },
            ]}
          >
            I confirm that this fabric inquiry is related to a single piece of
            garment fabric.
          </Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <FiButton
            style={[
              styles.submitButton,
              !isCheckedConfirm ? { backgroundColor: "#ccc" } : null,
            ]}
            disabled={!isCheckedConfirm}
            title={"Submit Inquiry"}
            titleStyle={styles.buttonText}
            onPress={() => handleSubmit()}
          />
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
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
      <ScrollView contentContainerStyle={styles.container}>
        <SafeAreaView>
          <TouchableOpacity
            onPress={() => navigate.goBack()}
            style={{
              paddingVertical: 10,
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

          <View style={styles.headerContainer}>
            <Text style={styles.headingText}>Fabric Inquiry</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.detailsHeadingText}>How does this work?</Text>
            <Text style={styles.detailsDescriptionText}>
              After you submit your inquiry, our 👨🏻‍💻
              <Text style={{ fontFamily: font.semiBold }}>
                {" "}
                FABRIC SPECIALISTS
              </Text>{" "}
              use your information to curate a shortlist of fabrics that will
              best fit your sourcing needs.
              <Text style={{ color: "#2e6f40", fontFamily: font.semiBold }}>
                {" "}
                The more detailed your response is, the better we will be able
                to find fabrics that meet your exact needs.{" "}
              </Text>
            </Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.noteContainer}>
              <Text style={styles.noteDescriptionText}>
                Please submit an inquiry for
                <Text style={{ fontFamily: font.semiBold }}>
                  {" "}
                  a single piece of garment or fabric.
                </Text>{" "}
                If multiple garments or fabrics are described, we will base our
                recommendations on the first item.
              </Text>
            </View>
          </View>
          <View>{renderForm()}</View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default NewInquiryScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },
  headerContainer: {
    alignItems: "center",
    padding: 10,
  },
  headingText: {
    fontFamily: font.semiBold,
    paddingTop: 10,
    fontSize: 26,
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: "#E8F7ED",
    borderRadius: 10,
  },
  detailsHeadingText: {
    fontSize: 20,
    fontFamily: font.semiBold,
  },
  detailsDescriptionText: {
    fontFamily: font.light,
    marginTop: 10,
    fontSize: 14,
  },
  formContainer: {
    marginTop: 20,
  },
  noteContainer: {
    padding: 16,
    backgroundColor: "#F6F7F8",
  },
  noteDescriptionText: {
    fontFamily: font.regular,
  },
  fullsizeTextInput: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    fontFamily: font.regular,
  },
  halfsizeTextInput: {
    width: "40%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    fontFamily: font.regular,
  },
  inputContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    fontFamily: font.semiBold,
    fontSize: 16,
    marginBottom: 5,
  },
  formContainerMain: {
    padding: 5,
  },
  twoInputStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  betweenTextStyle: {
    fontSize: 16,
    fontFamily: font.regular,
    marginHorizontal: 5,
  },
  uploadImage: {
    height: 50,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  uploadText: {
    fontSize: 16,
    fontFamily: font.regular,
    color: common.PRIMARY_COLOR,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#FF6F61",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    height: 40,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.2s",
  },
  buttonText: {
    color: "#ffffff",
    fontFamily: font.regular,
    fontSize: 16,
  },

  buttonContainer: {
    marginVertical: 20,
  },
  imageViewContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
  },
  imageContainer: {
    maxWidth: 320,
    maxHeight: 320,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
  },
  closeButton: {
    position: "absolute",
    top: 7,
    right: 7,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 50,
    height: 20,
    width: 20,
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "#000",
    fontFamily: font.bold,
  },
  imageDetailsContainer: {
    marginVertical: 10,
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    padding: 5,
    color: "red",
    fontFamily: font.regular,
    fontSize: 12,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
});
