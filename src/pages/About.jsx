import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb.jsx';
import '../styles/CompanyPages.css';

function About() {
  const navigate = useNavigate();

  return (
    <div className="company-page">
      <div className="company-content">
        <Breadcrumb />
        <h1>About Us</h1>
        <p>
          Welcome to our premium watch collection. We are passionate about crafting timeless timepieces that combine
          traditional watchmaking artistry with modern innovation. Our watches are designed for those who appreciate
          quality, precision, and elegance.
        </p>
        <p>
          Founded with a vision to create watches that stand the test of time, we source the finest materials and
          employ skilled artisans to ensure every piece meets our exacting standards. From our Classic Series for
          everyday luxury to our Limited Edition collector pieces, each watch tells a story of craftsmanship and
          dedication.
        </p>
        <p>
          Thank you for choosing our timepieces. We hope our watches become a cherished part of your journey.
        </p>
      </div>
    </div>
  );
}

export default About;