import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

router.post('/authenticate', userController.authenticate);

router.post('/checkIfUserExists', userController.checkIfUserExists);

router.post('/addUserDetails', userController.addUserDetails);

router.post('/addApp', userController.addApp);

router.post('/deleteApp',userController.deleteApp);

router.post('/sendOTP', userController.sendOTP);

router.get('/generatedOTP', userController.getGeneratedOTP);


export default router;