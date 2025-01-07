import { configureStore } from '@reduxjs/toolkit'
// import anecdoteReducer, { setAnecdotes } from './src/reducers/anecdoteReducer'
// import filterReducer from './src/reducers/filterReducer'
import notificationReducer from './reducers/notificationReducer'
// import anecdoteService from './src/services/anecdotes'

const store = configureStore({
    reducer: {
        // anecdotes: anecdoteReducer,
        // filter: filterReducer,
        notification: notificationReducer,
    }
})

// anecdoteService.getAll().then(anecdotes =>
//     store.dispatch(setAnecdotes(anecdotes))
// )

export default store