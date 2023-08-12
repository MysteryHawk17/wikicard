const { test, register, loginUser, changePassword } = require("../controllers/authController")

const router = require("express").Router()

const{checkLogin}=require("../middlewares/authMiddleware")


router.get("/test", test);
router.post("/register", register)
router.post("/login",loginUser)
router.put("/changepassword",checkLogin,changePassword)

module.exports = router;