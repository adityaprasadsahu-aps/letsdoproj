import { Routes, Route } from 'react-router-dom';
import './styles/App.css';
import Home from './pages/Home.jsx';
import RegistrationForm from './pages/Register.jsx';
import LoginForm from './pages/Login.jsx';
import CollectionPage from './pages/CollectionPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import SeriesPage from './pages/SeriesPage.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import OurStory from './pages/OurStory.jsx';
import Sustainability from './pages/Sustainability.jsx';
import Careers from './pages/Careers.jsx';
import ServiceCenters from './pages/ServiceCenters.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Profile from './pages/Profile.jsx';
import Admin from './pages/Admin.jsx';
import Store from './pages/Store.jsx';
import About from './pages/About.jsx';
import Search from './pages/Search.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';
import Collections from './pages/Collections.jsx';
import NewArrivals from './pages/NewArrivals.jsx';
import Compare from './pages/Compare.jsx';
import FAQs from './pages/FAQs.jsx';
import Company from './pages/Company.jsx';
import News from './pages/News.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<RegistrationForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/collections" element={<CollectionPage />} />
      <Route path="/collections/:series" element={<SeriesPage />} />
      <Route path="/product/:series/:productId" element={<ProductDetail />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/our-story" element={<OurStory />} />
      <Route path="/sustainability" element={<Sustainability />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/service-centers" element={<ServiceCenters />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/store" element={<Store />} />
      <Route path="/about" element={<About />} />
      <Route path="/search" element={<Search />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/collections-page" element={<Collections />} />
      <Route path="/new-arrivals" element={<NewArrivals />} />
      <Route path="/compare" element={<Compare />} />
      <Route path="/faqs" element={<FAQs />} />
      <Route path="/company" element={<Company />} />
      <Route path="/news" element={<News />} />
    </Routes>
  );
}

export default App;
