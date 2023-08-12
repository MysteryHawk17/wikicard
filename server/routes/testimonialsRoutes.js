const { test, createTestimonial, getAllTestimonials, getATestimonial, updateTestimonial, deleteTestimonial } = require("../controllers//testimonialsController");

const router = require("express").Router();
const upload = require("../utils/multer")

router.get("/test", test)
router.post("/create", upload.single('image'), createTestimonial);
router.get('/getalltestimonial/:cardId', getAllTestimonials);
router.get("/gettestimonial/:id", getATestimonial);
router.put('/updatetestimonial/:id', upload.single('image'), updateTestimonial);
router.delete('/deletetestimonial/:id', deleteTestimonial)

module.exports = router;