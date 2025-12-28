import express from 'express';
import { menu } from '../data/menu.js';

const router = express.Router();

// GET all menu items
router.get('/', (req, res) => {
  res.json({ status: 'success', data: menu });
});

export default router;
