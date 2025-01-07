import { createSlice, current } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        addNotification(state, action) {
            return action.payload
        },
        removeNotification() {
            return null
        }
    }
})

export const { addNotification, removeNotification } = notificationSlice.actions

export const setNotification = (message, time) => {
    return async dispatch => {
        dispatch(addNotification(message))
        setTimeout(() => {
        dispatch(removeNotification())
        }, time * 1000)
    }
}

export default notificationSlice.reducer