import { Router } from 'express';
import {
    adminLogin,
    adminRegisterAUser,
    adminGetUsers,
    adminGetUserDemographics,
    adminGetAUser,
    adminEditAUserInfo,
    adminGetInfo,
    adminEditAUserImage,
    adminUploadUserPicture,
} from '../controllers/controller-admin';
import verifyToken from '../middlewares/mware-vertifytoken';
import { upload } from '../configs/cloudinary';

// START: Admin Routes
const router: Router = Router();
router.post('/login', adminLogin);
router.get('/get-info', verifyToken, adminGetInfo);
router.get('/demographics', verifyToken, adminGetUserDemographics);
router.get('/user/list-users', verifyToken, adminGetUsers);
router.get('/user/list-users-v2', adminGetUsers);
router.get('/user/:id', verifyToken, adminGetAUser);
router.patch('/user/edit/:id', verifyToken, adminEditAUserInfo);
router.post('/user/register-user', verifyToken, adminRegisterAUser);
router.put('/user/edit-image/:id', verifyToken, upload.single('pictureFile'), adminEditAUserImage);
router.post('/user/upload-picture-test', upload.single('pictureFile'), adminUploadUserPicture);

export default router;
