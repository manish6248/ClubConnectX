import { Link } from 'react-router-dom';

const Navbar = ({ currentUser, logout }) => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold text-gray-900">
          <img src="Frontend_ClubConnect/src/assets/club connect.png" alt="" />
          </Link>
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <button
                onClick={logout}
                className="px-4 py-2 text-gray-700 hover:text-indigo-600"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-indigo-600"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;