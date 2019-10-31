module.exports = {
  apps: [
    {
      name: 'myProxy-prod',
      script: './build/app.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: process.env.NODE_ENV || 'production',
        PORT: process.env.PORT || 3000,
        ADMIN: process.env.ADMIN,
        PATH: process.env.PATH || '/home/myproxy'
      },
    },
  ],
}