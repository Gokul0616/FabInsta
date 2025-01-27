import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Dimensions } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { common } from "../Common";
import { SwiperFlatList } from "react-native-swiper-flatlist";
const width = Dimensions.get("window").width;

const ImageSliderFI = ({ uri }) => {
  const progress = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleProgressChange = (index) => {
    setCurrentIndex(index);
  };

  return (
    <View style={{ flex: 1 }}>
      <SwiperFlatList
        autoplay={true}
        autoplayDelay={3}
        autoplayLoop={true}
        onChangeIndex={(index) => handleProgressChange(index.index)}
        data={uri}
        renderItem={({ item }) => (
          <View style={styles.customSlide}>
            <Image source={{ uri: item }} style={styles.customImage} />
          </View>
        )}
      />

      <View style={styles.paginationContainer}>
        {uri.map((_, index) => (
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
  );
};

export default ImageSliderFI;
const styles = StyleSheet.create({
  customSlide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    overflow: "hidden",
    width: width,
  },
  customImage: {
    width: "100%",
    height: 220,
    resizeMode: "contain",
  },
  text: {
    position: "absolute",
    bottom: 10,
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    fontSize: 14,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
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
});
