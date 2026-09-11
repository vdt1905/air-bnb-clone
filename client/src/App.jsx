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
          element={<Navigate to={`/listings/${DEFAULT_LISTING_ID}`} replace />}
        />
        <Route path="/listings/:id" element={<ListingPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
