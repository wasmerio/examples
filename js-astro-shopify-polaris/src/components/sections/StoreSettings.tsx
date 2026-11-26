import {
  Page,
  Layout,
  LegacyCard,
  FormLayout,
  TextField,
} from "@shopify/polaris";
import React from "react";

import PolarisFrame from "../PolarisFrame.tsx";

export default function StoreSettings(props : {base: string}) {
  return (
    <PolarisFrame base={props.base}>
      <Page title="Store Settings" >
        <Layout>
          <Layout.AnnotatedSection
            id="storeDetails"
            title="Store details"
            description="Shopify and your customers will use this information to contact you."
          >
            <LegacyCard sectioned>
              <FormLayout>
                <TextField
                  label="Store name"
                  onChange={() => {}}
                  autoComplete="off"
                />
                <TextField
                  type="email"
                  label="Account email"
                  onChange={() => {}}
                  autoComplete="email"
                />
              </FormLayout>
            </LegacyCard>
          </Layout.AnnotatedSection>
        </Layout>
      </Page>
    </PolarisFrame>
  );
}
