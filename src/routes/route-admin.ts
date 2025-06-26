import { Router } from 'express'
import {
    adminGetUsers,
    adminLogin,
    adminRegisterUser,
} from '../controllers/controller-admin'

// START BASIC ROUTING
const router: Router = Router()

router.post('/register', adminRegisterUser)
router.post('/login', adminLogin)
router.get('/list-users', adminGetUsers)

export default router
