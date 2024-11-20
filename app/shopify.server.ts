import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
  DeliveryMethod
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-10";
import type { AdminApiContext } from "node_modules/@shopify/shopify-app-remix/dist/ts/server/clients";
import type { ShopifyRestResources } from "@shopify/shopify-api";
import prisma from "./db.server";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.October24,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  restResources,
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks",
    },
  },
  hooks: {
    afterAuth: async ({ admin, session }) => {
      await shopify.registerWebhooks({ session });

      try {

        const metafield = await getMetafields(admin);

        if (metafield == null) {

          await createMetafields(admin);

        }


      } catch (error: any) {
        if ("graphQLErrors" in error) {
          console.error(error.graphQLErrors);
        } else {
          console.error(error);
        }

        console.log("Error creating metafields", error);

        throw error;
      }
    },
  },
  future: {
    unstable_newEmbeddedAuthStrategy: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.October24;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;


async function getMetafields(admin: AdminApiContext<ShopifyRestResources>) {

  const response = await admin.graphql(getMetafieldQuery, {
    variables: {
      key: "DiscountValues",
      namespace: "$app:DiscountValues",
      ownerType: "PRODUCT",
    },
  });

  const responseTwo = await admin.graphql(getMetafieldQuery, {
    variables: {
      key: "DiscountPercentage",
      namespace: "$app:DiscountPercentage",
      ownerType: "PRODUCT",
    },
  });

  const responseThree = await admin.graphql(getMetafieldQuery, {
    variables: {
      key: "DiscountTitle",
      namespace: "$app:DiscountTitle",
      ownerType: "PRODUCT",
    },
  });

  const json = await response.json();


  return json.data?.metafieldDefinitions.nodes[0];

}

const getMetafieldQuery = `#graphql
query getMetafieldDefinition($key: String!, $namespace: String!, $ownerType: MetafieldOwnerType!) {
  metafieldDefinitions(first: 1, key: $key, namespace: $namespace, ownerType: $ownerType) {
    nodes {
      id
    }
  }
}
`;

async function createMetafields(admin: AdminApiContext<ShopifyRestResources>) {
  const response = await admin.graphql(createMetafieldMutation, {
    variables: {
      definition: {
        access: {
          admin: "PUBLIC_READ_WRITE",
          storefront: "PUBLIC_READ",
        },
        key: "DiscountValues",
        name: "The product discount quantities",
        namespace: "$app:DiscountValues",
        ownerType: "PRODUCT",
        type: "list.number_integer",
      },
    },
  });

  const json = await response.json();
  console.log(JSON.stringify(json, null, 2));

  const responseTwo = await admin.graphql(createMetafieldMutation, {
    variables: {
      definition: {
        access: {
          admin: "PUBLIC_READ_WRITE",
          storefront: "PUBLIC_READ",
        },
        key: "DiscountPercentage",
        name: "The product discount percentages",
        namespace: "$app:DiscountPercentage",
        ownerType: "PRODUCT",
        type: "list.number_decimal",
      },
    },
  });

  const jsonTwo = await responseTwo.json();
  console.log(JSON.stringify(jsonTwo, null, 2));

  const responseThree = await admin.graphql(createMetafieldMutation, {
    variables: {
      definition: {
        access: {
          admin: "PUBLIC_READ_WRITE",
          storefront: "PUBLIC_READ",
        },
        key: "DiscountTitle",
        name: "The product discount title names",
        namespace: "$app:DiscountTitle",
        ownerType: "PRODUCT",
        type: "list.single_line_text_field",
      },
    },
  });

  const jsonThree = await responseTwo.json();
  console.log(JSON.stringify(jsonThree, null, 2));

}

const createMetafieldMutation = `#graphql
mutation metafieldDefinitionCreate($definition: MetafieldDefinitionInput!) {
  metafieldDefinitionCreate(definition: $definition) {
    createdDefinition {
      key
      namespace
    }
    userErrors {
      field
      message
    }
  }
}
`;

const setAppIdentifierMutation = `#graphql
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
}`;

