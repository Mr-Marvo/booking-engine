module.exports = {
  apps: [{
    name: "booking-engine",
    script: "dist/src/main.js",
    instances: 1,
    exec_mode: "fork",
    env_dev: {
      NODE_ENV: "dev",
      PORT: 5000,
      MONGODB_URI: 'mongodb+srv://aknpremakumara_db_user:cowFT3ZCBx2BD1ry@booking-engine.npzvcyo.mongodb.net/?appName=booking-engine',
      JWT_SECRET: 'your-super-secret-jwt-key-change-this-in-production-12345',
      ADMIN_SETUP_KEY: 'admin_secret_key_123',
      STRIPE_SECRET_KEY: 'sk_test_51T4CuGGhfbX0uqEQlAIfBy42PJtFAVhTsPIGmNxnuhXHgC2lonriy5WKdqAZetDKHj3QyLKEbQK4s5MBJFMZWhZP00HmWQuKaD',
  },
    env_prod: {
      NODE_ENV: "prod",
      PORT: 5000,
      MONGODB_URI: 'mongodb+srv://aknpremakumara_db_user:cowFT3ZCBx2BD1ry@booking-engine.npzvcyo.mongodb.net/?appName=booking-engine',
      JWT_SECRET: 'your-super-secret-jwt-key-change-this-in-production-12345',
      ADMIN_SETUP_KEY: 'admin_secret_key_123',
      STRIPE_SECRET_KEY: 'sk_test_51T4CuGGhfbX0uqEQlAIfBy42PJtFAVhTsPIGmNxnuhXHgC2lonriy5WKdqAZetDKHj3QyLKEbQK4s5MBJFMZWhZP00HmWQuKaD',
    }
  }]
}
