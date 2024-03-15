/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    APIKEY: process.env.APIKEY,
    AUTHDOMAIN: process.env.AUTHDOMAIN,
    PROJECTID: process.env.PROJECTID,
    STORAGEBUCKET: process.env.STORAGEBUCKET,
    MESSAGINGSENDERID: process.env.MESSAGINGSENDERID,
    APPID: process.env.APPID,
    ADMINID: process.env.ADMINID,
  },
};

module.exports = nextConfig;
