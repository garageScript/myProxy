export default {
  ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  ADMIN_PASS: process.env.ADMIN || null,
  HOME: process.env.HOME || null,
}