import _ from 'lodash';
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ProductSpecification = ({ pimData, categories, fabricCodes, priceSlab }) => {
  const [solidPatternVariant, setSolidPatternVariant] = useState(null);

  const DisplayHierarchy = () => {
    return (
      <View style={styles.specsValue}>
        {categories?.length > 0 ? (
          categories.map((category, index) => {
            if (index === 0) return null;
            const isLast = index === categories.length - 1;
            return (
              <View key={index} style={styles.fabricValueList}>
                {isLast ? (
                  <TouchableOpacity onPress={() => handleScubaClick(category)}>
                    <Text style={styles.fabricLink}>{category.name}</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.fabricText}>{category.name}</Text>
                )}
                {index < categories.length - 1 && <Text style={styles.separator}> {'>'} </Text>}
              </View>
            );
          })
        ) : (
          <Text style={styles.fabricText}>No hierarchy found.</Text>
        )}
      </View>
    );
  };

  const handleScubaClick = (category) => {
    for (const [key, value] of Object.entries(product?.attributes || {})) {
      const stateValue = { [key]: [value] }
      if (key === "Fabric Type") {
        navigate(`/fabrics?FabricType=${category.name}`, { state: stateValue });
      }
    }
  };

  const handleFabricFilterClick = (fabric, categoryId) => {
    // const name = fabricName.replace(' ', '_');
    // const res = api.get(`product-category/category/${fabricCategoryId}`);
    // const fabricObject = {
    //   ...res.response,
    //   name: `${name} (0-100)%`,
    //   min: "0",
    //   max: "100",
    //   value: `${fabricCategoryId}(0-100)`
    // };
    // navigate(`/fabrics?FabricContent=${name}`, { state: { "Fabric Content": [fabricObject] } });
    console.log('Fabric filter clicked:', fabric, categoryId);
  };

  useEffect(() => {
    const firstVariant = Array.isArray(pimData?.pimVariants) && pimData?.pimVariants.length > 0 ? pimData?.pimVariants[0] : null;
    if (firstVariant && firstVariant.variants) {
      const foundVariant = firstVariant.variants.find(vari => vari.type === 'Solid / Pattern');
      setSolidPatternVariant(foundVariant || null);
    }
  }, [pimData?.pimVariants]);

  const renderTable = (headerData, bodyData) => (
    <View style={styles.tableContainer}>
      <View style={styles.tableRowHeader}>
        {headerData?.map((header, index) => (
          <View key={index} style={styles.tableCell}>
            <Text style={styles.headerText}>{header}</Text>
          </View>
        ))}
      </View>
      <View style={styles.tableBody}>
        {bodyData?.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            {item.map((data, idx) => (
              <View key={idx} style={styles.tableCell}>
                <Text style={styles.tableText}>{data}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );

  const renderPricingData = priceSlab?.map((item) => [
    item.orderType,
    `${item.min ? item.min : ''} - ${item.max ? item.max : ''} kgs`,
    `₹ ${_.round(item.sellingPrice, 2)} /kg`,
  ]);

  const renderMOQData = priceSlab?.map((item) => [
    item.orderType,
    `${item.min ? item.min : ''} - ${item.max ? item.max : ''} kgs`,
  ]);

  return (
    <SafeAreaView>
      <View style={styles.specsContainer}>
        <Text style={styles.specsHeader}>Pricing</Text>
        {renderTable(['Range', 'Amount', 'Price'], renderPricingData)}
      </View>

      <View style={styles.specsContainer}>
        <Text style={styles.specsHeader}>MOQ</Text>
        {renderTable(['Order', 'MOQ'], renderMOQData)}
      </View>

      <View style={styles.specsContainer}>
        <Text style={styles.specsHeader}>Fabric Specifications</Text>
        <View style={styles.specsDetails}>
          <View style={styles.specsRow}>
            <Text style={styles.specsLabel}>Fabric Type</Text>
            <DisplayHierarchy />
          </View>
          <View style={styles.horizontalLine}></View>
        </View>

        <View style={styles.specsDetails}>
          <View style={styles.specsRow}>
            <Text style={styles.specsLabel}>Fiber Content</Text>
            <View style={styles.specsValue}>
              {Object.entries(fabricCodes).map(([key, value], index) => {
                const [fabric, code] = key.split('(');
                const CategoryId = code.replace(')', '');
                const percentage = Math.round((value / Object.values(fabricCodes).reduce((sum, v) => sum + v, 0)) * 100);
                const fabricWithPercentage = `${fabric.trim()} ${percentage}%`;
                console.log('fab : ', fabricWithPercentage);

                return (
                  <View key={fabric} style={styles.fabricValueList}>
                    <TouchableOpacity onPress={() => handleFabricFilterClick(fabric.trim(), CategoryId)}>
                      <Text style={styles.fiberText}>{fabricWithPercentage}</Text>
                    </TouchableOpacity>
                    {index < Object.entries(fabricCodes).length - 1 && (
                      <Text style={styles.separator}>/</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
          <View style={styles.horizontalLine}></View>
        </View>
        {
          solidPatternVariant !== null && (
            <View style={styles.specsRow}>
              <View style={styles.specsDetails}>
                <Text style={styles.specsLabel}>Solid / Pattern</Text>
                <View style={styles.specsValue}>
                  <Text style={styles.fabricText}>{solidPatternVariant?.value}</Text>
                </View>
              </View>
              <View style={styles.horizontalLine}></View>
            </View>
          )
        }
        <View style={styles.specsDetails}>
          <View style={styles.specsRow}>
            <Text style={styles.specsLabel}>Dimensions</Text>
            <View style={styles.specsDimensionValue}>
              <View>
                <Text style={styles.fabricText}>{pimData?.product?.metrics?.weight || 'N/A'} gsm</Text>
                <Text style={styles.dimensionLabel}>Weight</Text>
              </View>
              <View>
                <Text style={styles.fabricText}>{pimData?.product?.metrics?.width || 'N/A'} gsm</Text>
                <Text style={styles.dimensionLabel}>Width</Text>
              </View>
              <View>
                <Text style={styles.fabricText}>{pimData?.product?.metrics?.thickness || 'N/A'} gsm</Text>
                <Text style={styles.dimensionLabel}>Thickness</Text>
              </View>
            </View>
          </View>
          <View style={styles.horizontalLine}></View>
        </View>
        {
          pimData?.attributes && Object.entries(pimData?.attributes)
            .filter(([key]) => key !== 'Fabric Type' && key !== 'Fabric Content')
            .map(([key, value]) => {
              if (!value?.heirarchyLabel) return null;
              const { heirarchyLabel, description } = value;
              const hasParentChild = heirarchyLabel.includes('/');
              const [parentName, childName] = hasParentChild ? heirarchyLabel.split('/').map(part => part.trim()) : [heirarchyLabel];
              return (
                <View style={styles.specsDetails} key={key}>
                  <View style={styles.specsRow}>
                    <Text style={styles.specsLabel}>{key}</Text>
                    <View style={styles.specsValue}>
                      <View>
                        <Text style={styles.fabricText}>{hasParentChild ? `${parentName} > ${childName}` : parentName}</Text>
                      </View>
                      {description && (
                        <Text style={styles.fabricText}>{description}</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.horizontalLine}></View>
                </View>
              );
            })
        }
      </View>
    </SafeAreaView>
  );
};

export default ProductSpecification;

const styles = StyleSheet.create({
  specsContainer: {
    padding: 20,
  },
  specsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  specsRow: {
    marginTop: 10,
  },
  specsLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  specsValue: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingLeft: 15,
    paddingTop: 5,
  },
  fabricValueList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  fabricLink: {
    textDecorationLine: "underline",
    textDecorationStyle: 'solid',
    color: "#596E85",
    fontSize: 15,
  },
  fabricText: {
    fontSize: 15,
    color: '#000',
  },
  separator: {
    marginHorizontal: 4,
    fontSize: 15,
  },
  horizontalLine: {
    height: 1,
    backgroundColor: '#dcdcdc',
    marginVertical: 10,
  },
  fiberText: {
    fontSize: 15,
    color: '#545f6e',
    fontWeight: 'bold',
  },
  specsDimensionValue: {
    flexDirection: 'row',
    paddingLeft: 15,
    paddingTop: 5,
    gap: 20,
  },
  dimensionLabel: {
    color: '#788191',
    fontSize: 15,
    fontWeight: 600,
  },


  tableContainer: {
    marginTop: 10,
  },
  tableRowHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  tableBody: {
    flex: 1,
  },
  tableCell: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  headerText: {
    fontWeight: 'bold',
  },
  tableText: {
    textAlign: 'center',
  },
  smallText: {
    fontSize: 10,
    color: '#777',
  },
  currency: {
    fontWeight: 'bold',
    color: '#333',
  },
});