import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb.jsx';
import '../styles/CompanyPages.css';

function Compare() {
  const navigate = useNavigate();

  return (
    <div className="company-page">
      <Breadcrumb />

      <div className="company-content">
        <h1>Compare Products</h1>
        <p>
          Compare our timepieces side by side to find the perfect watch for you.
        </p>
        <p>
          This feature is coming soon! You'll be able to select multiple watches and compare their specifications,
          prices, and features in detail.
        </p>
        <p>
          In the meantime, explore our <a href="#" onClick={(e) => {e.preventDefault(); navigate('/store');}} style={{color: '#e45000'}}>Store</a> to browse all products.
        </p>
      </div>
    </div>
  );
}

export default Compare;