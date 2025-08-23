import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useLocalViewer } from "@/data-access-layer/pocketbase/auth";
import { Schema } from "@/lib/pocketbase/types/pb-types";
import { createRootRouteWithContext, Outlet, redirect } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { TypedPocketBase } from "@tigawanna/typed-pocketbase";
import { TanStackDashboardSidebar } from "../TanStackDashboardSidebar";

// Define the router context interface
interface RouterContext {
  pb: TypedPocketBase<Schema> | null;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  loader: async ({ context }) => {
    console.log("Root loader context:", context.pb?.authStore);
    // You can perform any async operations here if needed
    // if (!context.pb || context.pb?.authStore.record?.id) {
    //   // @ts-expect-error
    //   throw redirect("/auth.signin");
    // }
    // return { pb: context.pb };
  },
});

function RootComponent() {
  const { data } = useLocalViewer();
  const user = data?.viewer;

  // if (!user) {
  //   // Redirect to auth page using regular navigation
  //   window.location.href = "/auth/signin";
  //   return null;
  // }

  return (
    <SidebarProvider defaultOpen={true}>
      <TanStackDashboardSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-sidebar-border" />
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
      <TanStackRouterDevtools />
    </SidebarProvider>
  );
}
