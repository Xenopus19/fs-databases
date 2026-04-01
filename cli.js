require('dotenv').config()

const Blog = require('./models/Blog')

const main = async () => {
    const blogs = await Blog.findAll()

    blogs.forEach(b => console.log(`${b.author}: '${b.title}', ${b.likes} likes.`))
}

main()