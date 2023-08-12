const express = require('express');
const compression = require('compression');
const app = express();

const port = process.env.PORT || 5000;
const cors = require('cors');
const connectDB = require('./db/connect');
require('dotenv').config();

//routes imports
const authRoutes=require("./routes/authRoutes")
const adminRoutes=require("./routes/adminRoutes")
const cardRoutes=require("./routes/cardRoutes")
const productRoutes=require("./routes/productRoutes")
const servicesRoutes=require("./routes/serviceRoutes")
const testimonialRoutes=require("./routes/testimonialsRoutes")

//middlewares
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(compression());

//route middlewares
app.use("/api/auth",authRoutes)
app.use("/api/admin",adminRoutes)
app.use("/api/card",cardRoutes)
app.use("/api/product",productRoutes)
app.use("/api/service",servicesRoutes)
app.use("/api/testimonial",testimonialRoutes)
//server test route
app.get("/", (req, res) => {
    res.status(200).json({ message: "Wiki Card server is running" })

})
//connection to database
connectDB(process.env.MONGO_URI);

//server listenng 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

