import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Breadcrumb.css';

function Breadcrumb() {
    const navigate = useNavigate();
    const location = useLocation();

    // Generate breadcrumbs based on current path
    const getBreadcrumbs = () => {
        const path = location.pathname;
        const crumbs = [{ label: 'Home', path: '/' }];

        if (path === '/') return crumbs;

        const pathSegments = path.split('/').filter(Boolean);
        
        // Define page labels
        const pageLabels = {
            store: 'Store',
            about: 'About',
            contact: 'Contact',
            search: 'Search',
            privacy: 'Privacy Policy',
            terms: 'Terms of Service',
            'collections-page': 'Collections',
            'new-arrivals': 'New Arrivals',
            compare: 'Compare',
            faqs: 'FAQs',
            company: 'Company',
            news: 'News & Updates',
            collections: 'Collections',
            classic: 'Classic Series',
            explorer: 'Explorer Series',
            signature: 'Signature Series',
            heritage: 'Heritage Edition',
            luxury: 'Luxury Collection',
            limited: 'Limited Edition',
            product: 'Product Details',
            register: 'Register',
            login: 'Login',
            cart: 'Shopping Cart',
            profile: 'Profile',
            admin: 'Admin Panel',
            'our-story': 'Our Story',
            sustainability: 'Sustainability',
            careers: 'Careers',
            'service-centers': 'Service Centers'
        };

        pathSegments.forEach((segment, index) => {
            const label = pageLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
            const currentPath = '/' + pathSegments.slice(0, index + 1).join('/');
            crumbs.push({ label, path: currentPath });
        });

        return crumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <div className="breadcrumbs">
            {breadcrumbs.map((crumb, index) => (
                <span key={index}>
                    {index > 0 && <span className="breadcrumb-separator"> &gt; </span>}
                    {index === breadcrumbs.length - 1 ? (
                        <span className="breadcrumb-current">{crumb.label}</span>
                    ) : (
                        <button 
                            className="breadcrumb-link" 
                            onClick={() => navigate(crumb.path)}
                        >
                            {crumb.label}
                        </button>
                    )}
                </span>
            ))}
        </div>
    );
}

export default Breadcrumb;
