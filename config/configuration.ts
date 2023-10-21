export default () => ({
  port: process.env.PORT || 8080,
  database: {
    name: process.env.DATABASE_NAME || 'tripTribeDb',
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 27018,
  },
});
