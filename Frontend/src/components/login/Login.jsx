import React,{useState,useEffect} from "react";
import $ from "jquery";
import { loginUser} from '../../api/api';
export default function Login({ sessionExpired }){
   /*--------------------------------------
   HOOK PARA INICIAR SESION
   ----------------------------------------*/
   const [admin,startSession]=useState({
        email:"",
        password:""
   });

   const [message, setMessage] = useState('');

  useEffect(() => {
    if (sessionExpired) {
      setMessage('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    }
  }, [sessionExpired]);

   /*----------------------------------------------------
   CAPTURAMOS CAMBIOS DEL FORMULARIO PARA EJECUTAR LA FUNCION DEL HOOK
   -----------------------------------------------------*/
   const formChange= e =>{
        startSession({
            ...admin,
            [e.target.name]:e.target.value,
            
        });
   };

    /*----------------------------------------------------
   EJECUTAMOS EL SUBMIT
   -----------------------------------------------------*/
   const submitLogin= async e =>{
        e.preventDefault();
        $(".alert").remove();
        const result = await loginUser(admin);
	
		if(result.status === 200){
          
            localStorage.setItem("ACCESS_TOKEN", result.token);
			localStorage.setItem("EMAIL", result.email);
            localStorage.setItem("SESSION_EXPIRED", false);
            
			window.location.href = "/";
			

		}else if(result.status === 400){

            $("#login-form").after(`<div class="alert alert-warning">${result.msg}</div>`)
			
		}else if(result.status === 500){

            $("#login-form").after(`<div class="alert alert-danger">${result.msg}</div>`)
                
        }
    }
    return (
        <div className="body-login login-container">
        <div className="login-card">
            <p className="login-title">Inicia sesión</p>
            {message && <div className="alert">{message}</div>}
            <form id="login-form" onChange={formChange} onSubmit={submitLogin}>
                <div className="input-group">
                    <input type="email" className="form-input" placeholder="Email" name="email" required />
                    <span className="input-icon fas fa-envelope"></span>
                </div>
                <div className="input-group">
                    <input type="password" className="form-input" placeholder="Password" name="password" required />
                    <span className="input-icon fas fa-lock"></span>
                </div>
                <button type="submit" className="login-button">Iniciar sesión</button>
            </form>
        </div>
    </div>
    )
}