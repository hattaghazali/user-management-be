import { Router } from 'express';
import {
    adminLogin,
    adminRegisterAUser,
    adminGetUsers,
    adminGetUserDemographics,
    adminGetAUser,
} from '../controllers/controller-admin';
import verifyToken from '../middlewares/mware-vertifytoken';

// START: Admin Routes
const router: Router = Router();
router.post('/login', adminLogin);
router.get('/demographics', verifyToken, adminGetUserDemographics);
router.get('/user/list-users', verifyToken, adminGetUsers);
router.get('/user/:id', verifyToken, adminGetAUser);
router.post('/user/register-user', verifyToken, adminRegisterAUser);

export default router;
