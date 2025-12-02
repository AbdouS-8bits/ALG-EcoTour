import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep configuration minimal. Removed invalid `experimental.authInterceptor` option
  // to avoid the runtime warning about unrecognized keys.
};

export default nextConfig;
