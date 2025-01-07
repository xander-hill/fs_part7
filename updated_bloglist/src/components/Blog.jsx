import { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { updateBlog, byebyeBlog } from "../reducers/blogReducer";

const Blog = ({ blog, loggedIn }) => {
  console.log(blog)
  const [details, setDetails] = useState(false);
  const isCreator = blog.user.name === loggedIn.name;
  const dispatch = useDispatch()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const likeBlog = (id) => {
    dispatch(updateBlog(id))
  };

  const deleteBlog = (id) => {
    if (window.confirm('Remove blog?')) {
      dispatch(byebyeBlog(id))
    }
  };

  const changeDetails = () => {
    setDetails(!details);
  };

  if (details === false) {
    return (
      <div style={blogStyle} className="blog">
        {blog.title} {blog.author}
        <button onClick={changeDetails}>view</button>
      </div>
    );
  }

  return (
    <div style={blogStyle} className="blog">
      <div>
        <span>{blog.title} {blog.author}</span>
        <button onClick={changeDetails}>hide</button>
      </div>
      <div>{blog.url}</div>
      <div>
        likes: {blog.likes}
        <button type="submit" onClick={() => likeBlog(blog.id)}>
          like
        </button>
      </div>
      <div>{blog.user.name}</div>
      {isCreator && (
        <button type="submit" onClick={() => deleteBlog(blog.id)}>
          remove
        </button>
      )}
    </div>
  );
};

export default Blog;
