import { useDisclosure } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal as RNModal,
  StyleSheet,
  Text,
  View
} from "react-native";
import { common } from "./Common";
import { FiButton } from "./FiButton";
import { FiInput } from "./FiInput";
import { font } from "./Theme";

const Return = ({
  item,
  order,
  handleChange = () => { },
  returnModalClose,
  comfirmReturn,
  setOrder,
}) => {
  const [visible, { open, close }] = useDisclosure(false);
  const [returned] = useState(item?.returnStatus || false);
  const [error, setError] = useState("");

  // Handle changes in pick list fields
  const pickListChange = (value, key, index) => {
    setOrder((prev) => ({
      ...prev,
      items: prev.items.map((currentItem, idx) =>
        currentItem.id === item.id
          ? {
            ...currentItem,
            pickList: currentItem.pickList
              ? currentItem.pickList.map((pickItem, pickIdx) =>
                pickIdx === index ? { ...pickItem, [key]: value } : pickItem
              )
              : [{ [key]: value }],
          }
          : currentItem
      ),
    }));
  };
  // Validate returned rolls
  useEffect(() => {
    validateReturnRolls();
  }, [order?.pickList]);

  const validateReturnRolls = () => {
    order?.pickList?.forEach((pick, i) => {
      const totalReturnAdded =
        parseInt(pick?.damagedRolls || 0, 10) +
        parseInt(pick?.stockRolls || 0, 10);

      if (pick.returnedRolls < totalReturnAdded) {
        setError(`Added Rolls exceeded in the ${pick.batch}`);
        return;
      }

      if (pick.returnedRolls !== totalReturnAdded) {
        setError(`Added Rolls not equal to returnedRolls in the ${pick.batch}`);
        return;
      }

      setError("");
    });
  };

  // Calculate total returned rolls
  const returnedRolls =
    item?.pickList?.reduce(
      (total, item) => total + (parseInt(item?.returnedRolls) || 0),
      0
    ) || 0;

  return (
    <KeyboardAvoidingView>
      <View style={{ borderColor: "#ccc", borderWidth: 1, borderRadius: 5 }}>
        {item?.pickList?.map((batchItem, index) => {
          return (
            <View key={index}>
              <View
                style={{
                  padding: 5,
                  minWidth: "100%",
                }}
              >
                <Text
                  style={{
                    fontFamily: font.semiBold,
                    fontSize: 16,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                >
                  Product Name:
                </Text>
                <Text
                  style={{
                    fontFamily: font.regular,
                    fontSize: 14,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                >
                  {item.productVariant.name}
                </Text>
              </View>
              <View
                style={{
                  padding: 5,
                  minWidth: "100%",
                }}
              >
                <Text
                  style={{
                    fontFamily: font.semiBold,
                    fontSize: 16,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                >
                  Batch:
                </Text>
                <Text
                  style={{
                    fontFamily: font.regular,
                    fontSize: 14,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                >
                  {batchItem.batch}
                </Text>
              </View>
              <View
                style={{
                  padding: 5,
                  minWidth: "100%",
                }}
              >
                <Text
                  style={{
                    fontFamily: font.semiBold,
                    fontSize: 16,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                >
                  No. of Rolls ordered
                </Text>
                <Text
                  style={{
                    fontFamily: font.regular,
                    fontSize: 14,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                >
                  {batchItem.noOfRoll}
                </Text>
              </View>
              <View
                style={{
                  padding: 5,
                  minWidth: "100%",
                }}
              >
                <Text
                  style={{
                    fontFamily: font.semiBold,
                    fontSize: 16,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                >
                  Returning No of Roll
                </Text>
                <Text
                  style={{
                    fontFamily: font.regular,
                    fontSize: 14,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                >
                  <FiInput
                    value={batchItem.returnedRolls}
                    onChangeText={(event) =>
                      pickListChange(event, "returnedRolls", index)
                    }
                    keyboardType={"numeric"}
                    placeholder={"Enter No. of Rolls"}
                    style={styles.input}
                  />
                </Text>
              </View>
              <View
                style={{
                  padding: 5,
                  minWidth: "100%",
                }}
              >
                <Text
                  style={{
                    fontFamily: font.semiBold,
                    fontSize: 16,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                >
                  Price
                </Text>
                <Text
                  style={{
                    fontFamily: font.regular,
                    fontSize: 14,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                >
                  {item.sellingPrice}
                </Text>
              </View>
              <View
                style={{
                  padding: 5,
                  minWidth: "100%",
                }}
              >
                <Text
                  style={{
                    fontFamily: font.semiBold,
                    fontSize: 16,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                >
                  Reason
                </Text>
                <Text
                  style={{
                    fontFamily: font.regular,
                    fontSize: 14,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                >
                  <FiInput
                    value={batchItem.reason}
                    onChangeText={(event) =>
                      pickListChange(event, "reason", index)
                    }
                    placeholder={"Enter Reason"}
                    style={styles.input}
                  />
                </Text>
              </View>
            </View>
          );
        })}
      </View>
      <View
        style={{
          padding: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <FiButton
          title={"Close"}
          onPress={returnModalClose}
          style={styles.closeButton}
          titleStyle={{
            fontFamily: font.semiBold,
            color: common.PRIMARY_COLOR,
          }}
        />
        <FiButton
          title={returned ? "Already Returned" : "Return"}
          onPress={open}
          disabled={
            returned ||
            error ||
            0 >= returnedRolls ||
            returnedRolls >
            item?.pickList?.reduce(
              (total, item) => total + (item?.noOfRoll || 0),
              0
            )
          }
          style={styles.returnButton}
          titleStyle={{
            fontFamily: font.semiBold,
            color: "#fff",
            textAlign: "center",
            width: "80%",
          }}
        />
      </View>
      <RNModal visible={visible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Return</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to return the product?
            </Text>
            <View style={styles.modalButtonContainer}>
              <FiButton
                title={"close"}
                titleStyle={{
                  color: common.PRIMARY_COLOR,
                  fontFamily: font.semiBold,
                }}
                style={{
                  backgroundColor: "#fff",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderWidth: 1,
                  borderColor: common.PRIMARY_COLOR,
                  borderRadius: 5,
                  marginTop: 10,
                  height: 40,
                  width: "40%",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "0.2s",
                }}
                onPress={close}
              />
              <FiButton
                type="submit"
                title="Confirm"
                onPress={() => comfirmReturn(item)}
                style={{
                  backgroundColor: "#FF6F61",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                  marginTop: 10,
                  height: 40,
                  width: "40%",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "0.2s",
                }}
              />
            </View>
          </View>
        </View>
      </RNModal>
    </KeyboardAvoidingView>
  );
};

export default Return;

// Styles
const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  headerCell: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
  input: {
    width: "100%",
    maxWidth: 300,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    fontFamily: font.regular,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: font.semiBold,
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: font.regular,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  closeButton: {
    borderColor: "#FF6F61",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    height: 40,
    width: "49%",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.2s",
  },
  returnButton: {
    backgroundColor: "#FF6F61",
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    height: 40,
    width: "49%",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.2s",
  },
});
