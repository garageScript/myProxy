const router = express.Router()
const adminRouter = require('./admin')
router.use('/admin', adminRouter)
