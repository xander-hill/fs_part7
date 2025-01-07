import { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { updateBlog, byebyeBlog, commentBlog } from "../reducers/blogReducer";

const Blog = ({ blog, loggedIn }) => {
  console.log(blog)
  const [details, setDetails] = useState(false);
  const [comment, setComment] = useState('')
  const isCreator = blog.user.name === loggedIn.name;
  const dispatch = useDispatch()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const getId = () => {
    return(
      Math.round((Math.random() * 10000))
    )
  }

  const handleCommentChange = (event) => {
    console.log(event.target.value);
    setComment(event.target.value);
  };

  const addComment = (event) => {
    event.preventDefault()
    console.log('Comment:',comment)
    const commentToSend = {
      content: comment
    }
    console.log('CommentToSend:', commentToSend)
    dispatch(commentBlog(blog.id, commentToSend))
    setComment('')
  }

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
      <h3>comments</h3>
      <div>
        <form onSubmit={addComment}>
          <input value={comment} onChange={handleCommentChange} placeholder="comment here..." />
          <button type="submit">comment</button>
        </form>
      </div>
      <ul>
        {blog.comments.map(comment => (
          <li key={getId()}>{comment}</li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;
