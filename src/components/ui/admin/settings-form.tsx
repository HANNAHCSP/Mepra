"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateStoreSettings } from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save } from "lucide-react";
import { StoreSettings } from "@prisma/client";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="gap-2">
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

export default function SettingsForm({ initialData }: { initialData: StoreSettings }) {
  const [state, formAction] = useActionState(updateStoreSettings, {
    success: false,
    message: "",
  });

  return (
    <form
      action={formAction}
      className="bg-card p-8 rounded-xl border border-border space-y-6 max-w-2xl"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b border-border pb-2">General Info</h3>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Store Name</label>
          <Input name="storeName" defaultValue={initialData.storeName} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Support Email</label>
            <Input name="supportEmail" defaultValue={initialData.supportEmail} required />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Support Phone</label>
            <Input name="supportPhone" defaultValue={initialData.supportPhone} required />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b border-border pb-2">Marketing & Operations</h3>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Announcement Bar Text</label>
          <Input
            name="announcementBar"
            defaultValue={initialData.announcementBar || ""}
            placeholder="e.g. Free Shipping on Orders Over 1000 EGP"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Free Shipping Threshold (Cents)</label>
          <Input
            name="shippingThreshold"
            type="number"
            defaultValue={initialData.shippingThreshold}
            required
          />
          <p className="text-xs text-muted-foreground">Example: 100000 = 1000.00 EGP</p>
        </div>
      </div>

      {state.message && (
        <p className={`text-sm ${state.success ? "text-green-600" : "text-red-600"}`}>
          {state.message}
        </p>
      )}

      <div className="flex justify-end pt-4">
        <SubmitButton />
      </div>
    </form>
  );
}
