import { AppProviders } from '@app/providers';
import { AppRouter } from '@app/router';
import '@app/styles/global.css';

export function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
