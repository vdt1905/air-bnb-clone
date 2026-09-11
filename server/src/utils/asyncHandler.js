// Express 5 forwards rejected promises automatically, but wrapping keeps the
// contract explicit and makes the handlers portable.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
