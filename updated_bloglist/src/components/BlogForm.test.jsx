import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('submitting a new blog', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByPlaceholderText('blog title')
    const authorInput = screen.getByPlaceholderText('blog author')
    const urlInput = screen.getByPlaceholderText('blog url')
    const sendButton = screen.getByText('create')

    await user.type(titleInput, 'Testing 123')
    await user.type(authorInput, 'Jonny Test')
    await user.type(urlInput, 'www.test.com')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Testing 123')
    expect(createBlog.mock.calls[0][0].author).toBe('Jonny Test')
    expect(createBlog.mock.calls[0][0].url).toBe('www.test.com')
})