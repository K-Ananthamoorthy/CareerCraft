// next.config.js
module.exports = {
    webpack: (config, { dev, isServer }) => {
      if (dev && !isServer) {
        // Disable error overlay in development
        config.optimization.minimize = false;
      }
      return config;
    },
  };
  