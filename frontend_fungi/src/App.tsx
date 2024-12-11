import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { AppRouter } from "./components/shared/layout/AppRouter/AppRouter.tsx";
import { Layout } from "./components/shared/layout/Layout/Layout.tsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function App() {
    return (
        <BrowserRouter future={{ 
            v7_startTransition: true,
            v7_relativeSplatPath: true 
        }}>
            <QueryClientProvider client={queryClient}>
                <Layout>
                    <AppRouter />
                </Layout>
            </QueryClientProvider>
        </BrowserRouter>
    );
}

export default App
