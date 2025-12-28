import express from 'express';
import cors from 'cors';
import menuRoutes from './routes/menuRoutes.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/api/menu', menuRoutes);

app.get('/', (req, res) => {
  res.send('🍕 Pizza Samurai API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
