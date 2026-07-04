import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';



import auth from "./Modules/Admin/admin.routes.js";
import Inventory from './Modules/InventoryAssets/asset.routes.js';
import rentalRoutes from "./modules/rentalmaster/master.routes.js";





const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(morgan('dev'));
app.use(express.json());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));



app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));



app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/uploads", express.static("uploads"));



app.use('/api/auth', auth);
app.use('/api/inventory',Inventory);
app.use("/api/rentals", rentalRoutes);



app.get('/', (req, res) => {
  res.send('App is running');
});

export default app;