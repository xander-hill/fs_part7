import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('renders blog', () => {
    const blog = {
        title: 'Example blog',
        author: 'Me',
        url: 'www.shouldnotappear.net',
        likes: 0,
        user: {
            name: 'joe'
        }
    }

    const loggedIn = {
        name: 'nacho'
    }

    render(<Blog blog={blog} loggedIn={loggedIn}/>)

    const element = screen.getByText('Example blog Me')

    expect(element).toBeDefined()

})

test('default blog renders with only title and author', () => {
    const blog = {
        title: 'Example blog',
        author: 'Me',
        url: 'www.shouldnotappear.net',
        likes: 0,
        user: {
            name: 'joe'
        }
    }

    const loggedIn = {
        name: 'nacho'
    }

    render(<Blog blog={blog} loggedIn={loggedIn}/>)

    const element = screen.getByText('Example blog Me')
    expect(element).toBeDefined()

    const url = screen.queryByText('www.shouldnotappear.net')
    expect(url).toBeNull()

    const likes = screen.queryByText('likes: 0')
    expect(likes).toBeNull()

})

test('blog shows url and likes after button clicked', async () => {
    const blog = {
        title: 'Example blog',
        author: 'Me',
        url: 'www.shouldnotappear.net',
        likes: 0,
        user: {
            name: 'joe'
        }
    }

    const loggedIn = {
        name: 'nacho'
    }

    const user = userEvent.setup()

    render(<Blog blog={blog} loggedIn={loggedIn}/>)

    const viewButton = screen.getByText('view')

    await user.click(viewButton)

    const url = screen.queryByText('www.shouldnotappear.net')
    expect(url).toBeDefined()

    const likes = screen.queryByText('likes: 0')
    expect(likes).toBeDefined()
})

test('like button works', async () => {
    const blog = {
        title: 'Example blog',
        author: 'Me',
        url: 'www.shouldnotappear.net',
        likes: 0,
        user: {
            name: 'joe'
        }
    }

    const loggedIn = {
        name: 'nacho'
    }

    const likeBlog = vi.fn()

    const user = userEvent.setup()

    render(<Blog blog={blog} loggedIn={loggedIn} likeBlog={likeBlog}/>)

    const viewButton = screen.getByText('view')

    await user.click(viewButton)

    const likeButton = screen.getByText('like')

    await user.click(likeButton)
    await user.click(likeButton)

    expect(likeBlog.mock.calls).toHaveLength(2)
})