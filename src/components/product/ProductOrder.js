import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Checkbox } from 'react-native-paper';
import Icon from "react-native-vector-icons/AntDesign";
import { common, storage } from '../../Common/Common';
import { font } from '../../Common/Theme';
import api from '../../Service/api';

const ProductOrder = ({
  pimData, colorOption, cartOptions, selectedValue, setSelectedValue, minimumOrder, handleAddToCart,
  setMinimumOrder, setError, backOrder, totalQuantity, kgPerRoll, combo, selectedSku, 
  sampleCheck, alreadyInCart, setSelectedSku, setSampleCheck, swatchAvailable, existComboSwatch,
}) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded]);
  const buttonRef = useRef(null);
  const [selectedLabel, setSelectedLabel] = useState();
  const [selectedCode, setSelectedCode] = useState();
  const [selectColor, setSelectColor] = useState();
  const navigation = useNavigation();

  const onSelect = (item) => {
    setSelectColor(item)
    setSelectedLabel(item.label);
    setSelectedCode(item.code);
    setSelectedValue(item.value);
    const filteredOption = _.filter(colorOption, c => c.id === item.value)[0];
    const skuCode = filteredOption ? filteredOption.skucode : null;
    setSelectedSku(skuCode)
    setExpanded(false);
  };


  useEffect(() => {
    if (selectedValue) {
      const foundColor = colorOption.find(color => color.id === selectedValue);
      setSelectedLabel(foundColor?.label);
      setSelectedCode(foundColor?.code);
    }
  }, [selectedValue])

  const handleSampleCheck = () => {
    setMinimumOrder('')
    setSampleCheck((prev) => !prev)
  }

  const handleQuantityChange = (qty) => {
    setMinimumOrder(qty)
  }

  const isAnyComboTrue = Object.values(alreadyInCart).some(item => item.combo === true);

  const handleSwatchCard = async () => {
    const data = {
      pimId: pim.pimId,
      swatchId: pim.swatchId
    }
    await api.post(`cart/swatch/save`, {
      json: data
    })
    return navigate('/cart');
  }

  const getButtonOneTitle = () => {
    return (
      totalQuantity < cartOptions[selectedValue]?.SampleMin && !backOrder || (!backOrder && totalQuantity === 0)
        ? "Out of Stock" : existComboSwatch?.combo ? "Already in Combo Cart" :
          (alreadyInCart[selectedValue]?.sample === true) && (alreadyInCart[selectedValue]?.wholeSale === true) ? "Already in Sample & Wholesale Cart" :
            ((alreadyInCart[selectedValue]?.sample === true)) ? "Already in Sample Cart" :
              (alreadyInCart[selectedValue]?.wholeSale === true) ? "Already in Wholesale Cart" : null
    );
  }

  const getButtonTwoTitle = () => {
    return (
      !backOrder && totalQuantity === 0 && selectedValue ? "Out of Stock" : (
        !backOrder && parseInt(minimumOrder) > totalQuantity ? `Maximum Quantity available : ${totalQuantity} Kg`
          : ((combo?.includes(selectedSku) === true) ? (isAnyComboTrue ? "Already in Combo Cart" : "Add to Combo")
            : (sampleCheck ? "Add to WholeSale Cart" : "Add to Sample Cart")
          )
      )
    )
  }

  const isButtonDisabled = () => {
    return (
      (combo?.includes(selectedSku) && (isAnyComboTrue)) || (minimumOrder < cartOptions[selectedValue]?.Wholesale && sampleCheck) || minimumOrder < cartOptions[selectedValue]?.SampleMin || !selectedValue
      || (!backOrder && minimumOrder > totalQuantity) || (combo?.includes(selectedSku) && minimumOrder < cartOptions[selectedValue]?.Wholesale)
    );
  };

  return (
    <View style={styles.productOrderContainer}>
      {(swatchAvailable && pimData.swatchCard) &&
        <View style={styles.innerContainer}>
          <Text style={styles.commonTitleText}>Swatch</Text>
          <View style={styles.swatchContentContainer}>
            <View style={styles.swatchRow}>
              <Text style={[styles.commonLabelText, { width: '25%' }]}>Color</Text>
              <Text style={[styles.commonValueText, { fontWeight: '400' }]}>Includes all available colors</Text>
            </View>
            <View style={styles.swatchRow}>
              <Text style={[styles.commonLabelText, { width: '25%' }]}>Price</Text>
              <Text style={styles.commonValueText}>1 Swatch Point</Text>
            </View>
            <TouchableOpacity
              style={[styles.swatchButtonContainer, { backgroundColor: existComboSwatch?.swatch ? '#e3e3e3' : '#ff6f61' }]}
              disabled={existComboSwatch?.swatch}
              onPress={handleSwatchCard}
            >
              <Text style={styles.swatchButtonText}>
                {existComboSwatch?.swatch ? "Already in Swatch Cart" : "Added to Swatch Cart"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      }

      <View style={styles.innerContainer}>
        <Text style={styles.commonTitleText}>Order</Text>
        <View style={styles.colorSelectorContainer}>
          <View style={styles.colorSelectorInnerContainer}>
            <View style={styles.colorLabelText}>
              <Text style={[styles.commonLabelText, { width: '50%' }]}>Color</Text>
              <Text style={styles.dropdownInfoLabel}>{combo?.includes(selectColor?.skucode) ? (isAnyComboTrue ? 'Already in combo' : 'Combo')
                : alreadyInCart[selectColor?.value]?.sample && alreadyInCart[selectColor?.value]?.wholeSale ? 'Already in Sample/WholeSale'
                  : alreadyInCart[selectColor?.value]?.sample ? 'Already in Sample'
                    : alreadyInCart[selectColor?.value]?.wholeSale ? 'Already in WholeSale' : null}
              </Text>
            </View>
            <View style={styles.colorSelectorValueContainer} ref={buttonRef}>
              <TouchableOpacity
                style={styles.colorDropdownButton}
                activeOpacity={0.8}
                onPress={toggleExpanded}
              >
                <Text style={selectedLabel ? '' : styles.colorDropdownPlaceholderText}>
                  {selectedLabel ?
                    <View style={styles.dropdownColorItem}>
                      <View style={{ backgroundColor: `${selectedCode}`, width: 15, height: 15, borderRadius: 15 / 2 }} />
                      <Text>{selectedLabel}</Text>
                    </View>
                    : "Select a color"}
                </Text>
                <Icon style={selectedLabel ? '' : styles.colorDropdownPlaceholderText} name={expanded ? 'caretup' : 'caretdown'} />
              </TouchableOpacity>
              {expanded && (
                <View style={styles.dropdownMenuContainer}>
                  <ScrollView nestedScrollEnabled>
                    {colorOption.map((item) => (
                      <TouchableOpacity
                        key={item.value}
                        activeOpacity={0.8}
                        onPress={() => onSelect(item)}
                        style={styles.dropdownItem}
                      >
                        <View style={styles.dropdownItemContainer}>
                          <View style={styles.dropdownColorItem}>
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
                            <Text style={styles.dropdownItemLabelText}>{item.label}</Text>
                          </View>
                          <Text style={styles.dropdownItemInfoText}>{combo?.includes(item.skucode) ? (isAnyComboTrue ? 'Already in combo' : 'Combo')
                            : alreadyInCart[item.value]?.sample && alreadyInCart[item.value]?.wholeSale ? 'Already in Sample/WholeSale'
                              : alreadyInCart[item.value]?.sample ? 'Already in Sample'
                                : alreadyInCart[item.value]?.wholeSale ? 'Already in WholeSale' : null}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        </View>

        {combo?.includes(selectedSku) && (
          <Text style={styles.comboMessageText}>The selected variant is in a combo and comes with {combo.length} variants</Text>
        )}

        <View style={styles.wholesaleOrderContainer}>
          <Text style={styles.commonLabelText}>Order Sample</Text>
          <View style={styles.wholesaleCheckboxContainer}>
            <Checkbox
              color={combo?.includes(selectedSku) ? '#e3e3e3' : common.PRIMARY_COLOR}
              status={!sampleCheck ? 'checked' : 'unChecked'}
              onPress={handleSampleCheck}
              disabled={combo?.includes(selectedSku)}
              style={{
                backgroundColor: combo?.includes(selectedSku) ? '#e3e3e3' : '#fff',
                opacity: combo?.includes(selectedSku) ? 0.5 : 1,
              }}
            />
            <Text style={styles.commonValueText}>Click for sample order</Text>
          </View>
          <View style={styles.orderFieldContainer}>
            {sampleCheck &&
              <View style={styles.orderInputField}>
                <Text style={styles.orderInputLabelText}>Roll</Text>
                <TextInput
                  value={(minimumOrder / kgPerRoll) || ''}
                  editable={(combo?.includes(selectedSku) && isAnyComboTrue) || !selectedValue || (!backOrder && totalQuantity === 0) || (alreadyInCart[selectedValue]?.sample && alreadyInCart[selectedValue]?.wholeSale) ? false : true}
                  placeholder={`Min Qty: ${(cartOptions[selectedValue]?.SampleMax) / kgPerRoll || '1+'}`}
                  onChangeText={(value) => { handleQuantityChange((value) * kgPerRoll); setError(false) }
                  }
                  min={Math.round(cartOptions[selectedValue]?.SampleMax / kgPerRoll)}
                  max={!backOrder ? totalQuantity : undefined}
                  style={[styles.inputField, {
                    backgroundColor: (combo?.includes(selectedSku) && isAnyComboTrue) || !selectedValue || (!backOrder && totalQuantity === 0) || (alreadyInCart[selectedValue]?.sample && alreadyInCart[selectedValue]?.wholeSale) ? '#e3e3e3' : '#fff'
                  }]}
                  keyboardType='number-pad'
                />
              </View>
            }
            <View style={styles.orderInputField}>
              <Text style={styles.orderInputLabelText}>Kg</Text>
              <TextInput
                value={isNaN(minimumOrder) || minimumOrder === undefined ? '' : String(minimumOrder)}
                placeholder={`Min Qty: ${cartOptions[selectedValue]?.SampleMin || '1+'}`}
                onChangeText={(value) => { handleQuantityChange(value); setError(false) }}
                min={cartOptions[selectedValue]?.SampleMin}
                max={cartOptions[selectedValue]?.SampleMax}
                rightSection={<p>Kg</p>}
                style={[styles.inputField,
                { backgroundColor: (combo?.includes(selectedSku) && isAnyComboTrue) || sampleCheck || !selectedValue || (!backOrder && totalQuantity === 0) || (alreadyInCart[selectedValue]?.sample && alreadyInCart[selectedValue]?.wholeSale) ? "#e3e3e3" : "#fff" }]}
                keyboardType='number-pad'
                editable={(combo?.includes(selectedSku) && isAnyComboTrue) || sampleCheck || !selectedValue || (!backOrder && totalQuantity === 0) || (alreadyInCart[selectedValue]?.sample && alreadyInCart[selectedValue]?.wholeSale) ? false : true}
              />
            </View>
            <View style={styles.orderInputField}>
              <Text style={styles.orderInputLabelText}>Meter</Text>
              <TextInput
                value={
                  !isNaN(minimumOrder) && !isNaN((pimData?.product?.metrics?.meterPerKg))
                    ? String((minimumOrder * pimData.product.metrics.meterPerKg).toFixed(2))
                    : '0'
                }
                style={[styles.inputField, { backgroundColor: '#e3e3e3' }]}
                editable={false}
              />
            </View>
          </View>
        </View>

        {(minimumOrder <= cartOptions[selectedValue]?.Wholesale && (alreadyInCart[selectedValue]?.sample === true)) ||
          (cartOptions[selectedValue]?.Wholesale <= minimumOrder && (alreadyInCart[selectedValue]?.wholeSale === true)) ||
          ((alreadyInCart[selectedValue]?.wholeSale === true) && (alreadyInCart[selectedValue]?.sample === true)) ? (
          <TouchableOpacity onPress={handleAddToCart} style={[styles.swatchButtonContainer, { backgroundColor: '#e3e3e3' }]} disabled={true}>
            <Text style={styles.swatchButtonText}>{getButtonOneTitle()}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleAddToCart} style={[styles.swatchButtonContainer, { backgroundColor: isButtonDisabled() ? '#e3e3e3' : '#ff6f61' }]} disabled={isButtonDisabled()}>
            <Text style={styles.swatchButtonText}>{getButtonTwoTitle()}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}
export default ProductOrder;

const styles = StyleSheet.create({
  productOrderContainer: {
    padding: 20,
    gap: 20,
  },
  innerContainer: {
    gap: 15,
  },
  commonTitleText: {
    fontSize: 20,
    fontFamily: font.bold,
  },
  swatchContentContainer: {
    gap: 15,
  },
  swatchRow: {
    flexDirection: 'row',
  },
  commonLabelText: {
    fontSize: 16,
    fontFamily: font.semiBold,
  },
  commonValueText: {
    fontSize: 16,
    fontFamily: font.regular,
  },
  swatchButtonContainer: {
    backgroundColor: '#ff6f61',
    borderRadius: 5,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchButtonText: {
    fontSize: 18,
    fontFamily: font.bold,
    color: 'white',
  },
  colorSelectorContainer: {
    gap: 10,
  },
  colorSelectorInnerContainer: {
    flexDirection: 'column',
  },
  colorSelectorValueContainer: {
    marginTop: 10,
  },
  colorDropdownButton: {
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
  colorDropdownPlaceholderText: {
    fontSize: 15,
    color: '#ccc',
    opacity: 0.8,
    fontFamily: font.medium,
  },
  dropdownItemList: {
    gap: 10,
  },
  dropdownColorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 8,
  },
  colorLabelText: {
    flexDirection: 'row',
  },
  dropdownMenuContainer: {
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
    maxHeight: 250,
  },
  dropdownItem: {
    paddingVertical: 8,
  },
  dropdownItemContainer: {
    gap: 5,
  },
  dropdownInfoLabel: {
    fontSize: 14,
    fontFamily: font.bold,
    color: '#c67f06',
    width: '50%',
    textAlign: 'right',
  },
  dropdownItemLabelText: {
    fontSize: 14,
    fontFamily: font.medium,
  },
  dropdownItemInfoText: {
    fontSize: 12,
    fontFamily: font.semiBold,
    color: '#c67f06',
    marginLeft: 35,
  },
  comboMessageText: {
    color: 'red',
    lineHeight: 20,
  },
  wholesaleOrderContainer: {
    gap: 10,
  },
  wholesaleCheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderFieldContainer: {
    gap: 20,
  },
  orderInputField: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  orderInputLabelText: {
    fontSize: 16,
    fontFamily: font.semiBold,
    width: '25%',
  },
  inputField: {
    height: 50,
    width: '75%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 15,
  }
})