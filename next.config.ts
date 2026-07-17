import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  ...(process.env.STATIC_EXPORT === "1"
    ? {
        output: "export" as const,
        // Type checking is run separately in CI; keeping it out of the export
        // path makes VPS packaging deterministic on constrained build hosts.
        typescript: { ignoreBuildErrors: true },
      }
    : {}),
};

export default nextConfig;
