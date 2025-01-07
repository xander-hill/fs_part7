import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: title,
            author: author,
            url: url,
        })

        setTitle('')
        setAuthor('')
        setUrl('')
    }

    const handleTitleChange = (event) => {
        console.log(event.target.value)
        setTitle(event.target.value)
    }
    
    const handleAuthorChange = (event) => {
        console.log(event.target.value)
        setAuthor(event.target.value)
    }
    
    const handleUrlChange = (event) => {
        console.log(event.target.value)
        setUrl(event.target.value)
    }

    return (
      <div className='blogForm'>
        <h2>create new blog</h2>
        <form onSubmit={addBlog}>
          <p>
          title:
          <input data-testid='title' value={title} onChange={handleTitleChange} placeholder='blog title'/>
          </p>
          <p>
          author:
          <input data-testid='author' value={author} onChange={handleAuthorChange} placeholder='blog author'/>
          </p>
          <p>
          url:
          <input data-testid='url' value={url} onChange={handleUrlChange} placeholder='blog url'/>
          </p>
          <button type = "submit">create</button>
        </form>
      </div>
    )
}

BlogForm.PropTypes = {
    createBlog: PropTypes.func.isRequired
}

export default BlogForm