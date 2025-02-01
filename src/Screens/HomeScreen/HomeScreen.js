import { CommonActions, useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import AlertBox from "../../Common/AlertBox";
import { common, storage } from "../../Common/Common";
import {
  extractNames,
  findKeyAndId,
  formateData,
} from "../../Common/FilterData";
import { font } from "../../Common/Theme";
import MainProductPage from "../../components/product/MainProductPage";
import api from "../../Service/api";
import SearchModal from "./SearchModal";
import SortingDropdown from "./SortingDropdown";

const HomeScreen = ({ navigation }) => {
  const navigate = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollOffsetY = useRef(0);
  const [isError, setIsError] = useState({
    message: "",
    heading: "",
    isRight: false,
    rightButtonText: "OK",
    triggerFunction: () => {},
    setShowAlert: () => {},
    showAlert: false,
  });

  const [totalItems, setTotalItems] = useState(0);
  const [productList, setProductList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [isAppliedFiltersVisible, setIsAppliedFiltersVisible] = useState(false);
  const [render, setRender] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [searchDisplayData, setSearchDisplayData] = useState([]);
  const [searchFilterRawData, setSearchFilterRawData] = useState([]);
  const [isFullScreenLoading, setFullScreenLoading] = useState(false);

  const clearStackAndNavigate = () => {
    navigate.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "Signin",
          },
        ],
      })
    );
    storage.delete("token");
  };
  const data = [
    { label: "Newest First", value: "New False" },
    { label: "Price Low - High", value: "Price True" },
    { label: "Price High - Low", value: "Price False" },
    { label: "Weight Low - High", value: "Weight True" },
    { label: "Weight High - Low", value: "Weight False" },
  ];
  const [filterDropdownValue, setFilterDropdownValue] = useState(
    data[0]?.value
  );
  const fetchProducts = async (fromsearch = false) => {
    if ((isFullScreenLoading || !hasMore) && fromsearch) return;
    setFullScreenLoading(true);
    try {
      let url = "";
      if (storage.getString("token")) {
        url = `pim/searchFilter?page=${
          fromsearch ? 0 : page
        }&size=${14}&sortData=${filterDropdownValue}`;
      } else {
        url = `pim/sampleProduct`;
      }
      const response = await api.post(url, searchData);

      if (!response || !response.response) {
        throw new Error("Invalid response structure");
      }
      const pim = response.response.content || [];
      setTotalItems(response.response.totalElements);

      const filteredPim = pim?.map((p) => ({
        ...p,
        pimVariants: Array.isArray(p.pimVariants)
          ? p.pimVariants.filter((pv) => pv.status === "ACTIVE")
          : [],
      }));
      const totalPages = response.response.totalPages;

      if (render) {
        setProductList((prev) => [...prev, ...filteredPim]);
      } else {
        setProductList(filteredPim);
        setRender(true);
      }

      setHasMore(page < totalPages - 1);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setIsError({
        message: err.response?.data?.message || "An Unexpected error occurred",
        heading: "Error",
        isRight: false,
        rightButtonText: "OK",
        triggerFunction: () => {},
        setShowAlert: () => {
          isError.setShowAlert(false);
        },
        showAlert: true,
      });
    } finally {
      setFullScreenLoading(false);
    }
  };
  useEffect(() => {
    if (filterDropdownValue.length != 0) {
      fetchProducts();
    }
  }, [page]);
  const onRefresh = async () => {
    setRefreshing(true);
    setPage(0);
    setProductList([]);
    await fetchProducts();

    setRefreshing(false);
  };

  const getGridData = () => {
    const numColumns = 2;
    const rows = Math.ceil(productList.length / numColumns);
    const gridData = [...productList];
    const emptyItems = rows * numColumns - productList.length;

    for (let i = 0; i < emptyItems; i++) {
      gridData.push({ id: `empty-${i}`, empty: true });
    }

    return gridData;
  };

  const closeAlert = () => {
    setIsError((prev) => ({ ...prev, showAlert: false }));
  };

  const renderProduct = ({ item }) => (
    <View style={styles.itemContainer}>
      <MainProductPage product={item} navigation={navigation} />
    </View>
  );

  const renderGridItem = ({ item }) =>
    item.empty ? (
      <View style={[styles.itemContainer, styles.emptyItem]} />
    ) : (
      renderProduct({ item })
    );

  useEffect(() => {
    if (filterDropdownValue !== null) {
      setProductList([]);
      fetchProducts();
    }
  }, [filterDropdownValue, searchData]);

  const handleSearchData = (searchData) => {
    if (searchData.data && Object.keys(searchData.data[0]).length > 0) {
      setSearchFilterRawData(searchData.data[0]);
      const res = formateData(searchData.data[0]);
      setSearchDisplayData(extractNames(searchData.data[0]));
      setSearchData(res);
    } else {
      setIsAppliedFiltersVisible(false);
      setSearchData(null);
    }
  };
  const handleRemoveItem = (item) => {
    setSearchDisplayData((prevData) =>
      prevData.filter((dataItem) => dataItem !== item)
    );

    if (searchDisplayData.length === 0) {
      setIsAppliedFiltersVisible(false);
    }

    const res = findKeyAndId(item, searchFilterRawData);

    const updatedSearchData = { ...searchData };

    if (res?.key in updatedSearchData) {
      updatedSearchData[res?.key] = updatedSearchData[res?.key].filter(
        (dataItem) => dataItem !== res?.id
      );
    }

    setSearchData(updatedSearchData);
  };

  const handleClearAll = () => {
    setSearchDisplayData([]);
    setSearchData(null);
    setIsAppliedFiltersVisible(false);
  };
  const renderSearchItems = () => {
    if (searchDisplayData.length === 0) {
      setIsAppliedFiltersVisible(false);
      return (
        <View style={{ margin: "auto" }}>
          <Text style={{ fontFamily: font.semiBold }}>No Data Found</Text>
        </View>
      );
    }
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.searchItemsScroll}
      >
        <TouchableOpacity
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingRight: 10,
          }}
          onPress={handleClearAll}
        >
          <Icon name="refresh-cw" size={18} color={common.PRIMARY_COLOR} />
        </TouchableOpacity>

        {searchDisplayData.map((item, index) => (
          <View key={index} style={styles.searchTextContainer}>
            <Text style={styles.searchFilterText}>{item}</Text>
            <TouchableOpacity
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingLeft: 5,
              }}
              onPress={() => handleRemoveItem(item)}
            >
              <Text style={{ color: "#616A7D", fontFamily: font.bold }}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  };

  const SearchAndFilterTab = () => {
    return (
      <View style={styles.searchContainerMain}>
        <View style={styles.searchContainer}>
          <TouchableOpacity
            style={[styles.searchButton]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.searchButtonText}>
              <Icon name="search" size={12} />
              Search
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.applyFilterVisibleButton}
            onPress={() => {
              setIsAppliedFiltersVisible(!isAppliedFiltersVisible);
            }}
          >
            <Text style={styles.searchButtonText}>
              Applied Filters
              <Icon
                name={isAppliedFiltersVisible ? "chevron-up" : "chevron-down"}
                size={14}
              />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {isFullScreenLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FF6F61" />
        </View>
      )}
      <Animated.View
        style={[
          styles.searchAndFilterContainer,
          {
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, 100],
                  outputRange: [0, -50],
                  extrapolate: "clamp",
                }),
              },
            ],
          },
        ]}
      >
        {SearchAndFilterTab()}
        {isAppliedFiltersVisible && (
          <View style={styles.filterVisibleContainer}>
            {renderSearchItems()}
          </View>
        )}

        <SearchModal
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
          searchData={handleSearchData}
          data={searchDisplayData}
        />
      </Animated.View>
      {productList.length === 0 && !isFullScreenLoading && (
        <View style={styles.noresultFoundContainer}>
          <Text style={styles.noResultFound}>No Results found</Text>
        </View>
      )}
      <AlertBox
        heading={isError.heading}
        message={isError.message}
        setShowAlert={closeAlert}
        showAlert={isError.showAlert}
        triggerFunction={isError.triggerFunction}
        isRight={isError.isRight}
        rightButtonText={isError.rightButtonText}
      />
      {productList.length > 0 && (
        <Animated.FlatList
          data={getGridData()}
          renderItem={renderGridItem}
          keyExtractor={(item) => {
            return item.pimId;
          }}
          ListHeaderComponent={
            <View style={styles.totalItemsContainer}>
              <Text style={styles.totalItemsText}>
                Total Items: {totalItems}
              </Text>
              <SortingDropdown
                setFilterDropdownValue={setFilterDropdownValue}
                initialValue={filterDropdownValue}
                data={data}
              />
            </View>
          }
          contentContainerStyle={[
            styles.listContainer,
            { paddingTop: isAppliedFiltersVisible ? 150 : 100 },
          ]}
          numColumns={2}
          maxToRenderPerBatch={6}
          initialNumToRender={6}
          windowSize={5}
          removeClippedSubviews={true}
          updateCellsBatchingPeriod={50}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (hasMore) {
              setPage((prev) => prev + 1);
            }
          }}
          onRefresh={onRefresh}
          refreshing={refreshing}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              progressViewOffset={100}
            />
          }
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
        />
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  listContainer: {
    padding: 4,
  },
  itemContainer: {
    flex: 1,
  },
  emptyItem: {
    backgroundColor: "transparent",
  },
  noresultFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  noResultFound: {
    marginTop: 100,
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: "#000",
    textAlign: "center",
    fontSize: 16,
    fontFamily: font.bold,
    fontWeight: "bold",
  },
  searchAndFilterContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  totalItemsContainer: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  totalItemsText: {
    color: "#333",
    fontSize: 16,
    fontFamily: font.medium,
    marginTop: 10,
  },

  searchContainerMain: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: 50,
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  searchButton: {
    width: "50%",
    height: 50,
    justifyContent: "center",
    // borderRightWidth: 1,
    // borderColor: "#ccc",
    alignItems: "center",
    display: "flex",
  },
  applyFilterVisibleButton: {
    width: "50%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  searchButtonText: {
    fontSize: 14,
    fontFamily: font.medium,
  },
  openModalButton: {
    backgroundColor: "#FF6F61",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  filterVisibleContainer: {
    marginTop: 100,
    height: 50,
    backgroundColor: "#F8F8F8",
    flexDirection: "row",
    alignItems: "center",
  },
  searchItemsScroll: {
    flexGrow: 0,
    paddingHorizontal: 20,
    width: "auto",
  },
  searchTextContainer: {
    backgroundColor: "#1C2740",
    alignSelf: "center",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 50,
    flexDirection: "row",
    marginRight: 10,
  },

  searchFilterText: {
    color: "#fff",
    fontFamily: font.semiBold,
    fontSize: 16,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  optionsModal: {
    position: "absolute",
    top: 50,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
    width: 150,
    padding: 10,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  optionText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
    fontFamily: "sans-serif-medium",
  },
});
