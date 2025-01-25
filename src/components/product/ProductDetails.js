import { useNavigation, useRoute } from '@react-navigation/native';
import React, { createContext, useEffect, useRef, useState } from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'
import ProductInformation from './ProductInformation';
import api from '../../Service/api';
import { backendUrl } from '../../Common/Common';
import ProductOrder from './ProductOrder';
import _ from 'lodash';
import ProductSpecification from './ProductSpecification';
import ProductStandardColor from './ProductStandardColor';

export const CreateProduct = createContext();
const ProductDetails = ({ route }) => {
    const navigation = useNavigation();
    const { pimId } = route.params;
    const routes = useRoute();
    const { search } = routes.params || {};
    const queryParams = search ? JSON.parse(decodeURIComponent(search)) : {};
    const variantId = queryParams.variantId;
    const [loading, setLoading] = useState(true);
    const [pim, setPim] = useState({});
    const [mainContent, setMainContent] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [profile, setProfile] = useState({});
    const [modalMessage, setModalMessage] = useState('');
    const [selectedValue, setSelectedValue] = useState(null);
    const [media, setMedia] = useState([]);
    const [categories, setCategories] = useState([]);
    const [colorOption, setColorOption] = useState([]);
    const [page, setPage] = useState(0);
    const [similarProduct, setSimilarProduct] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [similarProductSlide, setSimilarProductSlide] = useState([]);
    const [minimumOrderRequired, setMinimumOrderRequired] = useState('');
    const [minimumOrder, setMinimumOrder] = useState();
    const [pimVariantIds, setPimVariantIds] = useState([]);
    const [cart, setCart] = useState({});
    const [cartOptions, setCartOptions] = useState([]);
    const [alreadyInCart, setAlreadyInCart] = useState({});
    const [stock, setStock] = useState({});
    const [fabricCodes, setFabricCodes] = useState({});
    const [backOrder, setBackOrder] = useState();
    const [combo, setCombo] = useState([]);
    const [swatchAvailable, setSwatchAvailable] = useState(false);
    const [selectedSku, setSelectedSku] = useState(null);
    const [existComboSwatch, setExistComboSwatch] = useState();
    const [solidPatternVariant, setSolidPatternVariant] = useState(null);
    const [priceBook, setPriceBook] = useState([]);
    const [priceSlab, setPriceSlab] = useState([]);
    const [kgPerRoll, setKgPerRoll] = useState(0);
    const [error, setError] = useState(false);
    const [sampleCheck, setSampleCheck] = useState(false);

    const fabricSpecsRef = useRef(null);
    const pricingRef = useRef(null);
    const moqRef = useRef(null);
    const videoRef = useRef(null);
    const scrollContainerRef = useRef(null);

    const [showScrollRight, setShowScrollRight] = useState(true);
    const [showScrollLeft, setShowScrollLeft] = useState(false);
    const SCROLL_STEP = 300;


    // Fetch product information details useEffect
    useEffect(() => {
        const fetchAllProducts = async () => {
            // pim details set state 
            const response = await api.get(`/pim/product/${pimId}`);
            const pimData = response.response;
            setPim(pimData || {});
            setLoading(false);
        };
        fetchAllProducts();
    }, [pimId]);

    useEffect(() => {
        fetchPimDetails();
        fetchAndSetCategories();
        fetchColorAndImage();
    }, [pim]);

    // Fetch pim details function
    const fetchPimDetails = async () => {
        // Fabric code composition set state 
        const composition = pim.product?.fabricContent?.composition;
        const names = await replaceKeysWithNames(composition);
        setFabricCodes(names);

        // Stocks set state 
        pim.pimVariants = _.filter(pim?.pimVariants, (p) => p.status === 'ACTIVE');
        const skuIds = pim?.pimVariants.map((variant) => variant.variantSku);
        const res = await api.get(`stock/price?pimVariantSku=${skuIds}`);
        const stocks = res.response;
        setStock(stocks);

        // priceBook, priceSlab and cartOptions set state 
        let { sampleMoq, wholesaleMoq } = pim?.pimOtherInformation || {};
        if (!sampleMoq && !wholesaleMoq) {
            const moqs = await fetchMoq();
            sampleMoq = moqs.sampleMoq;
            wholesaleMoq = moqs.wholesaleMoq;
        }

        const priceBook = pim?.pimVariants?.map((item) => {
            const priceSlabs = item?.priceBook?.priceSlab || [
                { min: sampleMoq, max: wholesaleMoq, discount: 0, orderType: "SAMPLE" },
                { min: wholesaleMoq, max: '', discount: 0, orderType: "WHOLESALE" },
            ];
            return {
                variantId: item.id,
                priceSlabs,
                sellingPrice: item.sellingPrice,
                sku: item.variantSku,
            };
        }) || [];

        let minPrice = Number.POSITIVE_INFINITY;
        let maxPrice = Number.NEGATIVE_INFINITY;

        priceBook?.forEach((item) => {
            const samplePriceSlab = item?.priceSlabs.find((priceSlab) => priceSlab?.orderType === 'SAMPLE');
            const wholesalePriceSlab = item?.priceSlabs.find((priceSlab) => priceSlab?.orderType === 'WHOLESALE');
            if (samplePriceSlab) {
                setCartOptions((prev) => ({
                    ...prev,
                    [item.variantId]: {
                        SampleMin: samplePriceSlab.min,
                        SampleMax: samplePriceSlab.max,
                        Wholesale: wholesalePriceSlab ? wholesalePriceSlab.min : null,
                    },
                }));
            }
            item?.priceSlabs?.forEach((priceSlab) => {
                const sellingPrice = stocks[item.sku]?.price || item?.sellingPrice;
                const discountedPrice = sellingPrice - (sellingPrice * priceSlab?.discount) / 100;

                priceSlab.sellingPrice = discountedPrice;

                minPrice = Math.min(minPrice, discountedPrice);
                maxPrice = Math.max(maxPrice, discountedPrice);
            });
        });
        minPrice = minPrice === Number.POSITIVE_INFINITY ? null : minPrice;
        maxPrice = maxPrice === Number.NEGATIVE_INFINITY ? null : maxPrice;

        pim.minPrice = minPrice;
        pim.maxPrice = maxPrice;

        setPriceBook(priceBook);
        setPriceSlab(priceBook[0]?.priceSlabs || []);
    };

    // Fetch categories details and find category name function
    const replaceKeysWithNames = async (categories) => {
        const results = {};
        for (const [code, value] of Object.entries(categories)) {
            const res = await api.get(`product-category/category/${code}`);
            const name = res?.response?.name;
            if (name) {
                results[`${name}(${code})`] = value;
            }
        }
        return results;
    };

    // Fetch customer moq function
    const fetchMoq = async () => {
        try {
            const moqs = await api.get('customer/moq');
            const { sampleMoq, wholesaleMoq } = moqs?.response || {};
            return { sampleMoq, wholesaleMoq };
        } catch (error) {
            console.log("error");
            return {};
        }
    };

    // Fetch categories details function
    const fetchAndSetCategories = async () => {
        try {
            const fabricTypeAttribute = pim?.attributes?.["Fabric Type"];
            if (fabricTypeAttribute && fabricTypeAttribute.categoryId) {
                let hierarchy = [];
                let currentId = fabricTypeAttribute.categoryId;
                while (currentId) {
                    const res = await api.get(`product-category/category/${currentId}`);
                    const category = res.response;
                    if (category) {
                        hierarchy.push({
                            name: category.name,
                            hasParent: !!category.parentId,
                        });
                        currentId = category.parentId;
                    } else {
                        currentId = null;
                    }
                }
                setCategories(hierarchy.reverse());
            } else {
                setCategories(null);
            }
        } catch (error) {
            setCategories(null);
        }
    };

    // fetch images and video in carousel view , color options function
    const fetchColorAndImage = () => {
        const newMedia = [];
        if (pim) {
            const imageSrc = `${backendUrl}${pim?.product?.image?.replace("/api", "")}`;
            const videoSrc = `${backendUrl}${pim?.video?.replace("/api", "")}`;
            if (pim.video) {
                newMedia.push({
                    type: 'video',
                    poster: imageSrc,
                    src: videoSrc
                });
            }
            if (pim.pimVariants) {
                pim.pimVariants.forEach(variant => {
                    if (variant.image !== null) {
                        const variantImageSrc = `${backendUrl}${variant.image.replace("/api", "")}`;
                        newMedia.push({
                            type: 'image',
                            src: variantImageSrc,
                            sku: variant.variantSku,
                            id: variant.id
                        });
                    }
                });
            }
        }
        setMedia(newMedia);
        const colourOptions = []
        _.map(pim?.pimVariants, pimv => {
            const colorVariant = _.filter(pimv.variants, v => v.type === 'Colour')[0]
            if (colorVariant) {
                const color = {
                    "label": ` #${pimv.variantSku}-${_.capitalize(colorVariant?.value)}`,
                    "code": colorVariant.hexaColorCode,
                    "value": pimv.id,
                    "color": colorVariant.value,
                    "skucode": pimv.variantSku,
                    "id": pimv.id,
                    "image": pimv?.image,
                    "backOrder": pimv?.backOrder || false,
                }
                colourOptions.push(color)
            }
        })
        setColorOption(colourOptions);
        if (colourOptions.length > 0 && variantId) {
            const selectedColor = colourOptions.find((item) => item.skucode === variantId);
            if (selectedColor) {
                setSelectedValue(selectedColor.id);
            }
        }
    }

    useEffect(() => {
        setMainContent(_.filter(media, v => v.id === selectedValue)[0] || media[0])
        setPriceSlab(priceBook?.filter(item => item.variantId === selectedValue)[0]?.priceSlabs || priceBook[0]?.priceSlabs)
        let backOrder = true;
        let kg = stock[selectedSku]?.kgPerRoll;
        if (combo?.includes(selectedSku)) {
            setSampleCheck(true)
            const comboKgPerRoll = combo
                .map(sku => stock[sku]?.kgPerRoll)
                .filter(Boolean)
                .filter(kg => !isNaN(kg));
            if (comboKgPerRoll.length > 0) {
                kg = Math.min(...comboKgPerRoll);
            } else {
                kg = 0;
            }
            backOrder = combo.every(sku => {
                const colorOptionForSku = colorOption.find(option => option.skucode === sku); // use `find` instead of `filter` for first match
                return colorOptionForSku?.backOrder || false;
            });
        }
        else {
            backOrder = _.filter(colorOption, c => c.id === selectedValue)[0]?.backOrder || false
        }
        setBackOrder(backOrder)
        setKgPerRoll(kg || pim?.product?.otherInformation?.kilogram || 20)
    }, [selectedValue, selectedSku]);

    const totalQuantity = selectedValue
        ? (() => {
            let orderType = '';
            if (combo?.includes(selectedSku)) {
                orderType = "COMBO";
            }
            else if (minimumOrder >= cartOptions[selectedValue]?.Wholesale) {
                orderType = "WHOLESALE";
            } else if (cartOptions[selectedValue]?.SampleMin <= minimumOrder && minimumOrder <= cartOptions[selectedValue]?.SampleMax) {
                orderType = "SAMPLE";
            }
            if (orderType === "COMBO") {
                const skuCodes = pim.combo.comboVariants;
                const minStock = skuCodes.reduce((min, skuCode) => {
                    const stockAmount = stock[skuCode]?.wholeSaleQuantity || 0;
                    return Math.min(min, stockAmount);
                }, Infinity);
                return minStock;
            }
            else {
                const filteredOption = _.filter(colorOption, c => c.id === selectedValue)[0];
                const skuCode = filteredOption ? filteredOption.skucode : null;
                if (skuCode) {
                    if (orderType === "WHOLESALE") {
                        return stock[skuCode]?.wholeSaleQuantity || 0;
                    } else if (orderType !== "WHOLESALE") {
                        return stock[skuCode]?.quantity || 0;
                    }
                }
                return 0;
            }
        })() : 0;

    return (
        <CreateProduct.Provider value={pim} >
            <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", paddingTop: 50 }}>
                <ScrollView style={{ flex: 1, flexGrow: 1 }}>
                    <ProductInformation
                        pimData={pim}
                        loading={loading}
                        media={media}
                        cartOptions={cartOptions}
                        selectedValue={selectedValue}
                    />
                    <ProductOrder
                        pimData={pim}
                        colorOption={colorOption}
                        cartOptions={cartOptions}
                        selectedValue={selectedValue}
                        setSelectedValue={setSelectedValue}
                        minimumOrder={minimumOrder}
                        setMinimumOrder={setMinimumOrder}
                        setError={setError}
                        backOrder={backOrder}
                        totalQuantity={totalQuantity}
                        kgPerRoll={kgPerRoll}
                        combo={combo}
                        selectedSku={selectedSku}
                        sampleCheck={sampleCheck}
                        alreadyInCart={alreadyInCart}
                        setSelectedSku={setSelectedSku}
                        setSampleCheck={setSampleCheck}
                    />
                    <ProductSpecification
                        pimData={pim}
                        categories={categories}
                        fabricCodes={fabricCodes}
                        priceSlab={priceSlab}
                    />
                    <ProductStandardColor
                        pimData={pim}
                        colorOption={colorOption}
                    />
                </ScrollView>
            </SafeAreaView>
        </CreateProduct.Provider>
    )
}

export default ProductDetails
