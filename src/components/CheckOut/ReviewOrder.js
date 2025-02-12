import { useNavigation } from "@react-navigation/native";
import _ from "lodash";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { SvgUri } from "react-native-svg";
import { backendUrl, common } from "../../Common/Common";
import { FiButton } from "../../Common/FiButton";
import { font } from "../../Common/Theme";

const ReviewOrder = ({
  selectedAddresses,
  delivery,
  cartData,
  cartInfo,
  setPayment,
  payment,
  handlePlaceOrder,
  isLoading,
  priceSlab,
  walletChecked,
  combo,
  calculateShippingCharge,
  valueOption,
  amount,
  handleWalletCheck,
  setAddedWallet,
}) => {
  const { billLocation, shipLocation } = selectedAddresses;
  const navigate = useNavigation();
  const [wallet, setWallet] = useState(false);

  const handlePaymentChange = (event) => {
    setPayment(event.target.value);
  };
  const handleWalletCheckChange = () => {
    setWallet((prev) => !prev);
    setAddedWallet(
      Math.min(
        parseFloat(cartInfo.total) + Number(calculateShippingCharge),
        amount
      )
    );
    handleWalletCheck();
  };
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

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={styles.container}
    >
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FF6F61" />
        </View>
      )}
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Review Order</Text>
      </View>

      <View style={styles.addressContainer}>
        <View
          style={[
            styles.flexRow,
            {
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
              justifyContent: "space-between",
              padding: 15,
            },
          ]}
        >
          <Text style={styles.contentHeading}>Addresses</Text>
        </View>
        <View style={{ padding: 15 }}>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 5,
              padding: 8,
            }}
          >
            <View style={styles.addressNameContainer}>
              <Text style={{ color: "#8968d9", fontFamily: font.semiBold }}>
                Billing
              </Text>
            </View>
            <View style={{ paddingVertical: 20 }}>
              <Text style={styles.addressText}>{billLocation.address1}</Text>
              <Text style={styles.addressText}>{billLocation.address2}</Text>
              <Text style={styles.addressText}>
                {billLocation.city}, {billLocation.state} {billLocation.pincode}
              </Text>
              <Text style={styles.addressText}>{billLocation.country}</Text>
            </View>
            <View>
              <View style={styles.addressCredentidalContainer}>
                <Text style={styles.addressDetailsHeading}>Contact Name</Text>
                <Text style={styles.addressDetailsText}>
                  {billLocation.nickName}
                </Text>
              </View>
              <View style={styles.addressCredentidalContainer}>
                <Text style={styles.addressDetailsHeading}>Contact Phone</Text>
                <Text style={styles.addressDetailsText}>
                  {billLocation.mobileNo}
                </Text>
              </View>
              <View style={styles.addressCredentidalContainer}>
                <Text style={styles.addressDetailsHeading}>Contact Email</Text>
                <Text style={styles.addressDetailsText}>
                  {billLocation.email}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ padding: 15 }}>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 5,
              padding: 8,
            }}
          >
            <View style={[styles.addressNameContainer]}>
              <Text style={{ color: "#8968d9", fontFamily: font.semiBold }}>
                Shipping
              </Text>
            </View>
            <View style={{ paddingVertical: 20 }}>
              <Text style={styles.addressText}>{shipLocation.address1}</Text>
              <Text style={styles.addressText}>{shipLocation.address2}</Text>
              <Text style={styles.addressText}>
                {shipLocation.city}, {shipLocation.state} {shipLocation.pincode}
              </Text>
              <Text style={styles.addressText}>{shipLocation.country}</Text>
            </View>
            <View>
              <View style={styles.addressCredentidalContainer}>
                <Text style={styles.addressDetailsHeading}>Contact Name</Text>
                <Text style={styles.addressDetailsText}>
                  {shipLocation.nickName}
                </Text>
              </View>
              <View style={styles.addressCredentidalContainer}>
                <Text style={styles.addressDetailsHeading}>Contact Phone</Text>
                <Text style={styles.addressDetailsText}>
                  {shipLocation.mobileNo}
                </Text>
              </View>
              <View style={styles.addressCredentidalContainer}>
                <Text style={styles.addressDetailsHeading}>Contact Email</Text>
                <Text style={styles.addressDetailsText}>
                  {shipLocation.email}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.shippingContainer}>
        <View
          style={[
            styles.flexRow,
            {
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
              justifyContent: "space-between",
              padding: 15,
            },
          ]}
        >
          <Text
            style={[
              styles.contentHeading,
              { alignSelf: "flex-start", width: "30%" },
            ]}
          >
            Shipping
          </Text>
          <Text
            style={{
              color: "#788191",
              alignSelf: "flex-start",
              fontFamily: font.semiBold,
            }}
          >
            Ships from Tirupur, Tamilnadu
          </Text>
        </View>
        <View style={styles.flexRow}>
          <View
            style={{
              width: "100%",
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 5,
              paddingHorizontal: 15,
              paddingVertical: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Text
                style={[
                  styles.fontBold,
                  {
                    width: "50%",
                  },
                ]}
              >
                Country
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  width: "50%",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <SvgUri
                  width="15"
                  height="15"
                  uri="https://raw.githubusercontent.com/lipis/flag-icon-css/d81077e4e9648ba32546fad3b77932b48feb344b/flags/4x3/in.svg"
                />
                <Text style={styles.fontBold}>India</Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingVertical: 10,
              }}
            >
              <Text
                style={[
                  styles.fontBold,
                  {
                    width: "50%",
                  },
                ]}
              >
                Shipping Fees
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  width: "50%",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Text style={styles.fontBold}>
                  ₹{" "}
                  {delivery === "DELIVERED TO CUSTOMER"
                    ? calculateShippingCharge
                    : "0"}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 10,
              }}
            >
              <Text
                style={[
                  styles.fontBold,
                  {
                    width: "50%",
                  },
                ]}
              >
                Transporter Name
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  width: "50%",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Text style={styles.fontBold}>
                  {selectedAddresses?.shipLocation?.transporterCharges
                    ?.transporter?.name
                    ? selectedAddresses?.shipLocation?.transporterCharges
                      ?.transporter?.name
                    : "-"}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 10,
              }}
            >
              <Text
                style={[
                  styles.fontBold,
                  {
                    width: "50%",
                  },
                ]}
              >
                Transporter Charges
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  width: "50%",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Text style={styles.fontBold}>
                  ₹{" "}
                  {selectedAddresses?.shipLocation?.transporterCharges?.charges
                    ? selectedAddresses?.shipLocation?.transporterCharges
                      ?.charges
                    : "0"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.cartContainer}>
        <View
          style={{ padding: 15, borderBottomWidth: 1, borderColor: "#ccc" }}
        >
          <Text
            style={[
              styles.contentHeading,
              { alignSelf: "flex-start", width: "30%" },
            ]}
          >
            Cart{" "}
            <Text style={{ color: "#788191", fontSize: 14 }}>
              ({cartData.length})
            </Text>
          </Text>
        </View>
        <View
          style={{
            padding: 15,
            gap: 10,
          }}
        >
          {!combo
            ? cartData.map((item) => (
              <View key={item.variantSku} style={styles.itemContainer}>
                <View style={styles.cartProduct}>
                  <View style={styles.flexContainer}>
                    <View style={styles.cartProductLayout}>
                      <View style={styles.adaptiveLayout}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <View style={styles.productInfoContainer}>
                            <View style={styles.imageContainer}>
                              <Image
                                source={{
                                  uri: `${backendUrl}${item.image?.replace(
                                    "/api",
                                    ""
                                  )}`,
                                }}
                                style={styles.productImage}
                                resizeMode="cover"
                              />
                            </View>
                            <View style={styles.productDetails}>
                              <View style={styles.flexRow}>
                                <Text style={styles.articleCode}>
                                  {item.articleCode}
                                </Text>
                              </View>
                              <View style={styles.colorInfo}>
                                <Text>
                                  <Text style={styles.colorName}>
                                    {item.variantSku}
                                  </Text>{" "}
                                  ∙{" "}
                                  <Text style={styles.colorValue}>
                                    {item.value}
                                  </Text>
                                </Text>
                              </View>
                              <View style={styles.orderInfo}>
                                <View style={styles.attr}>
                                  <Text style={styles.key}>Price</Text>
                                  <Text style={styles.value}>
                                    ₹{" "}
                                    {(
                                      item.sellingPrice *
                                      (1 -
                                        (priceSlab[item.pimVariantId]?.[0]
                                          .discount || 0) /
                                        100)
                                    ).toFixed(2) || 0}{" "}
                                    /kg
                                  </Text>
                                </View>
                                <View style={styles.attr}>
                                  <Text style={styles.key}>Shipping</Text>
                                  <Text style={styles.value}>
                                    ₹{" "}
                                    {delivery === "DELIVERED TO CUSTOMER"
                                      ? calculateShippingCharge
                                      : "-"}
                                  </Text>
                                </View>
                                <View style={styles.attr}>
                                  <Text style={styles.key}>Est. Time</Text>
                                  <Text style={styles.value}> 8-12 days</Text>
                                </View>
                              </View>
                            </View>
                          </View>
                          <View style={styles.quantityAndPrice}>
                            <View style={styles.quantityContainer}>
                              <Text style={styles.quantityText}>
                                {item.quantity}{" "}
                                {item.cartType === "SWATCH" ? "point" : "Kg"}
                              </Text>
                            </View>
                            <View style={styles.priceContainer}>
                              <Text style={styles.subtotalText}>
                                ₹{" "}
                                {(
                                  item.sellingPrice *
                                  (1 -
                                    (priceSlab[item.pimVariantId]?.[0]
                                      .discount || 0) /
                                    100) *
                                  item.quantity
                                ).toFixed(2)}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))
            : cartData.map((items) => (
              <View
                key={items.combo.articleCode}
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: "#ccc",
                  padding: 5,
                }}
              >
                <View style={styles.cartProductPayload}>
                  <View style={styles.comboHeader}>
                    <Text style={styles.comboArticleCode}>
                      {items.combo.articleCode}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                      paddingTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: font.medium,
                        color: "#666",
                        fontSize: 12,
                      }}
                    >
                      {items.combo.quantity * items?.variants?.length} kg
                    </Text>
                    <View style={styles.comboPrice}>
                      <Text style={styles.comboTotalPrice}>
                        ₹
                        {items.combo.quantity *
                          items?.variants?.length *
                          items.combo.sellingPrice}
                      </Text>
                      <Text style={styles.comboPricePerKg}>
                        ₹{items.combo.sellingPrice}/kg
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.cartItemContainer}>
                  {items.variants.length > 0 ? (
                    _.map(items.variants, (variant, _index) => (
                      <View
                        key={variant.variantSku}
                        style={[
                          styles.variantContainer,
                          {
                            borderBottomWidth:
                              _index === items.variants.length - 1 ? 0 : 1,
                            borderColor: "#ccc",
                          },
                        ]}
                      >
                        <View style={styles.variantImageContainer}>
                          <Image
                            source={{
                              uri: `${backendUrl}${variant.image?.replace(
                                "/api",
                                ""
                              )}`,
                            }}
                            style={styles.variantImage}
                            resizeMode="cover"
                          />
                        </View>
                        <View style={styles.variantDetails}>
                          <Text style={styles.variantArticleCode}>
                            {items.combo.articleCode}
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              // if (items.combo.published === "true") {
                              //   navigate(
                              //     `${items.combo.pimUrl}?variantId=${variant.variantSku}`
                              //   );
                              // }
                              console.log("Variant Sku:", variant.variantSku);
                            }}
                          >
                            <Text style={styles.variantSku}>
                              {variant.variantSku}
                            </Text>
                          </TouchableOpacity>
                          {items.combo.published === "false" && (
                            <Text style={styles.unavailableText}>
                              (Product unavailable)
                            </Text>
                          )}
                          <Text style={styles.colorValue}>
                            #
                            {
                              variant.variants.filter(
                                (item) => item.type === "Colour"
                              )[0].value
                            }
                          </Text>
                        </View>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.unavailableText}>
                      (Combo unavailable)
                    </Text>
                  )}
                </View>
              </View>
            ))}
        </View>
      </View>
      <View style={styles.cartContainer}>
        <View
          style={{ padding: 15, borderBottomWidth: 1, borderColor: "#ccc" }}
        >
          <Text
            style={[
              styles.contentHeading,
              { alignSelf: "flex-start", width: "100%" },
            ]}
          >
            {getCartType()}
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 15,
            paddingVertical: 20,
            borderBottomWidth: 1,
            borderColor: "#ccc",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              paddingVertical: 8,
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Text style={styles.cartSubtotaltext}>
              Subtotal ({cartInfo.subTotal} Items)
            </Text>
            <Text style={styles.cartSubtotal}>₹ {cartInfo.total}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              paddingVertical: 8,
            }}
          >
            <Text style={styles.cartSubtotaltext}>Shipping Fees :</Text>
            <Text style={styles.cartSubtotal}>
              ₹{" "}
              {Number(
                delivery === "DELIVERED TO CUSTOMER"
                  ? calculateShippingCharge
                  : 0
              )}
            </Text>
          </View>

          {amount > 0 && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                paddingVertical: 8,
              }}
            >
              <Text style={[styles.cartSubtotaltext, { marginTop: 8 }]}>
                Add Wallet :
              </Text>
              <Checkbox
                onPress={() => handleWalletCheckChange()}
                color={common.PRIMARY_COLOR}
                status={walletChecked ? "checked" : "unchecked"}
              />
            </View>
          )}
          {wallet && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                paddingVertical: 8,
              }}
            >
              <Text style={styles.cartSubtotaltext}>Wallet Amount:</Text>
              <Text style={styles.cartSubtotal}>
                - ₹{" "}
                {Math.min(
                  Number(cartInfo.total) +
                  parseFloat(
                    delivery === "DELIVERED TO CUSTOMER"
                      ? calculateShippingCharge
                      : 0
                  ),
                  amount
                )}
              </Text>
            </View>
          )}
        </View>
        <View
          style={{
            paddingHorizontal: 15,
            paddingVertical: 20,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              paddingVertical: 8,
            }}
          >
            <Text
              style={[
                styles.cartSubtotaltext,
                { fontSize: 16, fontFamily: font.medium },
              ]}
            >
              Total
            </Text>
            <Text style={[styles.cartSubtotal, { fontSize: 18 }]}>
              ₹{" "}
              {(
                parseFloat(cartInfo.total) +
                parseFloat(
                  delivery === "DELIVERED TO CUSTOMER"
                    ? calculateShippingCharge
                    : 0
                ) -
                (wallet
                  ? Math.min(
                    Number(cartInfo.total) +
                    parseFloat(
                      delivery === "DELIVERED TO CUSTOMER"
                        ? calculateShippingCharge
                        : 0
                    ),
                    amount
                  )
                  : 0)
              ).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
      <FiButton
        title={"Place Order"}
        onPress={() => {
          handlePlaceOrder();
        }}
      />
    </ScrollView>
  );
};

