import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
import blogReducer from './reducers/blogReducer'
import userReducer from './reducers/userReducer'

const store = configureStore({
    reducer: {
        user: userReducer,
        notification: notificationReducer,
        blogs: blogReducer
    }
})

export default store