import { Router } from 'express';
import { validateListingId } from '../middleware/validationMiddleware.js';
import { getListing } from '../controllers/listingController.js';

const router = Router();

router.get('/:id', validateListingId, getListing);

export default router;
