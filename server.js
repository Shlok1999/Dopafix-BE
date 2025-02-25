const express = require('express');
const cors = require('cors'); 
const dotenv = require('dotenv');
const sessionMiddleware = require('./Config/sessionConfig'); 
const db = require('./Config/db'); 

dotenv.config(); 


const app = express();
const PORT = process.env.PORT || 4300;

app.use(express.json());



process.env.GOOGLE_APPLICATION_CREDENTIALS = "/home/aadashbaord/aa-dashboard-backend/Config/ServiceAccKey.json";


const authRoutes = require('./Routes/auth');


app.use(sessionMiddleware); 

const corsOptions = {
  origin: "http://localhost:3005", // Allow only requests from port 3005
  methods: "GET,POST,PUT,DELETE", // Specify allowed methods
  allowedHeaders: "Content-Type,Authorization", // Specify allowed headers
  credentials: true, // Enable credentials if needed (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions)); // Apply CORS settings
app.use(express.json());






app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route Mounting
app.use('/auth', authRoutes);



db.authenticate()
  .then(() => console.log('Database connected successfully!'))
  .catch(err => console.error('Unable to connect to the database:', err));


app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
