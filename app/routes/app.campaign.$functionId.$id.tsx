import react from 'react';
import { json } from '@remix-run/node'
import { authenticate } from "app/shopify.server";
import {
  Page
} from '@shopify/polaris'

export const loader = async({ params, request }) => {
  const { admin }  = await authenticate.admin(request);
  const { functionId, id } = params;

  return json({
    data: "Hello!"
  })
}

function Details() {

  return(
    <Page
    backAction={{ content: 'Campaigns', url: '/app/campaigns' }}
    title='Campaign'
    primaryAction={{
      content: "Update",
      disabled: false,
      onAction: () => {}
    }}
    >

    </Page>
  );

}


export default Details;
