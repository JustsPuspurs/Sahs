import './bootstrap';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

createInertiaApp({
    resolve: (name) => {
        console.log("Resolving component:", name); // Log the name to debug which component is being resolved
        return resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx', { eager: true })
        );
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