export default ReviewOrder;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 8,
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 16,
    gap: 16,
    flexGrow: 1,
  },
  contentHeading: {
    fontFamily: font.semiBold,
    fontSize: 18,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  headerRow: {
    flexDirection: "row",
    paddingVertical: 16,
    alignItems: "center",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: "100%",
  },
  headerText: {
    fontFamily: font.semiBold,
    fontSize: 22,
  },
  addressContainer: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  addressNameContainer: {
    borderWidth: 1,
    borderColor: "#8968d9",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  addressText: {
    fontFamily: font.regular,
    fontSize: 14,
  },
  addressDetailsText: {
    width: "55%",
    fontSize: 12,
    fontFamily: font.semiBold,
    color: "#000",
  },
  addressDetailsHeading: {
    width: "45%",
    fontSize: 12,
    fontFamily: font.semiBold,
    color: "#989FAB",
  },
  addressCredentidalContainer: {
    flexDirection: "row",
    paddingVertical: 3,
    alignItems: "center",
  },
  shippingContainer: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  fontBold: {
    fontFamily: font.semiBold,
  },
  cartContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  cartItemContainer: {
    padding: 5,
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  itemContainer: {
    marginBottom: 16,
  },
  cartProduct: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 16,
  },
  flexContainer: {
    flexDirection: "row",
    gap: 16,
  },
  cartProductLayout: {
    flex: 1,
  },
  adaptiveLayout: {
    flexDirection: "row",
    gap: 16,
  },
  productInfoContainer: {
    flexDirection: "row",
    gap: 20,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productDetails: {},
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  articleCode: {
    fontSize: 14,
    fontFamily: font.semiBold,
  },
  colorInfo: {
    marginTop: 4,
  },
  colorName: {
    fontFamily: font.semiBold,
    fontSize: 12,
  },
  colorValue: {
    fontFamily: font.semiBold,
    fontSize: 12,
  },
  orderInfo: {
    marginTop: 4,
  },
  attr: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  key: {
    fontSize: 12,
    fontFamily: font.regular,
    color: "#666",
  },
  value: {
    fontSize: 12,
    fontFamily: font.medium,
  },
  quantityAndPrice: {
    alignItems: "flex-end",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 12,
    fontFamily: font.semiBold,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  subtotalText: {
    fontFamily: font.semiBold,
    fontSize: 12,
  },
  cartProductPayload: {
    paddingVertical: 16,
    // borderBottomWidth: 1,
    // borderBottomColor: "#ccc",
  },
  comboHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  comboArticleCode: {
    fontSize: 16,
    fontFamily: font.bold,
  },
  comboPrice: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  comboTotalPrice: {
    color: "#666",
    fontSize: 12,
    fontFamily: font.semiBold,
  },
  comboPricePerKg: {
    fontSize: 12,
    color: "#666",
    fontFamily: font.semiBold,
  },
  cartItemContainer: {
    paddingVertical: 8,
  },
  variantContainer: {
    flexDirection: "row",
    gap: 16,
    paddingVertical: 8,
  },
  variantImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: "hidden",
  },
  variantImage: {
    width: "100%",
    height: "100%",
  },
  variantDetails: {
    flex: 1,
  },
  variantArticleCode: {
    fontSize: 14,
    fontFamily: font.bold,
  },
  variantSku: {
    fontSize: 12,
    color: common.PRIMARY_COLOR,
    fontFamily: font.medium,
  },
  unavailableText: {
    color: "red",
    fontFamily: font.medium,
  },
  cartSubtotaltext: {
    alignSelf: "flex-start",
    width: "50%",
    fontSize: 14,
    fontFamily: font.regular,
  },
  cartSubtotal: { fontFamily: font.semiBold },
});
