import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import AuctionDetailsPage from './pages/AuctionDetailsPage';
import CreateAuctionPage from './pages/CreateAuctionPage';
import EditAuctionPage from './pages/EditAuctionPage';
import MyAuctionsPage from './pages/MyAuctionsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="auctions/:id" element={<AuctionDetailsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="auctions/new" element={<CreateAuctionPage />} />
          <Route path="auctions/:id/edit" element={<EditAuctionPage />} />
          <Route path="my-auctions" element={<MyAuctionsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
