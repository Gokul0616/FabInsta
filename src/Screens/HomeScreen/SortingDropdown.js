import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { font } from "../../Common/Theme";
import { common } from "../../Common/Common";
import Icon from "react-native-vector-icons/Feather";

const DropdownComponent = ({
  initialValue = "New False",
  setFilterDropdownValue,
  data,
}) => {
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState(initialValue);

  // Log the value when it changes
  useEffect(() => {
    if (value) {
      setFilterDropdownValue(value);
    } else if (initialValue.length == 0) {
      setValue("New False");
    }
  }, [value]);

  return (
    <View style={styles.container}>
      <Dropdown
        style={[
          styles.dropdown,
          isFocus && { borderColor: common.PRIMARY_COLOR },
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        itemTextStyle={styles.itemTextStyle}
        itemContainerStyle={styles.itemContainerStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={value}
        value={value} // Bind selected value directly
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value); // Update local state
        }}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "50%",
  },

  dropdown: {
    height: 30,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  itemTextStyle: {
    fontSize: 12,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    fontSize: 12,
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: font.medium,
  },
  itemContainerStyle: { height: 50 },
  selectedTextStyle: {
    fontSize: 12,
    fontFamily: font.regular,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
