import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./components/shared/layout/Header/header.tsx";
import { Header } from "./components/shared/layout/Header/header.tsx";
import { Footer } from "./components/shared/layout/Footer/footer.tsx";
import { AppRouter } from "./components/shared/layout/AppRouter/AppRouter.tsx";

export function App() {

  return (
      <div className='wrapper'>
          <BrowserRouter>
              <Header />
              <AppRouter />
              <Footer />
          </BrowserRouter>
      </div>
  )
}

export default App
