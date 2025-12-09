import { prisma } from "@/lib/prisma";
import { startOfDay, subDays, format } from "date-fns";

export async function getSalesData(days = 7) {
  const startDate = startOfDay(subDays(new Date(), days - 1));

  // 1. Fetch all paid orders in the date range
  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate },
      status: { not: "DRAFT" },
      paymentStatus: { in: ["CAPTURED", "AUTHORIZED"] },
    },
    select: {
      createdAt: true,
      total: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // 2. Group by Date
  const groupedData = new Map<string, { date: string; revenue: number; orders: number }>();

  // Initialize all days with 0 (so the chart doesn't have gaps)
  for (let i = 0; i < days; i++) {
    const date = subDays(new Date(), i);
    const key = format(date, "MMM dd"); // e.g., "Dec 09"
    groupedData.set(key, { date: key, revenue: 0, orders: 0 });
  }

  // Aggregate actual data
  orders.forEach((order) => {
    const key = format(order.createdAt, "MMM dd");
    const current = groupedData.get(key);
    if (current) {
      groupedData.set(key, {
        ...current,
        revenue: current.revenue + order.total / 100, // Convert cents to dollars/EGP
        orders: current.orders + 1,
      });
    }
  });

  // Convert Map to Array and sort by date
  // (Since map keys were inserted in reverse order, we reverse the array)
  return Array.from(groupedData.values()).reverse();
}
