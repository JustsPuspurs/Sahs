// playwright/index.tsx
import { beforeMount } from '@playwright/experimental-ct-react/hooks';

beforeMount(({ App, props }) => {
  // Simply return the App component.
  return <App {...props} />;
});