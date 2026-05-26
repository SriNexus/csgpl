/**
 * ProductDetailContainer — /products/:categorySlug/:slug
 */

import { useParams, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Seo from "@/components/Seo";
import ProductDetail from "@/sections/products/ProductDetail";
import {
  getCategoryBySlug, getProductBySlug, getProductsByCategory,
} from "@/data/productsCatalog";

export default function ProductDetailContainer() {
  const { categorySlug = "", slug = "" } = useParams<{ categorySlug: string; slug: string }>();
  const category = getCategoryBySlug(categorySlug);
  const product  = getProductBySlug(slug);

  /* Apply product-specific <title>/<meta> imperatively. */
  useEffect(() => {
    if (!product) return;
    const prevTitle = document.title;
    document.title = product.seo.title;

    const setMeta = (name: string, content: string) => {
      let el = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      const created = !el;
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", name); document.head.appendChild(el); }
      const prev = el.getAttribute("content");
      el.setAttribute("content", content);
      return () => {
        if (created) el?.remove();
        else if (prev !== null) el?.setAttribute("content", prev);
      };
    };

    const restoreDesc = setMeta("description", product.seo.description);
    return () => {
      document.title = prevTitle;
      restoreDesc();
    };
  }, [product]);

  if (!category || !product || product.categorySlug !== category.slug) {
    return <Navigate to="/products" replace />;
  }

  const related = getProductsByCategory(category.slug).filter((p) => p.id !== product.id);

  return (
    <>
      <Seo docKey="seoProducts" />
      <main>
        <ProductDetail product={product} category={category} related={related} />
      </main>
    </>
  );
}
