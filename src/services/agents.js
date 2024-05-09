export const listAgents = async (token) => {
    return await fetch(`${process.env.REACT_APP_API_URL}/agents`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
};

export const addAgent = async (body, token) => {
    return await fetch(`${process.env.REACT_APP_API_URL}/agents`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });
};

export const deleteAgent = async (params, token) => {
    return await fetch(`${process.env.REACT_APP_API_URL}/agents?${new URLSearchParams(params)}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
}
