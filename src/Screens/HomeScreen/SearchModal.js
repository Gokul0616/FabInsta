import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox, List } from "react-native-paper";
import Icon from "react-native-vector-icons/Feather";
import AlertBox from "../../Common/AlertBox";
import { backendUrl, common } from "../../Common/Common";
import { FiButton } from "../../Common/FiButton";
import { FiInput } from "../../Common/FiInput";
import {
  extractDisplayOrderData,
  findKeyAndId,
  findObjectByName,
  getChildren,
  processGroupedContent,
} from "../../Common/FilterData";
import { font } from "../../Common/Theme";
import api from "../../Service/api";

const SearchModal = ({
  isVisible,
  onClose,
  searchData,
  data,
  filterFromProduct,
}) => {
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const [categoryFilterChildren, setCategoryFilterChildren] = useState([]);
  const [filterResponseData, setFilterResponseData] = useState([]);
  const [expandedSection, setExpandedSection] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedItemsParent, setSelectedItemsParent] = useState([]);
  const [groupedContent, setGroupedContent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hardValue, setHardValue] = useState({
    Weight: { min: "", max: "" },
    Width: { min: "", max: "" },
    Price: { min: "", max: "" },
    MOQ: { val: "" },
  });
  const [finalHardCodeArray, setFinalHardCodeArray] = useState([]);
  const [isLoadingLeft, setIsLoadingLeft] = useState(true);
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
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [response1, response2] = await Promise.all([
        api.get("/product-category/filter"),
        api.get("/variant/filter"),
      ]);

      setFilterResponseData([...response1.response, ...response2.response]);

      const data1 = extractDisplayOrderData(response1.response);
      const data2 = extractDisplayOrderData(response2.response);

      const combinedData = processGroupedContent([
        ...data1,
        ...data2,

        { group: "BASIC", name: "Price" },
        { group: "BASIC", name: "Weight" },
        { group: "BASIC", name: "Width" },
        { group: "BASIC", name: "MOQ" },
      ]);

      setGroupedContent(combinedData);
      setExpandedSection("Garment Type");
    } catch (err) {
      console.error(err);
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
      setIsLoading(false);
    }
  };
  const hasAppliedFilter = useRef(false);

  useEffect(() => {
    if (!hasAppliedFilter.current && selectedItems.length > 0) {
      handleApplyFilter(selectedItems);
      hasAppliedFilter.current = true;
    }
  }, [selectedItems]);

  const countSelectedItems = (name) => {
    const colourCount = selectedItems.filter((item) =>
      Object.keys(item).includes(name)
    ).length;

    return colourCount;
  };

  const handleSetFabricContentRange = (child) => {
    const selectedChild = selectedItems.find(
      (item) =>
        item[expandedSection]?.categoryId.split("(")[0] ===
        child.categoryId.split("(")[0]
    );
    const numMinValue = Number(selectedChild[expandedSection].minValue);
    const numMaxValue = Number(selectedChild[expandedSection].maxValue);

    if (numMinValue > numMaxValue || numMinValue === numMaxValue) {
      setIsError({
        message: "Range Must be Less to Greater",
        heading: "Error",
        isRight: false,
        rightButtonText: "OK",
        triggerFunction: () => {},
        setShowAlert: () => {
          isError.setShowAlert(false);
        },
        showAlert: true,
      });
    } else if (numMaxValue > 100) {
      setIsError({
        message: "Maximum Value is 100 or less than 100",
        heading: "Error",
        isRight: false,
        rightButtonText: "OK",
        triggerFunction: () => {},
        setShowAlert: () => {
          isError.setShowAlert(false);
        },
        showAlert: true,
      });
    } else {
      const selectedChild = selectedItems.find(
        (item) =>
          item[expandedSection]?.categoryId.split("(")[0] ===
          child.categoryId.split("(")[0]
      );

      if (selectedChild) {
        const baseCategoryId = child.categoryId.split("(")[0];
        selectedChild[
          expandedSection
        ].categoryId = `${baseCategoryId}(${numMinValue}-${numMaxValue})`;
        handleApplyFilter();
      }
    }
  };
  const handleReset = () => {
    setSelectedItems([]);
    setSelectedItemsParent([]);
    setHardValue({
      Weight: { min: "", max: "" },
      Width: { min: "", max: "" },
      Price: { min: "", max: "" },
      MOQ: { val: "" },
    });
    setFinalHardCodeArray([]);
    setSearchText("");
  };
  const handleClose = () => {
    setSearchText("");
    handleReset();
    setExpandedSection("Garment Type");
    searchData([]);
    onClose();
  };
  const handleSelectSolidPattern = (item) => {
    setSelectedItems((prev) => {
      const updatedSelection = [...prev];
      const index = updatedSelection.findIndex(
        (patterns) =>
          Array.isArray(patterns["Solid / Pattern"]) &&
          patterns["Solid / Pattern"].some((pattern) => pattern.id === item.id)
      );

      if (index === -1) {
        updatedSelection.push({ [expandedSection]: [item] });
      } else {
        updatedSelection.splice(index, 1);
      }

      return updatedSelection;
    });
  };
  const handleSelectColor = (item) => {
    setSelectedItems((prev) => {
      const updatedSelection = [...prev];

      const index = updatedSelection.findIndex(
        (colorObj) =>
          Array.isArray(colorObj.Colour) &&
          colorObj.Colour.some((color) => color.id === item.id)
      );

      if (index === -1) {
        updatedSelection.push({ [expandedSection]: [item] });
      } else {
        updatedSelection.splice(index, 1);
      }

      return updatedSelection;
    });
  };
  useEffect(() => {
    const handleBackPress = () => {
      if (isVisible) {
        onClose();
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => {
      subscription.remove();
    };
  }, [isVisible, onClose]);

  const toggleSection = async (section) => {
    try {
      setIsLoadingLeft(true);

      const objNameArr = await findObjectByName(filterResponseData, section);
      if (objNameArr) {
        setCategoryFilter(objNameArr);

        const getChild = getChildren(objNameArr);
        setCategoryFilterChildren(getChild);
      }
    } catch (err) {
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
      setIsLoadingLeft(false);
    }
  };

  useEffect(() => {
    toggleSection(expandedSection);
    if (expandedSection == null) {
      setCategoryFilterChildren([]);
    }
  }, [expandedSection]);
  const handleResetSection = () => {
    if (!["Price", "Weight", "Width", "MOQ"].includes(expandedSection)) {
      if (expandedSection) {
        setSelectedItems((prevSelectedItems) => {
          return prevSelectedItems.filter(
            (garment) => !garment.hasOwnProperty(expandedSection)
          );
        });
        setSelectedItemsParent((prevSelectedItems) => {
          return prevSelectedItems.filter(
            (garment) => !garment.hasOwnProperty(expandedSection)
          );
        });
      } else if (
        ["Price", "Weight", "Width", "MOQ"].includes(expandedSection)
      ) {
        if (expandedSection === "MOQ") {
          setHardValue((prev) => ({
            ...prev,
            [expandedSection]: { val: "" },
          }));
        } else {
          setHardValue((prev) => ({
            ...prev,
            [expandedSection]: { min: "", max: "" },
          }));
        }
      }
    }
    setSearchText("");
  };

  const handleApplyFilter = () => {
    const res = [...selectedItems, ...finalHardCodeArray];
    searchData({ data: [res] });
    onClose();
  };
  useEffect(() => {
    let res = [];

    data.forEach((item) => {
      res.push(findKeyAndId(item, [...selectedItems, ...finalHardCodeArray]));
    });

    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.length === 0 && filterFromProduct) {
        return [filterFromProduct]; // Set filterFromProduct if selectedItems is empty
      }

      return res.reduce((acc, data) => {
        prevSelectedItems.forEach((item) => {
          const selectedKey = Object.keys(item)[0];
          const selectedValue = item[selectedKey];

          if (data?.id === (selectedValue[0]?.id || selectedValue.categoryId)) {
            acc.push({ [selectedKey]: selectedValue });
          }
        });
        return acc;
      }, []);
    });

    setSelectedItemsParent((prev) => {
      return res.reduce((acc, data) => {
        prev.forEach((item) => {
          const selectedKey = Object.keys(item)[0];
          const selectedValue = item[selectedKey];

          if (data?.id === (selectedValue[0]?.id || selectedValue.categoryId)) {
            acc.push({ [selectedKey]: selectedValue });
          }
        });
        return acc;
      }, []);
    });
  }, [data, filterFromProduct]);

  const closeAlert = () => {
    setIsError((prev) => ({ ...prev, showAlert: false }));
  };

  const filterItems = (items) => {
    if (!searchText) return items;

    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.child &&
          item.child.length > 0 &&
          filterItems(item.child).length > 0)
    );
  };

  const handleParentToggle = (parent) => {
    const isParentSelected = selectedItemsParent.some(
      (garment) => garment[expandedSection]?.categoryId === parent.categoryId
    );

    if (isParentSelected) {
      setSelectedItemsParent((prev) =>
        prev.filter(
          (garment) =>
            garment[expandedSection]?.categoryId !== parent?.categoryId &&
            !parent?.child.some(
              (child) =>
                child[expandedSection]?.categoryId ===
                garment[expandedSection]?.categoryId
            )
        )
      );

      setSelectedItems((prev) =>
        prev.filter(
          (garment) => garment[expandedSection]?.parentId !== parent.categoryId
        )
      );
    } else {
      setSelectedItemsParent((prev) => [
        ...prev,
        {
          [expandedSection]: parent,
        },
      ]);

      setSelectedItems((prev) => [
        ...prev,
        ...parent.child
          .map((child) => ({
            [expandedSection]: child,
          }))
          .filter(
            (childObj) =>
              !prev.some(
                (garment) =>
                  garment[expandedSection]?.categoryId ===
                  childObj[expandedSection]?.categoryId
              )
          ),
      ]);
      ``;
    }
  };
  const handleChildToggle = (child, item) => {
    let obj;
    if (expandedSection === "Fabric Content") {
      child.minValue = 0;
      child.maxValue = 100;
      const baseCategoryId = child.categoryId.split("(")[0];
      child.categoryId = `${baseCategoryId}(${child.minValue}-${child.maxValue})`;

      obj = {
        [expandedSection]: child,
      };
    } else {
      obj = {
        [expandedSection]: child,
      };
    }

    const isChildSelected = selectedItems.some((garment) =>
      garment[expandedSection]?.categoryId
        ? garment[expandedSection]?.categoryId === child.categoryId
        : false
    );

    if (isChildSelected) {
      setSelectedItems((prev) =>
        prev.filter(
          (garment) =>
            garment[expandedSection]?.categoryId !== child?.categoryId
        )
      );
    } else {
      setSelectedItems((prev) => [...prev, obj]);
    }

    const selectedChildrenCount = selectedItems.filter(
      (garment) => garment[expandedSection]?.parentId === item?.categoryId
    ).length;
    if (
      item?.child.length ===
      selectedChildrenCount + (isChildSelected ? -1 : 1)
    ) {
      setSelectedItemsParent((prev) => [
        ...prev,
        {
          [expandedSection]: item,
        },
      ]);
    } else if (item?.child.length === undefined) {
      return;
    } else {
      setSelectedItemsParent((prev) =>
        prev.filter(
          (garment) =>
            garment[expandedSection]?.categoryId !== item?.categoryId &&
            !item?.child.some(
              (child) =>
                child[expandedSection]?.categoryId ===
                garment[expandedSection]?.categoryId
            )
        )
      );
    }
  };
  const getSelectedLengthForSection = (children) => {
    return children.reduce((count, child) => {
      const isSelected = selectedItems.some(
        (garment) => garment[expandedSection]?.categoryId === child?.categoryId
      );

      let total = isSelected ? 1 : 0;

      if (child.child && child.child.length > 0) {
        total += getSelectedLengthForSection(child.child);
      }

      return count + total;
    }, 0);
  };

  const getMinValue = (child) => {
    const selectedChild = selectedItems.find(
      (item) =>
        item[expandedSection]?.categoryId.split("(")[0] ===
        child.categoryId.split("(")[0]
    );
    const res = selectedChild ? selectedChild[expandedSection].minValue : "";
    return res;
  };
  const getMaxValue = (child) => {
    const selectedChild = selectedItems.find(
      (item) =>
        item[expandedSection]?.categoryId.split("(")[0] ===
        child.categoryId.split("(")[0]
    );

    const res = selectedChild ? selectedChild[expandedSection].maxValue : "";
    return res;
  };

  const handleChangeMaxValue = (val, child) => {
    setSelectedItems((prev) => {
      const updatedItems = prev.map((item) => {
        if (
          item[expandedSection]?.categoryId.split("(")[0] ===
          child.categoryId.split("(")[0]
        ) {
          return {
            ...item,
            [expandedSection]: {
              ...item[expandedSection],
              maxValue: val,
            },
          };
        }
        return item;
      });
      return updatedItems;
    });
  };

  const handleChangeMinValue = (val, child) => {
    setSelectedItems((prev) => {
      const updatedItems = prev.map((item) => {
        if (
          item[expandedSection]?.categoryId.split("(")[0] ===
          child.categoryId.split("(")[0]
        ) {
          return {
            ...item,
            [expandedSection]: {
              ...item[expandedSection],
              minValue: val,
            },
          };
        }
        return item;
      });
      return updatedItems;
    });
  };
  const handleHardCodeApplyMOQ = (val, item) => {
    if (item === "MOQ") {
      const val = Number(hardValue[item].val);

      const obj = {
        [item]: [val.toString()],
      };

      setFinalHardCodeArray((prev) => {
        const index = prev.findIndex((existingObj) => existingObj[item]);

        if (index !== -1) {
          prev[index] = obj;
        } else {
          prev.push(obj);
        }

        return [...prev];
      });
      handleApplyFilter();
    }
  };
  const handleHardCodeApply = (min, max, item) => {
    const numMinValue = Number(hardValue[item].min);
    const numMaxValue = Number(hardValue[item].max);
    if (numMaxValue === 0 || numMinValue === 0) {
      setIsError({
        message: "Please Enter Values",
        heading: "Error",
        isRight: false,
        rightButtonText: "OK",
        triggerFunction: () => {},
        setShowAlert: () => {
          isError.setShowAlert(false);
        },
        showAlert: true,
      });
    } else if (numMinValue > numMaxValue || numMinValue === numMaxValue) {
      setIsError({
        message: "Range Must be Less to Greater",
        heading: "Error",
        isRight: false,
        rightButtonText: "OK",
        triggerFunction: () => {},
        setShowAlert: () => {
          isError.setShowAlert(false);
        },
        showAlert: true,
      });
    } else {
      const obj = {
        [item]: [min, max].map((value) => value.toString()),
      };

      setFinalHardCodeArray((prev) => {
        const index = prev.findIndex((existingObj) => existingObj[item]);

        if (index !== -1) {
          prev[index] = obj;
        } else {
          prev.push(obj);
        }

        return [...prev];
      });
      handleApplyFilter();
    }
  };
  const renderAccordion = (item, depth) => {
    return (
      <View key={item.name} style={{}}>
        <View
          style={{
            flexDirection: "row",
            marginLeft:
              expandedSection !== "Fabric Content" && depth >= 1 ? 10 : 0,
            padding: 0,
            flex: 1,
            maxWidth: "90%",
            minWidth: "90%",
          }}
        >
          {expandedSection !== "Fabric Content" && depth === 1 && (
            <View
              style={{
                paddingTop: 15,
                height: "100%",
                width: "auto",
              }}
            >
              <Checkbox
                onPress={() => handleParentToggle(item)}
                color={common.PRIMARY_COLOR}
                status={
                  selectedItemsParent.some(
                    (garment) =>
                      garment[expandedSection]?.categoryId &&
                      garment[expandedSection]?.categoryId === item.categoryId
                  )
                    ? "checked"
                    : "unchecked"
                }
              />
            </View>
          )}
          <List.Accordion
            title={item.name}
            style={[
              styles.accordion,
              {
                alignItems: "center",
                minWidth: "100%",
                maxWidth: "100%",
                padding: 0,
              },
            ]}
            contentStyle={{
              marginLeft: 0,
              paddingLeft: 0,
            }}
            titleStyle={[
              styles.accordionTitle,
              {
                fontFamily:
                  expandedSection !== "Fabric Content" && depth === 1
                    ? font.regular
                    : font.semiBold,
              },
            ]}
            theme={{
              colors: { primary: styles.accordionTitle.color },
            }}
          >
            {item.child.map((child) =>
              child.child && child.child.length > 0 ? (
                renderAccordion(child, depth + 1)
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    if (expandedSection !== "Fabric Content") {
                      handleChildToggle(child, item);
                    } else {
                      handleChildToggle(child);
                    }
                  }}
                  style={{}}
                  key={child.name}
                >
                  {selectedItems.some(
                    (garment) =>
                      garment[expandedSection]?.categoryId.split("(")[0] ===
                      child.categoryId.split("(")[0]
                  ) && expandedSection === "Fabric Content" ? (
                    <View
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        paddingLeft: 8,
                        flex: 1,
                      }}
                    >
                      <View
                        style={{
                          paddingTop: 15,
                          height: "100%",
                          width: "auto",
                        }}
                      >
                        <Checkbox
                          color={common.PRIMARY_COLOR}
                          status="checked"
                        />
                      </View>
                      <List.Accordion
                        title={child.name}
                        style={[
                          styles.listItem,
                          {
                            alignItems: "center",
                            backgroundColor: "#fff",
                            minWidth: "90%",
                            maxWidth: "90%",
                            padding: 0,
                          },
                        ]}
                        contentStyle={{
                          marginLeft: 0,
                          paddingLeft: 0,
                        }}
                        titleStyle={[
                          styles.listItem,

                          {
                            fontSize: 14,
                          },
                        ]}
                        theme={{
                          colors: { primary: styles.accordionTitle.color },
                        }}
                      >
                        <View
                          style={{
                            minWidth: "80%",
                            maxWidth: "80%",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              flex: 1,
                              alignItems: "center",
                              justifyContent: "space-around",
                            }}
                          >
                            <FiInput
                              keyboardType={"numeric"}
                              style={styles.rangeInput}
                              placeholder={"0"}
                              maxLength={2}
                              value={getMinValue(child)}
                              onChangeText={(val) =>
                                handleChangeMinValue(val, child)
                              }
                            />

                            <Text>-</Text>
                            <FiInput
                              style={styles.rangeInput}
                              maxLength={3}
                              keyboardType={"numeric"}
                              onChangeText={(val) =>
                                handleChangeMaxValue(val, child)
                              }
                              placeholder={"100"}
                              value={getMaxValue(child)}
                            />
                          </View>
                          <FiButton
                            style={[styles.applyButton]}
                            title={"Apply"}
                            titleStyle={styles.applyButtonText}
                            onPress={() => handleSetFabricContentRange(child)}
                          />
                        </View>
                      </List.Accordion>
                    </View>
                  ) : (
                    <List.Item
                      key={child.name}
                      title={child.name}
                      style={[
                        styles.listItem,
                        {
                          height: 50,
                          minWidth:
                            expandedSection === "Fabric Content"
                              ? "100%"
                              : "80%",
                          marginLeft: 10,
                        },
                      ]}
                      titleStyle={[
                        styles.listItem,
                        {
                          marginLeft: 0,
                          width: "100%",
                        },
                      ]}
                      left={() => (
                        <Checkbox
                          color={common.PRIMARY_COLOR}
                          status={
                            selectedItems.some(
                              (garment) =>
                                garment[expandedSection]?.categoryId &&
                                garment[expandedSection]?.categoryId ===
                                  child.categoryId
                            )
                              ? "checked"
                              : "unchecked"
                          }
                        />
                      )}
                    />
                  )}
                </TouchableOpacity>
              )
            )}
          </List.Accordion>
        </View>
      </View>
    );
  };
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <AlertBox
        heading={isError.heading}
        message={isError.message}
        setShowAlert={closeAlert}
        showAlert={isError.showAlert}
        triggerFunction={isError.triggerFunction}
        isRight={isError.isRight}
        rightButtonText={isError.rightButtonText}
      />
      {isLoading && (
        <View style={styles.loadingOverlay} pointerEvents="auto">
          <ActivityIndicator size="large" color={common.PRIMARY_COLOR} />
        </View>
      )}
      {!isLoading && (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose}>
              <Icon name="x" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { fontFamily: font.bold }]}>
              Search Filters
            </Text>
            <TouchableOpacity
              onPress={() => {
                handleResetSection();
              }}
            >
              <Text style={[styles.resetText, { fontFamily: font.regular }]}>
                Reset
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mainContent}>
            <ScrollView
              style={{
                width: "34%",
                borderRightWidth: 1,
                borderRightColor: "#ddd",
              }}
              contentContainerStyle={styles.leftSection}
            >
              {groupedContent.map(({ groupName, items }) => (
                <View key={groupName}>
                  <Text
                    key={groupName}
                    style={[styles.filterHeaderLabel, { marginBottom: 16 }]}
                  >
                    {groupName}
                  </Text>
                  {items.map((item) => (
                    <TouchableOpacity
                      key={item.name}
                      style={styles.filterOption}
                      onPress={() => {
                        setSearchText("");
                        setExpandedSection(
                          expandedSection === item.name ? null : item.name
                        );
                      }}
                    >
                      <Text
                        style={
                          (styles.categoryText,
                          {
                            marginBottom: 10,
                            fontFamily: font.regular,
                            ...(expandedSection == item.name
                              ? {
                                  fontFamily: font.semiBold,
                                }
                              : {}),
                          })
                        }
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </ScrollView>

            <ScrollView
              style={{ width: "66%" }}
              contentContainerStyle={styles.rightSection}
            >
              {isLoadingLeft && (
                <View style={styles.loadingOverlay} pointerEvents="auto">
                  <ActivityIndicator
                    size="large"
                    color={common.PRIMARY_COLOR}
                  />
                </View>
              )}
              {expandedSection == null && (
                <Text style={[styles.filterLabel]}>Select Filter</Text>
              )}
              {![
                "Colour",
                "Solid / Pattern",
                "Price",
                "Weight",
                "MOQ",
                "Width",
                null,
              ].includes(expandedSection) && (
                <View style={styles.filterSection}>
                  <Text style={[styles.filterLabel]}>{expandedSection}</Text>
                  <Text style={[styles.categoryText]}>
                    Selected (
                    {getSelectedLengthForSection(categoryFilterChildren)})
                  </Text>
                  <FiInput
                    style={styles.searchInput}
                    placeholder={`Search ${expandedSection}`}
                    value={searchText}
                    onChangeText={setSearchText}
                  />

                  {categoryFilterChildren.length > 0 &&
                    filterItems(categoryFilterChildren).map((item) => (
                      <View key={item.name} style={{ overflow: "hidden" }}>
                        {item.child && item.child.length > 0 ? (
                          renderAccordion(item, 0)
                        ) : (
                          <TouchableOpacity
                            onPress={() => handleChildToggle(item)}
                            style={styles.checkboxRow}
                          >
                            <Checkbox
                              color={common.PRIMARY_COLOR}
                              status={
                                selectedItems.some(
                                  (garment) =>
                                    garment[expandedSection]?.categoryId &&
                                    garment[expandedSection]?.categoryId ===
                                      item.categoryId
                                )
                                  ? "checked"
                                  : "unchecked"
                              }
                            />
                            <Text style={styles.listItem}>{item.name}</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}
                </View>
              )}
              {expandedSection === "Colour" &&
                categoryFilter.name === "Colour" && (
                  <View style={styles.filterSection}>
                    <Text style={[styles.filterLabel]}>Color Options</Text>
                    <Text style={[styles.categoryText]}>
                      Selected ({countSelectedItems(expandedSection)})
                    </Text>
                    <View style={styles.rowContainer}>
                      {categoryFilterChildren.map((item) => (
                        <TouchableOpacity
                          key={item.name}
                          style={[styles.colorOptionRow, {}]}
                          onPress={() => {
                            handleSelectColor(item);
                          }}
                        >
                          <Text
                            style={[
                              styles.tickMark,
                              {
                                color: selectedItems.some(
                                  (colorObj) =>
                                    Array.isArray(colorObj.Colour) &&
                                    colorObj.Colour.some(
                                      (color) => color.id === item.id
                                    )
                                )
                                  ? common.PRIMARY_COLOR
                                  : "#ccc",
                              },
                            ]}
                          >
                            ✓
                          </Text>

                          <View
                            style={[
                              styles.colorBox,
                              { backgroundColor: item.hexaColorCode },
                            ]}
                          />
                          <Text style={[styles.colorLabel, { color: "black" }]}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              {expandedSection === "Solid / Pattern" && (
                <View style={styles.filterSection}>
                  <Text style={[styles.filterLabel]}>Solid / Pattern</Text>
                  <Text style={[styles.categoryText]}>
                    Selected ({countSelectedItems(expandedSection)})
                    {/* Fixed typo from "lenght" to "length" */}
                  </Text>
                  <View style={styles.rowContainer}>
                    {categoryFilterChildren.map((item) => (
                      <TouchableOpacity
                        key={item.name}
                        style={[
                          styles.patternOptionRow,
                          selectedItems.some(
                            (patterns) =>
                              Array.isArray(patterns["Solid / Pattern"]) &&
                              patterns["Solid / Pattern"].some(
                                (pattern) => pattern.id === item.id
                              )
                          ) && {
                            borderColor: common.PRIMARY_COLOR,
                            borderWidth: 2,
                          },
                        ]}
                        onPress={() => handleSelectSolidPattern(item)}
                      >
                        <Image
                          source={{
                            uri: backendUrl + item?.image?.replace("/api", ""),
                          }}
                          style={styles.patternImage}
                        />
                        <Text style={[styles.patternLabel, { color: "black" }]}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {expandedSection === "Weight" && (
                <View style={styles.filterSection}>
                  <Text style={[styles.filterLabel]}>Weight</Text>
                  <View>
                    <View style={styles.switchRow}>
                      <FiInput
                        value={hardValue[expandedSection]["min"]}
                        keyboardType={"numeric"}
                        onChangeText={(val) => {
                          setHardValue((prev) => ({
                            ...prev,
                            [expandedSection]: {
                              ...prev[expandedSection],
                              min: val,
                            },
                          }));
                        }}
                        style={[
                          styles.rangeInput,
                          { minWidth: "40%", maxWidth: "40%" },
                        ]}
                        placeholder={"min"}
                      />
                      <Text>-</Text>
                      <FiInput
                        keyboardType={"numeric"}
                        value={hardValue[expandedSection]["max"]}
                        onChangeText={(val) => {
                          setHardValue((prev) => ({
                            ...prev,
                            [expandedSection]: {
                              ...prev[expandedSection],
                              max: val,
                            },
                          }));
                        }}
                        style={[
                          styles.rangeInput,
                          { minWidth: "40%", maxWidth: "40%" },
                        ]}
                        placeholder={"max"}
                      />
                      <Text style={{ fontFamily: font.medium }}>gsm</Text>
                    </View>
                    <FiButton
                      style={styles.applyButton}
                      titleStyle={styles.applyButtonText}
                      onPress={() =>
                        handleHardCodeApply(
                          hardValue[expandedSection].min,
                          hardValue[expandedSection].max,
                          expandedSection
                        )
                      }
                      title={"Apply"}
                    />
                  </View>
                </View>
              )}
              {expandedSection === "Width" && (
                <View style={styles.filterSection}>
                  <Text style={[styles.filterLabel]}>Width</Text>
                  <View>
                    <View style={styles.switchRow}>
                      <FiInput
                        keyboardType={"numeric"}
                        value={hardValue[expandedSection]["min"]}
                        onChangeText={(val) => {
                          setHardValue((prev) => ({
                            ...prev,
                            [expandedSection]: {
                              ...prev[expandedSection],
                              min: val,
                            },
                          }));
                        }}
                        style={[
                          styles.rangeInput,
                          { minWidth: "40%", maxWidth: "40%" },
                        ]}
                        placeholder={"min"}
                      />
                      <Text>-</Text>
                      <FiInput
                        keyboardType={"numeric"}
                        value={hardValue[expandedSection]["max"]}
                        onChangeText={(val) => {
                          setHardValue((prev) => ({
                            ...prev,
                            [expandedSection]: {
                              ...prev[expandedSection],
                              max: val,
                            },
                          }));
                        }}
                        style={[
                          styles.rangeInput,
                          { minWidth: "40%", maxWidth: "40%" },
                        ]}
                        placeholder={"max"}
                      />
                      <Text style={{ fontFamily: font.medium }}>Inch</Text>
                    </View>
                    <FiButton
                      style={styles.applyButton}
                      titleStyle={styles.applyButtonText}
                      title={"Apply"}
                      onPress={() =>
                        handleHardCodeApply(
                          hardValue[expandedSection].min,
                          hardValue[expandedSection].max,
                          expandedSection
                        )
                      }
                    />
                  </View>
                </View>
              )}
              {expandedSection === "MOQ" && (
                <View style={styles.filterSection}>
                  <Text style={[styles.filterLabel]}>MOQ</Text>
                  <View>
                    <View style={styles.switchRow}>
                      <Text
                        style={{
                          fontFamily: font.regular,
                        }}
                      >
                        Less than
                      </Text>
                      <FiInput
                        value={hardValue[expandedSection]["val"]}
                        keyboardType={"numeric"}
                        onChangeText={(val) => {
                          setHardValue((prev) => ({
                            ...prev,
                            [expandedSection]: {
                              ...prev[expandedSection],
                              val: val,
                            },
                          }));
                        }}
                        style={[
                          styles.rangeInput,
                          { minWidth: "40%", maxWidth: "40%" },
                        ]}
                        placeholder={"moq"}
                      />
                      <Text style={{ fontFamily: font.medium }}>kg</Text>
                    </View>
                    <FiButton
                      style={styles.applyButton}
                      titleStyle={styles.applyButtonText}
                      title={"Apply"}
                      onPress={() =>
                        handleHardCodeApplyMOQ(
                          hardValue[expandedSection].val,
                          expandedSection
                        )
                      }
                    />
                  </View>
                </View>
              )}
              {expandedSection === "Price" && (
                <View style={styles.filterSection}>
                  <Text style={[styles.filterLabel]}>Price </Text>
                  <View>
                    <View style={styles.switchRow}>
                      <FiInput
                        keyboardType={"numeric"}
                        value={hardValue[expandedSection]["min"]}
                        onChangeText={(val) => {
                          setHardValue((prev) => ({
                            ...prev,
                            [expandedSection]: {
                              ...prev[expandedSection],
                              min: val,
                            },
                          }));
                        }}
                        style={[
                          styles.rangeInput,
                          { minWidth: "40%", maxWidth: "40%" },
                        ]}
                        placeholder={"min"}
                      />
                      <Text>-</Text>
                      <FiInput
                        keyboardType={"numeric"}
                        value={hardValue[expandedSection]["max"]}
                        onChangeText={(val) => {
                          setHardValue((prev) => ({
                            ...prev,
                            [expandedSection]: {
                              ...prev[expandedSection],
                              max: val,
                            },
                          }));
                        }}
                        style={[
                          styles.rangeInput,
                          { minWidth: "40%", maxWidth: "40%" },
                        ]}
                        placeholder={"0"}
                      />
                      <Text style={{ fontFamily: font.medium }}>₹</Text>
                    </View>
                    <FiButton
                      style={styles.applyButton}
                      titleStyle={styles.applyButtonText}
                      title={"Apply"}
                      onPress={() =>
                        handleHardCodeApply(
                          hardValue[expandedSection].min,
                          hardValue[expandedSection].max,
                          expandedSection
                        )
                      }
                    />
                  </View>
                </View>
              )}
            </ScrollView>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.applyButton]}
              onPress={handleApplyFilter}
            >
              <Text style={[styles.applyButtonText, { fontFamily: font.bold }]}>
                Apply Filters
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: "#D3D3D3" }]}
              onPress={handleClose}
            >
              <Text
                style={[
                  styles.applyButtonText,
                  { fontFamily: font.bold, color: "#000" },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Modal>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  headerTitle: {
    fontSize: 18,
    color: "#000",
  },
  resetText: {
    fontSize: 14,
    color: "#FF6F61",
  },
  mainContent: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
  },
  leftSection: {
    padding: 10,
  },
  rightSection: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  filterSection: {},
  filterLabel: {
    fontSize: 16,
    fontFamily: font.medium,
    marginBottom: 10,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 8,
  },
  filterHeaderLabel: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    fontFamily: font.bold,
    fontSize: 15,
  },
  filterOption: {
    paddingVertical: 5,
  },

  footer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: common.PRIMARY_COLOR,
    marginHorizontal: 4,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    marginVertical: 10,
    fontSize: 16,
    fontFamily: font.regular,
  },
  rangeInput: {
    minWidth: "35%",
    maxWidth: "40%",
    maxHeight: 40,
    minHeight: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    marginVertical: 10,
    fontSize: 16,
    fontFamily: font.regular,
  },
  garmentList: {
    maxHeight: 200,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 0,
    paddingVertical: 0,
  },
  garmentLabel: {
    flex: 1,
    flexWrap: "wrap",
    fontSize: 14,
    maxWidth: "90%",
    textAlign: "left",
    fontFamily: font.semiBold,
    lineBreakMode: "clip",
  },

  categoryText: {
    fontSize: 14,
    marginLeft: 8,
    fontFamily: font.regular,
    color: "#555",
  },
  fabric_contentHeading: {
    fontFamily: font.semiBold,
    fontSize: 16,
  },
  colorOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    marginVertical: 2,
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 8,
  },
  colorLabel: {
    fontSize: 14,
    color: "#555",
    fontFamily: font.regular,
  },
  tickMark: {
    fontSize: 16,
    color: common.PRIMARY_COLOR,
    width: 24,
    height: 24,
  },
  patternOptionRow: {
    flexDirection: "column",
    alignItems: "center",
    margin: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  patternImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 4,
  },
  patternLabel: {
    fontSize: 14,
    fontFamily: font.regular,
    textAlign: "center",
  },
  accordion: {
    backgroundColor: "#fff",
  },
  accordionTitle: {
    fontSize: 16,
    color: "#333",
    fontFamily: font.semiBold,
    alignItems: "center",

    width: "100%",
  },
  listItem: {
    backgroundColor: "transparent",
    fontFamily: font.regular,
    fontSize: 14,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
});
