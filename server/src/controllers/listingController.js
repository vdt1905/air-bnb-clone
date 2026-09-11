import { asyncHandler } from '../utils/asyncHandler.js';
import { getListingById } from '../services/listingService.js';

// HTTP only: read req, call the service, send the envelope.
export const getListing = asyncHandler(async (req, res) => {
  const listing = getListingById(req.params.id);
  res.status(200).json({ success: true, data: listing });
});
