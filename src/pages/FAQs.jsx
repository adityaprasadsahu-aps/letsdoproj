import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb.jsx';
import '../styles/CompanyPages.css';

function FAQs() {
  const navigate = useNavigate();

  const faqs = [
    {
      question: 'How do I care for my watch?',
      answer: 'Keep your watch away from water, extreme temperatures, and magnetic fields. Clean with a soft cloth and have it serviced regularly by a professional.'
    },
    {
      question: 'What is the warranty on your watches?',
      answer: 'All our watches come with a 2-year international warranty covering manufacturing defects. Extended warranties may be available.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Shipping typically takes 3-7 business days within the country and 7-14 days internationally. Express shipping options are available.'
    },
    {
      question: 'Can I return or exchange my watch?',
      answer: 'Yes, we offer a 30-day return policy for unworn watches in original condition. Exchanges are available within 14 days.'
    },
    {
      question: 'Are your watches waterproof?',
      answer: 'Most of our watches are water-resistant to varying degrees. Check the product specifications for exact water resistance ratings.'
    },
    {
      question: 'How do I know which watch size fits me?',
      answer: 'Measure your wrist circumference and refer to our size guide. Most men\'s watches fit wrists 6.5-8 inches, women\'s 5.5-7 inches.'
    }
  ];

  return (
    <div className="company-page">
      <Breadcrumb />

      <div className="company-content">
        <h1>Frequently Asked Questions</h1>
        <div style={{ marginTop: '30px' }}>
          {faqs.map((faq, index) => (
            <div key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
              <h3 style={{ color: '#e45000', marginBottom: '10px' }}>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: '30px' }}>
          Can't find the answer you're looking for? <a href="#" onClick={(e) => {e.preventDefault(); navigate('/contact');}} style={{color: '#e45000'}}>Contact us</a> for assistance.
        </p>
      </div>
    </div>
  );
}

export default FAQs;