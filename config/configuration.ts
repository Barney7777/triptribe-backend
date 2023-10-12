export default () => ({
  port: process.env.PORT || 8080,
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 27018,
  },
});
