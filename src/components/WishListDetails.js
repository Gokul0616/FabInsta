import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import { backendUrl } from '../Common/Common';
import { getpayLoadFromToken } from '../Common/JwtPayload';
import api from '../Service/api';
import { font } from '../Common/Theme';


const WishListDetails = () => {
    const [wishList, setWishList] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const payload = useMemo(() => getpayLoadFromToken(), []);
    const userRole = payload?.ROLE;
    const navigation = useNavigation();

    const groupedWishList = _.groupBy(wishList, 'articleCode');

    useEffect(() => {
        fetchWishList();
    }, []);

    const fetchWishList = async () => {
        try {
            const res = await api.get('wishlist/all');
            setWishList(res.response);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        }
    };

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        if (selectAll === false) {
            const allVariantId = _.flatMap(groupedWishList, (datas) =>
                datas.map((item) => item.id)
            );
            setSelectedItems(_.uniq(allVariantId));
        } else {
            setSelectedItems([]);
        }
    };

    const handleDelete = () => {
        if (selectedItems.length === 0) {
            ToastAndroid.show('No items selected!!!', ToastAndroid.SHORT);
        }
        else {
            Alert.alert(
                'Delete Item',
                'Are you sure you want to delete this item?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'OK',
                        onPress: () => { confirmDelete(); },
                    },
                ],
                { cancelable: false }
            );
        }
    };

    const handleXmarkDelete = async (id) => {
        try {
            await deleteSelectedItemsFromWishList([id]);
        } catch (error) {
            console.error("Failed to delete item:", error);
        }
    };



    const confirmDelete = async () => {
        try {
            if (selectAll === true) {
                await deleteAllItemsFromWishList();
            } else {
                await deleteSelectedItemsFromWishList(selectedItems);
            }
            fetchWishList();
            setSelectedItems([]);
        } catch (error) {
            alert("Failed to delete items from wishlist.");
        }
    };

    const deleteSelectedItemsFromWishList = async (selectedSkus) => {
        if (selectedSkus.length === 0) return;
        try {
            const skuString = selectedSkus.join(',');
            await api.delete(`wishlist/delete?id=${skuString}`);
            fetchWishList();
        } catch (error) {
            console.error("Error deleting items from wishlist:", error);
        }
    };

    const deleteAllItemsFromWishList = async () => {
        try {
            await api.delete('wishlist/delete-all');
            fetchWishList();
        } catch (error) {
            console.error("Error deleting all items from wishlist:", error);
        }
    };

    return (
      <SafeAreaView style={styles.topBottom}>
        <View style={styles.container}>
          <Text style={styles.wishListHeader}>Wishlist</Text>
          <View style={{ flex: 1 }}>
            {wishList?.length === 0 ? (
              <Text style={{ fontFamily: font.medium }}>
                There are no items.
              </Text>
            ) : (
              <View style={styles.wishListContainer}>
                <View style={styles.selectWishList}>
                  <TouchableOpacity
                    style={styles.selectAllWishListLabelContainer}
                  >
                    <Checkbox
                      status={selectAll ? "checked" : "unchecked"}
                      onPress={() => handleSelectAll()}
                    />
                    <Text style={styles.selectAllWishListLabel}>
                      Select All
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleDelete}
                    style={styles.deleteWishList}
                  >
                    <Text style={styles.selectAllWishListLabel}>Delete</Text>
                    <Icon name="delete" size={15} color="#000" />
                  </TouchableOpacity>
                </View>
                <View style={styles.wishListItemContainer}>
                  <ScrollView>
                    {_.map(groupedWishList, (items, articleCode) => (
                      <View
                        style={styles.wishListItemInnerContainer}
                        key={articleCode}
                      >
                        <View style={styles.wishListItemHeader}>
                          <TouchableOpacity>
                            <Checkbox
                              status={
                                items.every((item) =>
                                  selectedItems.includes(item.id)
                                )
                                  ? "checked"
                                  : "unchecked"
                              }
                              onPress={() => {
                                const allIds = items.map((item) => item?.id);
                                const isAllSelected = allIds.every((id) =>
                                  selectedItems.includes(id)
                                );
                                const newSelectedItems = isAllSelected
                                  ? selectedItems.filter(
                                      (id) => !allIds.includes(id)
                                    )
                                  : [...selectedItems, ...allIds];
                                setSelectedItems(_.uniq(newSelectedItems));
                              }}
                            />
                          </TouchableOpacity>
                          <Text
                            onPress={() => {
                              navigation.navigate("Home", {
                                screen: "fabrics",
                                params: { pimId: items[0]?.pimId },
                              });
                            }}
                            style={styles.wishListProductId}
                          >
                            {articleCode}
                          </Text>
                        </View>
                        <View style={styles.wishListProduct}>
                          {items.map((pimItem, index) => (
                            <View
                              style={styles.wishListProductLists}
                              key={index}
                            >
                              <View style={styles.selectProduct}>
                                <TouchableOpacity
                                  style={styles.selectProductCheckbox}
                                >
                                  <Checkbox
                                    status={
                                      selectedItems.includes(pimItem.id)
                                        ? "checked"
                                        : "unchecked"
                                    }
                                    onPress={() => {
                                      const updatedSelectedItems =
                                        selectedItems.includes(pimItem.id)
                                          ? selectedItems.filter(
                                              (id) => id !== pimItem.id
                                            )
                                          : [...selectedItems, pimItem.id];
                                      setSelectedItems(updatedSelectedItems);
                                    }}
                                  />
                                </TouchableOpacity>
                                <Icon
                                  name="close"
                                  size={24}
                                  onPress={() => handleXmarkDelete(pimItem?.id)}
                                />
                              </View>
                              <View style={styles.productInfoContainer}>
                                <Image
                                  source={{
                                    uri: `${backendUrl}${pimItem?.image?.replace(
                                      "/api",
                                      ""
                                    )}`,
                                  }}
                                  style={styles.productImage}
                                />
                                <View style={styles.productInfoDetails}>
                                  <Text
                                    onPress={() =>
                                      navigation.navigate("Home", {
                                        screen: "fabrics",
                                        params: {
                                          pimId: items[0]?.pimId,
                                          variantId: items?.variantSku,
                                        },
                                      })
                                    }
                                    style={styles.productText}
                                  >
                                    {pimItem?.variantSku || "Unknown"}
                                  </Text>
                                  <View style={styles.colorCodeDetails}>
                                    <View
                                      style={[
                                        styles.colorBox,
                                        {
                                          backgroundColor:
                                            pimItem?.hexaColorCode,
                                        },
                                      ]}
                                    />
                                    <Text
                                      style={{ fontFamily: font.medium }}
                                    >{`#${index + 1} ∙ ${
                                      pimItem?.value || "N/A"
                                    }`}</Text>
                                  </View>
                                  <Text style={styles.priceText}>
                                    &#8377; {(pimItem?.sellingPrice).toFixed(2)}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          ))}
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
};

export default WishListDetails;

const styles = StyleSheet.create({
  topBottom: {
    flex: 1,
    paddingTop: 50,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  wishListHeader: {
    fontSize: 26,
    fontFamily: font.semiBold,
    marginVertical: 10,
  },
  wishListContainer: {
    gap: 10,
    flex: 1,
  },
  selectWishList: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  selectAllWishListLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "50%",
  },
  selectAllWishListLabel: {
    fontSize: 16,
    fontFamily: font.medium,
  },
  deleteWishList: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  wishListItemContainer: {
    flex: 1,
    gap: 15,
  },
  wishListItemInnerContainer: {
    marginVertical: 10,
    gap: 15,
  },
  wishListItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  wishListProductId: {
    textDecorationLine: "underline",
    fontFamily: font.medium,
    fontSize: 16,
  },
  wishListProduct: {
    gap: 15,
  },
  wishListProductLists: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: 20,
    paddingHorizontal: 15,
    gap: 10,
  },
  selectProduct: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 25,
    marginBottom: 15,
  },
  productInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 75,
    height: 75,
    borderRadius: 4,
    marginRight: 10,
  },
  productInfoDetails: {
    gap: 10,
  },
  productText: {
    fontSize: 14,
    fontFamily: font.semiBold,
    textDecorationLine: "underline",
  },
  colorCodeDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  colorBox: {
    width: 10,
    height: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  priceText: {
    fontSize: 16,
    fontFamily: font.semiBold,
  },
});
