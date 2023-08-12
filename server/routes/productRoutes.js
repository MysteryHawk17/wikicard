const { test, createProduct, getAllProducts, getAProduct, updateProduct, deleteProduct } = require("../controllers/productController");

const router = require("express").Router();
const upload = require("../utils/multer")

router.get("/test", test)
router.post("/create", upload.single('image'), createProduct);
router.get('/getallproduct/:cardId', getAllProducts);
router.get("/getproduct/:id", getAProduct);
router.put('/updateproduct/:id', upload.single('image'), updateProduct);
router.delete('/deleteproduct/:id', deleteProduct)

module.exports = router;