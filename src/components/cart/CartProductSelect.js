import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Checkbox } from 'react-native-paper';

const CartProductSelect = (
    { items, selectedStatus, handleComboTotalChange, handleTotalChange, comboCart,
        comboSelected, removeOneCartItems, }
) => {
    const navigation = useNavigation();

    return (
        <View style={styles.productsGroupHeader}>
            <View style={styles.productSelect}>
                <Checkbox
                    status={(comboCart) ? (comboSelected?.some(selectedItem => selectedItem.combo.id === items.combo.id) ? 'checked' : 'unChecked') : (selectedStatus(items) ? 'checked' : 'unChecked')}
                    onPress={() => (comboCart) ? handleComboTotalChange(items) : handleTotalChange(items)}
                    disabled={!comboCart ? items.every(item => item.published === "false" || (!item.backOrder && item.outOfStock) || (item?.comboVariants?.includes(item.variantSku))) : !(items.variants.length > 0)}
                />
                <TouchableOpacity
                    onPress={() => {
                        if (
                            !comboCart &&
                            items.every(item => item.published === "true")
                        ) {
                            const pimId = items[0]?.pimId;
                            navigation.navigate('Home', { screen: 'fabrics', params: { pimId: pimId } });
                        } else if (comboCart && items.combo.pimUrl) {
                            const pimId = items[0]?.pimId;
                            navigation.navigate('Home', { screen: 'fabrics', params: { pimId: pimId } });
                        }
                    }}
                >
                    <Text style={styles.articleCode}>{comboCart ? items.combo.articleCode : items[0].articleCode}</Text>
                </TouchableOpacity>
                {
                    !comboCart && items.every(item => item.published === "false") ? <Text style={styles.unavailableText}> (Product unavailable)</Text> : ''
                }
            </View>
            <View>
                {comboCart && (
                    <View style={styles.cartProductDetails}>
                        <View style={styles.cartProductQuantity}>
                            <Text style={styles.productQuantityText}>{items.combo?.quantity * items?.variants?.length} kg</Text>
                            <Text style={styles.productQuantityText}>&#8377;{(items?.combo?.quantity * items?.variants?.length * items?.combo?.sellingPrice).toFixed(2)}</Text>
                            <Text style={styles.productQuantityText}>&#8377;{(items?.combo?.sellingPrice)} /kg</Text>
                        </View>
                        <TouchableOpacity onPress={() => removeOneCartItems(items)}>
                            <Text style={styles.removeAll}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

export default CartProductSelect;

const styles = StyleSheet.create({
    productsGroupHeader: {
        paddingVertical: 10,
        flexDirection: 'column',
    },
    productSelect: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    articleCode: {
        textDecorationLine: 'underline',
        fontSize: 16,
    },
    cartProductDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 5,
        paddingHorizontal: 10,
    },
    cartProductQuantity: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    productQuantityText: {
        fontSize: 12,
    },
    removeAll: {
        fontSize: 16,
        textDecorationLine: 'underline'
    },
    unavailableText: {
        color: "red",
        marginLeft: 8,
    },
});