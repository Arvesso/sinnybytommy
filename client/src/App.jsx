import React, { useEffect } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import Product from './pages/Product.jsx';
import Cart from './pages/Cart.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Account from './pages/Account.jsx';
import Checkout from './pages/Checkout.jsx';
import Payment from './pages/Payment.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminProducts from './pages/admin/Products.jsx';
import AdminProductForm from './pages/admin/ProductForm.jsx';
import AdminCategories from './pages/admin/Categories.jsx';
import AdminOrders from './pages/admin/Orders.jsx';
import AdminUsers from './pages/admin/Users.jsx';
import AdminContent from './pages/admin/Content.jsx';
import { useAuth } from './store.js';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

function PageWrap({ children }) {
  // CSS-driven; no exit, no remount delay → instant route switches
  return <div className="page-transition">{children}</div>;
}

export default function App() {
  const { user, loaded, init } = useAuth();
  const location = useLocation();
  useEffect(() => { init(); }, [init]);

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = ['/login', '/register'].includes(location.pathname);

  if (!loaded) return <div className="spinner" />;

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && !isAuthRoute && <Header />}
      <Routes location={location}>
          <Route path="/" element={<PageWrap><Home /></PageWrap>} />
          <Route path="/catalog/:slug" element={<PageWrap><Catalog /></PageWrap>} />
          <Route path="/product/:id" element={<PageWrap><Product /></PageWrap>} />
          <Route path="/cart" element={<PageWrap><Cart /></PageWrap>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={user ? <PageWrap><Account /></PageWrap> : <Navigate to="/login" />} />
          <Route path="/checkout" element={user ? <PageWrap><Checkout /></PageWrap> : <Navigate to="/login" />} />
          <Route path="/payment" element={user ? <PageWrap><Payment /></PageWrap> : <Navigate to="/login" />} />
          <Route path="/order/:id/success" element={<PageWrap><OrderSuccess /></PageWrap>} />

          <Route path="/admin" element={user?.is_admin ? <AdminLayout /> : <Navigate to="/login" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/:id" element={<AdminProductForm />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="content" element={<AdminContent />} />
          </Route>
        </Routes>
      {!isAdminRoute && !isAuthRoute && <Footer />}
    </>
  );
}
