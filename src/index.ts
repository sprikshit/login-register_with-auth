import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectToDB } from "./config/db";
import userRouter from './routes/userRoutes';

connectToDB();

dotenv.config();

const app = express();

app.use(express.json());



app.use('/api', userRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('application is running successfully.');
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server started listening on http://localhost:${PORT}`);
});
