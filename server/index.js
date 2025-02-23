const express = require("express");
const app = express();
require("dotenv").config();
const dbConnect = require("./config/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

// Database connection
dbConnect();

const PORT = process.env.PORT || 8080;

// Allowed Origins for CORS
const allowedOrigins = [
	"http://localhost:5173",
	// "https://assetmate-tle-smashers.netlify.app"
	// "https://asset-mate-tle-smashers.vercel.app/",
	"https://assetmate-kanhaiya.netlify.app",
	"https://manage-your-assets-tle-smashers01.vercel.app/",
	"https://manage-your-assets-tle-smashers01.vercel.app",

];

// CORS configuration
app.use(cors({
	origin: (origin, callback) => {
		// Allow requests with no origin (like mobile apps or Postman)
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	credentials: true, // Allows cookies to be sent across origins
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	optionsSuccessStatus: 204 // Default status for OPTIONS request
}));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

// Importing routes
const userRoutes = require("./routes/User");
const warehouseRoutes = require("./routes/Warehouse");
const supplierRoutes = require("./routes/Supplier");
const clientRoutes = require("./routes/Client");
const termRoutes = require("./routes/Terms");
const accountRoutes = require("./routes/Account");
const enquiryRoutes = require("./routes/Enquiry");
const marketingRoutes = require("./routes/Marketing");
const backupRoutes = require("./routes/backupRoutes");
// Route handling
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/warehouse", warehouseRoutes);
app.use("/api/v1/supplier", supplierRoutes);
app.use("/api/v1/client", clientRoutes);
app.use("/api/v1/terms", termRoutes);
app.use("/api/v1/account", accountRoutes);
app.use("/api/v1/enquiry", enquiryRoutes);
app.use("/api/v1/marketing", marketingRoutes);
app.use("/api/v1/backup", backupRoutes);

// Default route
app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running...."
	});
});

// Start the server
app.listen(PORT, () => {
	console.log(`App is running at http://localhost:${PORT}`);
});
