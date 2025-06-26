// Utility functions for cookie management
export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

export const removeCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const setCookie = (name: string, value: string, days: number = 30) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    // Remove secure flag if not on HTTPS, and add domain for broader accessibility
    const isSecure = window.location.protocol === 'https:';
    const cookieString = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/${isSecure ? ';secure' : ''};samesite=lax`;
    
    document.cookie = cookieString;
    console.log('Setting cookie:', cookieString);
    
    // Verify the cookie was set
    const cookieValue = getCookie(name);
    console.log('Cookie verification - set value:', value, 'retrieved value:', cookieValue);
  };