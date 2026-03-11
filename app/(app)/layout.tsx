import { UserProvider } from "@/context/UserProvider";
import { UISettingsProvider } from "@/context/UISettingsProvider";
import LayoutShell from "./components/LayoutShell";
// import LayoutShell from "@/components/LayoutShell";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <UISettingsProvider>
        <LayoutShell>{children}</LayoutShell>
      </UISettingsProvider>
    </UserProvider>
  );
}
