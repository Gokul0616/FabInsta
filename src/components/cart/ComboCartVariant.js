import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { backendUrl } from '../../Common/Common';
import { font } from '../../Common/Theme';

const ComboCartVariant = ({ items }) => {
  const navigation = useNavigation();
  return (
    <View>
      {items.variants.length > 0 ?
        <View style={styles.comboCart}>
          {_.map(items.variants, (variant, index) => (
            <View style={styles.comboCartProductLayout} key={index}>
              <View style={styles.comboCartProductInfo}>
                <Image source={{ uri: `${backendUrl}${variant.image?.replace("/api", "")}` }} style={styles.image} />
                <View style={styles.comboCartProductVariantInfo}>
                  <Text style={{ color: '#788191' }}>{items.combo.articleCode}</Text>
                  <Text style={styles.variantCode}
                    onPress={() => {
                      if (items.combo.published === "true") {
                        navigation.navigate('Home', { screen: 'fabrics', params: { pimId: pimId } });
                      }
                    }}
                  >
                    {variant?.variantSku}
                  </Text>
                  <Text>#{variant.variants.filter(item => item.type === 'Colour')[0].value}</Text>
                  {items.combo.published === "false" && <Text style={[styles.variantText, { color: "red" }]}>(Product unavailable)</Text>}
                </View>
              </View>
              <View style={styles.comboCartPriceWieghtInfo}>
                <Text style={styles.textLeft}>{items.combo.quantity} kg</Text>
                <View style={styles.priceInfo}>
                  <Text style={styles.priceText}>&#8377;{(items.combo.quantity * items.combo.sellingPrice).toFixed(2)}</Text>
                  <Text style={styles.priceText}>&#8377;{(items?.combo.sellingPrice).toFixed(2)} /kg</Text>
                </View>
              </View>
              <View style={{ borderWidth: 0.5, borderColor: 'silver', marginTop: 15, }} />
            </View>
          ))}
        </View> : <Text style={{ color: "red", alignItems: 'center', justifyContent: 'center', }}>(Combo unavailable)</Text>
      }
    </View>
  )
}

export default ComboCartVariant


const styles = StyleSheet.create({
  comboCart: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'silver',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 10,
  },
  comboCartProductLayout: {
    flexDirection: 'column',
    paddingHorizontal: 10,
  },
  comboCartProductInfo: {
    paddingHorizontal: 10,
    paddingTop: 10,
    flexDirection: 'row',
    gap: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  comboCartProductVariantInfo: {
    gap: 5,
  },
  variantCode: {
    fontSize: 16,
    fontFamily: font.bold,
    textDecorationLine: 'underline',
  },
  variantSampleText: {
    fontSize: 15,
    backgroundColor: '#fff6e5',
    color: '#c67f06',
    width: 70,
    textAlign: 'center',
    fontFamily: font.semiBold,
  },
  variantText: {
    fontSize: 14,
    fontFamily: font.medium,
  },
  comboCartPriceWieghtInfo: {
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceInfo: {
    width: '55%',
    gap: 8,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  priceText: {
    fontSize: 12,
    fontFamily: font.regular,
  },
  textLeft: {
    fontSize: 12,
    fontFamily: font.regular,
    width: '35%',
    textAlign: 'left',
  },
  comboCartItemFunctions: {
    paddingVertical: 10,
    flexDirection: 'row',
    gap: 20,
    marginBottom: 10,
  },
})