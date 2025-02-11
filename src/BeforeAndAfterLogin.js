import { useContext } from "react";
import { appContext } from "./App";
import Login from "./Login";
import ThirdPage from "./ThirdPage";
import ThirdPage2 from "./ThirdPage2";

function BeforeAndAfterLogin() {
  const { isLogin, setIsLogin, role } = useContext(appContext);

  const handleLogout = () => {
    setIsLogin("notlogin");
  };

  return (
    <div>
      {isLogin === "login" ? (
        role === "faculty" ? (
          <ThirdPage2 onLogout={handleLogout} />  
        ) : (
          <ThirdPage onLogout={handleLogout} />    
        )
      ) : (
        <Login />
      )}
    </div>
  );
}

export default BeforeAndAfterLogin;