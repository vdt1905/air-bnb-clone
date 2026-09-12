import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ListingPage from './pages/ListingPage.jsx';
import NotFound from './pages/NotFound.jsx';
import { DEFAULT_LISTING_ID } from './constants/api.js';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={`/listings/${DEFAULT_LISTING_ID}?check_in=2026-10-18&check_out=2026-10-23&adults=2`} replace />}
        />
        <Route path="/listings/:id" element={<ListingPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
