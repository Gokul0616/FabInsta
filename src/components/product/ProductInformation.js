import { useNavigation } from "@react-navigation/native";
import _ from "lodash";
import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { common } from "../../Common/Common";
import ImageSlider from "../../Common/ImageSlider";
import { font } from "../../Common/Theme";

const ProductInformation = ({
  pimData,
  loading,
  media,
  onSpecClicked,
  categories,
  cartOptions,
  selectedValue,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  const handleProgressChange = (index) => {
    setCurrentIndex(index);
  };

  const DisplayHierarchy = () => {
    return (
      <View style={styles.specsValue}>
        {categories?.length > 0 ? (
          categories.map((category, index) => {
            if (index === 0) return null;
            const isLast = index === categories.length - 1;
            return (
              <View key={index} style={styles.fabricValueList}>
                {isLast ? (
                  <TouchableOpacity onPress={() => handleScubaClick(category)}>
                    <Text style={styles.fabricLink}>{category.name}</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.fabricText}>{category.name}</Text>
                )}
                {index < categories.length - 1 && (
                  <Text style={styles.separator}> {">"} </Text>
                )}
              </View>
            );
          })
        ) : (
          <Text style={styles.fabricText}>No hierarchy found.</Text>
        )}
      </View>
    );
  };

  const handleScubaClick = (category) => {
    for (const [key, value] of Object.entries(pimData?.attributes || {})) {
      const stateValue = { [key]: value };
      if (key === "Fabric Type") {
        navigation.navigate("Home", {
          screen: "HomeScreen",
          params: { stateValue },
        });
      }
    }
  };  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.fabricInfoContainer}>
        <Text style={styles.fabricText}>All Fabrics</Text>
        <Text>&gt;</Text>
        <DisplayHierarchy />
      </View>
      <View style={[styles.imageContainer, { width: width }]}>
        {loading ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={common.PRIMARY_COLOR} />
          </View>
        ) : (
          // <View style={{ flex: 1, width: width }}>
          //   <SwiperFlatList
          //     autoplay={true}
          //     autoplayDelay={3}
          //     autoplayLoop={true}
          //     onChangeIndex={(index) => handleProgressChange(index.index)}
          //     data={media}
          //     renderItem={({ item, index }) => {
          //       return (
          //         <View
          //           key={index}
          //           style={[styles.customSlide, { width: width }]}
          //         >
          //           {item.type === "image" ? (
          //             <Image
          //               source={{ uri: item.src }}
          //               style={styles.customImage}
          //             />
          //           ) : (
          //             <Video
          //               source={{ uri: item.src }}
          //               poster={item.poster}
          //               style={styles.customImage}
          //               controls
          //             />
          //           )}
          //         </View>
          //       );
          //     }}
          //   />
          //   <View style={styles.paginationContainer}>
          //     {media.map((_, index) => (
          //       <View
          //         key={index}
          //         style={[
          //           styles.dot,
          //           currentIndex === index
          //             ? styles.activeDot
          //             : styles.inactiveDot,
          //         ]}
          //       />
          //     ))}
          //   </View>
          // </View>
          <ImageSlider media={media} />
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
          {pimData?.pimVariants?.length > 0 && (
            <Text style={styles.seeSpecsMap}>
              {pimData?.pimVariants?.length} colors
            </Text>
          )}
          <TouchableOpacity
            style={styles.seeSpecsFullView}
            onPress={onSpecClicked}
          >
            <Text
              style={[
                {
                  color: "#596E85",
                  fontFamily: font.regular,
                },
              ]}
            >
              View full Spec
            </Text>
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
              <Text style={styles.seeSpecsPricingValue}>
                <Icon name="currency-inr" size={15} color="#000" />{" "}
                {_.round(pimData?.minPrice, 2)} -{" "}
                <Icon name="currency-inr" size={15} color="#000" />{" "}
                {_.round(pimData?.maxPrice, 2)} /kg
              </Text>
            ) : (
              <Text style={styles.seeSpecsPricingValue}>
                <Icon name="currency-inr" size={15} color="#000" />{" "}
                {pimData?.product?.priceSetting?.sellingPrice} /kg
              </Text>
            )}
          </Text>
        </View>
        <View style={styles.otherDetailsContainer}>
          <Text style={styles.otherDetailsHeader}>MOQ</Text>
          <View style={styles.moqContainer}>
            <View style={styles.moqInnerContainer}>
              <Text style={styles.moqLabel}>Sample</Text>
              <Text style={styles.moqValue}>
                {cartOptions[selectedValue]?.SampleMin} -{" "}
                {cartOptions[selectedValue]?.SampleMax} Kg
              </Text>
            </View>
            <View style={styles.moqInnerContainer}>
              <Text style={styles.moqLabel}>Wholesale</Text>
              <Text style={styles.moqValue}>
                {cartOptions[selectedValue]?.Wholesale
                  ? cartOptions[selectedValue]?.Wholesale
                  : " - "}{" "}
                Kg
              </Text>
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
  fabricInfoContainer: {
    flexDirection: "row",
    margin: 10,
    padding: 5,
    gap: 5,
  },
  specsValue: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  fabricValueList: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  fabricLink: {
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    color: "#596E85",
    fontSize: 15,
    fontFamily: font.medium,
  },
  fabricText: {
    fontSize: 15,
    color: "#000",
    fontFamily: font.medium,
  },
  imageContainer: {
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
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
    overflow: "hidden",
    marginTop: 5,
  },
  customImage: {
    width: 250,
    height: 250,
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
    fontSize: 24,
    fontFamily: font.bold,
    paddingVertical: 5,
  },
  articleNameText: {
    paddingVertical: 5,
    fontSize: 20,
    fontFamily: font.bold,
  },
  seeSpecMapContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
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
    alignItems: "center",
  },
  otherDetailsHeader: {
    fontSize: 16,
    fontFamily: font.semiBold,
    color: "grey",
    width: 100,
  },
  sellerName: {
    color: "#596E85",
    fontFamily: font.regular,
  },
  seeSpecsPricing: {
    fontSize: 15,
    fontFamily: font.regular,
  },
  seeSpecsPricingValue: {
    fontFamily: font.semiBold,
  },
  moqContainer: {
    width: 200,
  },
  moqInnerContainer: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 0,
  },
  moqLabel: {
    width: "50%",
    fontSize: 15,
    fontFamily: font.medium,
    color: "#596E85",
  },
  moqValue: {
    width: "50%",
    fontSize: 15,
    textAlign: "right",
    fontFamily: font.semiBold,
  },
});
