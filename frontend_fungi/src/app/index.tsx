import './styles/index.css';
import { AppRouter } from './router/index.tsx';

import { Providers } from './providers/index.tsx';
import { Layout } from './layout/index.tsx';

export function App() {
    return (
        <Providers>
            <Layout>
                <AppRouter />
            </Layout>
        </Providers>
    );
}

export default App;
