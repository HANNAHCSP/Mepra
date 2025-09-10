// /src/app/api/users/sign-up/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";

const BodySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  // 1) Require JSON
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const preview = (await req.text()).slice(0, 200);
    return NextResponse.json(
      { error: "Content-Type must be application/json", received: contentType, bodyPreview: preview },
      { status: 400 }
    );
  }

  // 2) Parse JSON safely (so we never throw HTML back)
  const raw = await req.text();
  let body: unknown;
  try {
    body = raw ? JSON.parse(raw) : {};
  } catch {
    return NextResponse.json(
      { error: "Malformed JSON body", bodyPreview: raw.slice(0, 200) },
      { status: 400 }
    );
  }

  // 3) Validate with Zod (trimmed)
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;
  const lower = email.toLowerCase();

  // 4) Uniqueness check
  const exists = await prisma.user.findUnique({ where: { email: lower }, select: { id: true } });
  if (exists) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

  // 5) Create user
  const hashed = await hash(password, 12);
  await prisma.user.create({ data: { name, email: lower, password: hashed } });

  return NextResponse.json({ ok: true }, { status: 201 });
}
