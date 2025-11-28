import React, { useState, useEffect } from 'react';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// --- Firebase and Environment Setup ---
const appId = typeof __app_id !== 'undefined' ? __app_id : 'ecommerce-app-login';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Initialize Firebase App instance
const firebaseApp = firebaseConfig ? initializeApp(firebaseConfig) : null;

const LoginSignupApp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authStatus, setAuthStatus] = useState('Initializing...');
  const [userId, setUserId] = useState(null);

  // Initialize Auth and Database
  useEffect(() => {
    if (!firebaseApp) {
      setAuthStatus('Firebase not configured. Running in UI demo mode.');
      return;
    }

    const auth = getAuth(firebaseApp);
    
    // 1. Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setAuthStatus(`Successfully signed in as User ID: ${user.uid.substring(0, 8)}...`);
      } else {
        setUserId(null);
        setAuthStatus('Ready to sign in or sign up.');
        // If the user logs out, they might be logged out anonymously
        if (auth.currentUser) {
            setAuthStatus('Signed out. Ready to sign in.');
        }
      }
    });

    // 2. Initial Authentication with custom token or anonymously
    const authenticate = async () => {
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Firebase Auth Error during initialization:", error);
        setAuthStatus(`Authentication failed: ${error.message}`);
      }
    };
    
    authenticate();

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []); // Run only once on mount

  // Mock function to simulate login/signup submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firebaseApp) {
        setAuthStatus(`UI Demo Mode: ${isLogin ? 'Logged in' : 'Signed up'} with email: ${email}`);
        console.log(`Submitting form: ${isLogin ? 'Login' : 'Signup'} with email: ${email}, password: ${password}`);
        return;
    }

    // In a real app, you would use:
    // 1. signInWithEmailAndPassword(auth, email, password) for login
    // 2. createUserWithEmailAndPassword(auth, email, password) for signup
    
    // For this example, we'll stick to the provided Canvas auth mechanism.
    setAuthStatus(`Action attempted: ${isLogin ? 'Login' : 'Sign Up'}. Firebase is active but real email/password auth is disabled in this example.`);
  };

  const formTitle = isLogin ? 'Welcome Back!' : 'Create Account';
  const formSubtitle = isLogin ? 'Log in to continue your shopping journey.' : 'Join us and start your best shopping experience.';
  const buttonText = isLogin ? 'Sign In Securely' : 'Create Account';

  const AuthInfoBar = ({ status, userId }) => (
    <div className="bg-white/10 text-white p-3 rounded-t-xl text-xs font-mono border-b border-white/20 backdrop-blur-sm">
        <p>App ID: <span className="text-yellow-300">{appId}</span></p>
        <p className="mt-1">Status: <span className="text-green-300">{status}</span></p>
        {userId && <p className="mt-1">User ID: <span className="text-blue-300">{userId}</span></p>}
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob absolute top-10 left-10"></div>
        <div className="w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob absolute bottom-10 right-10 animation-delay-2000"></div>
        <div className="w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob absolute bottom-1/4 left-1/4 animation-delay-4000"></div>
      </div>

      {/* Login Card */}
      <div className="z-10 w-full max-w-md">
        <div className="bg-gray-800/90 rounded-xl shadow-2xl overflow-hidden border border-gray-700 backdrop-blur-sm">
          
          <AuthInfoBar status={authStatus} userId={userId} />

          <div className="p-8 md:p-10">
            <h1 className="text-3xl font-extrabold text-white text-center mb-2">{formTitle}</h1>
            <p className="text-gray-400 text-center mb-8">{formSubtitle}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password Input */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                  placeholder="••••••••"
                />
              </div>

              {/* Forgot Password / Remember Me (Login only) */}
              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-500 border-gray-600 rounded focus:ring-indigo-500 bg-gray-700"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition duration-150 ease-in-out">
                    Forgot password?
                  </a>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition duration-200 ease-in-out transform hover:scale-[1.01]"
              >
                {buttonText}
              </button>
            </form>

            {/* Switch Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-medium text-indigo-400 hover:text-indigo-300 transition duration-150 ease-in-out focus:outline-none"
                >
                  {isLogin ? 'Sign Up' : 'Log In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tailwind Blob Animation Styles (Internal CSS for Single File) */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default loging;