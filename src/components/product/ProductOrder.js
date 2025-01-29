import _ from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from "react-native-vector-icons/AntDesign";
import { font } from '../../Common/Theme';
import api from '../../Service/api';
import { Checkbox } from 'react-native-paper';
import { storage } from '../../Common/Common';
import { useNavigation } from '@react-navigation/native';

const ProductOrder = ({
  pimData, colorOption, cartOptions, selectedValue, setSelectedValue,
  minimumOrder, setMinimumOrder, setError, backOrder, totalQuantity,
  kgPerRoll, combo, selectedSku, sampleCheck, alreadyInCart, setSelectedSku, setSampleCheck
}) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded]);
  const buttonRef = useRef(null);
  const [selectedLabel, setSelectedLabel] = useState();
  const [selectedCode, setSelectedCode] = useState();
  const navigation = useNavigation();

  const onSelect = useCallback((item) => {
    setSelectedLabel(item.label);
    setSelectedCode(item.code);
    setSelectedValue(item.value);
    const filteredOption = _.filter(colorOption, c => c.id === item.value)[0];
    const skuCode = filteredOption ? filteredOption.skucode : null;
    setSelectedSku(skuCode)
    setExpanded(false);
  }, []);


  useEffect(() => {
    if (selectedValue) {
      const foundColor = colorOption.find(color => color.id === selectedValue);
      setSelectedLabel(foundColor?.label);
      setSelectedCode(foundColor?.code);
    }
  }, [selectedValue])

  // Add to cart function
  const handleAddToCart = async () => {
    const token = storage.getString("token");
    if (!token) {
      setModalMessage('You need to log in to add items to the cart.');
      return setIsOpenModal(true);
    }
    if (minimumOrder % kgPerRoll !== 0 && minimumOrder >= cartOptions[selectedValue]?.Wholesale) {
      setError(true)
      return
    }
    if (profile?.approveStatus === "APPROVED") {
      if (combo?.includes(selectedSku)) {
        await api.post(`cart/combo/save`, {
          json: cart
        })
      } else {
        await api.post(`cart/save`, {
          json: cart
        })
      }
      reloadHeader()
      return navigation.navigate('Cart', { params: { cartType: cart?.cartType } });
    }
    else {
      setModalMessage('You are not approved yet. Please Contact your Sales Manager');
      // setIsOpenModal(true);
    }
  };

  const handleSampleCheck = () => {
    setMinimumOrder('')
    setSampleCheck((prev) => !prev)
  }

  return (
    <View style={styles.container}>
      <View style={styles.orderDetailsContainer}>
        <Text style={styles.orderDetailsHeader}>Order</Text>
        <View style={styles.colorFieldContainer}>
          <View style={styles.colorFieldInnerContainer}>
            <Text style={styles.colorFieldlabel}>Color</Text>
            <View style={styles.colorFieldvalue} ref={buttonRef}>
              <TouchableOpacity style={styles.dropdownField} activeOpacity={0.8} onPress={toggleExpanded}>
                <Text style={selectedLabel ? '' : styles.dropdownPlaceholder}>
                  {selectedLabel ?
                    <View style={styles.dropdownItems}>
                      <View style={{ backgroundColor: `${selectedCode}`, width: 15, height: 15, borderRadius: '50%' }} />
                      <Text>{selectedLabel}</Text>
                    </View> : "Select a color"}
                </Text>
                <Icon style={selectedLabel ? '' : styles.dropdownPlaceholder} name={expanded ? 'caretup' : 'caretdown'} />
              </TouchableOpacity>
              {
                expanded ?
                  (
                    <View style={styles.dropdownOptions}>
                      <ScrollView style={styles.dropdownList}>
                        {colorOption.map((item) => (
                          <TouchableOpacity
                            key={item.value}
                            activeOpacity={0.8}
                            onPress={() => onSelect(item)}
                            style={styles.dropdownItems}
                          >
                            <View
                              style={{
                                backgroundColor: item.code,
                                width: 15,
                                height: 15,
                                borderRadius: 15 / 2,
                                borderWidth: 1,
                                borderColor: 'silver'
                              }}
                            />
                            <Text>{item.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )
                  : null
              }
            </View>
          </View>
        </View>
        {combo?.includes(selectedSku) && <Text style={{ marginLeft: '5rem', paddingBottom: '1rem', color: 'red' }}>The selected  Variant is in Combo comes with {combo.length} variant</Text>}
        <View style={{ marginBottom: '1rem' }}>
          <Text>Order by Roll </Text>
          <View>
            <View>
              <Checkbox checked={sampleCheck} onPress={() => handleSampleCheck()} />
              {<Text style={{ color: 'grey' }}>For WholeSale Order Only</Text>}
            </View>
          </View>
        </View>

        {(minimumOrder <= cartOptions[selectedValue]?.Wholesale && alreadyInCart[selectedValue]?.sample) ||
          (cartOptions[selectedValue]?.Wholesale <= minimumOrder && alreadyInCart[selectedValue]?.wholeSale) ||
          (alreadyInCart[selectedValue]?.wholeSale && alreadyInCart[selectedValue]?.sample) ? (
          <Button
            style={{
              height: '52px',
              cursor: 'not-allowed',
              backgroundColor: 'lightgray',
            }}
            onPress={handleAddToCart}
            disabled={true}
            title={(
              totalQuantity < cartOptions[selectedValue]?.SampleMin && !backOrder || (!backOrder && totalQuantity === 0)
                ? "Out of Stock"
                : existComboSwatch?.combo ? "Already in Combo Cart" :
                  alreadyInCart[selectedValue]?.sample && alreadyInCart[selectedValue]?.wholeSale ? "Already in Sample & Wholesale Cart" :
                    (minimumOrder <= cartOptions[selectedValue]?.Wholesale && alreadyInCart[selectedValue]?.sample) ? "Already in Sample Cart" :
                      alreadyInCart[selectedValue]?.wholeSale ? "Already in Wholesale Cart" : ""
            )}
          />
        ) :
          <Button
            color='#ff6f61'
            onPress={handleAddToCart}
            disabled={(combo?.includes(selectedSku) && (isAnyComboTrue)) || (minimumOrder < cartOptions[selectedValue]?.Wholesale && sampleCheck) || minimumOrder < cartOptions[selectedValue]?.SampleMin || !selectedValue || (!backOrder && minimumOrder > totalQuantity) || (combo?.includes(selectedSku) && minimumOrder < cartOptions[selectedValue]?.Wholesale)}
            title={
              !backOrder && totalQuantity === 0 && selectedValue ? "Out of Stock" :
                !backOrder && parseInt(minimumOrder) > totalQuantity ? `Maximum Quantity available: ${totalQuantity} Kg` :
                  combo?.includes(selectedSku) ? (isAnyComboTrue ? "Already in Combo Cart" : "Add to Combo") :
                    minimumOrder >= cartOptions[selectedValue]?.Wholesale ? "Add to WholeSale Cart" :
                      "Add to Sample Cart"
            }
          />
        }
      </View>
    </View>
  )
}

export default ProductOrder

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  orderDetailsContainer: {
    padding: 20,
    backgroundColor: "#fff",
  },
  orderDetailsHeader: {
    fontSize: 20,
    fontFamily: font.bold,
    paddingVertical: 5,
  },
  colorFieldContainer: {
    marginBottom: 16,
  },
  colorFieldInnerContainer: {
    flexDirection: 'column',
  },
  colorFieldlabel: {
    fontSize: 16,
    marginRight: 8,
    fontWeight: 'bold',
  },
  colorFieldvalue: {
    marginTop: 10,
  },
  dropdownField: {
    height: 50,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 15,
  },
  dropdownPlaceholder: {
    fontSize: 15,
    color: '#ccc',
    opacity: 0.8,
  },
  dropdownBackdrop: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  dropdownOptions: {
    position: 'absolute',
    top: 53,
    zIndex: 999,
    backgroundColor: 'white',
    width: '100%',
    padding: 10,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownList: {
    overflow: 'scroll',
    maxHeight: 250,
  },
  dropdownItems: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 15,
  },
  separator: {
    height: 4,
  },
  textInputPicker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingLeft: 10,
    width: '100%',
  },
  button: {
    backgroundColor: "#FF6F61",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    height: 40,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.2s",
  },
  buttonText: {
    color: "#ffffff",
    fontFamily: font.regular,
    fontSize: 16,
  },
})