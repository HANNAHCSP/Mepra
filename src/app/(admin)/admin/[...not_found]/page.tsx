import { notFound } from "next/navigation";

export default function AdminNotFound() {
  // Trigger the nearest not-found boundary
  notFound();
}
