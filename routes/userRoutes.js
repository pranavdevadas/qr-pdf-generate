import express from "express";
import usercontroller from "../controller/userController.js";
import dashBoardController from "../controller/dashboardController.js";
import settingsController from '../controller/settingsController.js'
import isUser from "../middleware/isUser.js";

const router = express.Router();

router.get("/login", usercontroller.getLogin);
router.post("/login", usercontroller.postLogin);
router.get("/register", usercontroller.getRegister);
router.post("/register", usercontroller.postRegister);
router.get("/home", isUser, usercontroller.getHome);

router.post('/generate-qr', dashBoardController.generateQr);

router.get('/settings', isUser, settingsController.getSettings)
router.post('/update-expiry', settingsController.updateExpiryDate)



export default router;
