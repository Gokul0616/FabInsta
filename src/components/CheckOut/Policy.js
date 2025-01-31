import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { font } from "../../Common/Theme";
import { common } from "../../Common/Common";
import { Checkbox } from "react-native-paper";
import { FiButton } from "../../Common/FiButton";

const Policy = ({
  cartData,
  cartInfo,
  handleNextStep,
  combo,
  policyAccept,
  setPolicyAccept,
}) => {
  const [deliveryModeError, setDeliveryModeError] = useState(false);

  const getCartType = () => {
    if (cartData[0]?.cartType === "SAMPLE") {
      return "Sample Cart";
    } else if (cartData[0]?.cartType === "SWATCH") {
      return "Swatch Cart";
    } else if (combo) {
      return "Combo Cart";
    } else {
      return "Wholesale Cart";
    }
  };
  useEffect(() => {
    if (policyAccept) {
      setDeliveryModeError(false);
    }
  }, [policyAccept]);
  const handlePress = () => {
    if (policyAccept) {
      setDeliveryModeError(false);
      handleNextStep();
    } else {
      setDeliveryModeError(true);
      Vibration.vibrate(100);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} style={{ flex: 1 }}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Policy</Text>
      </View>
      <Text style={styles.noteText}>
        Please Scroll down to Continue Review Order
      </Text>
      <View style={styles.contentContainer}>
        <Text style={styles.contentHeaderText}>
          Product Return Policy for specific products
        </Text>
        <View style={styles.innerContainer}>
          <Text style={styles.innerHeadingText}>
            Pilling ("<Text style={styles.coloredText}>PD-00615337</Text>")
          </Text>
          <View style={styles.contantDetailsTextContainer}>
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
            </View>
            <Text style={styles.bulletContentText}>
              The soft, fuzzy surface of this fabric may pile as a side effect
              of the brushing process. Please note that this is not a fabric
              defect and cannot be a reason for a refund.
            </Text>
          </View>
        </View>
        <View style={styles.innerContainer}>
          <Text style={styles.innerHeadingText}>
            Tears / Rips ("
            <Text style={styles.coloredText}>PD-00615337</Text>")
          </Text>
          <View style={styles.contantDetailsTextContainer}>
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
            </View>
            <Text style={styles.bulletContentText}>
              This fabric is easily damaged by rubbing or scratching. Therefore,
              defects resulting from customer mishandling will not be recognized
              as a reason for a refund.
            </Text>
          </View>
        </View>
        <View style={styles.innerContainer}>
          <Text style={styles.innerHeadingText}>
            Foreign Fiber / Color fly - Cotton Fiber ("
            <Text style={styles.coloredText}>PD-00634334</Text>")
          </Text>
          <View style={styles.contantDetailsTextContainer}>
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
            </View>
            <Text style={styles.bulletContentText}>
              This fabric is made from natural materials, so you may see small
              imperfections like fuzz, lumps, and cotton seeds. This is not a
              fabric defect and will not be recognized as a reason for a refund.
            </Text>
          </View>
        </View>
        <View style={styles.innerContainer}>
          <Text style={styles.innerHeadingText}>
            Shrinkage ("
            <Text style={styles.coloredText}>PD-00634334</Text>")
          </Text>
          <View style={styles.contantDetailsTextContainer}>
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
            </View>
            <Text style={styles.bulletContentText}>
              This fabric is made from natural materials, so you may see small
              imperfections like fuzz, lumps, and cotton seeds. This is not a
              fabric defect and will not be recognized as a reason for a refund.
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.contentHeaderText}>Yardage Order</Text>
        <View style={styles.innerContainer}>
          <Text style={styles.innerHeadingText}>Color Differences</Text>
          <View
            style={[
              styles.contantDetailsTextContainer,
              { paddingLeft: 20, marginVertical: 5 },
            ]}
          >
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
            </View>
            <Text style={styles.bulletContentText}>
              While we make every effort to represent the items displayed on our
              website accurately, please be aware that the{" "}
              <Text style={styles.fontBold}>
                provided videos or photos may not fully depict the true color or
                nature of a particular item.
              </Text>{" "}
              Due to this potential discrepancy, we strongly recommend that{" "}
              <Text style={styles.fontBold}>
                you request a sample prior to purchasing fabrics
              </Text>{" "}
              from our online store.
            </Text>
          </View>
          <View
            style={[
              styles.contantDetailsTextContainer,
              { paddingLeft: 20, marginVertical: 5 },
            ]}
          >
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
            </View>
            <Text style={styles.bulletContentText}>
              <Text style={styles.fontBold}>
                There may be lot-to-lot variations
              </Text>{" "}
              between different orders of the same product. We cannot guarantee
              color consistency between repeat orders.
            </Text>
          </View>
          <View
            style={[
              styles.contantDetailsTextContainer,
              { paddingLeft: 20, marginVertical: 5 },
            ]}
          >
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
            </View>
            <Text style={styles.bulletContentText}>
              <Text style={styles.fontBold}>
                There may be color differences
              </Text>{" "}
              between custom-dyed yardage samples and approved lab dips.
            </Text>
          </View>
        </View>
        <View style={styles.innerContainer}>
          <Text style={styles.innerHeadingText}>Product Quality</Text>
          <View
            style={[
              styles.contantDetailsTextContainer,
              { paddingLeft: 20, marginVertical: 5 },
            ]}
          >
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
            </View>
            <Text style={styles.bulletContentText}>
              It is possible that fabric products may have defects in the
              yardage. If defects frequently occur throughout the yardage, it
              may be considered low quality but not critically damaged. provided
              videos or photos may not fully depict the true color or nature of
              a particular item
            </Text>
          </View>
          <View
            style={[
              styles.contantDetailsTextContainer,
              { paddingLeft: 20, marginVertical: 5 },
            ]}
          >
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
            </View>
            <Text style={styles.bulletContentText}>
              <Text style={styles.fontBold}>
                The seller of the product is responsible for its quality and not
                {common.title}. {common.title} does not provide any guarantee
                for the quality of the product.
              </Text>
            </Text>
          </View>
          <View
            style={[
              styles.contantDetailsTextContainer,
              { paddingLeft: 20, marginVertical: 5 },
            ]}
          >
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
            </View>
            <Text style={styles.bulletContentText}>
              <Text style={styles.fontBold}>
                We strongly recommend placing sample orders before making bulk
                orders to ensure that the quality
              </Text>{" "}
              and pricing of the product meet your expectations.
            </Text>
          </View>
        </View>
        <View style={styles.innerContainer}>
          <Text style={styles.innerHeadingText}>Payment Methods</Text>
          <View
            style={[
              styles.contantDetailsTextContainer,
              { paddingLeft: 20, marginVertical: 5 },
            ]}
          >
            <Text style={styles.bulletContentText}>
              We accept payments via credit and debit cards, as well as bank
              transfers.
            </Text>
          </View>
          <View
            style={[
              styles.contantDetailsTextContainer,
              { paddingLeft: 20, marginVertical: 5 },
            ]}
          >
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
            </View>
            <View>
              <Text style={styles.bulletContentText}>
                <Text style={styles.fontBold}>
                  Credit and Debit Card Payments.
                </Text>
              </Text>
              <View
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 5,
                  gap: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Text style={styles.bulletText}>{"\u25CB"}</Text>
                  <Text
                    style={{ fontFamily: font.regular, paddingHorizontal: 5 }}
                  >
                    A processing fee of 2.5% applies for credit cards issued in
                    the United States (US).
                  </Text>
                </View>
                <View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.bulletText}>{"\u25CB"}</Text>
                    <Text style={[styles.fontBold, { paddingHorizontal: 5 }]}>
                      Bank Transfer
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
                    <Text style={styles.bulletText}>{"\u2022"}</Text>

                    <Text
                      style={[
                        styles.bulletContentText,
                        { paddingHorizontal: 5 },
                      ]}
                    >
                      No processing fees are applied for payments made via bank
                      transfer.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <Text style={[styles.bulletContentText, { paddingLeft: 20 }]}>
            In cases where refunds are initiated at the customer's request, the
            payment processing fee will not be refunded.
          </Text>
        </View>
        <View style={styles.innerContainer}>
          <Text style={styles.innerHeadingText}>Refunds</Text>

          <View
            style={[
              styles.contantDetailsTextContainer,
              { paddingLeft: 20, marginVertical: 5, flexDirection: "column" },
            ]}
          >
            <View style={{ width: "100%" }}>
              <Text style={styles.bulletContentText}>
                1. <Text style={styles.fontBold}>Refund Conditions</Text>
              </Text>
              <View
                style={[
                  styles.contantDetailsTextContainer,
                  { paddingLeft: 20, marginVertical: 5 },
                ]}
              >
                <View style={styles.bulletContainer}>
                  <Text style={styles.bulletText}>{"\u2022"}</Text>
                </View>
                <Text style={styles.bulletContentText}>
                  We cannot issue refunds for products that have been cut.{" "}
                  <Text style={styles.fontBold}>
                    To be eligible for a refund, the products must be returned
                    in their original condition
                  </Text>{" "}
                </Text>
              </View>
              <View
                style={[
                  styles.contantDetailsTextContainer,
                  { paddingLeft: 20, marginVertical: 5 },
                ]}
              >
                <View style={styles.bulletContainer}>
                  <Text style={styles.bulletText}>{"\u2022"}</Text>
                </View>
                <Text style={styles.bulletContentText}>
                  We are unable to issue refunds for orders 14 days after
                  delivery has been confirmed.
                </Text>
              </View>
              <View
                style={[
                  styles.contantDetailsTextContainer,
                  { paddingLeft: 20, marginVertical: 5 },
                ]}
              >
                <View style={styles.bulletContainer}>
                  <Text style={styles.bulletText}>{"\u2022"}</Text>
                </View>
                <Text style={styles.bulletContentText}>
                  We do not provide refunds solely based on the product not
                  meeting your expectations in terms of quality.
                </Text>
              </View>
              <View
                style={[
                  styles.contantDetailsTextContainer,
                  { paddingLeft: 20, marginVertical: 5 },
                ]}
              >
                <View style={styles.bulletContainer}>
                  <Text style={styles.bulletText}>{"\u2022"}</Text>
                </View>
                <Text style={styles.bulletContentText}>
                  Compensation for critical damages to the product, such as torn
                  fabric or critical shortage of amount, can be requested within
                  14 days after delivery.
                </Text>
              </View>
            </View>
            <View style={{ width: "100%" }}>
              <Text style={styles.bulletContentText}>
                2. <Text style={styles.fontBold}>Refund Methods</Text>
              </Text>
              <View
                style={[
                  styles.contantDetailsTextContainer,
                  { paddingLeft: 20, marginVertical: 5 },
                ]}
              >
                <View style={styles.bulletContainer}>
                  <Text style={styles.bulletText}>{"\u2022"}</Text>
                </View>
                <Text style={styles.bulletContentText}>
                  Refunds shall be credited to the original payment method used
                  by the payer.
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.innerContainer}>
          <Text style={styles.innerHeadingText}>Modification of Orders</Text>

          <View
            style={[
              styles.contantDetailsTextContainer,
              { paddingLeft: 20, marginVertical: 5, flexDirection: "column" },
            ]}
          >
            <View style={{ width: "100%", flexDirection: "row" }}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
              <Text style={styles.bulletContentText}>
                If you realize that you have made a mistake after placing an
                order and you wish to make changes, please email us immediately
                referencing your order number. We will do our best to satisfy
                your request.
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.innerContainer}>
          <Text style={styles.innerHeadingText}>Sample Orders</Text>

          <View
            style={[
              styles.contantDetailsTextContainer,
              {
                paddingLeft: 20,
                marginVertical: 5,
                flexDirection: "column",
                gap: 10,
              },
            ]}
          >
            <View style={{ width: "100%", flexDirection: "row" }}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
              <Text style={styles.bulletContentText}>
                {common.title} is not aware of the sample stock information
                provided by sellers.{" "}
                <Text style={styles.fontBold}>
                  We cannot ensure the availability of every color option for
                  every item in stock for sample orders.
                </Text>{" "}
                In the event that the requested color(s) is unavailable, it will
                be automatically canceled and refunded.
              </Text>
            </View>
            <View style={{ width: "100%", flexDirection: "row" }}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
              <Text style={styles.bulletContentText}>
                It is important to conduct preliminary tests with a swatch or a
                small portion of yardage before laundering or manufacturing bulk
                yardage to prevent any potential damage to the goods. The
                washing and handling methods may vary depending on the
                characteristics of the fabric or finished garments.
                <Text style={styles.fontBold}>
                  We cannot be held liable for any damages to fabrics resulting
                  from improper laundering or poor handling.
                </Text>
              </Text>
            </View>
            <View style={{ width: "100%", flexDirection: "row" }}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
              <Text style={styles.bulletContentText}>
                <Text style={styles.fontBold}>
                  Continued sample orders without corresponding bulk orders may
                  result in account restrictions on additional sample yardage
                  orders until a bulk order is placed.
                </Text>{" "}
                Kindly note that this policy is in place to safeguard the
                wholesale fabric suppliers on our platform and maintain a
                sustainable and healthy ecosystem.
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.innerContainer}>
          <Text style={styles.innerHeadingText}>Standard Color Orders</Text>

          <View
            style={[
              styles.contantDetailsTextContainer,
              {
                paddingLeft: 20,
                marginVertical: 5,
                flexDirection: "column",
                gap: 10,
              },
            ]}
          >
            <View style={{ width: "100%", flexDirection: "row" }}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
              <Text style={styles.bulletContentText}>
                <Text style={styles.fontBold}>
                  The estimated ship-out date will be confirmed by the seller
                </Text>{" "}
                after they have received your order.
              </Text>
            </View>
            <View style={{ width: "100%", flexDirection: "row" }}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
              <Text style={styles.bulletContentText}>
                In the event that the ship-out date is later than the notified
                processing time, we will seek your confirmation before
                proceeding.
              </Text>
            </View>
            <View style={{ width: "100%", flexDirection: "row" }}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
              <Text style={styles.bulletContentText}>
                <Text style={styles.fontBold}>
                  We cannot guarantee that the seller will cut and ship the
                  exact yardage ordered.
                </Text>{" "}
                Therefore, we{" "}
                <Text style={styles.fontBold}>
                  recommend that extra yardage be ordered
                </Text>{" "}
                for small orders less than 300 yards.
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.innerContainer}>
          <Text style={styles.innerHeadingText}>Stock & Production</Text>

          <View
            style={[
              styles.contantDetailsTextContainer,
              {
                paddingLeft: 20,
                marginVertical: 5,
                flexDirection: "column",
                gap: 10,
              },
            ]}
          >
            <View style={{ width: "100%", flexDirection: "row" }}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
              <Text style={styles.bulletContentText}>
                <Text style={styles.fontBold}>Certain items</Text> after they in
                our sellers’ inventory are equipped with stock services,
                allowing them to{" "}
                <Text style={styles.fontBold}>
                  be available for small orders with a quick processing time.
                </Text>
              </Text>
            </View>
            <View style={{ width: "100%", flexDirection: "row" }}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
              <Text style={styles.bulletContentText}>
                In the event that the{" "}
                <Text style={styles.fontBold}>stock is not available</Text> or
                your order, sellers will initiate
                <Text style={styles.fontBold}>
                  {" "}
                  the production of a new batch to fulfill your order
                </Text>
              </Text>
            </View>
            <View style={{ width: "100%", flexDirection: "row" }}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
              <Text style={styles.bulletContentText}>
                Due to the unavailability of real-time stock information,
                <Text style={styles.fontBold}>
                  {" "}
                  it cannot be guaranteed whether your order will be processed
                  using existing stock or through production.
                </Text>{" "}
              </Text>
            </View>
            <View style={{ width: "100%", flexDirection: "row" }}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
              <Text style={styles.bulletContentText}>
                The processing time for your order takes into account the
                possibility of producing a new batch. However, if the processing
                time exceeds the previously notified timeframe, we will seek
                your confirmation before proceeding further.
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.innerContainer}>
          <Text style={styles.innerHeadingText}>Custom Dye Orders</Text>

          <View
            style={[
              styles.contantDetailsTextContainer,
              {
                paddingLeft: 20,
                marginVertical: 5,
                flexDirection: "column",
                gap: 10,
              },
            ]}
          >
            <View style={{ width: "100%", flexDirection: "row" }}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
              <Text style={styles.bulletContentText}>
                <Text style={styles.fontBold}>Certain items</Text> after they in
                The estimated ship-out date will be confirmed by the seller
                after they have received your order.
              </Text>
            </View>
            <View style={{ width: "100%", flexDirection: "row" }}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
              <Text style={styles.bulletContentText}>
                In the event that the ship-out date is later than the notified
                processing time, we will seek your confirmation before
                proceeding.
              </Text>
            </View>
            <View style={{ width: "100%", flexDirection: "row" }}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
              <Text style={styles.bulletContentText}>
                We will send you
                <Text style={styles.fontBold}>
                  {" "}
                  the lab dip results for review and approval before starting
                  production.
                </Text>{" "}
              </Text>
            </View>
            <View style={{ width: "100%", flexDirection: "row" }}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
              <Text style={styles.bulletContentText}>
                <Text style={styles.fontBold}>
                  The estimated ship-out date will be confirmed after
                </Text>{" "}
                you have reviewed andapproved the lab dip results.
              </Text>
            </View>
            <View style={styles.innerContainer}>
              <Text>
                1.
                <Text style={styles.innerHeadingText}>
                  Overshipment and Undershipment
                </Text>
              </Text>

              <View
                style={[
                  styles.contantDetailsTextContainer,
                  {
                    paddingLeft: 20,
                    marginVertical: 5,
                    flexDirection: "column",
                    gap: 10,
                  },
                ]}
              >
                <View style={{ width: "100%", flexDirection: "row" }}>
                  <Text style={styles.bulletText}>{"\u2022"}</Text>
                  <Text style={styles.bulletContentText}>
                    We cannot guarantee that the seller will produce and ship
                    the exact yardage ordered.
                  </Text>
                </View>
                <View style={{ width: "100%", flexDirection: "row" }}>
                  <Text style={styles.bulletText}>{"\u2022"}</Text>
                  <Text style={styles.bulletContentText}>
                    <Text style={styles.fontBold}>
                      A deposit payment may be requested
                    </Text>{" "}
                    at checkout for overshipment of up to 3%.
                  </Text>
                </View>
                <View style={{ width: "100%", flexDirection: "row" }}>
                  <Text style={styles.bulletText}>{"\u2022"}</Text>
                  <Text style={styles.bulletContentText}>
                    Payment for the overshipment amount will be deducted from
                    the deposit once the production quantity is confirmed, and
                    any remaining deposit will be refunded.
                  </Text>
                </View>
                <View style={{ width: "100%", flexDirection: "row" }}>
                  <Text style={styles.bulletText}>{"\u2022"}</Text>
                  <Text style={styles.bulletContentText}>
                    Any undershipment will be refunded.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.innerContainer}>
          <Text style={styles.innerHeadingText}>Custom Print Orders</Text>

          <View
            style={[
              styles.contantDetailsTextContainer,
              {
                paddingLeft: 20,
                marginVertical: 5,
                flexDirection: "column",
                gap: 10,
              },
            ]}
          >
            <View style={{ width: "100%", flexDirection: "row" }}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
              <Text style={styles.bulletContentText}>
                The estimated ship-out date will be confirmed by the seller
                after they have received your order.
              </Text>
            </View>
            <View style={{ width: "100%", flexDirection: "row" }}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
              <Text style={styles.bulletContentText}>
                In the event that the ship-out date is later than the notified
                processing time, we will seek your confirmation before
                proceeding.
              </Text>
            </View>
            <View style={{ width: "100%", flexDirection: "row" }}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
              <Text style={styles.bulletContentText}>
                Upon uploading your print artwork file, a preview will be
                generated for your review.
                <Text style={styles.fontBold}>
                  {" "}
                  Please note that after confirming the preview, the print file
                  cannot be changed or edited.
                </Text>{" "}
              </Text>
            </View>
            <View style={{ width: "100%", flexDirection: "row" }}>
              <Text style={styles.bulletText}>{"\u2022"}</Text>
              <Text style={styles.bulletContentText}>
                Please note that{" "}
                <Text style={styles.fontBold}>
                  we cannot guarantee that the color of the artwork displayed on
                  your screen will match exactly with the printed fabric
                </Text>{" "}
                due to variations in digital and printing processes.
              </Text>
            </View>
            <View style={styles.innerContainer}>
              <Text>
                1.
                <Text style={styles.innerHeadingText}>Color Differences</Text>
              </Text>

              <View
                style={[
                  styles.contantDetailsTextContainer,
                  {
                    paddingLeft: 20,
                    marginVertical: 5,
                    flexDirection: "column",
                    gap: 10,
                  },
                ]}
              >
                <View style={{ width: "100%", flexDirection: "row" }}>
                  <Text style={styles.bulletText}>{"\u2022"}</Text>
                  <Text style={styles.bulletContentText}>
                    <Text style={styles.fontBold}>
                      Colors of the printed yardages may vary from the colors
                      displayed on your device screens
                    </Text>{" "}
                    due to differences in screen settings.
                  </Text>
                </View>
                <View style={{ width: "100%", flexDirection: "row" }}>
                  <Text style={styles.bulletText}>{"\u2022"}</Text>
                  <Text style={styles.bulletContentText}>
                    There may be batch-to-batch variations in colors for print
                    orders.
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.innerContainer}>
              <Text>
                2.
                <Text style={styles.innerHeadingText}>
                  Shrinkage and Imperfections
                </Text>
              </Text>

              <View
                style={[
                  styles.contantDetailsTextContainer,
                  {
                    paddingLeft: 20,
                    marginVertical: 5,
                    flexDirection: "column",
                    gap: 10,
                  },
                ]}
              >
                <View style={{ width: "100%", flexDirection: "row" }}>
                  <Text style={styles.bulletText}>{"\u2022"}</Text>
                  <Text style={styles.bulletContentText}>
                    <Text style={styles.fontBold}>
                      Fabric used for printing may shrink during the printing
                      process. The shrinkage rate may vary depending on the
                      printing conditions,
                    </Text>{" "}
                    , and may also differ between batches.
                  </Text>
                </View>
                <View style={{ width: "100%", flexDirection: "row" }}>
                  <Text style={styles.bulletText}>{"\u2022"}</Text>
                  <Text style={styles.bulletContentText}>
                    Irregularities or imperfections may occur in the printing on
                    the cutting edge of the fabric roll as a result of printer
                    settings and printing processes.
                  </Text>
                </View>
                <View style={{ width: "100%", flexDirection: "row" }}>
                  <Text style={styles.bulletText}>{"\u2022"}</Text>
                  <Text style={styles.bulletContentText}>
                    We highly recommend that you{" "}
                    <Text style={styles.fontBold}>
                      order small sample amounts initially and allow for extra
                      yardage when placing bulk orders{" "}
                    </Text>
                    account for potential shrinkage or imperfections.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.contentHeaderText}>Shipping</Text>
        <View style={[styles.innerContainer, { paddingLeft: 10, gap: 10 }]}>
          <Text style={styles.innerHeadingText}>Shipping Address</Text>
          <Text style={styles.noteText}>
            After the order has been shipped, the shipping address cannot be
            modified under any circumstances.
          </Text>

          <View style={styles.innerContainer}>
            <Text style={styles.innerHeadingText}>
              Customs Duty and Sales Tax
            </Text>

            <View
              style={[
                styles.contantDetailsTextContainer,
                {
                  paddingLeft: 20,
                  marginVertical: 5,
                  flexDirection: "column",
                  gap: 10,
                },
              ]}
            >
              <View style={{ width: "100%", flexDirection: "row" }}>
                <Text style={styles.bulletText}>{"\u2022"}</Text>
                <Text style={styles.bulletContentText}>
                  International shipments may be subject to customs clearance.
                </Text>
              </View>
              <View style={{ width: "100%", flexDirection: "row" }}>
                <Text style={styles.bulletText}>{"\u2022"}</Text>
                <Text style={styles.bulletContentText}>
                  <Text style={styles.fontBold}>
                    Ultron can provide an estimate of duties and taxes, but the
                    exact amount can only be determined at the time of customs
                    clearance and is subject to the discretion of the customs
                    office in the destination country.
                  </Text>
                </Text>
              </View>
              <View style={{ width: "100%", flexDirection: "row" }}>
                <Text style={styles.bulletText}>{"\u2022"}</Text>
                <Text style={styles.bulletContentText}>
                  The recipient of the order is responsible for clearing
                  customs.
                </Text>
              </View>
              <View style={{ width: "100%", flexDirection: "row" }}>
                <Text style={styles.bulletText}>{"\u2022"}</Text>
                <Text style={styles.bulletContentText}>
                  For orders with incoterms DDP, if duties and taxes are paid in
                  advance at checkout to Ultron, we will pay them on behalf of
                  the recipient. However, the recipient may still be required to
                  provide information to the customs office.
                </Text>
              </View>
              <View style={{ width: "100%", flexDirection: "row" }}>
                <Text style={styles.bulletText}>{"\u2022"}</Text>
                <Text style={styles.bulletContentText}>
                  If requested by the customs office, the recipient is
                  responsible for responding within the specified time. Ultron
                  is not liable for any losses caused by delayed responses to
                  the customs office.
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.innerContainer}>
            <Text style={styles.innerHeadingText}>Transit Time</Text>

            <View
              style={[
                styles.contantDetailsTextContainer,
                {
                  paddingLeft: 20,
                  marginVertical: 5,
                  flexDirection: "column",
                  gap: 10,
                },
              ]}
            >
              <View style={{ width: "100%", flexDirection: "row" }}>
                <Text style={styles.bulletText}>{"\u2022"}</Text>
                <Text style={styles.bulletContentText}>
                  <Text style={styles.fontBold}>
                    The estimated transit time provided does not include the
                    order processing time{" "}
                  </Text>
                  and is solely based on the transit time of the package(s).
                </Text>
              </View>
              <View style={{ width: "100%", flexDirection: "row" }}>
                <Text style={styles.bulletText}>{"\u2022"}</Text>
                <Text style={styles.bulletContentText}>
                  The estimated delivery date provided prior to checkout is
                  subject to change based on the condition of the shipment, and
                  the{" "}
                  <Text style={styles.fontBold}>
                    actual arrival date may vary.
                  </Text>
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.innerContainer}>
            <Text style={styles.innerHeadingText}>Unattended Shipments</Text>

            <View
              style={[
                styles.contantDetailsTextContainer,
                {
                  paddingLeft: 20,
                  marginVertical: 5,
                  flexDirection: "column",
                  gap: 10,
                },
              ]}
            >
              <View style={{ width: "100%", flexDirection: "row" }}>
                <Text style={styles.bulletText}>{"\u2022"}</Text>
                <Text style={styles.bulletContentText}>
                  The buyer and recipient are responsible for promptly
                  responding to calls and emails from both the delivery service
                  provider and Ultron. If the shipment is left unattended, the
                  packages may be discarded and will not be returned to Ultron,
                  resulting in a waste of the goods.
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.innerContainer}>
            <Text style={styles.innerHeadingText}>Refused Shipments</Text>

            <View
              style={[
                styles.contantDetailsTextContainer,
                {
                  paddingLeft: 20,
                  marginVertical: 5,
                  flexDirection: "column",
                  gap: 10,
                },
              ]}
            >
              <View style={{ width: "100%", flexDirection: "row" }}>
                <Text style={styles.bulletText}>{"\u2022"}</Text>
                <Text style={styles.bulletContentText}>
                  We do not handle refused shipments. If the recipient refuses a
                  shipment from Ultron, the packages will be discarded. In other
                  words, the packages will not be returned to Ultron and will be
                  considered a waste.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={[styles.termsContainer, { zIndex: 2 }]}>
        <View
          style={[
            styles.flexRow,
            {
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
              justifyContent: "space-between",
            },
          ]}
        >
          <Text style={styles.contentHeading}>{getCartType()}</Text>
        </View>
        <View
          style={[
            styles.flexRow,
            {
              borderBottomWidth: 1,
              borderColor: "#ccc",
              flexDirection: "column",
            },
          ]}
        >
          <Text style={styles.cartHeading}>
            Subtotal ({cartInfo.subTotal} Items)
          </Text>
          <Text style={[styles.cartDataText, { fontSize: 14 }]}>
            ₹ {cartInfo.total}
          </Text>
        </View>
        <View
          style={[
            styles.flexRow,
            {
              flexDirection: "column",
            },
          ]}
        >
          <Text style={styles.cartHeading}>Total</Text>
          <Text style={styles.cartDataText}>₹ {cartInfo.total}</Text>
        </View>
      </View>
      <View
        style={[
          styles.contentContainer,
          deliveryModeError && { borderColor: "red" },
        ]}
      >
        <TouchableOpacity
          onPress={() => setPolicyAccept(!policyAccept)}
          style={{ flexDirection: "row" }}
        >
          <Checkbox
            status={policyAccept ? "checked" : "unchecked"}
            color={common.PRIMARY_COLOR}
          />
          <Text style={{ fontFamily: font.regular }}>
            I have read and agree with the terms and conditions.
          </Text>
        </TouchableOpacity>
      </View>
      {deliveryModeError && (
        <Text style={styles.noteText}>
          Please Accept the Terms and Conditions .
        </Text>
      )}
      <FiButton
        title={"Continue to review order"}
        onPress={() => handlePress()}
      />
    </ScrollView>
  );
};

