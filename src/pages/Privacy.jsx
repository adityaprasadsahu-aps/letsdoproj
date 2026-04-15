import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb.jsx';
import '../styles/CompanyPages.css';

function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="company-page">
      <Breadcrumb />

      <div className="company-content">
        <h1>Privacy Policy</h1>
        <p>
          We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information.
        </p>
        <h2>Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us.
          This may include your name, email address, shipping address, and payment information.
        </p>
        <h2>How We Use Your Information</h2>
        <p>
          We use the information we collect to process orders, provide customer service, send marketing communications
          (with your consent), and improve our services.
        </p>
        <h2>Information Sharing</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personal information to third parties without your consent,
          except as described in this policy.
        </p>
        <p>
          For questions about this Privacy Policy, please contact us.
        </p>
      </div>
    </div>
  );
}

export default Privacy;