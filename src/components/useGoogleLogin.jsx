import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import axios from 'axios';

export const useGoogleAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Código recebido:', codeResponse);
        
        // TODO: Implementar chamada à sua API backend
        const tokens = await axios.post('/api/auth/google', {
          code: codeResponse.code,
        });

        console.log('Tokens recebidos:', tokens);
        setUser(tokens.data.user);
        
      } catch (err) {
        console.error('Erro no login Google:', err);
        setError('Falha na autenticação com Google');
      } finally {
        setLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error('Erro no login Google:', errorResponse);
      setError('Falha na autenticação com Google');
      setLoading(false);
    },
  });

  const logout = () => {
    setUser(null);
    // TODO: Implementar logout na API
  };

  return {
    user,
    loading,
    error,
    googleLogin,
    logout
  };
};