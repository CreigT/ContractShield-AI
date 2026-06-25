import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingRoot: path.join(__dirname),
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "firebase/app": path.join(__dirname, "node_modules/firebase/app/dist/esm/index.esm.js"),
      "firebase/auth": path.join(__dirname, "node_modules/firebase/auth/dist/esm/index.esm.js"),
      "firebase/firestore": path.join(__dirname, "node_modules/firebase/firestore/dist/esm/index.esm.js"),
      "firebase/storage": path.join(__dirname, "node_modules/firebase/storage/dist/esm/index.esm.js"),
      "@firebase/app": path.join(__dirname, "node_modules/@firebase/app/dist/esm/index.esm2017.js"),
      "@firebase/auth": path.join(__dirname, "node_modules/@firebase/auth/dist/esm2017/index.js"),
      "@firebase/firestore": path.join(__dirname, "node_modules/@firebase/firestore/dist/index.esm2017.js"),
      "@firebase/storage": path.join(__dirname, "node_modules/@firebase/storage/dist/index.esm2017.js"),
    };

    return config;
  },
};

export default nextConfig;
