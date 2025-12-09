"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { format } from "date-fns";

export async function exportOrdersCSV() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return { success: false, message: "Unauthorized" };
  }

  try {
    // 1. Fetch Orders (Flattened data for CSV)
    const orders = await prisma.order.findMany({
      where: { status: { not: "DRAFT" } },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    // 2. Define CSV Headers
    const headers = [
      "Order Number",
      "Date",
      "Customer Name",
      "Customer Email",
      "Status",
      "Payment Status",
      "Total (EGP)",
      "Items Count",
    ];

    // 3. Convert Rows to CSV String
    const rows = orders.map((order) => [
      order.orderNumber,
      format(order.createdAt, "yyyy-MM-dd HH:mm"),
      order.user?.name || "Guest",
      order.customerEmail,
      order.status,
      order.paymentStatus,
      (order.total / 100).toFixed(2), // Convert cents to EGP
      // We didn't fetch items count in this query for speed, but could if needed.
      // Let's assume basic info is enough for accounting.
    ]);

    // 4. Join everything
    const csvContent = [
      headers.join(","), // Header row
      ...rows.map((row) => row.map((field) => `"${field}"`).join(",")), // Data rows (quoted)
    ].join("\n");

    return {
      success: true,
      csv: csvContent,
      filename: `orders-${format(new Date(), "yyyy-MM-dd")}.csv`,
    };
  } catch (error) {
    console.error("Export Error:", error);
    return { success: false, message: "Failed to generate CSV" };
  }
}
