const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
export const getUsers = async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if(!response.ok){
       throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json()

    return data.data
}