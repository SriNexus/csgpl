/**
 * ProductsContainer — orchestrates the /products page.
 * Currently sources from the static catalog (CMS-ready: swap to a hook later).
 */

import Seo from "@/components/Seo";
import ProductsHero from "@/sections/products/ProductsHero";
import ProductsCatalog from "@/sections/products/ProductsCatalog";
import ProductsValueProps from "@/sections/products/ProductsValueProps";
import ProductsCta from "@/sections/products/ProductsCta";

export default function ProductsContainer() {
  return (
    <>
      <Seo docKey="seoProducts" />
      <main>
        <ProductsHero />
        <ProductsCatalog />
        <ProductsValueProps />
        <ProductsCta />
      </main>
    </>
  );
}
