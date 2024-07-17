import React, { useContext } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css'
import Articles from './pages/Articles.jsx';
import Login from './pages/Login.jsx';
import DetailsArticles from './pages/DetailsArticle.jsx';
import Panier from './pages/Panier.jsx';
import RecapPanier from './pages/RecapPanier.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Register from './pages/Register.jsx';
import AdminDashboard from './pages/PanelAdmin.jsx';
import CategoryForm from './components/CategoryForm.jsx';
import ProductForm from './components/ProductForm.jsx';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { auth } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={(props) =>
        auth ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
          <Routes>
            <Route path='/' element={<App />}> 
              <Route index element={<Home />} />
              <Route path="/articles" element={<Articles  />} /> 
              <Route path="/login" element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path="/details-article/:IDProduit" element={<DetailsArticles />} />
              <Route path="/admin" element={<AdminDashboard /> } />
              <Route path="/admin/products" element={<ProductForm />} />
              <Route path="/admin/categories" element={<CategoryForm /> } />
              <Route path="/panier" element={<Panier />} />
            <Route path="/recap-panier" element={<RecapPanier />} />
          </Route>    
          </Routes>
    </BrowserRouter>
  </AuthProvider>
)
