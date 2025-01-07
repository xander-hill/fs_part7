import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import { initializeUser, loginUser, logoutUser } from "./reducers/userReducer";
import { setNotification } from './reducers/notificationReducer'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs, createBlog, updateBlog, byebyeBlog } from "./reducers/blogReducer";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch()

  const blogFormRef = useRef();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = {
        username,
        password
      }
      dispatch(loginUser(user))
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(setNotification("Wrong credentials", 5))
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    dispatch(logoutUser())
  };

  useEffect(() => {
    dispatch(initializeBlogs())
  }, []);

  useEffect(() => {
    dispatch(initializeUser())
  }, []);

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    dispatch(createBlog(blogObject))
    dispatch(setNotification(`Added ${blogObject.title} by ${blogObject.author}`, 5))
  };

  const likeBlog = (id) => {
    dispatch(updateBlog(id))
  };

  const deleteBlog = (id) => {
    if (window.confirm('Remove blog?')) {
      dispatch(byebyeBlog(id))
    }
  };

  const loggedIn = useSelector(state => state.user)

  const sortedBlogs = useSelector(state => [...state.blogs].sort((a, b) => b.likes - a.likes))

  if (loggedIn === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              data-testid="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              data-testid="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div>
        {loggedIn.name} is logged in
        <button type="submit" onClick={handleLogout}>
          logout
        </button>
      </div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <div>
        {sortedBlogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            likeBlog={() => likeBlog(blog.id)}
            removeBlog={() => deleteBlog(blog.id)}
            loggedIn={loggedIn}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
