import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Star, MessageSquare } from "lucide-react";
import DeleteReviewButton from "@/components/ui/admin/delete-review-button";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { name: true, imageUrl: true, handle: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-primary">Reviews</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Moderate customer feedback ({reviews.length} total)
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-accent/50 font-medium">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4 w-1/3">Comment</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      href={`/products/${review.product.handle}`}
                      className="flex items-center gap-3 group"
                      target="_blank"
                    >
                      <div className="relative h-10 w-10 rounded border border-border overflow-hidden bg-white">
                        <Image
                          src={review.product.imageUrl || "/placeholder.svg"}
                          alt={review.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors max-w-[150px] truncate block">
                        {review.product.name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {review.user.name || "Anonymous"}
                      </span>
                      <span className="text-xs text-muted-foreground">{review.user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex text-secondary">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${star <= review.rating ? "fill-current" : "text-border"}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {review.comment ? (
                      <p className="text-muted-foreground line-clamp-2" title={review.comment}>
                        {review.comment}
                      </p>
                    ) : (
                      <span className="text-muted-foreground/50 italic text-xs">No comment</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DeleteReviewButton reviewId={review.id} />
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    No reviews yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
