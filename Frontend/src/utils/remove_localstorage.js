export const  removeLocalStorage =async  ()=> { 
    localStorage.removeItem("ACCESS_TOKEN");
	localStorage.removeItem("SESSION_EXPIRED");
	localStorage.removeItem("EMAIL");
}; 
