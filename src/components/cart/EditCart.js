import React from 'react'
import { Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';
import { backendUrl } from '../../Common/Common';
import { font } from '../../Common/Theme';

const EditCart = ({ editItem, setEditItem, handleEditSave, cancelRemove, error, setError, sampleMoq, wholesaleMoq, }) => {
    return (
        <View style={styles.editContainerModal}>
            <View style={styles.editInnerContainerModal}>
                <View style={styles.editHeaderContainer}>
                    <Text style={styles.editHeaderLabel}>Edit Amount</Text>
                    <Icon name="close" size={20} onPress={cancelRemove} />
                </View>
                <View style={styles.editDetailsContainer}>
                    <Text style={styles.editDetailsText}>Color</Text>
                    <View style={styles.productInfoContainer}>
                        <Image source={{ uri: `${backendUrl}${editItem?.image?.replace("/api", "")}` }} style={styles.image} />
                        <View style={styles.productVariantInfo}>
                            <Text style={styles.productArticleCode}>{editItem?.articleCode}</Text>
                            <Text
                                style={styles.productVariantCode}
                                onPress={() => {
                                    if (editItem?.published === "true") {
                                        const pimId = editItem[0]?.pimId;
                                        const variantId = editItem?.variantSku;
                                        navigation.navigate('Home', { screen: 'fabrics', params: { pimId: pimId, variantId: variantId } });
                                    }
                                }}
                            >
                                {editItem?.variantSku}
                            </Text>
                            {editItem?.cartType === 'SAMPLE' && <Text style={styles.productVariantSample}>SAMPLE</Text>}
                            <Text style={styles.productVariantText}># {editItem?.value}</Text>
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputFieldContainer}>
                            <TextInput
                                value={editItem?.quantity != null ? String(editItem?.quantity) : '0'}
                                placeholder={editItem?.cartType === 'SAMPLE' ? `${editItem?.sampleMoq || sampleMoq}~${editItem?.wholesaleMoq || wholesaleMoq}` : `${editItem?.wholesaleMoq || wholesaleMoq}+`} min={editItem?.cartType === 'SAMPLE' ? (editItem?.sampleMoq || sampleMoq) : (editItem?.wholesaleMoq || wholesaleMoq)}
                                onChangeText={(value) => {
                                    setEditItem({ ...editItem, quantity: value, });
                                    setError('');
                                }}
                                max={editItem?.cartType === 'SAMPLE' && (editItem?.wholesaleMoq || wholesaleMoq)}
                                style={styles.inputField}
                                keyboardType='number-pad'
                            />
                            <Text style={styles.inputInfoText}>kg</Text>
                        </View>
                        {error && <Text style={{ color: 'red', fontSize: 12, textAlign:'left' }}>{error}</Text>}
                        {editItem?.cartType === 'WHOLESALE' && <Text style={styles.inputInfoText}>Quantity must be a multiple of {editItem?.kgPerRoll} kg</Text>}
                        <Text style={styles.inputInfoText}>minimum {editItem?.cartType === 'SAMPLE' ? (editItem?.sampleMoq || sampleMoq) : (editItem?.wholesaleMoq || wholesaleMoq)} kg</Text>
                    </View>
                </View>
                <View style={styles.infoContainer}>
                    <Icon name='exclamationcircle' size={15} width={20} color='#1864ab' />
                    <Text style={styles.infoText}>To minimize the likelihood of order cancellation, we recommend orders are above the advised MOQ.</Text>
                </View>
                <TouchableOpacity style={styles.editBtn} onPress={() => handleEditSave()}>
                    <Text style={styles.editBtnText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default EditCart;

const styles = StyleSheet.create({
    editContainerModal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 10000,
    },
    editInnerContainerModal: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        zIndex: 10000,
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    editHeaderContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    editHeaderLabel: {
        fontSize: 20,
        fontFamily: font.bold,
    },
    editDetailsContainer: {
        marginBottom: 15,
        gap: 10,
    },
    editDetailsText: {
        fontSize: 15,
        fontFamily: font.bold,
    },
    productInfoContainer: {
        paddingTop: 10,
        flexDirection: 'row',
        gap: 15,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    productVariantInfo: {
        gap: 12,
    },
    productArticleCode: {
        color: '#788191',
        fontSize: 13,
        fontFamily: font.bold,
    },
    productVariantCode: {
        fontSize: 16,
        fontFamily: font.bold,
        textDecorationLine: 'underline'
    },
    productVariantSample: {
        fontSize: 15,
        backgroundColor: '#fff6e5',
        color: '#c67f06',
        width: 65,
        borderRadius: 10,
        textAlign: 'center',
        fontFamily: font.semiBold,
    },
    productVariantText: {
        fontSize: 14,
        fontFamily: font.regular,
    },
    inputContainer: {
        gap: 5,
    },
    inputFieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    inputField: {
        height: 50,
        width: '94%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 15,
    },
    inputInfoText: {
        fontSize: 12,
        color: 'gray',
        fontFamily: font.semiBold,
        textAlign: 'right',
    },
    infoContainer: {
        marginBottom: 15,
        flexDirection: 'row',
        gap: 5,
        backgroundColor: '#ebf6ff',
        padding: 10,
        borderRadius: 10,
    },
    infoText: {
        fontSize: 10,
        fontFamily: font.semiBold,
    },
    editBtn: {
        padding: 15,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ff6f61',
        backgroundColor: '#ff6f61',
    },
    editBtnText: {
        fontFamily: font.bold,
        color: 'white',
        textAlign: 'center',
    },
})
