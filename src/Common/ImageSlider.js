import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

const deviceWidth = Dimensions.get('window').width;

const ImageSlider = ({ media }) => {
  const autoPlay = true;
  const intervalTime = 3000;
  const dotsToShow = 5;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [shiftValue, setShiftValue] = useState(0);
  const shiftUnit = 20;
  const RIGHT = -1;
  const LEFT = 1;
  const [image, setImage] = useState([]);
  const totalSlides = media?.length;

  // Update the image list whenever media prop changes
  useEffect(() => {
    if (media && media.length > 0) {
      const imageArray = media.map(item => item?.src);
      setImage(imageArray);
      setCurrentSlide(0);  // Reset to first slide when media changes
    }
  }, [media]);

  // --- Auto-play functionality ---
  useEffect(() => {
    if (!autoPlay || totalSlides <= 0) return;
    const timer = setInterval(() => {
      imageSlides();
    }, intervalTime);
    return () => clearInterval(timer);
  }, [currentSlide, totalSlides]);

  const imageSlides = () => {
    setCurrentSlide((prevSlide) => {
      const nextSlide = (prevSlide + 1) % totalSlides;
      onChange(prevSlide, nextSlide);
      return nextSlide;
    });
  };

  const onChange = (currentSlide, nextSlide) => {
    let reqSlideVal = 0;
    if (nextSlide > currentSlide) {
      reqSlideVal =
        shiftValueCalculator(currentSlide, nextSlide, RIGHT) *
        shiftUnit *
        RIGHT;
    } else {
      reqSlideVal =
        shiftValueCalculator(currentSlide, nextSlide, LEFT) * shiftUnit;
    }

    if (nextSlide > 2 && nextSlide < totalSlides - 3) {
      setShiftValue(shiftValue + reqSlideVal);
    } else if (nextSlide <= 2) {
      setShiftValue(0);
    } else if (nextSlide >= totalSlides - 3) {
      setShiftValue((totalSlides - dotsToShow) * shiftUnit * RIGHT);
    }
  };

  const shiftValueCalculator = (currentSlide, nextSlide, direction) => {
    let slideDifference = 0;
    if (direction === RIGHT) {
      slideDifference = nextSlide - currentSlide;
    } else {
      slideDifference = currentSlide - nextSlide;
    }

    switch (slideDifference) {
      case 4:
        return 2;
      case 3:
        return 1;
      default:
        return slideDifference;
    }
  };

  const shiftAnimated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(shiftAnimated, {
      toValue: shiftValue,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [shiftValue, shiftAnimated]);

  const translateX = useRef(new Animated.Value(-currentSlide * deviceWidth)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: -currentSlide * deviceWidth,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [currentSlide, translateX]);

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <Animated.View
          style={[
            styles.carouselWrapper,
            {
              width: deviceWidth,
              transform: [{ translateX }],
            },
          ]}>
          {image?.map((src, index) => (
            <Image key={index} source={{ uri: src }} style={styles.image} />
          ))}
        </Animated.View>
      </View>

      <View style={styles.innerContainer}>
        <View style={styles.sliderNav}>
          <Animated.View
            style={[
              styles.sliderNavLists,
              { transform: [{ translateX: shiftAnimated }] },
            ]}>
            {media?.map((_, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.sliderBtn,
                  currentSlide === i && styles.activeSliderBtn,
                ]}
                onPress={() => setCurrentSlide(i)} // Manual navigation (optional)
              />
            ))}
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

export default ImageSlider;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselContainer: {
    width: 300,
    height: 300,
    overflow: 'hidden',
  },
  carouselWrapper: {
    flexDirection: 'row',
  },
  image: {
    width: deviceWidth,
    height: 300,
  },
  innerContainer: {
    marginTop: 10,
    width: deviceWidth,
    alignItems:'center',
    justifyContent:'center',
  },
  sliderNav: {
    width: 100,
    overflow: 'hidden',
  },
  sliderNavLists: {
    flexDirection: 'row',
  },
  sliderBtn: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'gray',
    margin: 5,
    transform: [{ scale: 0.6 }],
  },
  activeSliderBtn: {
    backgroundColor: '#ff6f61',
    transform: [{ scale: 1.2 }],
  },
});