// Import with the ES module syntax
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig = {
  reactStrictMode: true,
  // Other Next.js configurations
};

// Sentry config (if you're using Sentry)
const sentryWebpackPluginOptions = {
  // Sentry config options
};

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
