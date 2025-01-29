import _ from 'lodash';
import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import SwiperFlatList from 'react-native-swiper-flatlist';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { common } from '../../Common/Common';
import { font } from '../../Common/Theme';
const width = Dimensions.get("window").width;

const ProductInformation = ({ pimData, loading, media, cartOptions, selectedValue }) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    const handleProgressChange = (index) => {
        setCurrentIndex(index);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.imageContainer}>
                {loading ? (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color={common.PRIMARY_COLOR} />
                    </View>
                ) : (
                    <View style={{ flex: 1 }}>
                        <SwiperFlatList
                            width={width}
                            height={220}
                            autoplay={true}
                            autoplayDelay={3}
                            autoplayLoop={true}
                            onChangeIndex={(index) => handleProgressChange(index.index)}
                            data={media}
                            renderItem={({ item, index }) => {
                                return (
                                    <View key={index} style={styles.customSlide}>
                                        {item.type === 'image' ? (
                                            <Image
                                                source={{ uri: item.src }}
                                                style={styles.customImage}
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <Video
                                                source={{ uri: item.src }}
                                                poster={item.poster}
                                                style={styles.customImage}
                                                resizeMode="contain"
                                                controls
                                            />
                                        )}
                                    </View>
                                );
                            }}
                        />
                        {/* Dot-based Pagination */}
                        <View style={styles.paginationContainer}>
                            {media.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.dot,
                                        currentIndex === index ? styles.activeDot : styles.inactiveDot,
                                    ]}
                                />
                            ))}
                        </View>
                    </View>
                )}
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.articleCodeText}>
                    {pimData?.product?.articleCode}
                </Text>
                <Text style={styles.articleNameText}>
                    {pimData?.product?.articleName}
                </Text>
                <View style={styles.seeSpecMapContainer}>
                    {pimData?.product?.productCategories["Fabric Type"]
                        ?.heirarchyLabel && (
                            <Text style={styles.seeSpecsMap}>
                                {
                                    pimData?.product?.productCategories["Fabric Type"]
                                        ?.heirarchyLabel
                                }
                            </Text>
                        )}
                    {pimData?.product?.fabricContent?.value && (
                        <Text style={styles.seeSpecsMap}>
                            {pimData?.product?.fabricContent?.value}
                        </Text>
                    )}
                    {pimData?.product?.metrics?.weight && (
                        <Text style={styles.seeSpecsMap}>
                            {pimData?.product?.metrics?.weight}gsm
                        </Text>
                    )}
                    {pimData?.pimVariants?.length && (
                        <Text style={styles.seeSpecsMap}>
                            {pimData?.pimVariants?.length} colors
                        </Text>
                    )}
                    <TouchableOpacity style={styles.seeSpecsFullView}>
                        <Text style={styles.sellerName}>View full Spec</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.otherDetailsContainer}>
                    <Text style={styles.otherDetailsHeader}>Seller</Text>
                    <Text style={styles.sellerName}>{common.title}</Text>
                </View>
                <View style={styles.otherDetailsContainer}>
                    <Text style={styles.otherDetailsHeader}>Pricing</Text>
                    <Text style={styles.seeSpecsPricing}>
                        {pimData?.minPrice ? (
                            <Text>
                                <Icon name="currency-inr" size={15} color="#000" /> {_.round(pimData?.minPrice, 2)} - <Icon name="currency-inr" size={15} color="#000" /> {_.round(pimData?.maxPrice, 2)} /kg
                            </Text>
                        ) : (
                            <Text><Icon name="currency-inr" size={15} color="#000" /> {pimData?.product?.priceSetting?.sellingPrice} /kg</Text>
                        )}
                    </Text>
                </View>
                <View style={styles.otherDetailsContainer}>
                    <Text style={styles.otherDetailsHeader}>MOQ</Text>
                    <View style={styles.moqContainer}>
                        <View style={styles.moqInnerContainer}>
                            <Text style={styles.moqLabel}>Sample</Text>
                            <Text style={styles.moqValue}>{cartOptions[selectedValue]?.SampleMin} - {cartOptions[selectedValue]?.SampleMax} Kg</Text>
                        </View>
                        <View style={styles.moqInnerContainer}>
                            <Text style={styles.moqLabel}>Wholesale</Text>
                            <Text style={styles.moqValue}>{cartOptions[selectedValue]?.Wholesale ? cartOptions[selectedValue]?.Wholesale : ' - '} Kg</Text>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ProductInformation;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
    },
    imageContainer: {
        width: "100%",
        height: 220,
        backgroundColor: "#f9f9f9",
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#f9f9f9",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
    },
    customSlide: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        overflow: "hidden",
        width: width,
        marginTop: 5,
    },
    customImage: {
        width: "100%",
        height: 220,
        resizeMode: "contain",
    },
    paginationContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 5,
        marginHorizontal: 3,
    },
    activeDot: {
        backgroundColor: common.PRIMARY_COLOR,
    },
    inactiveDot: {
        backgroundColor: "#ccc",
    },
    detailsContainer: {
        padding: 20,
        backgroundColor: "#fff",
    },
    articleCodeText: {
        fontSize: 20,
        fontFamily: font.bold,
        paddingVertical: 5,
    },
    articleNameText: {
        paddingVertical: 5,
        fontSize: 18,
        fontFamily: font.bold,
    },
    seeSpecMapContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        width: '100%',
        alignItems: "center",
        gap: 10,
    },
    seeSpecsMap: {
        padding: 8,
        fontSize: 12,
        fontFamily: font.regular,
        backgroundColor: "#F0F2F4",
        borderRadius: 5,
    },
    seeSpecsFullView: {
        padding: 8,
        fontSize: 12,
        fontFamily: font.regular,
    },
    otherDetailsContainer: {
        display: "flex",
        flexDirection: "row",
        paddingVertical: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    otherDetailsHeader: {
        fontSize: 16,
        fontFamily: font.medium,
        color: "grey",
        width: 100,
    },
    sellerName: {
        textDecorationLine: "underline",
        color: "#596E85",
    },
    seeSpecsPricing: {
        fontSize: 15,
        fontFamily: font.regular,
    },
    moqContainer: {
        width: 200,
    },
    moqInnerContainer: {
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 0,
    },
    moqLabel: {
        width: '50%',
        fontSize: 15,
    },
    moqValue: {
        width: '50%',
        fontSize: 15,
        textAlign: 'right',
    },
});
