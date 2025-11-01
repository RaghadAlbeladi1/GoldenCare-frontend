import sendRequest from "./sendRequest";
const baseURL = "/users/";

export async function signup(formData) {
    try {
        const newUserData = await sendRequest(`${baseURL}signup/`, "POST", formData);
        localStorage.setItem("accessToken", newUserData.access)
        localStorage.setItem("refreshToken", newUserData.refresh)
        return newUserData.user
    } catch (err) {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        return null
    }
}

export async function login(formData) {
    try {
        const loggedInUser = await sendRequest(`${baseURL}login/`, "POST", formData);
        
        if (loggedInUser.access && loggedInUser.refresh) {
            localStorage.setItem("accessToken", loggedInUser.access);
            localStorage.setItem("refreshToken", loggedInUser.refresh);
        }
        
        return loggedInUser.user
    } catch (error) {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        return null
    }
}

export async function getUser() {
    try {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            const response = await sendRequest(`${baseURL}token/refresh/`)
            localStorage.setItem('accessToken', response.access);
            return response.user
        }
        return null;
    } catch (error) {
        return null;
    }
}

export function logout() {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
}
