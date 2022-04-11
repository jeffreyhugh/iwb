const { withOffline } = require('next-offline-ts');

const nextConfig = {
  reactStrictMode: true,
};

module.exports = withOffline(nextConfig);
