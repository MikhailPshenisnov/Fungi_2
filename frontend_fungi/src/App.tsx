import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./components/Header/header.tsx";
import { Header } from "./components/Header/header.tsx";
import { Footer } from "./components/Footer/footer.tsx";
import { AppRouter } from "./components/AppRouter/AppRouter";

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
