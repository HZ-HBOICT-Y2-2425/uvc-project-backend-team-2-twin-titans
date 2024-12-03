import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config({ path: 'variables.env' });
import cors from 'cors';
import indexRouter from './routes/index.js';

const app = express();

// Configure CORS to allow requests from your frontend domain
app.use(cors({ origin: 'http://localhost:5173' })); // Replace with your frontend domain if different

// Support JSON-encoded and URL-encoded bodies, mainly used for POST and update
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);

app.set('port', process.env.PORT || 3013);
const server = app.listen(app.get('port'), () => {
  console.log(`🍿 Express running → PORT ${server.address().port}`);
});
