const { test, createService, getAllServices, getAServices, deleteService, updateSevice } = require("../controllers/serviceController");

const router = require("express").Router();
const upload = require("../utils/multer")

router.get("/test", test)
router.post("/create", upload.single('image'), createService);
router.get('/getallservice/:cardId', getAllServices);
router.get("/getservice/:id", getAServices);
router.put('/updateservice/:id', upload.single('image'), updateSevice);
router.delete('/deleteservice/:id', deleteService)

module.exports = router;