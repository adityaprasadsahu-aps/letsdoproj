import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb.jsx';
import '../styles/CompanyPages.css';

function Terms() {
  const navigate = useNavigate();

  return (
    <div className="company-page">
      <Breadcrumb />

      <div className="company-content">
        <h1>Terms of Service</h1>
        <p>
          Welcome to our website. By accessing or using our services, you agree to be bound by these Terms of Service.
        </p>
        <h2>Use of Service</h2>
        <p>
          You may use our services only for lawful purposes and in accordance with these Terms. You agree not to use
          our services in any way that violates any applicable laws or regulations.
        </p>
        <h2>Products and Pricing</h2>
        <p>
          All product descriptions, pricing, and availability are subject to change without notice. We reserve the
          right to discontinue any product at any time.
        </p>
        <h2>Shipping and Returns</h2>
        <p>
          Shipping costs and delivery times vary. Returns are accepted within 30 days of purchase in original condition.
          Please refer to our return policy for details.
        </p>
        <h2>Limitation of Liability</h2>
        <p>
          Our liability is limited to the maximum extent permitted by law. We are not liable for any indirect,
          incidental, or consequential damages.
        </p>
        <p>
          These terms are governed by the laws of [Your Jurisdiction]. For questions, please contact us.
        </p>
      </div>
    </div>
  );
}

export default Terms;