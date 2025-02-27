import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
dotenv.config();



const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    credentials: true
}));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static("public"));
app.use(cookieParser());




// Route imports
import userRouter from './routes/user.route.js';
import productRouter from './routes/product.route.js';
import cartRouter from './routes/cart.route.js';

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);

// Default route
app.get('/', (req, res) => {
    res.send('API is running....');
});



// Database connection and server start
connectDB()
.then(() => {
    server.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️  Server running on port ${process.env.PORT}`);
    });
})
.catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
});