import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { backendUrl, common } from "../../../Common/Common";
import { font } from "../../../Common/Theme";

const FabricInquiryDetails = ({ route }) => {
  const { item } = route.params;
  const navigate = useNavigation();
  const imageUrl = backendUrl + item?.referenceImage?.replace("/api", "");
  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          onPress={() => navigate.goBack()}
          style={{
            paddingVertical: 10,
            flexDirection: "row",
            paddingHorizontal: 10,
            alignItems: "center",
          }}
        >
          <Icon name="arrow-left" size={24} color="#333" />
          <Text
            style={{ color: "#000", fontFamily: font.semiBold, fontSize: 18 }}
          >
            Back
          </Text>
        </TouchableOpacity>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>{item.endUse}</Text>

          <View style={styles.statusCell}>
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
        </View>
        <View style={{ borderWidth: 0.5, borderColor: "#ccc" }} />
        <View style={{ padding: 10 }}>
          <View style={styles.trackingContainer}>
            <View>
              <View style={styles.currentStatusDot}></View>
              <View style={styles.verticalLine}></View>
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailText}>Fabric inquiry submitted</Text>
              <Text style={styles.cellText}>
                {moment(item.createdDate).format("MMM DD, YYYY")}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ borderWidth: 0.5, borderColor: "#ccc" }} />
        <View style={styles.myInquiryDetails}>
          <View style={styles.detailsContainerRow}>
            <Text style={styles.headerText}>My Inquiry</Text>
            <Text style={styles.cellText}>
              {moment(item.createdDate).format("MMM DD, YYYY")}
            </Text>
          </View>
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUrl }} style={styles.referenceImage} />
          </View>
          <View style={styles.detailsContainerRow}>
            <Text style={styles.detailTextHeaderRow}>End Use</Text>
            <Text style={styles.detaildTextRow}>{item.endUse}</Text>
          </View>
          <View style={styles.detailsContainerRow}>
            <Text style={styles.detailTextHeaderRow}>Season </Text>
            <Text style={styles.detaildTextRow}>{item.season}</Text>
          </View>
          <View style={styles.detailsContainerRow}>
            <Text style={styles.detailTextHeaderRow}>Fabric Type</Text>
            <Text style={styles.detaildTextRow}>{item.fabricType}</Text>
          </View>
          <View style={styles.detailsContainerRow}>
            <Text style={styles.detailTextHeaderRow}>Fiber Composition</Text>
            <Text style={styles.detaildTextRow}>{item.fiberComposition}</Text>
          </View>
          <View style={styles.detailsContainerRow}>
            <Text style={styles.detailTextHeaderRow}>Weight</Text>
            <Text style={styles.detaildTextRow}>
              {item.weightMin} - {item.weightMax} gsm
            </Text>
          </View>
          <View style={styles.detailsContainerRow}>
            <Text style={styles.detailTextHeaderRow}>
              Finish or Performance
            </Text>
            <Text style={styles.detaildTextRow}>{item.finishPerformance}</Text>
          </View>
          <View style={styles.detailsContainerRow}>
            <Text style={styles.detailTextHeaderRow}>Target Price</Text>
            <Text style={styles.detaildTextRow}>
              ${item.priceMin} - ${item.priceMax}
            </Text>
          </View>
          {item.expectedOrderAmount ? (
            <View style={styles.detailsContainerRow}>
              <Text style={styles.detailTextHeaderRow}>
                Expected Order Amount
              </Text>
              <Text style={styles.detaildTextRow}>
                {item.expectedOrderAmount}
              </Text>
            </View>
          ) : null}
          {item.note ? (
            <View style={styles.detailsContainerRow}>
              <Text style={styles.detailTextHeaderRow}>Note</Text>
              <Text style={styles.detaildTextRow}>{item.note}</Text>
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default FabricInquiryDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 10,
  },

  headerRow: {
    flexDirection: "column",

    paddingHorizontal: 5,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  headerText: {
    fontFamily: font.semiBold,
    fontSize: 22,
    color: "#333",
    marginBottom: 5,
    flexShrink: 1,
  },
  cellText: {
    fontFamily: font.light,
    fontSize: 14,
    color: "#555",
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
  inProgressText: {
    color: "#000",
  },
  completedText: {
    color: "#000",
  },
  trackingContainer: {
    flexDirection: "row",
  },
  currentStatusDot: {
    height: 10,
    width: 10,
    backgroundColor: common.PRIMARY_COLOR,
    borderRadius: 5,
  },
  verticalLine: {
    width: 2,
    height: 50,
    backgroundColor: "#ccc",
    marginLeft: 4,
  },
  detailText: {
    fontFamily: font.semiBold,
    fontSize: 14,
  },
  detailTextContainer: {
    padding: 5,
  },
  myInquiryDetails: {
    padding: 5,
  },
  imageContainer: {
    paddingVertical: 20,
    paddingHorizontal: 5,
  },
  referenceImage: {
    height: 80,
    width: 80,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
  },
  detailsContainerRow: {
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  detailTextHeaderRow: {
    fontFamily: font.semiBold,
    fontSize: 14,
    color: "#928BA3",
  },
  detaildTextRow: {
    fontFamily: font.semiBold,
    fontSize: 18,
  },
});
