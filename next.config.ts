import type { NextConfig } from "next";

// Два режима сборки из одного репозитория:
// - GitHub Pages (статика): output "export" + basePath /dariger-ai
// - Node-хостинг (SmarterASP/Vercel, сервер с /api/chat): обычный сервер Next
const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const isStaticExport = process.env.BUILD_MODE === "static" || isGitHubPages;

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export" as const, basePath: isGitHubPages ? "/dariger-ai" : "" } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
