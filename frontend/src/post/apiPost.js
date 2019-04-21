export const createPost = (userId, token, post) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/new/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: post
    })
        .then(res => res.json())
        .catch(err => console.log(err))
}

export const editPost = (postId, token, post) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: post
    })
        .then(res => res.json())
        .catch(err => console.log(err))
}

export const getAllPost = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/post`)
        .then(res => res.json())
        .catch(err => console.log(err))
}

export const getPost = (postId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
    })
        .then(res => res.json())
        .catch(err => console.log(err))
}

export const getPostByUser = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/by/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
    })
        .then(res => res.json())
        .catch(err => console.log(err))
}

export const removePost = (postId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .catch(err => console.log(err))
}