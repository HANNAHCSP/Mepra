"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { createProductAction, updateProductAction } from "@/app/actions/admin-product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save, AlertCircle, Trash2 } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { cn } from "@/lib/utils";

import { Product, ProductVariant } from "@prisma/client";

type ProductWithVariant = Product & { variants: ProductVariant[] };

interface ProductFormProps {
  initialData?: ProductWithVariant | null;
}

const CATEGORIES = ["Flatware"];
const COLLECTIONS = [
  "Daily Use Sets",
  "Cutlery Sets",
  "Spoons",
  "Forks",
  "Knives",
  "Serving Pieces",
];

// Added validation logic to props: form cannot submit if !hasImage
function SubmitButton({
  disabled,
  isUploading,
  isEditing,
  hasImage,
}: {
  disabled?: boolean;
  isUploading: boolean;
  isEditing: boolean;
  hasImage: boolean;
}) {
  const { pending } = useFormStatus();

  // Logic: Disable if pending, manually disabled, uploading, OR NO IMAGE
  const isDisabled = pending || disabled || isUploading || !hasImage;

  return (
    <div className="flex items-center gap-3">
      <Link href="/admin/products">
        <Button variant="outline" type="button" disabled={pending}>
          Cancel
        </Button>
      </Link>

      <Button type="submit" disabled={isDisabled} className="min-w-[140px] gap-2">
        {pending || isUploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {isUploading
          ? "Uploading..."
          : pending
            ? "Saving..."
            : isEditing
              ? "Update Product"
              : "Create Product"}
      </Button>
    </div>
  );
}

function ErrorMessage({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <p className="text-xs text-red-600 flex items-center gap-1 mt-1 animate-in slide-in-from-top-1 fade-in">
      <AlertCircle className="w-3 h-3" />
      {errors[0]}
    </p>
  );
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const isEditing = !!initialData;
  const initialState = { success: false, message: "", errors: {} as Record<string, string[]> };

  const action = isEditing ? updateProductAction.bind(null, initialData.id) : createProductAction;

  const [state, formAction] = useActionState(action, initialState);

  // State for Image
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [isUploading, setIsUploading] = useState(false);

  const initialVariant = initialData?.variants[0];
  const initialPrice = initialVariant ? (initialVariant.price / 100).toFixed(2) : "";
  const initialStock = initialVariant ? initialVariant.stock : "";

  const inputStyles =
    "flex h-12 w-full rounded-md border-2 border-input bg-white px-4 py-3 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:border-secondary focus-visible:ring-4 focus-visible:ring-secondary/10 disabled:cursor-not-allowed disabled:bg-muted/30 disabled:opacity-60";
  const getErrorClass = (hasError?: boolean) =>
    hasError ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-100" : "";

  return (
    <form
      action={formAction}
      className="space-y-8 bg-card p-8 rounded-xl border border-border shadow-sm"
    >
      {!state.success && state.message && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-800 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{state.message}</p>
        </div>
      )}

      {state.success && state.message && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800 text-sm">
          <Save className="w-5 h-5 flex-shrink-0" />
          <p>{state.message}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column: Details */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b border-border pb-2">Basic Details</h3>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Product Name</label>
              <Input
                name="name"
                defaultValue={initialData?.name}
                placeholder="e.g. Mepra Linea Fork"
                className={getErrorClass(!!state.errors?.name)}
                required
              />
              <ErrorMessage errors={state.errors?.name} />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                defaultValue={initialData?.description}
                rows={5}
                className={cn(inputStyles, getErrorClass(!!state.errors?.description))}
                placeholder="Product details..."
                required
              />
              <ErrorMessage errors={state.errors?.description} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b border-border pb-2">Organization</h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Category</label>
                <div className="relative">
                  <select
                    name="category"
                    defaultValue={initialData?.category || "Flatware"}
                    className={cn(inputStyles, getErrorClass(!!state.errors?.category))}
                    required
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <ErrorMessage errors={state.errors?.category} />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Collection</label>
                <div className="relative">
                  <select
                    name="collection"
                    defaultValue={initialData?.collection || ""}
                    className={cn(inputStyles, getErrorClass(!!state.errors?.collection))}
                  >
                    <option value="" disabled>
                      Select a collection
                    </option>
                    {COLLECTIONS.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>
                <ErrorMessage errors={state.errors?.collection} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Media */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b border-border pb-2">Pricing & Inventory</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Price (EGP)</label>
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={initialPrice}
                  placeholder="0.00"
                  className={getErrorClass(!!state.errors?.price)}
                  required
                />
                <ErrorMessage errors={state.errors?.price} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Stock</label>
                <Input
                  name="stock"
                  type="number"
                  defaultValue={initialStock}
                  placeholder="100"
                  className={getErrorClass(!!state.errors?.stock)}
                  required
                />
                <ErrorMessage errors={state.errors?.stock} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-lg font-medium">Product Image</h3>
              {imageUrl && (
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded border border-green-200">
                  Image Active
                </span>
              )}
            </div>

            <div className="grid gap-2">
              {/* Validation Border Container */}
              <div
                className={cn(
                  "rounded-xl border transition-all duration-300",
                  state.errors?.imageUrl ? "border-red-500 bg-red-50 p-2" : "border-transparent"
                )}
              >
                <FileUpload
                  endpoint="imageUploader"
                  value={imageUrl}
                  onChange={(url) => setImageUrl(url || "")}
                  onUploadBegin={() => setIsUploading(true)}
                  onUploadComplete={() => setIsUploading(false)}
                />
              </div>

              <input type="hidden" name="imageUrl" value={imageUrl} />

              {!imageUrl && !isUploading && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Image is required to save.
                </p>
              )}

              <ErrorMessage errors={state.errors?.imageUrl} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-border mt-8">
        <SubmitButton isUploading={isUploading} isEditing={isEditing} hasImage={!!imageUrl} />
      </div>
    </form>
  );
}
