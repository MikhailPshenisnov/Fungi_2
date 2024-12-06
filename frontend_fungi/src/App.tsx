import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { AppRouter } from "./components/shared/layout/AppRouter/AppRouter.tsx";
import { Layout } from "./components/shared/layout/Layout/Layout.tsx";

export function App() {
    return (
        <BrowserRouter>
            <Layout>
                <AppRouter />
            </Layout>
        </BrowserRouter>
    );
}

export default App
