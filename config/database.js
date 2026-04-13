module.exports = ({ env }) => {
  const client = env("DATABASE_CLIENT");

  return {
    connection: {
      client: client,
      connection: {
        connectionString: env("DATABASE_URL"),
        ssl: env.bool("DATABASE_SSL", true)
          ? { rejectUnauthorized: false }
          : false,
        // Prevent hanging on DNS resolution failures
        connectionTimeoutMillis: 10000,
        query_timeout: 30000,
      },
      pool: {
        // min:0 avoids eagerly creating connections at startup (prevents
        // EAI_AGAIN crashes when DNS is not yet ready on Render cold starts)
        min: 0,
        max: 10,
        acquireTimeoutMillis: 60000,
        createTimeoutMillis: 30000,
        destroyTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        // Do NOT propagate connection creation errors to the pool acquire call;
        // lets Strapi retry rather than crash on a transient DNS failure
        propagateCreateError: false,
      },
      acquireConnectionTimeout: env.int(
        "DATABASE_CONNECTION_TIMEOUT",
        60000
      ),
    },
  };
};
