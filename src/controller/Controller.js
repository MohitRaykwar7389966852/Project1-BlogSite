const blogModel = require("../Model/blogModel");
const authorModel = require("../Model/authorModel");

const createAuthor = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length === 0) res.send({ msg: "data for updation must be given" })
        let emailidexist = await authorModel.findOne({ email: data.email })
        if (emailidexist) {
            return res.status(400).send({ status: false, meg: "email alredy exist" })
        }

        let author_data = await authorModel.create(data)
        res.send({ data: author_data })
    }
    catch (e) {
        res.status(500).send(e.message)
    }
}

const createBlog = async function (req, res) {
    try{
    let data = req.body
    if (Object.keys(data).length === 0) res.send({ msg: "data for updation must be given" })
    if(data.hasOwnProperty('ispublished'))
    {
        if (data.ispublished == true) {
            data.publishedAt = Date.now()
        }
    }
    let authorId = data.authorId
    let checkAuthorId = await authorModel.find({ _id: authorId })
    if (!checkAuthorId) {
        res.status(400).send({ status: false, msg: "Enter valid Author Id" })
    }
    let createBlogData = await blogModel.create(data)
    res.status(201).send({ status: true, data: createBlogData })
} catch(e){
    res.status(500).send(e.message)
}
}

const getBlog = async function (req, res) {
    try {
        let filter = req.query
        filter.isdeleted = false
        filter.ispublished = true
        let blog = await blogModel.find(filter).populate("authorId")
        if (blog.length == 0) res.status(404).send({ msg: "no data found" })
        res.status(200).send({ data: blog })
    } catch (e) {
        res.status(500).send(e.message)
    }
}


const putBlog = async function (req, res) {
    try {
        let blogid = req.params.blogid
        let checkId = await blogModel.findOne({ _id: blogid, isdeleted: false })
        if (!checkId) res.status(404).send({ msg: "blog id not exist" })
        let data = req.body
        if (Object.keys(data).length === 0) res.send({ msg: "data for updation must be given" })
        if (data.hasOwnProperty('ispublished')) {
            if (data.ispublished == true) {
                data.publishedAt = Date.now()
            }
        }
        let blog = await blogModel.findOneAndUpdate(
            { _id: blogid },
            { $set: data },
            { new: true }
        )
        res.status(200).send({ data: blog })
    }
    catch (e) {
        res.status(500).send(e.message)
    }
}

const checkDeleteStatus = async function (req, res) {
    try {
        let blogId = req.params.blogId
        let checkBlogId = await blogModel.find({ _id: blogId, isdeleted: false })
        if (!checkBlogId) res.status(404).send({ msg: "Blog Id is not valid" })

        let deleted = await blogModel.findOneAndUpdate(
            { _id: blogId },
            { $set: { isdeleted: true, deletedAt: Date.now() } }
        )
        res.status(200).end()
    } catch (e) { res.status(500).send(e.message) }
}

// const DeleteStatus = async function (req, res) {
//     try {
//         let blogId = req.query.blogId
//         let checkBlogId = await blogModel.find({ _id: blogId, isdeleted: false })
//         if (!checkBlogId) res.status(404).send({ msg: "Blog Id is not valid" })

//         let deleted = await blogModel.findOneAndUpdate(
//             { _id: blogId },
//             { $set: { isdeleted: true, deletedAt: Date.now() } }
//         )
//         res.status(200).end()
//     } catch (e) { res.status(500).send(e.message) }
// }


module.exports.createAuthor = createAuthor
module.exports.createBlog = createBlog
module.exports.getBlog = getBlog
module.exports.putBlog = putBlog
module.exports.checkDeleteStatus = checkDeleteStatus
// module.exports.DeleteStatus = DeleteStatus