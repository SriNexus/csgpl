import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LayoutContainer from "./containers/LayoutContainer";
import Home from "./pages/Home";
import PlaceholderPage from "./pages/PlaceholderPage";
import BlogListContainer from "./containers/BlogListContainer";
import BlogPostContainer from "./containers/BlogPostContainer";
import DynamicPageContainer from "./containers/DynamicPageContainer";
import ProductsContainer from "./containers/ProductsContainer";
import ProductCategoryContainer from "./containers/ProductCategoryContainer";
import ProductDetailContainer from "./containers/ProductDetailContainer";
import AboutContainer from "./containers/AboutContainer";
import SolutionContainer from "./containers/SolutionContainer";
import AppErrorBoundary from "./components/AppErrorBoundary";

/* ============================================================
   Admin is lazy-loaded so public users never download admin code.
   ============================================================ */
const AdminLogin       = lazy(() => import("./pages/AdminLogin"));
const RequireAuth      = lazy(() => import("./admin/RequireAuth"));
const AdminLayout      = lazy(() => import("./admin/layout/AdminLayout"));
const DashboardView    = lazy(() => import("./admin/views/DashboardView"));
const LeadsView        = lazy(() => import("./admin/views/LeadsView"));
const ProjectsView     = lazy(() => import("./admin/views/ProjectsView"));
const TestimonialsView = lazy(() => import("./admin/views/TestimonialsView"));
const ProductsView     = lazy(() => import("./admin/views/ProductsView"));
const BlogsListView    = lazy(() => import("./admin/views/blog/BlogsListView"));
const BlogEditorView   = lazy(() => import("./admin/views/blog/BlogEditorView"));
const CategoriesView   = lazy(() => import("./admin/views/blog/CategoriesView"));
const PagesListView    = lazy(() => import("./admin/views/pages/PagesListView"));
const PageEditorView   = lazy(() => import("./admin/views/pages/PageEditorView"));
const MediaLibraryView = lazy(() => import("./admin/views/MediaLibraryView"));
const BrandingView     = lazy(() => import("./admin/views/BrandingView"));
const SeoView          = lazy(() => import("./admin/views/SeoView"));
const AnalyticsView    = lazy(() => import("./admin/views/AnalyticsView"));
const SettingsView     = lazy(() => import("./admin/views/SettingsView"));
const PageBuilderView  = lazy(() => import("./admin/views/PageBuilderView"));
const StorageDebugView = lazy(() => import("./admin/views/StorageDebugView"));
const HealthDashboardView = lazy(() => import("./admin/views/HealthDashboardView"));

function PublicLayout({ children }: { children: React.ReactNode }) {
  return <LayoutContainer>{children}</LayoutContainer>;
}

function AdminLoader() {
  return (
    <div className="min-h-screen grid place-items-center bg-paper">
      <div className="h-8 w-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
    </div>
  );
}

function AppRoutes() {
  const loc = useLocation();
  const isAdmin = loc.pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <Suspense fallback={<AdminLoader />}>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<DashboardView />} />
            <Route path="leads" element={<LeadsView />} />
            <Route path="pages" element={<PageBuilderView />} />

            {/* Blog */}
            <Route path="blogs"            element={<BlogsListView />} />
            <Route path="blogs/new"        element={<BlogEditorView />} />
            <Route path="blogs/:id"        element={<BlogEditorView />} />
            <Route path="blogs-categories" element={<CategoriesView />} />

            {/* Dynamic pages */}
            <Route path="pages-builder"     element={<PagesListView />} />
            <Route path="pages-builder/new" element={<PageEditorView />} />
            <Route path="pages-builder/:id" element={<PageEditorView />} />

            <Route path="products" element={<ProductsView />} />
            <Route path="projects" element={<ProjectsView />} />
            <Route path="testimonials" element={<TestimonialsView />} />
            <Route path="media" element={<MediaLibraryView />} />
            <Route path="branding" element={<BrandingView />} />
            <Route path="seo" element={<SeoView />} />
            <Route path="analytics" element={<AnalyticsView />} />
            <Route path="settings" element={<SettingsView />} />
            <Route path="debug/storage" element={<StorageDebugView />} />
            <Route path="debug/health"  element={<HealthDashboardView />} />
          </Route>
        </Routes>
      </Suspense>
    );
  }

  return (
    <PublicLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about"          element={<AboutContainer />} />

        {/* Products — live catalog */}
        <Route path="/products"                          element={<ProductsContainer />} />
        <Route path="/products/:categorySlug"            element={<ProductCategoryContainer />} />
        <Route path="/products/:categorySlug/:slug"      element={<ProductDetailContainer />} />

        {/* Solar Solutions — Residential / Commercial / Industrial */}
        <Route path="/solutions/:slug"                   element={<SolutionContainer />} />

        <Route path="/solar-for-need" element={<PlaceholderPage title="Solar For Your Need"   subtitle="Tailored solar systems for homes, societies, businesses & industries." />} />
        <Route path="/contact"        element={<PlaceholderPage title="Get in Touch"          subtitle="We'd love to power your future. Reach out today." />} />

        {/* Blog */}
        <Route path="/blog"           element={<BlogListContainer />} />
        <Route path="/blog/:slug"     element={<BlogPostContainer />} />

        {/* Dynamic CMS pages */}
        <Route path="/p/:slug"        element={<DynamicPageContainer />} />

        <Route path="*"               element={<PlaceholderPage title="Page Not Found"        subtitle="The page you're looking for doesn't exist." />} />
      </Routes>
    </PublicLayout>
  );
}

export default function App() {
  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppErrorBoundary>
  );
}
