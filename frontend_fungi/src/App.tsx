import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import {MainPage} from "./pages/MainPage/MainPage.tsx";
import "./components/Header/header.tsx";
import {Header} from "./components/Header/header.tsx";
import { Footer } from "./components/Footer/footer.tsx";
import PublicationsSec from "./pages/Publications/PublicationsSec/PublicationsSec.tsx";
import Publications from "./pages/Publications/index.tsx";
import AboutUs from "./pages/AboutUs/AboutUs.tsx";


export function App() {

  return (
      <div className='wrapper'>
          <BrowserRouter>
              <Header />
              <Routes>
                  <Route path="/" element={<Navigate to="/mainpage"/>}/>
                  <Route path="/mainpage" element={
                      <MainPage />
                  } />
                  <Route path="/about" element={
                      <AboutUs/>
                  }/>
                  <Route path="/publications" element={
                      <Publications />
                  } />
                  <Route path="/publications-sec" element={
                      <PublicationsSec />
                  } />
                  <Route path="*" element={<Navigate to="/mainpage"/>}/>
              </Routes>
              <Footer />
          </BrowserRouter>
      </div>
  )
}

export default App
