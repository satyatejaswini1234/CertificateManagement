import { useContext } from "react";
import { appContext } from "./App";
import Login from "./Login";
import ThirdPage from "./ThirdPage";

function BeforeAndAfterLogin() {
  const { isLogin, setIsLogin } = useContext(appContext);

  const handleLogout = () => {
    setIsLogin("notlogin");
  };

  return (
    <div>
      {isLogin === "login" ? <ThirdPage onLogout={handleLogout} /> : <Login />}
    </div>
  );
}

export default BeforeAndAfterLogin;
