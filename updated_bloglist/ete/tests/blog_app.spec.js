const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'Dilly Dilly',
                username: 'dillydilly',
                password: 'dillydilly'
            }
        })
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'Boogie Woogie',
                username: 'boogie',
                password: 'woogie'
            }
        })

        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        const locator = await page.getByText('Log in to application')
        await expect(locator).toBeVisible()
    })

    describe('login', () => {

        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'dillydilly', 'dillydilly')
            await expect(page.getByText('Dilly Dilly is logged in')).toBeVisible()
        })

        test('fails with incorrect credentials', async ({ page }) => {
            await loginWith(page, 'dillydilly', 'meep')
            await expect(page.getByText('Wrong username and/or password')).toBeVisible()
        })

        describe('when logged in', () => {
            beforeEach(async ({ page }) => {
                await loginWith(page, 'dillydilly', 'dillydilly')
            })

            test('logged in user can create note', async ({ page }) => {
                await createBlog(page, 'Bing', 'Bong', 'www.bingbong.com')
                await page.pause()
                await expect(page.getByText('Bing Bong')).toBeVisible()
            })

            describe('blog uploaded', () => {
                beforeEach( async ({ page }) => {
                    await createBlog(page, 'Bing', 'Bong', 'www.bingbong.com')
                    await page.getByText('Bing Bong').waitFor()
                })

                test('can like a blog', async ({ page }) => {
                    await page.getByRole('button', { name: 'view' }).click()
                    await page.getByRole('button', { name: 'like' }).click()
                    await expect(page.getByText('likes: 1')).toBeVisible()
                })

                test('can remove a blog', async ({ page }) => {
                    page.on('dialog', async (dialog) => {
                        if (dialog.type() === 'confirm') {
                            expect(dialog.message()).toBe('Remove Bing by Bong')
                            await dialog.accept()
                        }
                    })
                    await page.getByRole('button', { name: 'view' }).click()
                    await page.getByRole('button', { name: 'like' }).click()
                    await page.getByRole('button', { name: 'remove' }).waitFor()
                    await page.getByRole('button', { name: 'remove' }).click()
                    await expect(page.getByText('Bing Bong')).not.toBeVisible()
                })

                test('only creator can remove a blog', async ({ page }) => {
                    await page.getByRole('button', { name: 'logout' }).click()
                    await loginWith(page, 'boogie', 'woogie')
                    await page.getByText('Bing Bong').waitFor()
                    await page.getByRole('button', { name: 'view' }).click()
                    await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
                })

                test('blogs arranged by likes', async ({ page }) => {
                    test.setTimeout(60000)
                    await createBlog(page, 'boom', 'bop', 'blam')
                    await page.getByText('boom bop').waitFor()
                    await createBlog(page, 'zoinks', 'scoob', 'ruhroh')
                    await page.getByText('zoinks scoob').waitFor()
                    const firstBlog = page.locator('div.blog', { hasText: 'boom bop' })
                    const secondBlog = page.locator('div.blog', { hasText: 'zoinks scoob' })
                    await firstBlog.getByRole('button', { name: 'view' }).click()
                    await firstBlog.getByRole('button', { name: 'like' }).click()
                    await secondBlog.getByRole('button', { name: 'view' }).click()
                    await secondBlog.getByRole('button', { name: 'like' }).click()
                    await secondBlog.getByRole('button', { name: 'like' }).click()
                    const topBlog = page.locator('div.blog').first()
                    await expect(topBlog.getByText('zoinks scoob')).toBeVisible()
                })
            })
        })
    })
})