import { Router } from 'express';
import {
    adminLogin,
    adminRegisterAUser,
    adminGetUsers,
    adminGetUserDemographics,
    adminGetAUser,
    adminGetInfo,
} from '../controllers/controller-admin';
import verifyToken from '../middlewares/mware-vertifytoken';

// START: Admin Routes
const router: Router = Router();
router.post('/login', adminLogin);
router.get('/get-info', verifyToken, adminGetInfo);
router.get('/demographics', verifyToken, adminGetUserDemographics);
router.get('/user/list-users', verifyToken, adminGetUsers);
router.get('/user/list-users-v2', adminGetUsers);
router.get('/user/:id', verifyToken, adminGetAUser);
router.post('/user/register-user', verifyToken, adminRegisterAUser);

export default router;
