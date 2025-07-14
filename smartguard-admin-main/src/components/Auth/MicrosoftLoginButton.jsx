import { useMsal } from "@azure/msal-react";
import { useState } from "react";
import { loginRequest } from "../../MSALConfig.js";

const MicrosoftLoginButton = () => {
  const { instance } = useMsal();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await instance.loginRedirect({
        ...loginRequest,
        prompt: 'select_account'
      });
    } catch (e) {
      console.error('Login failed:', e);
      setLoading(false);
    }
  };

  return (
    <button 
      className="btn btn-primary w-100 mb-3" 
      onClick={handleLogin} 
      disabled={loading}
    >
      {loading ? "Signing in..." : "Sign in with Microsoft"}
    </button>
  );
};

export default MicrosoftLoginButton;
