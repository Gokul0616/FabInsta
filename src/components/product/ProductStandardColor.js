import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Icon from "react-native-vector-icons/AntDesign";
import { backendUrl, storage } from "../../Common/Common";
import api from "../../Service/api";

const ProductStandardColor = ({ pimData, colorOption }) => {
    const [pimVariantIds, setPimVariantIds] = useState([]);

    useEffect(() => {
        if (storage.getString("token")) {
          fetchWishListPImIds()
        }
      }, [pimData])

    const toggleWishlist = async (pimVariantId) => {
        try {
            const response = await api.post(`wishlist/save?pimVariantId=${pimVariantId}`);
            fetchWishListPImIds();
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    };

    const fetchWishListPImIds = async () => {
        try {
            const res = await api.get('wishlist/pim-ids')
            setPimVariantIds(res.response)
        } catch (error) {
        }
    }

    return (
        <SafeAreaView>
            <View style={styles.stdColorContainer}>
                <Text style={styles.stdColorHeader}>{_.size(pimData?.pimVariants)} Standard Colors</Text>
                <View style={styles.colorOptionContainer}>
                    {_.map(colorOption, (item, index) => {
                        const imageSource = `${backendUrl}${item.image?.replace("/api", "")}`;
                        return (
                            <View key={index} style={styles.colorItem}>
                                <Image source={{ uri: imageSource }} style={styles.colorImage} />
                                <View style={styles.colorDetails}>
                                    <View style={styles.colorLabel}>
                                        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.colorText}>#{index + 1} {item.color}</Text>
                                        <Text style={styles.colorCode}>{item.skucode}</Text>
                                    </View>
                                    <Icon
                                        name={_.includes(pimVariantIds, item?.id) ? "heart" : "hearto"}
                                        size={25}
                                        onPress={() => toggleWishlist(item?.id)}
                                        color={_.includes(pimVariantIds, item?.id) ? 'red' : 'none'}
                                    />
                                </View>
                            </View>
                        )
                    })}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ProductStandardColor;

const styles = StyleSheet.create({
    stdColorContainer: {
        padding: 20,
    },
    stdColorHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    colorOptionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        gap: 10,
    },
    colorItem: {
        backgroundColor: "#FFF",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 5,
        width: 155,
        padding: 5,
    },
    colorImage: {
        width: '100%',
        height: 150,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        marginBottom: 10,
    },
    colorDetails: {
        paddingHorizontal: 5,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    colorLabel: {
        width: '75%',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        marginBottom: 5,
    },
    colorText: {
        fontSize: 14,
        color: '#1c2740',
        fontWeight: 600,
    },
    colorCode: {
        fontSize: 14,
        color: '#545f6e',
        fontWeight: 600,
    },
});