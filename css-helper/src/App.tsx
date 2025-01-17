import { useState, useEffect } from 'react';

const GitHubLogin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const checkGitHubAuth = async () => {
      try {
        // Check if there's an active GitHub session
        const response = await fetch('https://api.github.com/user', {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            // The browser will automatically include the session cookie
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to check GitHub authentication:', error);
        setIsAuthenticated(false);
        setUserData(null);
      }
    };

    checkGitHubAuth();

    // Set up an interval to periodically check auth status
    const authCheckInterval = setInterval(checkGitHubAuth, 5 * 60 * 1000); // Check every 5 minutes

    // Listen for visibility changes to recheck auth when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkGitHubAuth();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      clearInterval(authCheckInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleLogin = () => {
    window.location.href = 'https://github.com/login';
  };

  const handleLogout = async () => {
    try {
      // Send logout request to GitHub
      await fetch('https://github.com/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      setIsAuthenticated(false);
      setUserData(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {!isAuthenticated ? (
        <button
          onClick={handleLogin}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700"
        >
          Sign in with GitHub
        </button>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <p className="text-lg font-medium">Welcome, {userData?.login}!</p>
            <p className="text-sm text-gray-500">
              {userData?.public_repos} public repositories
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default GitHubLogin;