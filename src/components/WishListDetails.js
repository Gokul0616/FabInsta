import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import { Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import { getpayLoadFromToken } from '../Common/JwtPayload';
import api from '../Service/api';
import { backendUrl, storage } from '../Common/Common';

const WishListDetails = () => {
    const [wishList, setWishList] = useState([]);
    const [selectAll, setSelectAll] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [yardQuantities, setYardQuantities] = useState({});
    const [cartTypes, setCartTypes] = useState({});
    const [cartItem, setCartItem] = useState([]);
    const [inputValue, setInputValue] = useState({});

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

    const handleDelete = () => {
        if (selectedItems.length === 0) {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }
        setShowModal(true);
    };

    const confirmDelete = async () => {
        try {
            setShowModal(false);
            if (selectAll) {
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
    const handleXmarkDelete = async (id) => {
        try {
            await deleteSelectedItemsFromWishList([id]);
        } catch (error) {
            console.error("Failed to delete item:", error);
        }
    };

    const handleXmarkclick = () => {
        setShowModal(false);
    }

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        if (!selectAll === true) {
            const allVariantId = _.flatMap(groupedWishList, (datas) =>
                datas.map((item) => item.id)
            );
            setSelectedItems(_.uniq(allVariantId));
        } else {
            setSelectedItems([]);
        }
    };


    const CartOption = (wishlist) => {
        if (!wishlist || wishlist?.length === 0) {
            console.warn("Wishlist data is undefined or empty");
            return [];
        }
        const { samplemoq, wholesalemoq } = wishlist[0];
        return [
            { label: 'Sample', value: String(samplemoq) },
            { label: 'Wholesale', value: String(wholesalemoq) }
        ];
    };

    const cartOptions = CartOption(wishList);


    const isItemInCart = (pimVariantId, cartType = null) => {
        return Array.isArray(cartItem) && cartItem.some(item =>
            item.pimVariantId === pimVariantId &&
            (cartType ? item.cartType === cartType : true)
        );
    };

    const isSampleInCart = (pimVariantId) => isItemInCart(pimVariantId, 'SAMPLE');

    const getButtonLabel = (pimItem) => {
        const qty = inputValue[pimItem.id];
        if (!qty) {
            return 'Add to Sample Cart';
        }
        if (isSampleInCart(pimItem.pimVariantId) && cartTypes[pimItem.id] === 'SAMPLE') {
            return 'Already in Sample Cart';
        }
        return cartTypes[pimItem.id] === 'WHOLESALE' ? 'Add to Wholesale Cart' : 'Add to Sample Cart';
    };

    const isButtonDisabled = (pimItem) => {
        return getButtonLabel(pimItem) === 'Already in Sample Cart';
    };


    const handleYardQuantityChange = (id, wholesaleMOQ, e) => {
        const qty = e.target.value;
        setYardQuantities(prevQuantities => ({ ...prevQuantities, [id]: qty }));
        setInputValue(prevValues => ({ ...prevValues, [id]: qty }));
        setCartTypes(prevCartTypes => ({
            ...prevCartTypes, [id]: parseInt(qty, 10) >= wholesaleMOQ ? 'WHOLESALE' : 'SAMPLE'
        }));
    };

    const handleAddToCart = async (pimItem) => {
        const token = storage.getString('token');
        if (!token) {
            console.error('Error: User is not logged in.');
            return;
        }
        const quantity = parseInt(yardQuantities[pimItem.id], 10);
        const cartType = cartTypes[pimItem.id];

        if (!quantity || quantity <= 0) {
            console.error('Error: Invalid quantity.');
            return;
        }
        const cartItem = {
            pimVariantId: pimItem.pimVariantId,
            cartType: cartType,
            quantity: quantity,
        };
        try {
            await api.post('cart/save', { json: cartItem });
            await fetchCarts();
            navigate('/cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    useEffect(() => {
        fetchCarts();
    }, []);

    const fetchCarts = async () => {
        try {
            const response = await api.get('cart/getall');
            setCartItem(response.response);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    return (
        <SafeAreaView style={styles.topBottom}>
            <View style={styles.container}>
                <Text style={styles.wishListHeader}>Wishlist</Text>
                <View style={{ flex: 1 }}>
                    {wishList?.length === 0 ? (
                        <Text>There are no items.</Text>
                    ) : (
                        <View style={styles.wishListContainer}>
                            <View style={styles.selectWishList}>
                                <TouchableOpacity
                                    style={styles.selectAllWishListLabelContainer}
                                    onPress={() => handleSelectAll()}>
                                    <Checkbox status={selectAll ? "checked" : "unchecked"} />
                                    <Text style={styles.selectAllWishListLabel}>Select All</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleDelete} style={styles.deleteWishList}>
                                    <Text>Delete</Text>
                                    <Icon name="delete" size={15} color="#000" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.wishListItemContainer}>
                                <ScrollView>
                                    {_.map(groupedWishList, (items, articleCode) => (
                                        <View style={styles.wishListItemInnerContainer} key={articleCode}>
                                            <View style={styles.wishListItemHeader}>
                                                <TouchableOpacity>
                                                    <Checkbox
                                                        status={items.every(item => selectedItems.includes(item.id)) ? "checked" : "unchecked"}
                                                        onPress={() => {
                                                            const allIds = items.map(item => item?.id);
                                                            const isAllSelected = allIds.every(id => selectedItems.includes(id));
                                                            const newSelectedItems = isAllSelected
                                                                ? selectedItems.filter(id => !allIds.includes(id))
                                                                : [...selectedItems, ...allIds];
                                                            setSelectedItems(_.uniq(newSelectedItems));
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                                <Text
                                                    // onPress={() => { navigation.navigate(items[0]?.pimUrl) }} 
                                                    style={styles.wishListProductId}>{articleCode}</Text>
                                            </View>
                                            <View style={styles.wishListProduct}>
                                                {items.map((pimItem, index) => (
                                                    <View style={styles.wishListProductLists} key={index}>
                                                        <View style={styles.selectProduct}>
                                                            <TouchableOpacity style={styles.selectProductCheckbox}>
                                                                <Checkbox
                                                                    status={selectedItems.includes(pimItem.id) ? "checked" : "unchecked"}
                                                                    onPress={() => {
                                                                        const updatedSelectedItems = selectedItems.includes(pimItem.id)
                                                                            ? selectedItems.filter(id => id !== pimItem.id)
                                                                            : [...selectedItems, pimItem.id];
                                                                        setSelectedItems(updatedSelectedItems);
                                                                    }}
                                                                />
                                                            </TouchableOpacity>
                                                            <Icon name="close" size={24} />
                                                        </View>
                                                        <View style={styles.productInfoContainer}>
                                                            <Image source={{ uri: `${backendUrl}${pimItem?.image?.replace("/api", "")}` }} style={styles.productImage} />
                                                            <View style={styles.productInfoDetails}>
                                                                <Text
                                                                    onPress={() => navigation.navigate(`${items[0].pimUrl}?variantId=${pimItem.variantSku}`)}
                                                                    style={styles.productText}>
                                                                    {pimItem?.variantSku || 'Unknown'}
                                                                </Text>
                                                                <View style={styles.colorCodeDetails}>
                                                                    <View style={[styles.colorBox, { backgroundColor: pimItem?.hexaColorCode }]} />
                                                                    <Text>{`#${index + 1} ∙ ${pimItem?.value || 'N/A'}`}</Text>
                                                                </View>
                                                                <Text style={styles.priceText}>&#8377;{pimItem?.sellingPrice}</Text>
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
        </SafeAreaView >
    );
};

export default WishListDetails;

const styles = StyleSheet.create({
    topBottom: {
        flex: 1,
        paddingVertical: 50,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    wishListHeader: {
        fontSize: 26,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    wishListContainer: {
        gap: 10,
        flex: 1,
    },
    selectWishList: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
    },
    selectAllWishListLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        width: '50%',
    },
    selectAllWishListLabel: {
        fontSize: 18,
    },
    deleteWishList: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: '#000',
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    wishListProductId: {
        textDecorationLine: 'underline',
        fontSize: 16,
    },
    wishListProduct: {
        gap: 15,
    },
    wishListProductLists: {
        width: '100%',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 25,
        marginBottom: 15,
    },
    productInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
        fontWeight: 'bold',
    },
    colorCodeDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    colorBox: {
        width: 10,
        height: 10,
        borderRadius: 10,
    },
    priceText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
