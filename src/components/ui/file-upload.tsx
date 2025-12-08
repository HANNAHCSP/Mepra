"use client";

import { useCallback, useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { UploadCloud, Loader2, Image as ImageIcon, RefreshCw, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  endpoint: "imageUploader";
  value: string;
  onChange: (url?: string) => void;
  onUploadBegin: () => void;
  onUploadComplete: () => void;
}

export const FileUpload = ({
  endpoint,
  value,
  onChange,
  onUploadBegin,
  onUploadComplete,
}: FileUploadProps) => {
  const [preview, setPreview] = useState<string>(value);
  const [progress, setProgress] = useState(0);

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onUploadBegin: () => {
      onUploadBegin();
      toast.info("Uploading image...", { id: "upload-toast" });
    },
    onClientUploadComplete: (res) => {
      // Update with the REAL url from the server
      const serverUrl = res?.[0].url;
      onChange(serverUrl);
      setPreview(serverUrl); // Ensure preview matches server URL
      onUploadComplete();
      toast.success("Upload complete!", { id: "upload-toast" });
      setProgress(0);
    },
    onUploadProgress: (p) => {
      setProgress(p);
    },
    onUploadError: (e) => {
      onUploadComplete();
      setPreview(value); // Revert to original if failed
      toast.error(`Upload error: ${e.message}`, { id: "upload-toast" });
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      // 1. Instant Optimistic Preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // 2. Start Background Upload
      startUpload([file]);
    },
    [startUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(["image"]),
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering dropzone
    setPreview("");
    onChange("");
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          "relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer group",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30",
          preview
            ? "h-64 border-solid border-border"
            : "h-64 flex flex-col items-center justify-center gap-4"
        )}
      >
        <input {...getInputProps()} />

        {/* --- STATE 1: HAS IMAGE (Preview) --- */}
        {preview ? (
          <>
            <Image
              src={preview}
              alt="Upload preview"
              fill
              className={cn(
                "object-contain p-2 transition-opacity duration-300",
                isUploading ? "opacity-50 blur-sm" : "opacity-100"
              )}
            />

            {/* Overlay Actions */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 gap-4">
              {/* Disabled during upload */}
              {!isUploading && (
                <>
                  <div className="flex flex-col items-center text-white">
                    <RefreshCw className="w-8 h-8 mb-2" />
                    <span className="text-xs font-medium uppercase tracking-wider">
                      Click to Replace
                    </span>
                  </div>
                  <button
                    onClick={handleRemove}
                    className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-destructive hover:text-white transition-colors"
                    title="Remove Image"
                    type="button"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Uploading Spinner Overlay */}
            {isUploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-2" />
                <span className="text-sm font-medium text-foreground bg-background/80 px-3 py-1 rounded-full backdrop-blur-sm">
                  {progress}% Uploading...
                </span>
              </div>
            )}
          </>
        ) : (
          /* --- STATE 2: EMPTY (Dropzone) --- */
          <>
            <div className="p-4 rounded-full bg-muted group-hover:bg-background transition-colors shadow-sm">
              <UploadCloud
                className={cn(
                  "w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors",
                  isDragActive && "text-primary"
                )}
              />
            </div>
            <div className="text-center space-y-1">
              <p className="text-lg font-medium text-foreground">
                {isDragActive ? "Drop image here" : "Click to upload"}
              </p>
              <p className="text-sm text-muted-foreground">SVG, PNG, JPG or GIF (max 4MB)</p>
            </div>
          </>
        )}
      </div>

      {/* Help Text */}
      <div className="flex justify-between items-center mt-2 px-1">
        <p className="text-xs text-muted-foreground">
          {preview ? "Image uploaded and ready." : "Upload a product image."}
        </p>
        {preview && !isUploading && (
          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
            Active
          </span>
        )}
      </div>
    </div>
  );
};
