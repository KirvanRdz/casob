import {rutaAPI} from '../config/Config';
const token = localStorage.getItem("ACCESS_TOKEN");

export const  loginUser = async (body)=> { 
    const url = `${rutaAPI}/api/users/login`;

	const params = {

		method: "POST",
        body:   JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
		}

	}

	return fetch(url, params).then(response=>{

		return response.json();

	}).then(result=>{
        
		return result;

	}).catch(err=>{

		return {status:500,msg:'server error'};

	})
}; 


export const  getAllInvoices = async (page,limit)=> { 
    const url = `${rutaAPI}/api/invoices?page=${page}&limit=${limit}`;


	const params = {

		method: "GET",
		headers: {
			"Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
		}

	}

	return fetch(url, params).then(response=>{

		return response.json();

	}).then(result=>{
        
		return result;

	}).catch(err=>{

		return {status:500,msg:'server error'};

	})
}; 


export const  updateDataInvoice = async (body,id)=> { 
    const url = `${rutaAPI}/api/invoices/${id}`;


	const params = {

		method: "PUT",
        body:   JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
		}

	}

	return fetch(url, params).then(response=>{

		return response.json();

	}).then(result=>{
        
		return result;

	}).catch(err=>{

		return {status:500,msg:'server error'};

	})
}; 

export const  updateFileInvoice = async (formData,id)=> { 
    const url = `${rutaAPI}/api/invoices/upload/${id}`;


	const params = {

		method: "PUT",
        body:   formData,
		headers: {
            "Authorization": `Bearer ${token}`,
		}

	}

	return fetch(url, params).then(response=>{

		return response.json();

	}).then(result=>{
        
		return result;

	}).catch(err=>{

		return {status:500,msg:'server error'};

	})
}; 


export const  createInvoice = async (formData)=> { 
    const url = `${rutaAPI}/api/invoices/upload`;


	const params = {

		method: "POST",
        body:   formData,
		headers: {
            "Authorization": `Bearer ${token}`,
		}

	}

	return fetch(url, params).then(response=>{

		return response.json();

	}).then(result=>{
        
		return result;

	}).catch(err=>{

		return {status:500,msg:'server error'};

	})
}; 

export const  validateInvoice = async (body)=> { 
    const url = `${rutaAPI}/api/invoices/validate`;


	const params = {

		method: "POST",
        body:   JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
		}

	}

	return fetch(url, params).then(response=>{

		return response.json();

	}).then(result=>{
        
		return result;

	}).catch(err=>{

		return {status:500,msg:'server error'};

	})
}; 

export const  deleteInvoiceById = async (id)=> { 
    const url = `${rutaAPI}/api/invoices/${id}`;


	const params = {

		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
		}

	}

	return fetch(url, params).then(response=>{

		return response.json();

	}).then(result=>{
        
		return result;

	}).catch(err=>{

		return {status:500,msg:'server error'};

	})
}; 