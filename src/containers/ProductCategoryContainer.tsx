/**
 * ProductCategoryContainer — /products/:categorySlug
 */

import { useParams, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Seo from "@/components/Seo";
import CategoryPage from "@/sections/products/CategoryPage";
import { getCategoryBySlug, getProductsByCategory } from "@/data/productsCatalog";

export default function ProductCategoryContainer() {
  const { categorySlug = "" } = useParams<{ categorySlug: string }>();
  const category = getCategoryBySlug(categorySlug);
  const products = category ? getProductsByCategory(category.slug) : [];

  /* Imperatively set <title> for this category page (uses seoProducts as base). */
  useEffect(() => {
    if (!category) return;
    const prev = document.title;
    document.title = `${category.name} — CSGPL Solar Products`;
    return () => { document.title = prev; };
  }, [category]);

  if (!category) return <Navigate to="/products" replace />;

  return (
    <>
      <Seo docKey="seoProducts" />
      <main>
        <CategoryPage category={category} products={products} />
      </main>
    </>
  );
}
