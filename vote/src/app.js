import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log('Current directory:', __dirname);

const app = express();
app.use(express.static(path.join(__dirname, "..", 'public')));



app.get('/', (req, res) => {
    res.send('Hello, World!');
});

export default app;