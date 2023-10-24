import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProductAdd from './components/ProductAdd';
import ProductEdit from './components/ProductEdit';
import ProductList from './components/ProductList';
import ProductInfo from './components/ProductInfo';
import Login from './components/Login';
import Logout from './components/Logout';
import ProtectedRoutes from "./components/ProtectedRoute";
import OrderList from "./components/Orderlist";
import OrderInfo from "./components/OrderInfo";
import Header from "./components/Header/Header";  // Убедитесь, что вы создали компонент Logout
import "./App.css"
import SearchResult from "./components/SearchResult/SearchResult";
import ProductDetail from "./components/Product/ProductDetail/ProductDetail";
import CatalogPage from "./components/CatalogPage/CatalogPage";
import Footer from "./components/Footer/Footer";
import OrderStatistics from "./components/OrderStatistics";

function App() {
    return (
        <AuthProvider>
            <RouterComponent />
        </AuthProvider>
    );
}



function RouterComponent() {
    const { isAuthenticated } = useAuth();

    return (
        <Router>
            <Header />
            <div className="container">

                        {isAuthenticated ? (
                            <>
                                {/*<li>*/}
                                {/*    <Logout />*/}
                                {/*</li>*/}
                                {/*<li>*/}
                                {/*    <Link to="/products/add">Добавить продукт</Link>*/}
                                {/*</li>*/}
                                {/*<li>*/}
                                {/*    <Link to="/products">Продукты</Link>*/}
                                {/*</li>*/}
                                {/*<li>*/}
                                {/*    <Link to="/orders">Заказы</Link>*/}
                                {/*</li>*/}
                            </>
                        ) : (
                            <li>
                                <Link to="/login"></Link>
                            </li>
                        )}

                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path='/search-result' element={<SearchResult/>}/>
                    <Route path="/" element={<CatalogPage />} />

                    <Route path="/*" element={<ProtectedRoutes />}>
                        <Route path="products/add" element={<ProductAdd />} />
                        <Route path="statistic" element={<OrderStatistics />} />
                        <Route path="products/:id/edit" element={<ProductEdit />} />
                        <Route path="products/:id" element={<ProductDetail />} />
                        <Route path="products" element={<ProductList />} />
                        <Route path="orders" element={<OrderList />} />
                        <Route path="orders/:id" element={<OrderInfo />} />
                    </Route>
                </Routes>

            </div>
            <Footer />
        </Router>
    );
}

export default App;
