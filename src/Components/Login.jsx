import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Config/Config';
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({ user_id: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

 const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setErrorMessage('');

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', formData.user_id) // ✅ CORRECT COLUMN
      .maybeSingle();                   // ✅ NO 406

    if (!data) {
      throw new Error('User not found');
    }

    if (data.password !== formData.password) {
      throw new Error('Wrong password');
    }

    localStorage.setItem('user', JSON.stringify(data));
    navigate('/dashboard');
  } catch (err) {
    setErrorMessage('❌ Invalid User ID or Password');
    document.getElementById('login-form')?.classList.add('animate-shake');
    setTimeout(() => {
      document.getElementById('login-form')?.classList.remove('animate-shake');
    }, 500);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3c72] via-[#3b5998] to-[#2a5298] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl px-8 py-10 sm:px-10 sm:py-12 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#fdc800]/10 rounded-full filter blur-xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#5974a8]/10 rounded-full filter blur-xl"></div>

          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-[#fdc800]/20 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#fdc800]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white text-center mb-2">Welcome Back</h2>
            <p className="text-white/80 text-center mb-8">Login to your COSMO University account</p>

            <form onSubmit={handleLogin} id="login-form" className="flex flex-col gap-6">
              <div>
                <label htmlFor="user_id" className="block text-white/90 mb-2 text-sm font-medium">University ID</label>
                <div className="relative">
                  <input
                    type="text"
                    id="user_id"
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#fdc800]/50 border border-white/20 transition-all"
                    placeholder="e.g. CUS2023XYZ"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-white/90 mb-2 text-sm font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#fdc800]/50 border border-white/20 transition-all pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/50 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#fdc800] focus:ring-[#fdc800] border-white/30 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-white/80">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#forgot-password" className="font-medium text-[#fdc800] hover:text-[#f7a600] transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 bg-red-500/20 text-red-300 text-sm py-2 px-4 rounded-lg border border-red-500/30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errorMessage}
                </motion.div>
              )}

              <motion.button
                type="submit"
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${isLoading ? 'bg-[#fdc800]/70' : 'bg-[#fdc800] hover:bg-[#f7a600]'} text-[#1e2a47] flex items-center justify-center gap-2`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  'Login'
                )}
              </motion.button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-white/50 text-sm">
                  Need help?
                </span>
              </div>
            </div>

            <p className="text-white/70 text-center text-sm">
              Don't have an account?{' '}
              <a href="#contact-admin" className="font-medium text-[#fdc800] hover:text-[#f7a600] transition-colors">
                Contact Admin
              </a>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Add this to your global CSS */}
      <style jsx>{`
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
};

export default Login;