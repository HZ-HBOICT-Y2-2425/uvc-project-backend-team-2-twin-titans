import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config({ path: 'variables.env' });
import indexRouter from './routes/index.js';
import cors from 'cors';  // Importeer de CORS-middleware

const app = express();

// Stel CORS in om verzoeken van je frontend (localhost:5173) toe te staan
const allowedOrigins = ['http://localhost:5173'];  // Pas dit aan voor andere frontend-omgevingen
const corsOptions = {
    origin: allowedOrigins,   // Welke origins worden toegestaan
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Welke HTTP-methoden worden toegestaan
    allowedHeaders: ['Content-Type', 'Authorization'],  // Welke headers mogen gebruikt worden
};

// Gebruik CORS middleware in je Express-app
app.use(cors(corsOptions));

// support json encoded and url-encoded bodies, mainly used for post and update
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Gebruik de routes
app.use('/', indexRouter);

app.set('port', process.env.PORT || 3012);
const server = app.listen(app.get('port'), () => {
  console.log(`🍿 Express running → PORT ${server.address().port}`);
});
