import { useState } from 'react'
import axios from 'axios'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('token'))
  })

  const login = async (correo, password) => {
  try {
    const response = await axios.post('http://localhost:8000/api/login/', {
      correo,
      password,
    });

    const { token, usuario } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario)); 
    setIsAuthenticated(true);
    return { success: true };
  } catch (error) {
    setIsAuthenticated(false);
    return {
      success: false,
      error: error.response?.data?.detail || 'Error de autenticación',
    };
  }
};


  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('token')
  }

  return { isAuthenticated, login, logout }
}