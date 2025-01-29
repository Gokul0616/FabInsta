import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Checkbox } from 'react-native-paper';
import _ from 'lodash';

const ProceedCart = ({
    sampleCart, wholesaleCart, sampleSelected, wholesaleSelected, isToggled, handleToggle,
    getStateValue, handleProceed, price, swatchCart, swatchSelected, comboCart, comboSelected
}) => {
    const [selectCheckBox, setSelectCheckBox] = useState(false);

    const getDiscountForVariant = (pimVariantId, cartType) => {
        const priceSlabs = price[pimVariantId];
        if (!priceSlabs) return 0;
        const matchingSlab = priceSlabs.filter(priceSlab => priceSlab.orderType === cartType)[0];
        return matchingSlab ? matchingSlab.discount || 0 : 0;
    }

    return (
        <View style={styles.proceedCart}>
            <View style={styles.proceedCartDetails}>
                <Text style={styles.proceedCartHeader}>{sampleCart ? 'Sample Cart' : wholesaleCart ? 'Wholesale Cart' : swatchCart ? 'Swatch Cart' : comboCart ? 'Combo Cart' : ''}</Text>
                <View style={{ borderWidth: 0.5, borderColor: 'silver', marginTop: 10, }} />
                <View style={styles.proceedCartContainer}>
                    <Text style={styles.proceedLabel}>Subtotal ({sampleCart ? _.size(sampleSelected) : wholesaleCart ? _.size(wholesaleSelected) : swatchCart ? _.size(swatchSelected) : comboCart ? _.size(comboSelected) : 0}{" "}items)</Text>
                    <Text style={styles.proceedValue}>
                        {`₹ ${sampleCart ? _.sumBy(sampleSelected, (item) => item.sellingPrice * (1 - getDiscountForVariant(item.pimVariantId, "SAMPLE") / 100) * item.quantity).toFixed(2)
                            : wholesaleCart ? _.sumBy(wholesaleSelected, (item) => item.sellingPrice * (1 - getDiscountForVariant(item.pimVariantId, "WHOLESALE") / 100) * item.quantity).toFixed(2)
                                : swatchCart ? _.sumBy(swatchSelected, (item) => item.sellingPrice * (1 - getDiscountForVariant(item.pimVariantId, "SWATCH") / 100) * item.quantity).toFixed(2)
                                    : comboCart ? _.sumBy(comboSelected, (item) => item.combo.sellingPrice * item.combo.quantity * item?.variants?.length).toFixed(2) : "0.00"}`
                        }
                    </Text>
                </View>
                <View style={{ borderWidth: 0.5, borderColor: 'silver', marginTop: 10, }} />
                <View style={styles.proceedCartContainer}>
                    <Text style={styles.proceedLabel}>Total</Text>
                    <Text style={styles.proceedCartTotalValue}>
                        {`₹ ${sampleCart ? _.sumBy(sampleSelected, (item) => item.sellingPrice * (1 - getDiscountForVariant(item.pimVariantId, "SAMPLE") / 100) * item.quantity).toFixed(2)
                            : wholesaleCart ? _.sumBy(wholesaleSelected, (item) => item.sellingPrice * (1 - getDiscountForVariant(item.pimVariantId, "WHOLESALE") / 100) * item.quantity).toFixed(2)
                                : swatchCart ? _.sumBy(swatchSelected, (item) => item.sellingPrice * (1 - getDiscountForVariant(item.pimVariantId, "SWATCH") / 100) * item.quantity).toFixed(2)
                                    : comboCart ? _.sumBy(comboSelected, (item) => item.combo.sellingPrice * item.combo.quantity * item?.variants?.length).toFixed(2) : "0.00"}`
                        }
                    </Text>
                </View>
            </View>
            <View style={styles.checkbox}>
                <Checkbox
                    status={selectCheckBox ? 'checked' : 'unChecked'}
                    onPress={() => setSelectCheckBox(prev => !prev)}
                />
                <Text style={styles.checkboxText}>Ordered kg and Actual kg may varies, Click here to Proceed Cart.</Text>
            </View>
            {selectCheckBox &&
                <Button style={styles.proceedBtn} disabled={getStateValue("cartItem") < 1} onPress={handleProceed}>
                    <Text style={styles.proceedBtnText}>Proceed to cart</Text>
                </Button>}
        </View>
    )
}

export default ProceedCart

const styles = StyleSheet.create({
    proceedCart: {
        flexDirection: 'column',
        gap: 20,
        marginBottom: 20,
    },
    proceedCartDetails: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'silver',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 20,
    },
    proceedCartHeader: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    proceedCartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        gap: 5,
    },
    proceedLabel: {
        fontSize: 14,
        textAlign: 'center',
    },
    proceedValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    proceedCartTotalValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxText: {
        fontSize: 14,
        width: '90%',
        lineHeight: 20,
    },
    proceedBtn: {
        backgroundColor: '#ff6f61',
        borderRadius: 5,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    proceedBtnText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
})