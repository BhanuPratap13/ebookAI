const router = require("express").Router();
const { registerUser, signInUser, loginUser, getProfile, updateUserProfile } = require("../controllers/authController");
const{protect}=require('../middlewares/authMiddleware')

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get('/profile',protect,getProfile)
router.put('/profile',protect,updateUserProfile)

module.exports = router;