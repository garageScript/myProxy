export default {
  ENV: process.env.NODE_ENV || process.env.ENV || 'development',
  PORT: process.env.PORT || process.env.ENV || 3000,
  ADMIN_PASS: process.env.ADMIN || process.env.ENV || null,
  HOME: process.env.HOME || process.env.ENV || null,
  isProduction: (): boolean =>
    (process.env.NODE_ENV || process.env.ENV) === 'production',
}