export default Policy;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F8F8",
    padding: 8,
    paddingBottom: 25,
    gap: 16,
  },
  headerRow: {
    flexDirection: "row",
    paddingVertical: 16,
    alignItems: "center",
  },
  headerText: {
    fontFamily: font.semiBold,
    fontSize: 22,
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    gap: 14,
  },
  contentHeaderText: {
    fontSize: 18,
    fontFamily: font.semiBold,
  },
  coloredText: {
    color: common.PRIMARY_COLOR,
  },
  innerHeadingText: {
    fontFamily: font.semiBold,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  innerContainer: { width: "100%" },
  contantDetailsTextContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
  },
  bulletContainer: {
    width: 10,
    alignItems: "center",
  },
  bulletText: {
    fontSize: 14,
    color: "#333",
    fontFamily: font.semiBold,
  },
  bulletContentText: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 5,
    fontFamily: font.regular,
    color: "#333",
  },
  fontBold: {
    fontFamily: font.semiBold,
  },
  noteText: {
    fontFamily: font.regular,
    paddingLeft: 10,
    color: "red",
  },
  contentHeading: {
    fontFamily: font.semiBold,
    fontSize: 18,
  },
  termsContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 1,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  cartHeading: {
    fontFamily: font.semiBold,
    color: "#727272",
    padding: 5,
  },
  cartDataText: {
    fontFamily: font.bold,
    fontSize: 18,
  },
});
