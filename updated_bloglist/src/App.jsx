import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import { setNotification } from './reducers/notificationReducer'
import { useDispatch } from 'react-redux'

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  // const [message, setMessage] = useState('')
  const dispatch = useDispatch()

  const blogFormRef = useRef();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(setNotification("Wrong credentials", 5))
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();

    window.localStorage.removeItem("loggedBlogAppUser");
    setUser(null);
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();

    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));
      // setMessage(`Added ${returnedBlog.title} by ${returnedBlog.author}`);
      // setTimeout(() => {
      //   setMessage(null);
      // }, 5000);
      dispatch(setNotification(`Added ${returnedBlog.title} by ${returnedBlog.author}`, 5))
    });
  };

  const likeBlog = (id) => {
    const blog = blogs.find((blog) => blog.id === id);
    const changedBlog = { ...blog, likes: blog.likes + 1 };

    blogService
      .update(id, changedBlog)
      .then((returnedBlog) => {
        setBlogs(blogs.map((blog) => (blog.id === id ? returnedBlog : blog)));
      })
      .catch((error) => {
        // setMessage(`Note '${blog.title}' was already removed from server`);
        // setTimeout(() => {
        //   setMessage(null);
        // }, 5000);
        dispatch(setNotification(`Note '${blog.title}' was already removed from server`, 5))
        setBlogs(blogs.filter((blog) => blog.id !== id));
      });
  };

  const deleteBlog = (id) => {
    const blog = blogs.find((blog) => blog.id === id);

    if (window.confirm(`Remove ${blog.title} by ${blog.author}`)) {
      blogService
        .remove(id)
        .then(setBlogs(blogs.filter((blog) => blog.id !== id)))
        .catch((error) => {
          console.error("Error deleting blog:", error);
          // setMessage("Failed to delete the blog");
          // setTimeout(() => setMessage(null), 5000);
          dispatch(setNotification("Failed to delete the blog", 5))
        });
    }
  };

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);

  if (user === null) {
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
        {user.name} is logged in
        <button type="submit" onClick={handleLogout}>
          logout
        </button>
      </div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <div>
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            likeBlog={() => likeBlog(blog.id)}
            removeBlog={() => deleteBlog(blog.id)}
            loggedIn={user}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
