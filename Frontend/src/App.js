import {  useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { removeLocalStorage } from "./utils/remove_localstorage";
//Componentes Fijos
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
//Componentes dinamicos
import Login from "./components/login/Login";
import Inicio from "./components/container/inicio/Inicio";
import Error404 from "./components/container/error404/Error404";

export default function App() {
 
  const auth =  getAccessToken();
 // Capturamos el valor antes de eliminar el localStorage
 const sessionExpiredValue = localStorage.getItem("SESSION_EXPIRED");
 const [sessionExpired, setSessionExpired] = useState(sessionExpiredValue);
  if (!auth){
    
    removeLocalStorage();
    
    return (
      <Router>
      <Routes>
        <Route  path="/" element={<Login sessionExpired={sessionExpired}/>}/>
        <Route  path="*" element={<Error404/>}/>
      </Routes>
    </Router>
     
    )
  }


  return (

    <Router>
      <div className="siderbar-mini">
          <div className="wrapper">
            <Header/>
              <Routes>
                <Route  path="/" element={<Inicio/>}/>
                <Route  path="*" element={<Error404/>}/>

              </Routes>
          
            <Footer/>
        
          </div>
      
      </div>
    </Router>
  );
}

/*=============================================
Función para tener acceso al token
=============================================*/

const getAccessToken = ()=>{

  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  const email = localStorage.getItem("EMAIL");
  if(!accessToken || accessToken === null ||
     !email || email === null
    
    ){
    
    return false;

  }
  try {
    const metaToken = jwtDecode(accessToken); 
    if(!metaToken.data){

      return false;
   }
    if(tokenExpira( metaToken) || !metaToken.data.userId  || metaToken.data.email !== email){
  
      return false;
   
    }else{
    
      return true;
   
    }
  
  } catch (error) {
    
    return false;
  }
 
 

}

/*=============================================
Función para verificar fecha de expiración del token
=============================================*/

const tokenExpira = ( metaToken)=>{

const { exp } = metaToken;

const now = (Date.now())/1000;

return exp < now;

}