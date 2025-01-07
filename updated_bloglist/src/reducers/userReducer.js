import { createSlice } from "@reduxjs/toolkit";
import loginService from '../services/login'
import blogService from '../services/blogs'

const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        removeUser(state, action) {
            return null
        },
        addUser(state,action) {
            return action.payload
        },
        // changeUser(state, action) {
        //     return {
        //         ...state,

        //     }
        // }
    }
})

export const { removeUser, addUser, changeUser } = userSlice.actions

export const loginUser = user => {
    return async dispatch => {
        const loggedInUser = await loginService.login(user)
        window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(loggedInUser));
        blogService.setToken(loggedInUser.token);
        dispatch(addUser(loggedInUser))
    }
}

export const logoutUser = () => {
    return async dispatch => {
        window.localStorage.removeItem("loggedBlogAppUser");
        dispatch(removeUser())
    }
}

export const initializeUser = () => {
    return async dispatch => {
        const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser")
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            dispatch(addUser(user))
            blogService.setToken(user.token)
        }
    }
}

export default userSlice.reducer