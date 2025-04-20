import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthForm({ type }) {
  const [formData, setFormData] = useState({ username: '', password: '' }); // Adjusted to match image
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === 'login') {
        await login(formData.username, formData.password);
      } else {
        await register(formData.username, formData.password); // Simplified for login image match
      }
      navigate('/all-events');
      // navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header to match image */}
      

      {/* Main Content with Login Form */}
      <div className="flex items-center justify-center flex-1 p-4">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              SIGN IN TO YOUR ACCOUNT
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="username" className="sr-only">
                  User Name
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="user name"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="passwords" // Match image (plural as shown)
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              {type === 'register' && (
                <>
                  <div>
                    <label htmlFor="name" className="sr-only">Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="role" className="sr-only">Role</label>
                    <select
                      id="role"
                      name="role"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="">Select Role</option>
                      <option value="student">Student</option>
                      <option value="club-admin">Club Admin</option>
                      <option value="sponsor">Sponsor</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                {type === 'login' ? 'Sign in' : 'Register'}
              </button>
            </div>
            <div className="text-center text-sm">
              {type === 'login' ? (
                <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Don't have an account? Register
                </Link>
              ) : (
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Already have an account? Login
                </Link>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}