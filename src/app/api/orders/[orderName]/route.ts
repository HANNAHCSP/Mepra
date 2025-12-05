import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderName: string }> } // 1. Change type to Promise
) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  // 2. Await the params before using them
  const { orderName } = await params;

  if (!token) {
    return NextResponse.json({ error: "Access token is required" }, { status: 401 });
  }

  if (!orderName) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderName, // Use the awaited variable
        accessToken: token,
      },
      select: {
        id: true,
        orderNumber: true,
        userId: true,
        customerEmail: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found or access denied" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error(`[API_ORDER_FETCH_ERROR]`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
