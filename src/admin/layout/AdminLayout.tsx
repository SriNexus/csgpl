import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import { ToastHost } from "@/admin/ui/toast";
import { cmsService } from "@/cms";

/**
 * AdminLayout — sidebar + topbar shell.
 * Mounts the global <ToastHost /> exactly once.
 *
 * Prefetches the most-used CMS resources in the background so admin pages
 * feel instant — the cache is warm by the time the user navigates.
 */
export default function AdminLayout() {
  useEffect(() => {
    // Fire-and-forget — populates cmsCache for the next route visit.
    Promise.all([
      cmsService.list("media"),
      cmsService.list("projects"),
      cmsService.list("testimonials"),
      cmsService.list("products"),
      cmsService.list("blogs"),
      cmsService.list("categories"),
      cmsService.list("pages"),
      cmsService.list("leads"),
      cmsService.getDoc("branding"),
      cmsService.getDoc("settings"),
      cmsService.getDoc("footer"),
      cmsService.getDoc("homepageLayout"),
      cmsService.getDoc("hero"),
    ]).catch(() => { /* swallow — individual hooks will surface real errors */ });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <ToastHost />
    </div>
  );
}
