import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  // Define a route for "imageUploader"
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      // 1. Verify user is Admin
      const session = await getServerSession(authOptions);
      if (session?.user?.role !== "admin") throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(
      async ({ metadata, file }: { metadata: { userId: string }; file: { url: string } }) => {
        console.log("Upload complete for userId:", metadata.userId);
        console.log("file url", file.url);
        return { uploadedBy: metadata.userId };
      }
    ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
