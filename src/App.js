import { createContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BeforeAndAfterLogin from "./BeforeAndAfterLogin";
import Certificate from "./Certificate";
export const appContext = createContext();

function App() {
  const [isLogin, setIsLogin] = useState("notlogin");
  return (
    <appContext.Provider
      value={{
        isLogin,
        setIsLogin,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BeforeAndAfterLogin />} />
          <Route path="/certificate" element={<Certificate />} />
        </Routes>
      </BrowserRouter>
    </appContext.Provider>
  );
}

export default App;
