import './bootstrap';
import { createInertiaApp } from '@inertiajs/inertia-react';
import { createRoot } from 'react-dom/client';

createInertiaApp({
    // Use dynamic import to resolve page components
    resolve: name => import(`./Pages/${name}.jsx`).then(module => module.default),
    setup({ el, App, props }) {
        // Mount the application
        createRoot(el).render(<App {...props} />);
    },
});
