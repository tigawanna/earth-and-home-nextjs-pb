import { ResponsiveDrawer } from "@/components/root/ResponsiveDrawer";

export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full h-full  flex flex-col items-center justify-center">
      <ResponsiveDrawer>{children}</ResponsiveDrawer>
    </section>
  );
}
export const metadata = {
  title: "Properties",
  description: "Browse and discover properties",
};
