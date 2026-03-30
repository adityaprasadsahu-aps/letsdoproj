import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Home.jsx';
import RegistrationForm from './register.jsx';
import LoginForm from './login.jsx';
import AddItem from './AddItem.jsx';
import CollectionPage from './collection.jsx';
import ContactPage from './contact.jsx';
import ClassicSeries from './ClassicSeries.jsx';
import ExplorerSeries from './ExplorerSeries.jsx';
import SignatureSeries from './SignatureSeries.jsx';
import HeritageSeries from './HeritageSeries.jsx';
import LuxurySeries from './LuxurySeries.jsx';
import LimitedSeries from './LimitedSeries.jsx';
import ProductDetail from './ProductDetail.jsx';
import OurStory from './OurStory.jsx';
import Sustainability from './Sustainability.jsx';
import Careers from './Careers.jsx';
import ServiceCenters from './ServiceCenters.jsx';
import Cart from './Cart.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<RegistrationForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/admin/add-item" element={<AddItem />} />
      <Route path="/collections" element={<CollectionPage />} />
      <Route path="/collections/classic" element={<ClassicSeries />} />
      <Route path="/collections/explorer" element={<ExplorerSeries />} />
      <Route path="/collections/signature" element={<SignatureSeries />} />
      <Route path="/collections/heritage" element={<HeritageSeries />} />
      <Route path="/collections/luxury" element={<LuxurySeries />} />
      <Route path="/collections/limited" element={<LimitedSeries />} />
      <Route path="/product/:series/:productId" element={<ProductDetail />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/our-story" element={<OurStory />} />
      <Route path="/sustainability" element={<Sustainability />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/service-centers" element={<ServiceCenters />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
}

export default App;
