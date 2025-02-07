import {
  CommonActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import _ from "lodash";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Checkbox } from "react-native-paper";
import Icon from "react-native-vector-icons/AntDesign";
import FeatherIcon from "react-native-vector-icons/Feather";
import api from "../../Service/api";
import CartProductSelect from "./CartProductSelect";
import CartVariant from "./CartVariant";
import ComboCartVariant from "./ComboCartVariant";
import ProceedCart from "./ProceedCart";
import { common } from "../../Common/Common";
import { font } from "../../Common/Theme";
import EditCart from "./EditCart";

const CartDetails = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectProductGroup, setSelectProductGroup] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [disableSelectAll, setDisableSelectAll] = useState(false);
  const [sample, setSample] = useState([]);
  const [wholesale, setWholesale] = useState([]);
  const [combo, setCombo] = useState([]);
  const [swatch, setSwatch] = useState([]);
  const [activeIndex, setActiveIndex] = useState("sample");
  const comboCart = activeIndex === "combo";
  const sampleCart = activeIndex === "sample";
  const wholesaleCart = activeIndex === "wholesale";
  const swatchCart = activeIndex === "swatch";
  const [sampleSelected, setSampleSelected] = useState([]);
  const [wholesaleSelected, setWholesaleSelected] = useState([]);
  const [swatchSelected, setSwatchSelected] = useState([]);
  const [comboSelected, setComboSelected] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sampleMoq, setSampleMoq] = useState();
  const [wholesaleMoq, setWholesaleMoq] = useState();
  const [price, setPrice] = useState([]);
  const [credit, setCredit] = useState(0);
  const navigation = useNavigation();
  const route = useRoute();
  const [editOpenModal, setEditOpenModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (route?.params?.cartType) {
      const type = route.params.cartType;
      setActiveIndex(type?.toLowerCase());
    }
    fetchCarts();
    fetchCustomer();
  }, [route]);

  // useEffect(()=>{})

  const fetchCustomer = async () => {
    const res = await api.get(`customer/swatchPoint`);
    setCredit(res.response);
  };

  const fetchCarts = async (recalculate = false, editItem) => {
    try {
      const response = await api.get("cart/getall");
      const combo = await api.get("cart/comboCart");
      const Swatch = await api.get("cart/swatchCart");
      const varinatSkus = response.response.map((item) => item.pimVariantId);
      const priceResponse = await api.get(
        `pricebook/priceSlabBySkus?VariantIds=${varinatSkus}`
      );
      setPrice(priceResponse.response);
      const filteredData = _.filter(response.response, (cart) => {
        return cart.cartType === "SAMPLE";
      });
      const wholeSaleData = _.filter(response.response, (cart) => {
        return cart.cartType === "WHOLESALE";
      });
      const swatchData = Swatch.response;
      const comboData = combo.response;
      const groupedSampleList = _.groupBy(filteredData, "articleCode");
      const groupedWholeSaleList = _.groupBy(wholeSaleData, "articleCode");
      const groupedswatchDataList = _.groupBy(swatchData, "articleCode");
      const moqs = await api.get("customer/moq");
      const { sampleMoq, wholesaleMoq } = moqs?.response;
      setSampleMoq(sampleMoq);
      setWholesaleMoq(wholesaleMoq);
      setWholesale(groupedWholeSaleList);
      setCombo(comboData);
      setSwatch(groupedswatchDataList);
      setSample(groupedSampleList);
      if (recalculate) {
        let selectedArray;
        switch (editItem.cartType) {
          case "SAMPLE":
            selectedArray = sampleSelected;
            break;
          case "WHOLESALE":
            selectedArray = wholesaleSelected;
            break;
          case "COMBO":
            selectedArray = comboSelected;
            break;
          case "SWATCH":
            selectedArray = swatchSelected;
            break;
          default:
            selectedArray = [];
        }
        const updatedQty = selectedArray.map((item) =>
          item.id === editItem.id ? editItem : item
        );
        if (editItem.cartType === "SAMPLE") {
          setSampleSelected(updatedQty);
        } else {
          setWholesaleSelected(updatedQty);
        }
      }
    } catch (error) {
      console.error("Error fetching ultron:", error);
    }
  };

  const calculateTotalCount = (data) => {
    return Object.values(data).reduce(
      (sum, variants) => sum + variants.length,
      0
    );
  };

  const calculateComboTotalCount = (data) => {
    return data.length;
  };

  const calculateComboAvailableCount = (data) => {
    return Object.values(data).reduce((sum, combo) => {
      if (combo.variants.length > 0) {
        return sum + 1;
      } else {
        return 0;
      }
    }, 0);
  };

  const calculateTotalAvailableCount = (data) => {
    return Object.values(data).reduce((sum, variants) => {
      const publishedVariants = variants.filter(
        (variant) =>
          variant.published === "true" &&
          !(!variant.backOrder && variant.outOfStock) &&
          !variant?.comboVariants?.includes(variant?.variantSku)
      );
      return sum + publishedVariants.length;
    }, 0);
  };

  useEffect(() => {
    const getTotalCountAndSelectState = (cartData, selectedItems) => {
      const totalCount = comboCart
        ? calculateComboAvailableCount(cartData)
        : calculateTotalAvailableCount(cartData);
      const isAllSelected =
        totalCount > 0 && totalCount === selectedItems.length;
      return { totalCount, isAllSelected };
    };
    let totalCount = 0;
    let isAllSelected = false;
    if (sampleCart) {
      const { totalCount: sampleTotal, isAllSelected: sampleIsAllSelected } =
        getTotalCountAndSelectState(sample, sampleSelected);
      totalCount = sampleTotal;
      isAllSelected = sampleIsAllSelected;
    } else if (wholesaleCart) {
      const {
        totalCount: wholesaleTotal,
        isAllSelected: wholesaleIsAllSelected,
      } = getTotalCountAndSelectState(wholesale, wholesaleSelected);
      totalCount = wholesaleTotal;
      isAllSelected = wholesaleIsAllSelected;
    } else if (comboCart) {
      const { totalCount: comboTotal, isAllSelected: comboIsAllSelected } =
        getTotalCountAndSelectState(combo, comboSelected);
      totalCount = comboTotal;
      isAllSelected = comboIsAllSelected;
    } else if (swatchCart) {
      const { totalCount: swatchTotal, isAllSelected: swatchIsAllSelected } =
        getTotalCountAndSelectState(swatch, swatchSelected);
      totalCount = swatchTotal;
      isAllSelected = swatchIsAllSelected;
    } else {
      setSelectAll(false);
      return;
    }
    setSelectAll(isAllSelected);

    setDisableSelectAll(totalCount === 0);
  }, [
    sample,
    wholesale,
    combo,
    swatch,
    sampleSelected,
    wholesaleSelected,
    comboSelected,
    swatchSelected,
    activeIndex,
  ]);

  // get item count and total price function
  const getItemCountAndTotalPrice = () => {
    let selectedItems = [];
    let priceSlab = {};

    switch (activeIndex) {
      case "sample":
        priceSlab = filterDataByType("SAMPLE");
        selectedItems = sampleSelected;
        break;
      case "wholesale":
        priceSlab = filterDataByType("WHOLESALE");
        selectedItems = wholesaleSelected;
        break;
      case "combo":
        selectedItems = comboSelected;
        break;
      case "swatch":
        selectedItems = swatchSelected;
        break;
      default:
        break;
    }
    const itemCount = selectedItems.length;
    const totalPrice = selectedItems.reduce((total, item) => {
      const discount = priceSlab[item.pimVariantId]?.[0]?.discount || 0;
      const price = comboCart
        ? item.combo.sellingPrice * (1 - discount / 100)
        : item.sellingPrice * (1 - discount / 100);
      const parsedPrice = isNaN(price) ? 0 : parseFloat(price).toFixed(2);
      const quantity =
        parseInt(
          comboCart
            ? item.combo.quantity * item.combo.comboVariants.length
            : item.quantity,
          10
        ) || 0;
      return total + parsedPrice * quantity;
    }, 0);
    return `${itemCount} items ∙ ₹ ${totalPrice.toFixed(2)}`;
  };

  const filterDataByType = (orderType) => {
    const filteredResult = {};
    Object.keys(price).forEach((key) => {
      const items = price[key];
      if (Array.isArray(items)) {
        const filteredItems = items.filter(
          (item) => item.orderType === orderType
        );

        if (filteredItems.length > 0) {
          filteredResult[key] = filteredItems;
        }
      }
    });
    return filteredResult;
  };

  const handleSelectAllChange = () => {
    const filterValidComboItems = (items) => {
      return items.filter((item) => {
        return item?.variants?.length > 0;
      });
    };
    const filterValidItems = (items) => {
      return _.filter(
        items,
        (item) =>
          item.published === "true" &&
          !(item.backOrder === false && item.outOfStock === true) &&
          !item?.comboVariants?.includes(item?.variantSku)
      );
    };
    let selectedItems = [];
    const itemsMap = {
      sample: sample,
      wholesale: wholesale,
      combo: combo,
      swatch: swatch,
    };
    if (["sample", "wholesale", "swatch"].includes(activeIndex)) {
      const allItems = Object.values(itemsMap[activeIndex]).flat();
      selectedItems = selectAll === false ? filterValidItems(allItems) : [];
      if (sampleCart) {
        setSampleSelected(selectedItems);
      } else if (wholesaleCart) {
        setWholesaleSelected(selectedItems);
      } else if (swatchCart) {
        setSwatchSelected(selectedItems);
      }
    }
    if (comboCart) {
      selectedItems = selectAll === false ? filterValidComboItems(combo) : [];
      setComboSelected(selectedItems);
    }
    setSelectAll(!selectAll);
  };

  const selectedStatus = (items) => {
    let validItems = [];
    if (activeIndex !== "combo") {
      validItems = items?.filter(
        (variant) =>
          variant.published === "true" &&
          !(!variant.backOrder && variant.outOfStock)
      );
    }
    let selectedList = [];
    switch (activeIndex) {
      case "sample":
        selectedList = sampleSelected;
        break;
      case "wholesale":
        selectedList = wholesaleSelected;
        break;
      case "swatch":
        selectedList = swatchSelected;
        break;
      case "combo":
        selectedList = comboSelected;
        break;
      default:
        selectedList = [];
        break;
    }
    const allSelected = validItems.every((item) =>
      selectedList?.some((selectedItem) => selectedItem.id === item.id)
    );
    const hasValidItems = validItems?.length > 0;
    return allSelected && hasValidItems;
  };

  const handleTotalChange = (items, event) => {
    switch (activeIndex) {
      case "sample":
        setSampleSelected((prev) => updateSelectedItems(prev, items));
        break;
      case "wholesale":
        setWholesaleSelected((prev) => updateSelectedItems(prev, items));
        break;
      case "swatch":
        setSwatchSelected((prev) => updateSelectedItems(prev, items));
        break;
      default:
        break;
    }
    const updateSelectedItems = (prevSelected, items) => {
      if (selectProductGroup === false) {
        return [
          ...prevSelected,
          ...filterValidItems(items).filter(
            (item) =>
              !prevSelected.some((selectedItem) => selectedItem.id === item.id)
          ),
        ];
      } else {
        return prevSelected.filter(
          (selectedItem) => !items.some((item) => item.id === selectedItem.id)
        );
      }
    };
    const filterValidItems = (items) => {
      return items.filter(
        (item) =>
          item.published === "true" &&
          !(item.backOrder === false && item.outOfStock === true) &&
          !item?.comboVariants?.includes(item?.variantSku)
      );
    };
    setSelectProductGroup(!selectProductGroup);
  };

  const handleComboTotalChange = (item, event) => {
    setComboSelected((prevSelectedItems) =>
      updateComboselection(prevSelectedItems, item)
    );
  };

  const updateComboselection = (prevSelectedItems, ...items) => {
    const selectedSet = new Set(prevSelectedItems.map((item) => item.combo.id));
    const updatedItems = items.reduce(
      (acc, item) => {
        if (!selectedSet.has(item.combo.id)) {
          acc.push(item);
        } else {
          const index = acc.findIndex(
            (existingItem) => existingItem.combo.id === item.combo.id
          );
          if (index !== -1) acc.splice(index, 1);
        }
        return acc;
      },
      [...prevSelectedItems]
    );
    return updatedItems;
  };

  const handleIndividualChange = (item) => {
    switch (activeIndex) {
      case "sample":
        setSampleSelected((prevSelectedItems) =>
          updateSelection(prevSelectedItems, item)
        );
        break;
      case "wholesale":
        setWholesaleSelected((prevSelectedItems) =>
          updateSelection(prevSelectedItems, item)
        );
        break;
      case "swatch":
        setSwatchSelected((prevSelectedItems) =>
          updateSelection(prevSelectedItems, item)
        );
        break;
      default:
        break;
    }
  };

  const updateSelection = (prevSelectedItems, ...items) => {
    const selectedIds = new Set(prevSelectedItems.map((item) => item.id));
    const updatedItems = items.reduce(
      (acc, item) => {
        if (selectedIds.has(item.id)) {
          return acc.filter((selectedItem) => selectedItem.id !== item.id);
        } else {
          return [...acc, item];
        }
      },
      [...prevSelectedItems]
    );
    return updatedItems;
  };

  const handleProceed = () => {
    navigation.navigate("checkout", {
      cartItem: getStateValue("toShippingTab"),
      priceSlab: getStateValue("price"),
      combo: comboCart,
      amount: credit,
    });
  };

  const getStateValue = (key) => {
    if (key === "toShippingTab") {
      switch (activeIndex) {
        case "sample":
          return sampleSelected;
        case "wholesale":
          return wholesaleSelected;
        case "combo":
          return comboSelected;
        case "swatch":
          return swatchSelected;
        default:
          return [];
      }
    } else if (key === "price") {
      switch (activeIndex) {
        case "sample":
          return filterDataByType("SAMPLE");
        case "wholesale":
          return filterDataByType("WHOLESALE");
        default:
          return {};
      }
    } else {
      switch (activeIndex) {
        case "sample":
          return _.size(sampleSelected);
        case "wholesale":
          return _.size(wholesaleSelected);
        case "combo":
          return _.size(comboSelected);
        case "swatch":
          return _.size(swatchSelected);
        default:
          return 0;
      }
    }
  };

  const handleEditSave = async () => {
    switch (editItem?.cartType) {
      case "SAMPLE":
        {
          const minSampleMoq =
            price[editItem?.pimVariantId]?.filter(
              (item) => item.orderType === "SAMPLE"
            )?.[0]?.min ||
            editItem?.sampleMoq ||
            sampleMoq;
          const maxWholesaleMoq =
            price[editItem?.pimVariantId]?.filter(
              (item) => item.orderType === "SAMPLE"
            )?.[0]?.max ||
            editItem?.wholesaleMoq ||
            wholesaleMoq;
          if (
            editItem?.quantity < minSampleMoq ||
            editItem?.quantity > maxWholesaleMoq
          ) {
            setError(
              `Quantity must be between ${minSampleMoq} kg and ${maxWholesaleMoq} kg.`
            );
            return;
          }
          if (
            editItem?.quantity > editItem.totalStockQuantity &&
            !editItem.backOrder
          ) {
            setError(
              `Total Available Quantity is ${editItem.totalStockQuantity} kg.`
            );
            return;
          }
        }
        break;
      case "WHOLESALE":
        {
          const minWholesaleMoq =
            price[editItem?.pimVariantId]?.filter(
              (item) => item.orderType === "WHOLESALE"
            )[0].min ||
            editItem?.wholesaleMoq ||
            wholesaleMoq;
          if (editItem.quantity < minWholesaleMoq) {
            setError(`Quantity must be at least ${minWholesaleMoq} kg.`);
            return;
          }
          if (
            editItem.quantity > minWholesaleMoq &&
            editItem?.quantity % (editItem.kgPerRoll || 20) !== 0
          ) {
            setError(
              `Quantity must be muliple of ${editItem?.kgPerRoll || 0}.`
            );
            return;
          }
          if (
            editItem?.quantity > editItem.availableQuantity &&
            !editItem.backOrder
          ) {
            setError(
              `Total Available Quantity is ${editItem.availableQuantity} kg.`
            );
            return;
          }
        }
        break;
      case "COMBO":
        {
          const comboMoq = editItem?.wholesaleMoq || wholesaleMoq;
          if (editItem?.quantity < comboMoq) {
            setError(`Quantity must be at least ${comboMoq} units for combo.`);
            return;
          }
        }
        break;
      case "SWATCH":
        {
          const swatchMoq = editItem.swatchMoq || swatchMoq;
          if (editItem.quantity < swatchMoq) {
            setError(
              `Quantity must be at least ${swatchMoq} units for swatch.`
            );
            return;
          }
        }
        break;
      default:
        setError("Invalid cart type.");
        return;
    }
    try {
      await api.post("/cart/save", editItem);
      setError("");
      setEditOpenModal(false);
      fetchCarts(true, editItem);
    } catch (error) {
      setError("Failed to save the cart. Please try again.");
      console.error("Error saving cart item:", error);
    }
  };

  const handleToggle = () => {
    setIsToggled((prevState) => !prevState);
  };

  const handleEdit = (item) => {
    setError("");
    setEditOpenModal(true);
    setEditItem(item);
  };

  const cancelRemove = () => {
    setEditOpenModal(false);
    setSelectedItem(null);
  };

  const removeAllCartItems = (item) => {
    setSelectedItem(item);
    Alert.alert(
      "Are you sure?",
      "Remove all products in cart?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            removeAllItems();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const removeAllItems = async () => {
    try {
      let idsToDelete = [];
      if (sampleCart) {
        idsToDelete = AllIds(sample);
      } else if (wholesaleCart) {
        idsToDelete = AllIds(wholesale);
      } else if (comboCart) {
        idsToDelete = AllCartIds(combo);
      } else if (swatchCart) {
        idsToDelete = AllIds(swatch);
      }

      await api.delete(`cart/deleteALL?ids=${idsToDelete}`);

      if (sampleCart) {
        setSampleSelected([]);
        setSample({});
      } else if (wholesaleCart) {
        setWholesaleSelected([]);
        setWholesale({});
      } else if (comboCart) {
        setComboSelected([]);
        setCombo({});
      } else if (swatchCart) {
        setSwatchSelected([]);
        setSwatch({});
      }
      await fetchCarts();
    } catch (error) {
      console.error("Error removing all items:", error);
    }
  };

  const AllIds = (data) => {
    return Object.values(data).flatMap((variants) =>
      variants.map((variant) => variant.id)
    );
  };

  const AllCartIds = (data) => {
    return Object.values(data).map((item) => item.combo.id);
  };

  const removeOneCartItems = (item) => {
    Alert.alert(
      "Are you sure?",
      "Remove this item from cart?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            confirmRemove(item);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const confirmRemove = async (selectedItem) => {
    try {
      await api.delete(
        `cart/delete?id=${comboCart ? selectedItem.combo.id : selectedItem.id}`
      );
      await fetchCarts();
      if (sampleCart) {
        setSampleSelected((prevSelectedItems) =>
          prevSelectedItems.filter((item) => item.id !== selectedItem.id)
        );
      } else if (wholesaleCart) {
        setWholesaleSelected((prevSelectedItems) =>
          prevSelectedItems.filter((item) => item.id !== selectedItem.id)
        );
      } else if (comboCart) {
        setComboSelected((prevSelectedItems) =>
          prevSelectedItems.filter(
            (item) => item.combo.id !== selectedItem.combo.id
          )
        );
      } else if (swatchCart) {
        setSwatchSelected((prevSelectedItems) =>
          prevSelectedItems.filter((item) => item.id !== selectedItem.id)
        );
      }
      setSelectedItem(null);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const cartItems = sampleCart
    ? sample
    : wholesaleCart
    ? wholesale
    : comboCart
    ? combo
    : swatchCart
    ? swatch
    : [];

  return (
    <SafeAreaView style={styles.topBottom}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.cartHeader}>Cart</Text>
          <View style={styles.cartContainer}>

            <View style={styles.tabs}>
              <TouchableOpacity
                style={activeIndex === 'sample' ? styles.selectedTab : styles.tab}
                onPress={() => setActiveIndex('sample')}
              >
                <Text style={styles.tabText}>Sample</Text>
                <Text style={styles.badgeCount}>{calculateTotalCount(sample)}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={activeIndex === 'wholesale' ? styles.selectedTab : styles.tab}
                onPress={() => setActiveIndex('wholesale')}
              >
                <Text style={styles.tabText}>Wholesale</Text>
                <Text style={styles.badgeCount}>{calculateTotalCount(wholesale)}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={activeIndex === 'swatch' ? styles.selectedTab : styles.tab}
                onPress={() => setActiveIndex('swatch')}
              >
                <Text style={styles.tabText}>Swatch</Text>
                <Text style={styles.badgeCount}>{calculateTotalCount(swatch)}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={activeIndex === 'combo' ? styles.selectedTab : styles.tab}
                onPress={() => setActiveIndex('combo')}
              >
                <Text style={styles.tabText}>Combo</Text>
                <Text style={styles.badgeCount}>{calculateComboTotalCount(combo)}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.selectAllTag}>
              <TouchableOpacity style={styles.selectAllCheckbox}>
                <Checkbox
                  status={selectAll ? "checked" : "unchecked"}
                  onPress={() => handleSelectAllChange()}
                  disabled={disableSelectAll}
                  color={common.PRIMARY_COLOR}
                />
                <Text style={styles.selectAllLabel}>Select All</Text>
              </TouchableOpacity>
              {(sampleCart || wholesaleCart || comboCart) && (
                <Text style={styles.selectAllLabel}>{getItemCountAndTotalPrice()}</Text>
              )}
              <TouchableOpacity onPress={() => removeAllCartItems(null)} style={styles.deleteCart}>
                <Text style={styles.selectAllLabel}>Delete</Text>
                <Icon name="delete" size={15} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.CartDetailsScroll}>
              {(sampleCart || wholesaleCart || comboCart || swatchCart) && (
                <View style={styles.cartProducts}>
                  {(sampleCart && calculateTotalCount(sample) !== 0) ||
                  (wholesaleCart && calculateTotalCount(wholesale) !== 0) ||
                  (comboCart && calculateComboTotalCount(combo) !== 0) ||
                  (swatchCart && calculateTotalCount(swatch) !== 0) ? (
                    <View style={styles.cartItems}>
                      {_.map(cartItems, (items, articleCode) => (
                        <View
                          key={articleCode}
                          style={{ flexDirection: "column" }}
                        >
                          <CartProductSelect
                            selectedStatus={selectedStatus}
                            comboCart={comboCart}
                            items={items}
                            handleComboTotalChange={handleComboTotalChange}
                            handleTotalChange={handleTotalChange}
                            comboSelected={comboSelected}
                            removeOneCartItems={removeOneCartItems}
                          />
                          {comboCart ? (
                            <>
                              <ComboCartVariant
                                items={items}
                                comboSelected={comboSelected}
                              />
                            </>
                          ) : (
                            <CartVariant
                              items={items}
                              handleIndividualChange={handleIndividualChange}
                              handleEdit={handleEdit}
                              removeOneCartItems={removeOneCartItems}
                              activeIndex={activeIndex}
                              sampleSelected={sampleSelected}
                              wholesaleSelected={wholesaleSelected}
                              swatchSelected={swatchSelected}
                              price={price}
                            />
                          )}
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View style={styles.cartEmpty}>
                      <FeatherIcon
                        name="shopping-cart"
                        size={50}
                        color="#000"
                      />
                      <Text style={styles.cartEmptyText}>Cart is empty</Text>
                      <TouchableOpacity
                        textColor="white"
                        style={styles.cartEmptyBtn}
                        onPress={() =>
                          navigation.navigate("Home", { screen: "HomeScreen" })
                        }
                      >
                        <Text style={styles.cartBtnText}>
                          Start adding products
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
              <ProceedCart
                handleProceed={handleProceed}
                handleToggle={handleToggle}
                isToggled={isToggled}
                getStateValue={getStateValue}
                sampleCart={sampleCart}
                wholesaleCart={wholesaleCart}
                sampleSelected={sampleSelected}
                wholesaleSelected={wholesaleSelected}
                price={price}
                swatchCart={swatchCart}
                swatchSelected={swatchSelected}
                comboCart={comboCart}
                comboSelected={comboSelected}
              />
            </View>
          </View>
          <Modal
            visible={editOpenModal}
            transparent
            animationType="slide"
            style={{
              flex: 1,
              maxHeight: "80%",
            }}
          >
            <EditCart
              editItem={editItem}
              sampleMoq={sampleMoq}
              setEditItem={setEditItem}
              setError={setError}
              wholesaleMoq={wholesaleMoq}
              handleEditSave={handleEditSave}
              cancelRemove={cancelRemove}
              error={error}
            />
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CartDetails;

const styles = StyleSheet.create({
  topBottom: {
    flex: 1,
    paddingTop: 40,
  },
  container: {
    flex: 1,
    padding: 15,
  },
  cartContainer: {
    flex: 1,
    marginTop: 15,
  },
  cartHeader: {
    fontSize: 26,
    fontFamily: font.bold,
    marginVertical: 10,
  },

  tabs: {
    gap: 2,
    backgroundColor: "#e3e3e3",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: "25%",
  },
  tabText: {
    fontSize: 10,
    fontFamily: font.bold,
  },
  badgeCount: {
    fontSize: 10,
    fontFamily: font.semiBold,
  },
  selectedTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "25%",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    elevation: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  selectAllTag: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 30,
  },
  selectAllCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  deleteCart: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  selectAllLabel: {
    fontSize: 12,
    fontFamily: font.medium,
  },

  cartEmpty: {
    paddingVertical: 40,
    marginTop: 50,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  cartEmptyText: {
    fontSize: 20,
    fontFamily: font.bold,
  },
  cartEmptyBtn: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ff6f61",
    backgroundColor: "#ff6f61",
  },
  cartBtnText: {
    fontFamily: font.bold,
    color: "white",
  },
  CartDetailsScroll: {
    flexDirection: "column",
    gap: 50,
  },
  cartItems: {
    flexDirection: "column",
  },
});
