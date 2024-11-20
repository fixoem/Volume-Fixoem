import React from "react";
import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo
} from "react";
import {
  Form,
  useActionData,
  useNavigation,
  useSubmit
} from "@remix-run/react"
import { json } from "@remix-run/node";
import { getPromo } from '../server/Promo.server';
import {
  Page,
  Button,
  Card,
  FormLayout,
  TextField,
  Layout,
  Text,
  Box,
  BlockStack,
  InlineGrid,
  Popover,
  DatePicker,
  Icon,
  Divider,
  Thumbnail,
  Banner
} from '@shopify/polaris';
import { authenticate } from "app/shopify.server";
import {
  SaveBar,
  useAppBridge
} from '@shopify/app-bridge-react';
import {
  CalendarIcon,
  CollectionIcon,
  ProductIcon,
  DeleteIcon,
  PlusIcon
} from '@shopify/polaris-icons';
import {
  DiscountMethod,
  RequirementType,
} from "@shopify/discount-app-components";
import { CurrencyCode } from "@shopify/react-i18n";
import { useField, useForm } from "@shopify/react-form";
import { MinimumRequirements } from "@shopify/discount-app-components/build/ts/latest/src/components/SummaryCard/components";


function PromoForm(){
  const shopify = useAppBridge();
  const submitForm = useSubmit();
  const actionData = useActionData();
  const navigation = useNavigation();
  const todaysDate = useMemo( () => new Date(), []);

  const isLoading = navigation.state === "submitting";
  const currencyCode = CurrencyCode.Cad;
  const submitErrors = actionData?.errors || [];
  const returnToDiscount = () => open("/app/campaigns")

  useEffect( () => {
    if (submitErrors.length > 0) {
      console.log("Errores al enviar el formulario:", submitErrors);
    }

    if (actionData?.errors.length == 0 && actionData?.discount){
      returnToDiscount();
    }
  }, [actionData]);




  const [isOn, setIsOn] = useState(false);
  const handleToggle = useCallback(() => setIsOn((isOn) => !isOn), []);

  const [haveRangeDate, setHaveRangeDate] = useState(false);
  const handleToggleRangeDate = useCallback(() => setHaveRangeDate((haveRangeDate) => !haveRangeDate), []);

  const [nameText, setNameText] = useState('');
  const handleNameTextChange = useCallback((value) => setNameText(value), []);

  const [descriptionText, setDescriptionText] = useState('');
  const handleDescriptionTextChange = useCallback((value) => setDescriptionText(value), []);

  const [ selectedOption, setSelectedOption ] = useState('product');
  const handleSelectChange = useCallback((value) => setSelectedOption(value), []);


  const switchStyle = {
    width: '50px',
    height: '25px',
    backgroundColor: isOn ? '#4CAF50' : '#333',
    borderRadius: '25px',
    position: 'relative' as 'relative',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const knobStyle = {
    width: '23px',
    height: '23px',
    backgroundColor: 'white',
    borderRadius: '50%',
    position: 'absolute' as 'absolute',
    top: '1px',
    left: isOn ? '26px' : '1px',
    transition: 'left 0.3s ease',
  };

  const switchStyleDate = {
    width: '50px',
    height: '25px',
    backgroundColor: haveRangeDate ? '#4CAF50' : '#333',
    borderRadius: '25px',
    position: 'relative' as 'relative',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const knobStyleDate = {
    width: '23px',
    height: '23px',
    backgroundColor: 'white',
    borderRadius: '50%',
    position: 'absolute' as 'absolute',
    top: '1px',
    left: haveRangeDate ? '26px' : '1px',
    transition: 'left 0.3s ease',
  };

  // Second date
  function nodeContainsDescendantFirst(rootNode, descendant) {
    if (rootNode === descendant) {
      return true;
    }
    let parent = descendant.parentNode;
    while (parent != null) {
      if (parent === rootNode) {
        return true;
      }
      parent = parent.parentNode;
    }
    return false;
  }
  const [visibleFirst, setVisibleFirst] = useState(false);
  const [selectedDateFirst, setSelectedDateFirst] = useState(new Date());
  const [{ monthFirst, yearFirst }, setDateFirst] = useState({
    monthFirst: selectedDateFirst.getMonth(),
    yearFirst: selectedDateFirst.getFullYear(),
  });
  const formattedValueFirst = selectedDateFirst.toISOString().slice(0, 10);
  const datePickerRefFirst = useRef(null);
  function isNodeWithinPopoverFirst(node) {
    return datePickerRefFirst?.current
      ? nodeContainsDescendantFirst(datePickerRefFirst.current, node)
      : false;
  }
  function handleInputValueChangeFirst() {
    console.log("handleInputValueChange");
  }
  function handleOnCloseFirst({ relatedTarget }) {
    setVisibleFirst(false);
  }
  function handleMonthChangeFirst(month, year) {
    setDateFirst({ month, year });
  }
  function handleDateSelectionFirst({ end: newSelectedDate }) {
    console.log(newSelectedDate.toISOString());
    setSelectedDateFirst(newSelectedDate);
    setVisibleFirst(false);
  }
  useEffect(() => {
    if (selectedDateFirst) {
      setDateFirst({
        monthFirst: selectedDateFirst.getMonth(),
        yearFirst: selectedDateFirst.getFullYear(),
      });
    }
  }, [selectedDateFirst]);

  // Second date
  function nodeContainsDescendantSecond(rootNode, descendant) {
    if (rootNode === descendant) {
      return true;
    }
    let parent = descendant.parentNode;
    while (parent != null) {
      if (parent === rootNode) {
        return true;
      }
      parent = parent.parentNode;
    }
    return false;
  }
  const [visibleSecond, setVisibleSecond] = useState(false);
  const [selectedDateSecond, setSelectedDateSecond] = useState(new Date());
  const [{ monthSecond, yearSecond }, setDateSecond] = useState({
    monthSecond: selectedDateSecond.getMonth(),
    yearSecond: selectedDateSecond.getFullYear(),
  });
  const formattedValueSecond = selectedDateSecond.toISOString().slice(0, 10);
  const datePickerRefSecond = useRef(null);
  function isNodeWithinPopoverSecond(node) {
    return datePickerRefSecond?.current
      ? nodeContainsDescendantSecond(datePickerRefSecond.current, node)
      : false;
  }
  function handleInputValueChangeSecond() {
    console.log("handleInputValueChange");
  }
  function handleOnCloseSecond({ relatedTarget }) {
    setVisibleSecond(false);
  }
  function handleMonthChangeSecond(month, year) {
    setDateSecond({ month, year });
  }
  function handleDateSelectionSecond({ end: newSelectedDate }) {
    console.log(newSelectedDate.toISOString())
    setSelectedDateSecond(newSelectedDate);
    setVisibleSecond(false);
  }
  useEffect(() => {
    if (selectedDateSecond) {
      setDateSecond({
        monthSecond: selectedDateSecond.getMonth(),
        yearSecond: selectedDateSecond.getFullYear(),
      });
    }
  }, [selectedDateSecond]);

  function productsMarkup(array: any) {
    return array.map((product: any, index: number) => (
      <div key={index} style={{ width: '100%', display: 'flex', justifyContent: 'start', gap: '20px', alignItems: 'center', marginTop: '10px' }}>
        <Thumbnail size="small" source={product.images[0].originalSrc} alt={product.images[0].altText} />
        <Text as="p" variant="bodySm">{product.title}</Text>
        <div style={{ marginLeft: 'auto', marginRight: '20px' }}>
          <Button icon={DeleteIcon} variant="primary" tone="critical" onClick={ () => { deleteProduct(index) } }></Button>
        </div>
      </div>
    ));
  }

  const [productList, setProductList] = useState<any[]>([]);
  const [rowProductsMarkup, setRowProductsMarkup] = useState<any[]>([]);

  const handleRowProductsMarkup = useCallback((product) => {
    setRowProductsMarkup((prevProducts) => {

      const productsExist = prevProducts.some((prevProduct) => prevProduct.id === product.id);

      if (!productsExist) {
        setProductList((prevProductList) => [...prevProductList, product.id]);
        return [...prevProducts, product];
      }

      return prevProducts;
    });
  }, []);

  async function addProduct() {
    const selected = selectedOption;
    const product = await window.shopify.resourcePicker({
      type: selected == 'collection' ? "collection" : "product",
      action: "select"
    });

    handleRowProductsMarkup(product[0]);
  }

  function deleteProduct(index: number) {
    setRowProductsMarkup((prevProducts) => {
      const productToRemove = prevProducts[index];

      setProductList((prevProductList) =>
        prevProductList.filter((id) => id != productToRemove.id)
      );

      return prevProducts.filter((product, i) => i !== index);
    });
  }

  function levelMarkup(array: any) {
    return array.map((level, index) => {
      return (
        <tr style={{ backgroundColor: '#fff' }} key={index}>
          <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{level.level}</td>
          <td style={{ padding: '10px', border: '1px solid #ccc', backgroundColor: '#f4f4f4', textAlign: 'center' }}>{level.quantity}</td>
          <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{level.percent}</td>
          <td style={{ padding: '10px', border: '1px solid #ccc', backgroundColor: '#f4f4f4', textAlign: 'center' }}>
            <Button icon={DeleteIcon} variant="primary" tone="critical" onClick={ () => { deleteLevel(index); } }></Button>
          </td>
        </tr>
      );
    });
  }

  const [quantities, setQuantities] = useState<any[]>([]);
  const handleSetQuantities = useCallback((quantity) => {
    setQuantities((prevQuantities) => {
      return [...prevQuantities, quantity];
    });
  }, []);
  const [percentages, setPercentages] = useState<any[]>([]);
  const handleSetPercentages = useCallback((percentage) => {
    setPercentages((prevPercentages) => {
      return [...prevPercentages, percentage];
    });
  }, []);

  const [ level, setLevel ] = useState<any[]>([]);

  const handleRowLevelMarkup = useCallback((level) => {
    setLevel((prevLevels) => {
      return [...prevLevels, level];
    });
  }, []);

  const [levelName, setLevelName] = useState('');
  const handleLevelNameChange = useCallback((value) => setLevelName(value), []);

  const [levelQuantity, setLevelQuantity] = useState('');
  const handleLevelQuantityChange = useCallback((value) => setLevelQuantity(value), []);

  const [levelPercent, setLevelPercent] = useState('');
  const handleLevelPercentChange = useCallback((value) => setLevelPercent(value), []);

  function addLevel() {

    if (levelName == '' || levelQuantity == '' || levelPercent == '') {
      return;
    }

    handleRowLevelMarkup({
      level: levelName,
      quantity: parseInt(levelQuantity),
      percent: parseFloat(levelPercent)
    });

    handleSetQuantities(parseInt(levelQuantity));
    handleSetPercentages(parseFloat(levelPercent).toFixed(1).toString());

    setLevelName('');
    setLevelQuantity('');
    setLevelPercent('');
  }

  function deleteLevel(index: number) {
    setLevel((prevLevels) => {
      return prevLevels.filter((level, i) => i !== index);
    });
  }

  const onSubmit = () => {

    const automaticBasicDiscount = {
      "title": nameText,
      "summary": descriptionText,
      "combinesWith": {
        "orderDiscounts": false,
        "productDiscounts": false,
        "shippingDiscounts": false
      },
      "customerGets": {
        "levels": level
      },
      "items": {
        "all": false,
        "products": {
          "productsToAdd": productList
        }
      },
      "startsAt": selectedDateFirst.toISOString(),
      "endsAt": haveRangeDate == true ? selectedDateSecond.toISOString() : null,
      "metafieldObjectValues": {
        "DiscountValues": quantities,
        "DiscountPercentages": percentages
      }
    };

    console.log(automaticBasicDiscount);

    submitForm({ discount: JSON.stringify(automaticBasicDiscount) }, { method: "post" });

    return { status: "success" }
  }

  const handleSave = () => {
    onSubmit();
    shopify.saveBar.hide('my-save-bar');
  };

  const handleDiscard = () => {
    shopify.saveBar.hide('my-save-bar');
  };

  const showSaveBar = () => {
    shopify.saveBar.show('my-save-bar');
  };

  // const errorBanner =
  //   submitErrors.length > 0 ? (

  //       <Banner title="Error" tone="critical">
  //         <p>There were some issues with your form submission:</p>
  //         <ul>
  //           {submitErrors.map(({ message, field }, index) => {
  //             return (
  //               <li key={`${message}${index}`}>
  //                 {field} {message}
  //               </li>
  //             );
  //           })}
  //         </ul>
  //       </Banner>

  //   ) : null;

  const errorBanner = () => {
    console.log(submitErrors);
  }

  return(
    <Page
      backAction={{ content: 'Campaings', url: '/app/campaigns/'  }}
      title={'Campaing'}
      primaryAction={{
        content: "Save",
        disabled: false,
        onAction: showSaveBar
      }}
    >

      <SaveBar id="my-save-bar">
        <button variant="primary" onClick={handleSave}></button>
        <button onClick={handleDiscard}></button>
      </SaveBar>

      <Form method="post">
        <Layout>
        {errorBanner}
          <Layout.Section >
              <Box paddingBlock={'200'}>
                <Card padding={'400'}>
                  <div style={{ paddingBottom: '10px' }}>
                    <Text as="h2" variant="headingSm">Name</Text>
                  </div>
                  <TextField
                    type="text"
                    label=""
                    value={nameText}
                    onChange={handleNameTextChange}
                    autoComplete="off"
                  />
                </Card>
              </Box>

              <Box paddingBlock={'200'}>
                <Card padding={'400'}>
                  <div style={{ paddingBottom: '10px' }}>
                    <Text as="h2" variant="headingSm">Description</Text>
                  </div>
                  <TextField
                    type="text"
                    label=""
                    value={descriptionText}
                    onChange={handleDescriptionTextChange}
                    autoComplete="off"
                  />
                </Card>
              </Box>

              <Box paddingBlock={'200'}>
                <Card padding={'400'}>
                  <Text as="h2" variant="headingSm">Select offer</Text>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto', width:'100%', gap:'10px', marginTop:'10px' }}>

                    <div onClick={ () => { handleSelectChange('collection') } } style={{ border: selectedOption == 'collection' ? '2px solid #242424' : '2px solid #f4f4f4', borderRadius: '10px', display: 'flex', flexDirection: 'column', padding: '5px' }}>
                      <div style={{ display: 'grid', width: '100%', justifyContent: 'start', padding: '5px 0', gridAutoFlow: 'column' }}>
                        <Icon source={CollectionIcon}/>
                        <Text as="p" variant="headingSm"> Collection </Text>
                      </div>

                      <Text as="p" variant="bodySm"> Offer a discount when the clients reaches an certain amount of products from the same collection </Text>
                    </div>


                    <div onClick={ () => { handleSelectChange('product') } } style={{ border: selectedOption == 'product' ? '2px solid #242424' : '2px solid #f4f4f4', borderRadius: '10px', display: 'flex', flexDirection: 'column', padding: '5px' }}>
                      <div style={{ display: 'grid', width: '100%', justifyContent: 'start', padding: '5px 0', gridAutoFlow: 'column' }}>
                        <Icon source={ProductIcon}/>
                        <Text as="p" variant="headingSm"> Product </Text>
                      </div>

                      <Text as="p" variant="bodySm"> Offer a discount when the clients reaches a certain amount of the same product </Text>
                    </div>

                  </div>

                </Card>
              </Box>

              <Box paddingBlock={'200'}>
                <Card padding={'0'}>
                  <Box padding={'200'} paddingInline={'400'}>
                    <Text as="h2" variant="headingSm">{ selectedOption == 'product' ? 'Products' : 'Collection' }</Text>
                  </Box>
                  <Divider borderWidth='0165' />
                  <Box padding={'200'} paddingInline={'400'}>
                    {productsMarkup(rowProductsMarkup)}
                  </Box>
                  <Divider borderWidth='0165' />
                  <Box padding={'200'} paddingInline={'400'}>
                    <Button onClick={ addProduct }> Add { selectedOption == 'product' ? 'Products' : 'Collection' } </Button>
                  </Box>
                </Card>
              </Box>

              <Box paddingBlock={'200'}>
                <Card padding={'400'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text as="h2" variant="headingSm">Discount levels</Text>

                  </div>

                  <div style={{ width: '100%', paddingTop: '20px', borderRadius: '8px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <tr style={{ backgroundColor: '#f4f4f4', color: '#000', textAlign: 'left', padding: '12px' }}>
                        <th style={{ padding: '12px', border: '1px solid #ccc', textAlign: 'center' }}>Level</th>
                        <th style={{ padding: '12px', border: '1px solid #ccc', textAlign: 'center' }}>Quantity</th>
                        <th style={{ padding: '12px', border: '1px solid #ccc', textAlign: 'center' }}>Percentage</th>
                        <th style={{ padding: '12px', border: '1px solid #ccc', textAlign: 'center' }}>Action</th>
                      </tr>
                      {levelMarkup(level)}
                      <tr style={{ backgroundColor: '#fff' }}>
                        <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                          <TextField
                            label=""
                            type="text"
                            value={ levelName }
                            onChange={ handleLevelNameChange }
                            autoComplete="off"
                          />

                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ccc', backgroundColor: '#f4f4f4', textAlign: 'center' }}>

                          <TextField
                            label=""
                            type="number"
                            value={ levelQuantity }
                            onChange={ handleLevelQuantityChange }
                            autoComplete="off"
                          />

                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                          <TextField
                            label=""
                            type="number"
                            value={ levelPercent }
                            onChange={ handleLevelPercentChange }
                            autoComplete="off"
                          />

                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ccc', backgroundColor: '#f4f4f4', textAlign: 'center' }}>
                          <Button variant="primary" icon={PlusIcon} onClick={ addLevel }></Button>
                        </td>
                      </tr>
                    </table>
                  </div>
                </Card>
              </Box>

              <Box paddingBlock={'200'}>
                <InlineGrid columns={haveRangeDate ? 2 : 1} gap={'400'}>
                  <Card padding={'400'}>
                    <Text as="h2" variant="headingSm">Start date</Text>

                    <Box minWidth={'276px'} paddingBlock={'200'}>
                      <Popover
                        active={visibleFirst}
                        autofocusTarget="none"
                        preferredAlignment="left"
                        fullWidth
                        preferInputActivator={false}
                        preferredPosition="below"
                        preventCloseOnChildOverlayClick
                        onClose={handleOnCloseFirst}
                        activator={
                          <TextField
                            role="combobox"
                            label={""}
                            prefix={<Icon source={CalendarIcon} />}
                            value={formattedValueFirst}
                            onFocus={() => setVisibleFirst(true)}
                            onChange={handleInputValueChangeFirst}
                            autoComplete="off"
                          />
                        }
                      >
                        <Card ref={datePickerRefFirst}>
                          <DatePicker
                            month={monthFirst}
                            year={yearFirst}
                            selected={selectedDateFirst}
                            onMonthChange={handleMonthChangeFirst}
                            onChange={handleDateSelectionFirst}
                          />
                        </Card>
                      </Popover>
                    </Box>
                  </Card>
                  { haveRangeDate && (
                  <Card padding={'400'}>
                    <Text as="h2" variant="headingSm">End date</Text>

                    <Box minWidth={'276px'} paddingBlock={'200'}>
                      <Popover
                        active={visibleSecond}
                        autofocusTarget="none"
                        preferredAlignment="left"
                        fullWidth
                        preferInputActivator={false}
                        preferredPosition="below"
                        preventCloseOnChildOverlayClick
                        onClose={handleOnCloseSecond}
                        activator={
                          <TextField
                            role="combobox"
                            label={""}
                            prefix={<Icon source={CalendarIcon} />}
                            value={formattedValueSecond}
                            onFocus={() => setVisibleSecond(true)}
                            onChange={handleInputValueChangeSecond}
                            autoComplete="off"
                          />
                        }
                      >
                        <Card ref={datePickerRefSecond}>
                          <DatePicker
                            month={monthSecond}
                            year={yearSecond}
                            selected={selectedDateSecond}
                            onMonthChange={handleMonthChangeSecond}
                            onChange={handleDateSelectionSecond}
                          />
                        </Card>
                      </Popover>
                    </Box>
                  </Card>)}
                </InlineGrid>
              </Box>


          </Layout.Section>

          <Layout.Section variant='oneThird'>
            <Box paddingBlock={'200'}>
              <Card padding={'400'}>

                <div style={{ display: 'flex', gap: '5px', flexFlow: 'column', width: '100%'  }}>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '5px' }}>
                    <Text as="h2" variant="headingSm">Active</Text>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', gap:'15px' }}>
                      <div style={switchStyle} onClick={handleToggle}>
                        <div style={knobStyle}></div>
                      </div>
                      <p style={{ width: '70%' }} >Turn on if the campaing should be active?</p>
                    </div>
                  </div>

                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '5px' }}>
                    <Text as="h2" variant="headingSm">Date range</Text>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', gap:'15px' }}>
                      <div style={switchStyleDate} onClick={handleToggleRangeDate}>
                        <div style={knobStyleDate}></div>
                      </div>
                      <p style={{ width: '70%' }}>Turn on to define the end date for your campaign</p>
                    </div>
                  </div>
                </div>

              </Card>
            </Box>
          </Layout.Section>
        </Layout>
      </Form>
    </Page>
  );
}

export default PromoForm;


export const action = async({ params, request }) => {
  const { functionId } = params;
  const { admin }  = await authenticate.admin(request);
  const formData = await request.formData();
  const discountData = formData.get("discount");

  if(discountData == null || discountData == undefined)
    return json({"error": "The discount data doesn't exist"});

  const {
    title,
    summary,
    combinesWith,
    customerGets,
    items,
    startsAt,
    endsAt,
    metafieldObjectValues
  } = JSON.parse(discountData);

  const productList = items.products.productsToAdd;


  const results = await Promise.all(
    customerGets.levels.map(async (level, index) => {

      const baseDiscount = {
        title: `${title} ${index + 1}`,
        combinesWith,
        startsAt: startsAt,
        endsAt: endsAt,
      };

      const customCustomerGets = {
        customerGets: {
          value: {
            percentage: parseFloat(level.percent)/100
          },
          items
        },
      };

      const minimumRequirement = {
        minimumRequirement :{
          quantity:{
            greaterThanOrEqualToQuantity: level.quantity.toString()
          }
        }
      }

      console.log(JSON.stringify({"variables" : {
        "automaticBasicDiscount": {
          ...baseDiscount,
          ...customCustomerGets,
          ...minimumRequirement
        },
      }}, null, 2));

      console.log(JSON.stringify(customCustomerGets, null, 2));

      try {
        const response = await admin.graphql(
          `#graphql
            mutation discountAutomaticBasicCreate($automaticBasicDiscount: DiscountAutomaticBasicInput!) {
              discountAutomaticBasicCreate(automaticBasicDiscount: $automaticBasicDiscount) {
                automaticDiscountNode {
                  id
                  automaticDiscount {
                    ... on DiscountAutomaticBasic {
                      startsAt
                      endsAt
                      minimumRequirement {
                        ... on DiscountMinimumSubtotal {
                          greaterThanOrEqualToSubtotal {
                            amount
                            currencyCode
                          }
                        }
                      }
                      customerGets {
                        value {
                          ... on DiscountAmount {
                            amount {
                              amount
                              currencyCode
                            }
                            appliesOnEachItem
                          }
                        }
                        items {
                          ... on AllDiscountItems {
                            allItems
                          }
                        }
                      }
                    }
                  }
                }
                userErrors {
                  code
                  message
                  field
                }
              }
            }`,
          {
            variables: {
              automaticBasicDiscount: {
                ...baseDiscount,
                ...customCustomerGets,
                ...minimumRequirement
              },
            },
          }
        );

        const responseJson = await response.json();
        const errors = responseJson.data?.discountAutomaticBasicCreate?.userErrors;

        if (errors && errors.length > 0) {
          console.log(JSON.stringify(errors, null, 2));
          return { success: false, errors };
        }


        return { success: true, discountId: responseJson.data?.discountAutomaticBasicCreate?.automaticDiscountNode?.id };
      } catch (error) {
        return { success: false, errors: [{ message: error.message }] };
      }
    })
  );


  const metafieldMarkup = [
    {
      "key": "DiscountValues",
      "namespace": "$app:DiscountValues",
      "ownerId": "",
      "type": "list.number_integer",
      "value": JSON.stringify(metafieldObjectValues.DiscountValues)
    },
    {
      "key": "DiscountPercentage",
      "namespace": "$app:DiscountPercentage",
      "ownerId": "",
      "type": "list.number_decimal",
      "value": JSON.stringify(metafieldObjectValues.DiscountPercentages)
    }
  ]

  const resultsMetafields = await Promise.all(
    productList.map( async (product) => {

      const metafieldValues = metafieldMarkup[0];
      const metafieldPercentages = metafieldMarkup[1];

      metafieldValues.ownerId = product;
      metafieldPercentages.ownerId = product;

      console.log(JSON.stringify(metafieldValues, null, 2));
      console.log(JSON.stringify(metafieldPercentages, null, 2));

      try {

        const response = await admin.graphql(
          `#graphql
            mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
              metafieldsSet(metafields: $metafields) {
                metafields {
                  key
                  namespace
                  value
                  createdAt
                  updatedAt
                }
                userErrors {
                  field
                  message
                  code
                }
              }
            }`,
          {
            variables: {
              metafields: [ metafieldValues, metafieldPercentages ],
            },
          }
        );

        const responseJson = await response.json();
        const errors = responseJson.data?.metafieldCreate?.userErrors;

        if (errors && errors.length > 0) {
          console.log(JSON.stringify(errors, null, 2));
          return { success: false, errors };
        }

      } catch (error) {
        return { success: false, errors: [{ message: error.message }] };
      }

    })
  );

  console.log(JSON.stringify(resultsMetafields, null, 2));


  // Separar resultados exitosos y errores
  const successes = results.filter(result => result.success);
  const errors = results.filter(result => !result.sucess);

  console.log(JSON.stringify(successes,null, 2));
  console.log(JSON.stringify(errors, null, 2));

  return json({ successes, errors });

};
