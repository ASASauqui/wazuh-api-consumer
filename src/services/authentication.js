export const login = async (body) => {
    return await fetch(`${process.env.REACT_APP_API_URL}/security/user/authenticate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
};

export const logout = async (token) => {
    return await fetch(`${process.env.REACT_APP_API_URL}/security/user/authenticate`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
};
