const blogModel = require("../Model/blogModel");
const authorModel = require("../Model/authorModel");

const createBlog = async function (req, res) {
    let data = req.body
    let authorId = data.authorId
    let checkAuthorId = await authorModel.find({ _id: authorId })
    if (!checkAuthorId) {
        return res.status(400).send({ status: false, msg: "Enter valid Author Id" })
    }
    let createBlogData = await blogModel.create(data)
    if (createBlogData.ispublished == true) {
        let blogUpdated = await blogModel.findOneAndUpdate({ _id: createBlogData._id }, { publishedAt: Date.now() }, { new: true })
        return res.status(201).send({ status: true, data: blogUpdated })
    }
    return res.status(201).send({ status: true, data: createBlogData })

}

module.exports.createBlog = createBlog
