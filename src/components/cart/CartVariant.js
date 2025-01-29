import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import { backendUrl, common } from '../../Common/Common';

const CartVariant = (
    { items, handleIndividualChange, handleEdit, removeOneCartItems, activeIndex,
        sampleSelected, wholesaleSelected, swatchSelected, price }
) => {

    const navigation = useNavigation();

    const getDiscountForVariant = (pimVariantId, cartType) => {
        const priceSlabs = price[pimVariantId];
        if (!priceSlabs) return 0;
        const matchingSlab = priceSlabs.filter(priceSlab => priceSlab.orderType === cartType)[0];
        return matchingSlab ? matchingSlab.discount || 0 : 0;
    }

    return (
        <View style={styles.cartProducts}>
            {items.map((item, index) => (
                <View style={styles.productsGroup} key={index}>
                    {(item.outOfStock && !item.backOrder) && (
                        <View style={styles.availableInfo}>
                            <Icon name='exclamationcircle' size={15} width={20} style={styles.availableInfoText} />
                            <Text style={styles.availableInfoText}>Checkout unavailable product status.</Text>
                            {(item.quantity > item.availableQuantity && activeIndex === 'wholesale') &&
                                <Text style={styles.availableInfoText}>Total Available Quantity is {item.availableQuantity} kg</Text>}
                            {(item.quantity > item.totalStockQuantity && activeIndex === 'sample') &&
                                <Text style={styles.availableInfoText}>Total Available Quantity is {item.totalStockQuantity} kg</Text>}
                        </View>
                    )}
                    <View style={styles.cartProductLayout}>
                        {activeIndex !== 'swatch' && (
                            <Checkbox
                                status={
                                    (activeIndex === 'sample' ? sampleSelected :
                                        activeIndex === 'wholesale' ? wholesaleSelected :
                                            activeIndex === 'swatch' ? swatchSelected : []).some(selectedItem => selectedItem.id === item.id) ? 'checked' : 'unChecked'
                                }
                                onPress={() => handleIndividualChange(item)}
                                disabled={item.published === "false" || (item.outOfStock && !item.backOrder) || item?.comboVariants?.includes(item?.variantSku)}
                                color={common.PRIMARY_COLOR}
                            />
                        )}
                        <View style={styles.cartProductInfo}>
                            <Image source={{ uri: `${backendUrl}${item.image?.replace("/api", "")}` }} style={styles.image} />
                            <View style={styles.cartProductVariantInfo}>
                                <Text style={styles.variantCode}
                                    onPress={() => {
                                        if (item.published === "true") {
                                            const pimId = items[0]?.pimId;
                                            const variantId = item?.variantSku;
                                            navigation.navigate('Home', { screen: 'fabrics', params: { pimId: pimId, variantId: variantId } });
                                        }
                                    }}
                                >
                                    {item?.variantSku}
                                </Text>
                                <View style={styles.badges}>
                                    {item.cartType === 'SAMPLE' && <Text style={styles.variantSampleText}>SAMPLE</Text>}
                                    {item.badge_dead_stock && <Text style={styles.variantText}>{item.badge_dead_stock}</Text>}
                                </View>
                                {activeIndex !== 'swatch' && (<Text style={styles.variantText}># {item.value}</Text>)}
                                {item.published === "false" && <Text style={[styles.variantText, { color: "red" }]}>(Product unavailable)</Text>}
                                {item?.comboVariants?.includes(item?.variantSku) && <Text style={[styles.variantText, { color: "red" }]}>(This product is in combo)</Text>}
                            </View>
                        </View>
                        <View style={{ borderWidth: 0.5, borderColor: 'silver', marginTop: 15, }} />
                        <View style={styles.cartPriceWieghtInfo}>
                            <Text style={styles.textLeft}>
                                {item.quantity} {activeIndex !== 'swatch' ? <>kg</> : <>point</>}
                            </Text>
                            <View style={styles.priceInfo}>
                                <Text style={styles.priceText}>
                                    &#8377;{(item.quantity * (item.sellingPrice * (1 - getDiscountForVariant(item.pimVariantId, item.cartType) / 100))).toFixed(2)}
                                </Text>
                                <Text style={styles.priceText}>
                                    &#8377;{(item.sellingPrice * (1 - getDiscountForVariant(item.pimVariantId, item.cartType) / 100)).toFixed(2)}
                                    {activeIndex !== 'swatch' ? <>/kg</> : <>/point</>}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.cartItemFunctions}>
                            {activeIndex !== 'swatch' && (
                                <TouchableOpacity onPress={() => handleEdit(item)}>
                                    <Text style={styles.cartItemBtnText}>Edit</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity onPress={() => removeOneCartItems(item)}>
                                <Text style={styles.cartItemBtnText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ))}
        </View >
    )
}

export default CartVariant

const styles = StyleSheet.create({
    cartProducts: {
        gap: 20,
        marginBottom: 20,
    },
    productsGroup: {
        width: '100%',
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: 'silver',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
        borderRadius: 10,
        marginBottom: 5,
    },
    availableInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        gap: 5,
        flexWrap: 'wrap',
        backgroundColor: '#ffa0a0',
        margin: 10,
        borderRadius: 5,
    },
    availableInfoText: {
        fontSize: 14,
        color: '#ff0000',
    },
    cartProductLayout: {
        flexDirection: 'column',
        paddingHorizontal: 10,
    },
    cartProductInfo: {
        paddingHorizontal: 10,
        paddingTop: 10,
        flexDirection: 'row',
        gap: 15,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    cartProductVariantInfo: {
        gap: 5,
    },
    variantCode: {
        fontSize: 16,
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },
    variantSampleText: {
        fontSize: 15,
        backgroundColor: '#fff6e5',
        color: '#c67f06',
        width: 70,
        textAlign: 'center',
        fontWeight: '600',
    },
    variantText: {
        fontSize: 14
    },
    cartPriceWieghtInfo: {
        width: '100%',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    priceInfo: {
        width: '55%',
        gap: 8,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexDirection: 'row',
    },
    priceText: {
        fontSize: 12,
    },
    textLeft: {
        fontSize: 12,
        width: '35%',
        textAlign: 'left',
    },
    cartItemFunctions: {
        paddingVertical: 10,
        flexDirection: 'row',
        gap: 20,
        marginBottom: 10,
    },
    cartItemBtnText: {
        textAlign: 'center',
        fontSize: 15,
        textDecorationLine: 'underline',
        paddingHorizontal: 8,
    },
})