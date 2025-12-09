import { getStoreSettings } from "@/app/actions/settings";
import SettingsForm from "@/components/ui/admin/settings-form";

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-primary">Store Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage global configuration variables.</p>
      </div>

      <SettingsForm initialData={settings} />
    </div>
  );
}
