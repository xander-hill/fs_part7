import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import userService from "./services/users"
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import { initializeUser, loginUser, logoutUser } from "./reducers/userReducer";
import { setNotification } from './reducers/notificationReducer'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs, createBlog, updateBlog, byebyeBlog } from "./reducers/blogReducer";
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams,
  useNavigate,
  useMatch,
  Navigate
} from 'react-router-dom'

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([])
  const dispatch = useDispatch()

  const blogFormRef = useRef();

  useEffect(() => {
    dispatch(initializeBlogs())
  }, []);

  useEffect(() => {
    dispatch(initializeUser())
  }, []);

  useEffect(() => {
    userService.getAll().then(userlist => setUsers(userlist))
  }, [])

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

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    dispatch(createBlog(blogObject))
    dispatch(setNotification(`Added ${blogObject.title} by ${blogObject.author}`, 5))
  };

  const sortedBlogs = useSelector(state => [...state.blogs].sort((a, b) => b.likes - a.likes))

  const User = ({ user }) => {

    if (!user) {
      return (
        <div>ERROR</div>
      )
    }

    return (
      <div>
        <h2>{user.name}</h2>
        <ul>
          {user.blogs.map(blog => (
            <li key={blog.id}>
              {blog.title}
            </li>
          ))}
        </ul>
      </div>
    )
  }


  const Users = ({ users }) => {

    return (
      <div>
        <h2>Users</h2>
        <ul>
          {users.map(user => (
            <li key={user.id} >
              <Link to={`/users/${user.id}`}>
                {`${user.name}: ${user.blogs.length}`}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const BlogList = () => {
    return (
      <div>
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
        <ul>
          {sortedBlogs.map((blog) => (
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>
                {`${blog.title} by ${blog.author}`}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const userMatch = useMatch('/users/:id')
  const user = userMatch
    ? users.find(a => a.id === userMatch.params.id)
    : null

  const blogMatch = useMatch('/blogs/:id')
  const blog = blogMatch
    ? sortedBlogs.find(blog => blog.id === blogMatch.params.id)
    : null

  const loggedIn = useSelector(state => state.user)

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
        <Link to="/">blogs  </Link>
        <Link to="/users">users</Link>
        {loggedIn.name} is logged in
        <button type="submit" onClick={handleLogout}>
          logout
        </button>
      </div>
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path='/blogs/:id' element={<Blog
          blog={blog}
          loggedIn={loggedIn}
        />} />
        <Route path="/users/:id" element={<User user={user}/>} />
        <Route path="/users" element={<Users users={users} />} />
      </Routes>
    </div>
  );
};

export default App;
