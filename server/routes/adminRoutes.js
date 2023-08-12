const { test, createTemplate, deletetemplate, gettemplate, getAlltemplates } = require("../controllers/adminController");

const router = require("express").Router();
const upload = require("../utils/multer")

router.get("/test", test)
router.post("/template/create", upload.single('image'), createTemplate)
router.get("/template/getalltemplates", getAlltemplates)
router.get("/template/gettemplate/:id", gettemplate)
router.delete("/template/delete/:id", deletetemplate)


module.exports = router;