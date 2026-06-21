import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes/index.routes.js';


const app = express();


app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use(express.static('public'));

app.use('/api', apiRoutes);

app.get("/*name", (req, res) => {
    res.sendFile('public/index.html', { root: process.cwd() })
})

export default app;