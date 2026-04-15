import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb.jsx';
import '../styles/CompanyPages.css';

function Company() {
  const navigate = useNavigate();

  return (
    <div className="company-page">
      <Breadcrumb />
      <div className="company-content">
        <h1>Our Company</h1>
        <p>
          Founded in 2020, Chronos has been at the forefront of modern watchmaking, blending traditional craftsmanship
          with contemporary design. Our mission is to create timepieces that not only tell time but also tell stories.
        </p>
        <h2>Our Values</h2>
        <ul>
          <li><strong>Quality:</strong> Every watch undergoes rigorous testing and quality control.</li>
          <li><strong>Innovation:</strong> We continuously explore new materials and technologies.</li>
          <li><strong>Sustainability:</strong> Committed to ethical sourcing and environmentally friendly practices.</li>
          <li><strong>Customer Satisfaction:</strong> Your trust and satisfaction are our highest priorities.</li>
        </ul>
        <h2>Our Team</h2>
        <p>
          Our team consists of master watchmakers, designers, and artisans with decades of combined experience
          in the luxury timepiece industry. We work closely with suppliers and partners worldwide to bring you
          the finest watches.
        </p>
        <p>
          Learn more about our <a href="#" onClick={(e) => {e.preventDefault(); navigate('/our-story');}} style={{color: '#e45000'}}>story</a> and our commitment to <a href="#" onClick={(e) => {e.preventDefault(); navigate('/sustainability');}} style={{color: '#e45000'}}>sustainability</a>.
        </p>
      </div>
    </div>
  );
}

export default Company;