import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { font } from "../../Common/Theme";
import api from "../../Service/api";
import { FiButton } from "../../Common/FiButton";
import { backendUrl, common } from "../../Common/Common";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
import AlertBox from "../../Common/AlertBox";

const FabricInquiries = () => {
  const [data, setData] = useState([]);
  const [isFullScreenLoading, setIsFullScreenLoading] = useState(false);
  const navigate = useNavigation();
  const [isError, setIsError] = useState({
    message: "",
    heading: "",
    isRight: false,
    rightButtonText: "OK",
    triggerFunction: () => {},
    setShowAlert: () => {},
    showAlert: false,
  });

  const fetchData = async () => {
    try {
      setIsFullScreenLoading(true);

      const res = await api.get("/fabricInquiry");
      setData(res.response || []);
    } catch (err) {
      console.log("Error at Fetching Data :", err);
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
      setIsFullScreenLoading(false);
    }
  };

  const closeAlert = () => {
    setIsError((prev) => ({ ...prev, showAlert: false }));
  };

  const hanldePress = (item) => {
    navigate.navigate("FabricInquiryDetails", { item });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const renderRow = ({ item }) => {
    const imageUrl = backendUrl + item?.referenceImage?.replace("/api", "");
    return (
      <TouchableOpacity style={styles.row} onPress={() => hanldePress(item)}>
        <View style={[styles.cell, styles.detailsCell]}>
          <Image source={{ uri: imageUrl }} style={styles.referenceImage} />
        </View>

        <View style={styles.cell}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={styles.detailText}
          >
            {item.endUse}
          </Text>
          <Text style={styles.cellText}>
            {moment(item.createdDate).format("MMM DD, YYYY")}
          </Text>
        </View>

        <View style={[styles.cell, styles.statusCell]}>
          {item.isProgress ? (
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, styles.inProgressDot]} />
              <Text style={[styles.statusText, styles.inProgressText]}>
                In Progress
              </Text>
            </View>
          ) : (
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, styles.completedDot]} />
              <Text style={[styles.statusText, styles.completedText]}>
                Completed
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      {isFullScreenLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FF6F61" />
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
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Fabric Inquiries</Text>
          <FiButton
            style={styles.newEnquiry}
            title={"NEW INQUIRY"}
            titleStyle={styles.newEnquiryText}
            onPress={() => navigate.navigate("NewInquiryScreen")}
          />
        </View>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Your inquiries</Text>
          <Text
            style={[styles.headerText, { color: "#AAB0BB", marginLeft: 10 }]}
          >
            {data.length}
          </Text>
        </View>
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Inquiry Details</Text>
        <Text style={styles.headerCell}>Inquiry Date</Text>
        <Text style={styles.headerCell}>Status</Text>
      </View>

      <FlatList
        data={data}
        renderItem={renderRow}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.tableBody}
        decelerationRate={"fast"}
      />
    </SafeAreaView>
  );
};

export default FabricInquiries;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  headerContainer: {},
  headerRow: {
    flexDirection: "row",
    paddingVertical: 16,
    alignItems: "center",
  },
  headerText: {
    fontFamily: font.semiBold,
    fontSize: 22,
  },
  newEnquiry: {
    width: 100,
    height: 32,
    borderRadius: 8,
    marginLeft: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: common.PRIMARY_COLOR,
  },
  newEnquiryText: {
    color: "#fff",
    fontFamily: font.medium,
    fontSize: 12,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerCell: {
    flex: 1,
    textAlign: "center",
    fontFamily: font.semiBold,
    fontSize: 16,
    color: "#333",
  },
  tableBody: {
    paddingVertical: 10,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cell: {
    width: "33%",
    justifyContent: "center",
  },
  detailsCell: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontFamily: font.semiBold,
    fontSize: 14,
    marginRight: 10,
  },
  referenceImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  cellText: {
    fontFamily: font.light,
    fontSize: 14,
    color: "#555",
  },
  statusCell: {
    alignItems: "center",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  inProgressDot: {
    backgroundColor: "#2375D7",
  },
  completedDot: {
    backgroundColor: "green",
  },
  statusText: {
    fontFamily: font.medium,
    fontSize: 14,
  },
});
