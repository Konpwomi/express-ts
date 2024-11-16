import express, {Request, Response} from 'express';
import todoRoutes from './routes/todoRoutes';
import cors from 'cors';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use('/api/todos', todoRoutes);

app.listen(port, () => {
    console.log(`Server is running on Port ${port}`);
});