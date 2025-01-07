import { createSlice } from "@reduxjs/toolkit";
import blogService from '../services/blogs'

const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        changeBlog(state, action) {
            const id = action.payload.id
            return state.map(blog => blog.id !== id ? blog : action.payload)
        },
        appendBlog(state, action) {
            state.push(action.payload)
        },
        setBlogs(state, action) {
            return action.payload
        },
        removeBlog(state, action) {
            return state.filter(blog => blog.id !== action.payload)
        }
    }
})

export const { appendBlog, setBlogs, changeBlog, removeBlog } = blogSlice.actions;


export const initializeBlogs = () => {
    return async dispatch => {
        const blogs = await blogService.getAll()
        dispatch(setBlogs(blogs))
    }
}

export const createBlog = blog => {
    return async dispatch => {
        const newBlog = await blogService.create(blog)
        dispatch(appendBlog(newBlog))
    }
}

export const updateBlog = id => {
    return async dispatch => {
        const blogs = await blogService.getAll()
        const blogToChange = blogs.find(blog => blog.id === id)
        const changedBlog = 
        {
            ...blogToChange,
            likes: blogToChange.likes + 1
        }
        const updatedBlog = await blogService.update(id, changedBlog)
        dispatch(changeBlog(updatedBlog))
    }
}

export const byebyeBlog = id => {
    return async dispatch => {
        await blogService.remove(id)
        dispatch(removeBlog(id))
    }
}

export default blogSlice.reducer