import { createInertiaApp } from '@inertiajs/react';
import ReactDOM from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

createInertiaApp({
  resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
  setup({ el, App, props }) {
    ReactDOM.createRoot(el).render(<App {...props} />);
  },
});
