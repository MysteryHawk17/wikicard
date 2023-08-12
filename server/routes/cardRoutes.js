const { test, createCard, updateBasicDetails, getAllUserCards, getCard, updateTemplate, updateBusinessHours, updateAppointments, updateCardStatus, updateSocialLinks, deleteCard } = require("../controllers/cardController");

const router = require("express").Router();
const upload = require("../utils/multer")
const { checkLogin } = require("../middlewares/authMiddleware")

router.get("/test", test)
router.post('/create', checkLogin, upload.fields([
    { name: "profile" }, { name: "cover" }
]), createCard)
router.get("/getallusercards", checkLogin, getAllUserCards)
router.get("/getcard/:cardId", getCard)
router.put("/update/basicdetails/:cardId", checkLogin, upload.fields([
    { name: "profile" }, { name: "cover" }
]), updateBasicDetails);
router.put("/update/template/:cardId", checkLogin, updateTemplate);
router.put("/update/businesshours/:cardId", checkLogin, updateBusinessHours);
router.put("/update/appointmenthours/:cardId", checkLogin, updateAppointments);
router.put("/update/cardstatus/:cardId", checkLogin, updateCardStatus);
router.put("/update/socialLinks/:cardId", checkLogin, updateSocialLinks);
router.delete("/deletecard/:cardId",checkLogin,deleteCard)

module.exports = router;