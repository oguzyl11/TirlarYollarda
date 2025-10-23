/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    REACT_APP_HIDE_DEVTOLS_WARNING: 'true',
  },
};

export default nextConfig;
