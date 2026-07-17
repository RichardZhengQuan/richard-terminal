import type { Metadata } from "next";
import NotFoundClient from "./not-found-client";

export const metadata: Metadata = {
  title: "Page not found | Richard's Terminal",
  description: "The requested route is not available in Richard's Terminal.",
};

export default function NotFound() {
  return <NotFoundClient />;
}
