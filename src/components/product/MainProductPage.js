import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import { backendUrl, storage } from "../../Common/Common";
import { font } from "../../Common/Theme";
import AlertBox from "../../Common/AlertBox";
import api from "../../Service/api";

const MainProductPage = ({ product, navigation }) => {
    const [isError, setIsError] = useState({
        message: "",
        heading: "",
        isRight: false,
        rightButtonText: "OK",
        triggerFunction: () => { },
        setShowAlert: () => { },
        showAlert: false,
    });
    const [profile, setProfile] = useState({});

    useEffect(() => {
        // fetch customer profile function
        const fetchAllProfile = async () => {
            try {
                const res = await api.get(`customer/profile`);
                setProfile(res?.response || {});
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        if (storage.getString("token")) {
            fetchAllProfile();
        }
    }, []);

    const imageUrl = backendUrl + product?.image?.replace("/api", "");

    const filterColorVariants = (products) => {
        return products?.flatMap((product) =>
            product?.pimVariants.flatMap((variant) =>
                variant?.variants.filter((v) => v.name === "Colour")
            )
        );
    };
    const colorVariants = filterColorVariants([product]);
    const pimId = product.pimId;

    const handleViewProduct = () => {
        if (!profile.assignedSalesman) {
            setIsError({
                message: 'Salesman is not yet assigned to your account. Please contact support',
                heading: "Salesman Not Assigned",
                isRight: false,
                rightButtonText: "OK",
                triggerFunction: () => { },
                setShowAlert: () => {
                    isError.setShowAlert(false);
                },
                showAlert: true,
            });
        } else {
            if (profile?.approveStatus === "APPROVED") {
                navigation.navigate("fabrics", { pimId: pimId });
            } else {
                setIsError({
                    message: `Please contact your sales representative ${profile.salesManName} : ${profile.salesMan.mobile} for more details`,
                    heading: "Your Account is not approved yet",
                    isRight: false,
                    rightButtonText: "OK",
                    triggerFunction: () => { },
                    setShowAlert: () => {
                        isError.setShowAlert(false);
                    },
                    showAlert: true,
                });
            }
        }
    }

    const closeAlert = () => {
        setIsError((prev) => ({ ...prev, showAlert: false }));
    };

    return (
        <View>
            <TouchableOpacity
                style={styles.container}
                onPress={handleViewProduct}
            >
                <Image source={{ uri: imageUrl }} style={styles.productImage} />
                <View style={styles.colorsContainer}>
                    {colorVariants?.slice(0, 14).map((color, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.colorCircle,
                                { backgroundColor: color.hexaColorCode },
                            ]}
                        />
                    ))}
                </View>

                <View style={styles.productInfo}>
                    <Text style={styles.productSku}>{product.articleCode}</Text>
                    <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
                        {product.articleName}
                    </Text>
                    <Text style={styles.productPrice}>₹ {product.channelPrice}</Text>
                    <Text style={styles.productVariant}>{product.fabricContent.value}</Text>
                    <Text style={styles.productGsm}>{product.metrics.weight}gsm</Text>
                    <View style={styles.colorsVariantContainer}>
                        <Image
                            source={require("../../../assets/images/color-wheel.png")}
                            alt="color-wheel"
                            style={{ width: 15, height: 15, marginRight: 5 }}
                        />
                        <Text style={styles.colorVariant}>{product.pimVariants.length}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <AlertBox
                heading={isError.heading}
                message={isError.message}
                setShowAlert={closeAlert}
                showAlert={isError.showAlert}
                triggerFunction={isError.triggerFunction}
                isRight={isError.isRight}
                rightButtonText={isError.rightButtonText}
            />
        </View>
    );
};

export default MainProductPage;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F1F1F1",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
    margin: 8,
    flex: 1,
  },

  productImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  colorsContainer: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "row",
    marginBottom: 16,
    width: "100%",
    height: 10,
  },
  colorCircle: {
    width: 10,
    height: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFF",
    elevation: 2,
  },
  productInfo: {
    alignItems: "flex-start",
    width: "100%",
  },
  productName: {
    fontSize: 16,
    fontFamily: font.bold,
    marginBottom: 4,
    width: "100%",
    height: 40,
    textAlign: "flex-start",
  },
  productPrice: {
    fontSize: 14,
    fontFamily: font.semiBold,
    color: "#555",
    marginBottom: 2,
    textAlign: "center",
  },
  productGsm: {
    fontSize: 12,
    fontFamily: font.regular,
    color: "#888",
    marginBottom: 4,
    textAlign: "center",
  },
  productVariant: {
    fontSize: 12,
    fontFamily: font.regular,
    color: "#333",
    marginBottom: 4,
    textAlign: "center",
  },
  productSku: {
    fontSize: 12,
    fontFamily: font.regular,
    color: "#555",
    marginBottom: 4,
    textAlign: "center",
  },
  colorVariant: {
    fontSize: 14,
    fontFamily: font.regular,
    color: "#333",
    textAlign: "center",
  },
  colorsVariantContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
});  