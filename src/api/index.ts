import express from 'express'

const router = express.Router()
const adminRouter = require('./admin')
router.use('/admin', adminRouter)

module.exports = router;
