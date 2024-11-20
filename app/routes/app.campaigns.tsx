import {
  Page,
  Card,
  IndexTable,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  Button,
  EmptyState,
  Badge
} from '@shopify/polaris';
import React, { useState, useCallback } from 'react';
import {  authenticate } from 'app/shopify.server';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { json } from '@remix-run/node';
import { getAllPromos } from '../server/Promos.server';

export async function loader({request}: {request: Request}) {

  const { admin, session } = await authenticate.admin(request);
  //const promos = await getAllPromos();

  const response = await admin.graphql(
    `#graphql
      query getDiscounts {
        automaticDiscountNodes(first: 10) {
          edges {
            node {
              id
              automaticDiscount {
                ... on DiscountAutomaticBasic {
                  title
                  summary
                  startsAt
                  endsAt
                  status
                  customerGets {
                    items {
                      ... on AllDiscountItems {
                        allItems
                      }
                    }
                  }
                  minimumRequirement {
                    ... on DiscountMinimumQuantity {
                      greaterThanOrEqualToQuantity
                    }
                  }
                }
              }
            }
          }
        }
      }
    `
  );

  const responseJson = await response.json();
  const promos = responseJson.data?.automaticDiscountNodes?.edges;
  //console.log(responseJson.data?.discountNodes?.edges);

  return json({
    promos,
    ENV: {
      SHOPIFY_FUNCTION: process.env.SHOPIFY_PRODUCT_DISCOUNT_ID
    }
  });

}

function Promos() {

  const { promos, ENV } = useLoaderData();
  const navigate = useNavigate();

  //console.log(promos);

  const resourceName = {
    singular: 'Promo',
    plural: 'Promos',
  };



  const {selectedResources, allResourcesSelected, handleSelectionChange} = useIndexResourceState(promos);

  const promosRowsMarkup = formatRowMarkup(promos);
  const [rowMarkup, setRowMarkup] = useState(promosRowsMarkup);

  const handleRowMarkupChange = useCallback((array) => setRowMarkup(formatRowMarkup(array)), []);

  function filterRowMarkup(item: string) {
    if (item === "Todos") {
      handleRowMarkupChange(promos);
    } else {
      const filteredPromos = promos.filter(( campaign ) => {
        if (item === "Active") return campaign.node.discount.status === "ACTIVE";
        if (item === "Inactive") return campaign.node.discount.status === "INACTIVE";
        return true;
      });

      handleRowMarkupChange(filteredPromos);
    }
  }

  function search(query: string) {
    const filteredPromos = promos.filter(
      ({
        id,
        title,
        description,
        promoType,
        startDate,
        endDate,
        isActive,
      }) => {
        const searchString = query.toLowerCase();
        const idString = id.toString().toLowerCase();
        const titleString = title.toLowerCase();
        const descriptionString = description.toLowerCase();
        const promoTypeString = promoType.toLowerCase();
        const startDateString = startDate.toLowerCase();
        const endDateString = endDate.toLowerCase();
        const isActiveString = isActive.toString().toLowerCase();

        return (
          idString.includes(searchString) ||
          titleString.includes(searchString) ||
          descriptionString.includes(searchString) ||
          promoTypeString.includes(searchString) ||
          startDateString.includes(searchString) ||
          endDateString.includes(searchString) ||
          isActiveString.includes(searchString)
        );
      }
    );

    handleRowMarkupChange(filteredPromos);
  }

  const [itemStrings] = useState(["Todos", "Active", "Inactive"]);

  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {
      filterRowMarkup(item);
    },
    id: `${item}-${index}`,
    isLocked: index === 0,
  }));

  const [selected, setSelected] = useState(0);

  const { mode, setMode } = useSetIndexFiltersMode();

  const [queryValue, setQueryValue] = useState('');

  const handleFiltersQueryChange = useCallback((value: string) => {
    setQueryValue(value);
    search(value);
  }, []);

  const onHandleCancel = () => {};

  return (
    <Page
      title="Campaigns"
      primaryAction={<Button variant="primary" onClick={() => { navigate(`/app/campaign/${ENV.SHOPIFY_FUNCTION}/new`) }}>Create Campaign</Button>}>
      <Card>

          {promos.length > 0 ?
            (
              <>
                <IndexFilters
                  queryValue={queryValue}
                  queryPlaceholder="Buscando..."
                  onQueryChange={handleFiltersQueryChange}
                  onQueryClear={() => setQueryValue('')}
                  cancelAction={{
                    onAction: onHandleCancel,
                    disabled: false,
                    loading: false,
                  }}
                  tabs={tabs}
                  selected={selected}
                  onSelect={setSelected}
                  filters={[]}
                  appliedFilters={[]}
                  onClearAll={() => {}}
                  mode={mode}
                  setMode={setMode}
                  hideFilters
                  filteringAccessibilityTooltip="Search (F)"
                />
                <IndexTable
                  resourceName={resourceName}
                  itemCount={promos.length}
                  selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
                  onSelectionChange={handleSelectionChange}
                  headings={[
                    { title: 'Title' },
                    { title: 'Status' },
                    { title: 'Start Date' },
                    { title: 'End Date' }
                  ]}
                >
                  {rowMarkup}
                </IndexTable>
              </>
            )

            :

            (<EmptyState
              heading="Manage your campaigns"
              action={{content: 'Add campaign', onAction: () => { navigate(`/app/campaign/${ENV.SHOPIFY_FUNCTION}/new`) }}}
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <p> Launch new campaigns to boost your sales through volume-based offers. </p>
            </EmptyState>)
          }

      </Card>
    </Page>
  );

  function formatRowMarkup(data) {

    let names = data.map( ({ node }, index) => {
      return({
        titleArray: node.automaticDiscount.title.split(' '),
        index: index
      });
    })

    names = names.reduce((acc, current) => {
      const key = current.titleArray[0];

      if (!acc[key]) {
        acc[key] = current;
      }

      return acc;
    }, {});

    names = Object.values(names).map((item) => ({
      titleArray: item.titleArray,
      index: item.index
    }));


    return names.map( (name, index) => {
        const copyId = data[name.index].node.id.split('/');
        const id = copyId[copyId.length - 1];

        // onClick={() => { navigate(`/app/campaign/${ENV.SHOPIFY_FUNCTION}/${id}`) }}

        return(
          <IndexTable.Row
            id={id.toString()}
            key={id}
            selected={selectedResources.includes(id.toString())}
            position={index}
            onClick={() => { navigate(`/app/campaign/${data[name.index].node.automaticDiscount.title.split(' ')[0]}`) }}
          >
            <IndexTable.Cell>{data[name.index].node.automaticDiscount.title.split(' ')[0]}</IndexTable.Cell>
            <IndexTable.Cell>{
              data[name.index].node.automaticDiscount.status === "ACTIVE" ?
            <Badge tone="success">Active</Badge>
            :
            <Badge tone="critical">Inactive</Badge>
            }</IndexTable.Cell>
            <IndexTable.Cell>{formatDate(data[name.index].node.automaticDiscount.startsAt)}</IndexTable.Cell>
            <IndexTable.Cell>{formatDate(data[name.index].node.automaticDiscount.endsAt)}</IndexTable.Cell>
          </IndexTable.Row>
        )

    });


  }

  function formatDate(dateString) {

    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} de ${month} de ${year}`;

  }
}

export default Promos;
