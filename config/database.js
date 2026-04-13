module.exports = ({ env }) => {
  const client = env("DATABASE_CLIENT");
  const isProduction = process.env.NODE_ENV === "production";

  // Force IPv4 DNS resolution — Render does not support IPv6 outbound
  const dns = require("dns");
  dns.setDefaultResultOrder("ipv4first");

  // In production (Render), always use SSL for Supabase
  const useSSL = isProduction ? true : env.bool("DATABASE_SSL", false);

  console.log(
    `[DB Config] client=${client}, ssl=${useSSL}, NODE_ENV=${process.env.NODE_ENV}`
  );

  return {
    connection: {
      client: client,
      connection: {
        connectionString: env("DATABASE_URL"),
        ssl: useSSL ? { rejectUnauthorized: false } : false,
        connectionTimeoutMillis: 10000,
      },
      pool: {
        min: 0,
        max: 5,
        acquireTimeoutMillis: 30000,
        createTimeoutMillis: 15000,
        destroyTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        propagateCreateError: false,
      },
      acquireConnectionTimeout: env.int(
        "DATABASE_CONNECTION_TIMEOUT",
        30000
      ),
    },
  };
};
