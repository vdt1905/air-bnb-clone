import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import listingRoutes from './listingRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/listings', listingRoutes);

export default router;
