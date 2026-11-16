import type { Metadata } from "next";
import NotFoundClient from "./not-found-client";

export const metadata: Metadata = {
  title: "Page not found | Richard Q",
  description: "Return to Richard Q’s résumé and project portfolio.",
};

export default function NotFound() {
  return <NotFoundClient />;
}
