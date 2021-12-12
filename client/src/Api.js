import axios from 'axios'

const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://viceroy-michaelcissokho.herokuapp.com' : 'http://localhost:5000';

class Api {

    static token

    static async request(endpoint, data = {}, method = 'get') {
        console.log("API CALL:", endpoint, data, method);

        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
        const params = (method === 'get') ? data : {};

        try {
            return (await axios({ url, method, data, params, headers }))
        } catch (err) {
            console.error("API error:", err.response);
            let message = err.response.data;
            throw Array.isArray(message) ? message : [message]
        }

    }

    //signup a new user with form data and save username and token in localStorage
    static async register(username, email, password) {
        const response = await this.request('auth/register', { username, email, password }, 'post')
        localStorage.setItem('id', response.id)
        localStorage.setItem('username', response.username)
        localStorage.setItem('isAdmin', response.isAdmin)
        localStorage.setItem('token', response.token)

        return response
    }

    //login user with form data and save username and token in localStorage
    static async login(username, password) {
        try {
            const response = await this.request('auth/login', { username, password }, 'post')
            localStorage.setItem('id', response.id)
            localStorage.setItem('username', response.username)
            localStorage.setItem('isAdmin', response.isAdmin)
            localStorage.setItem('token', response.token)
            return response
        } catch (err) {
            alert(err[0].error.message)
        }
    }

    //update a user
    static async updateUser(password, firstname, lastname, email) {
        const response = await this.request(
            `users/${localStorage.getItem('username')}/update`,
            { password, firstname, lastname, email },
            'patch'
        )

        return response
    }
}

export { Api }