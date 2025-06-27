import { Router } from 'express';
import {
    adminLogin,
    adminRegisterAUser,
    adminGetUsers,
    adminGetUserDemographics,
} from '../controllers/controller-admin';
import verifyToken from '../middlewares/mware-vertifytoken';

// START: Admin Routes
const router: Router = Router();
router.post('/login', adminLogin);
router.post('/register-user', verifyToken, adminRegisterAUser);
router.get('/list-users', verifyToken, adminGetUsers);
router.get('/user-demographics', verifyToken, adminGetUserDemographics);

export default router;
