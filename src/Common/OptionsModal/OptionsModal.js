import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { font } from "../Theme";

const OptionsModal = ({ isVisible, onClose, options }) => {
  const groupedOptions = options.reduce((acc, item) => {
    if (!acc[item.order]) {
      acc[item.order] = [];
    }
    acc[item.order].push(item);
    return acc;
  }, {});

  const renderOptions = () =>
    Object.keys(groupedOptions)
      .sort((a, b) => a - b)
      .map((order) => {
        const group = groupedOptions[order].sort(
          (a, b) => a.displayOrder - b.displayOrder
        );
        return (
          <View key={order}>
            {group.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionItem}
                onPress={() => {
                  item.onPress();
                  onClose();
                }}
              >
                {item.icon && <Icon name={item.icon} size={18} color="#333" />}
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.divider} />
          </View>
        );
      });

  return (
    <Modal visible={isVisible} transparent onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.optionsModal}>{renderOptions()}</View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  optionsModal: {
    position: "absolute",
    top: 50,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
    width: 200,
    padding: 10,
    zIndex: 99999,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  optionText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
    fontFamily: font.semiBold,
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 8,
  },
});

export default OptionsModal;
