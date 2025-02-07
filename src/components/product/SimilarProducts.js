import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import React from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { backendUrl } from '../../Common/Common';
import { font } from '../../Common/Theme';

const { width } = Dimensions.get('window');
const columnWidth = width / 2.2;

const SimilarProducts = ({ similarProduct }) => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleProgressChange = (index) => {
    setCurrentIndex(index);
  };

  const handleViewProduct = (pimId) => {
    navigation.navigate("fabrics", { pimId: pimId });
  }

  return (
    <SafeAreaView>
      {
        similarProduct.length !== 0 && (
          <View style={styles.similarProductContainer}>
            <Text style={styles.similarItemsHeader}>Similar Items</Text>
            <View style={styles.similarItemsContainer}>
              <SwiperFlatList
                width={width}
                autoplay={false}
                autoplayLoop={false}
                onChangeIndex={(index) => handleProgressChange(index.index)}
                data={similarProduct}
                contentContainerStyle={{ gap: 2, }}
                renderItem={({ item, index }) => {
                  const imageSource = `${backendUrl}${item.image?.replace("/api", "")}`;
                  const hexaColorCodes = item?.pimVariants?.flatMap(item => item?.variants?.filter(variant => variant?.hexaColorCode));

                  return (
                    <TouchableOpacity
                      style={styles.similarItemsSlideContainer}
                      onPress={() => handleViewProduct(item?.pimId)}
                    >
                      <Image source={{ uri: imageSource }} style={styles.productImage} />
                      <View style={styles.colorsContainer}>
                        {_.map(hexaColorCodes, (hexa, index) => (
                          <View
                            key={index}
                            style={[
                              styles.colorCircle,
                              { backgroundColor: hexa?.hexaColorCode },
                            ]}
                          />
                        ))}
                      </View>
                      <View style={styles.productInfo}>
                        <Text style={styles.productSku}>{item.articleCode}</Text>
                        <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
                          {item.articleName}
                        </Text>
                        <Text style={styles.productPrice}>₹ {item.channelPrice}</Text>
                        <Text style={styles.productVariant}>{item.fabricContent.value}</Text>
                        <Text style={styles.productGsm}>{item.metrics.weight}gsm</Text>
                        <View style={styles.colorsVariantContainer}>
                          <Image
                            source={require("../../../assets/images/color-wheel.png")}
                            alt="color-wheel"
                            style={{ width: 15, height: 15, marginRight: 5 }}
                          />
                          <Text style={styles.colorVariant}>{item.pimVariants.length}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        )
      }
    </SafeAreaView>
  )
}

export default SimilarProducts

const styles = StyleSheet.create({
  similarItemsHeader: {
    fontSize: 18,
    fontFamily: font.bold,
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  similarItemsContainer: {
    marginBottom: 20,
  },
  similarItemsSlideContainer: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
    margin: 8,
    flex: 1,
    width: columnWidth,
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
})