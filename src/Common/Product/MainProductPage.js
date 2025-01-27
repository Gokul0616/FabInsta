import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  Vibration,
} from "react-native";
import { backendUrl, common } from "../Common";

import { font } from "../Theme";
import api from "../../Service/api";
import ImageSliderFI from "./ImageSllider";
import { useNavigation } from "@react-navigation/native";

const MainProductPage = ({ route }) => {
  const { pimId } = route.params;
  const [activeSlide, setActiveSlide] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const images = [];

  const getPimVariantImages = (data) => {
    if (!data || !data.pimVariants) return [];
    return data?.pimVariants
      .map((variant) => variant.image)
      .filter((image) => image)
      .map((image) => backendUrl + image.replace("/api", ""));
  };
  const navigation = useNavigation();

  const fetchData = async () => {
    const response = await api.get(`/pim/product/${pimId}`);
    setProduct(response.response);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    setActiveSlide(0);
  }, []);

  useEffect(() => {
    const handleBackPress = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  images.push(...getPimVariantImages(product));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {loading ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={common.PRIMARY_COLOR} />
          </View>
        ) : (
          <ImageSliderFI uri={images} />
        )}
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.articleCodeText}>
          {product?.product?.articleCode}
        </Text>
        <Text style={styles.articleNameText}>
          {product?.product?.articleName}
        </Text>
        <View style={styles.seeSpecMapContainer}>
          {product?.product?.productCategories["Fabric Type"]
            ?.heirarchyLabel && (
            <Text style={styles.seeSpecsMap}>
              {
                product?.product?.productCategories["Fabric Type"]
                  ?.heirarchyLabel
              }
            </Text>
          )}
          {product?.product?.fabricContent?.value && (
            <Text style={styles.seeSpecsMap}>
              {product?.product?.fabricContent?.value}
            </Text>
          )}
          {product?.product?.metrics?.weight && (
            <Text style={styles.seeSpecsMap}>
              {product?.product?.metrics?.weight}gsm
            </Text>
          )}
          {product?.pimVariants?.length && (
            <Text style={styles.seeSpecsMap}>
              {product?.pimVariants?.length} colors
            </Text>
          )}
          <TouchableOpacity>
            <Text style={styles.sellerName}>View full Spec</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.otherDetailsContainer}>
          <Text style={styles.otherDetailsHeader}>Seller</Text>
          <Text style={styles.sellerName}>{common.title}</Text>
        </View>
        <View style={styles.otherDetailsContainer}>
          <Text style={styles.otherDetailsHeader}>Pricing</Text>
          <Text style={styles.sellerName}>{common.title}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default MainProductPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  imageContainer: {
    width: "100%",
    height: 220,
    backgroundColor: "#f9f9f9",
  },
  customSlide: {
    flex: 1,
    justifyContent: "center",
    padding: 5,
    alignItems: "center",
    backgroundColor: "#F0F2F4",
  },
  customImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
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
    fontFamily: font.semiBold,
  },
  seeSpecMapContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
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
  otherDetailsContainer: {
    display: "flex",
    flexDirection: "row",
    paddingVertical: 5,
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
});
