"use strict";

// Blog Controller:
const Blog = require("../models/blog");
const blogDetail = require("../helpers/blogDetails");

const { getUser } = require("../middlewares/permissions");

module.exports = {
  list: async (req, res) => {
    /*
      #swagger.tags = ["Blogs"]
      #swagger.summary = "List Blogs <Permissions: Public>"
      #swagger.description = `
        You can use <u>filter[] & search[] & sort[] & page & limit</u> queries with endpoint.
        <ul> Examples:
            <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
            <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
            <li>URL/?<b>sort[field1]=asc&sort[field2]=desc</b></li>
            <li>URL/?<b>limit=10&page=1</b></li>
        </ul>
      `
    */
    // query check
    const authorQuery = req.query?.author;
    let statusQuery;
    if (req.query?.status)
      statusQuery = ["p", "published"].includes(req.query.status.toLowerCase())
        ? "Published"
        : ["d", "draft"].includes(req.query.status.toLowerCase())
        ? "Draft"
        : undefined;
    const filterQuery = {};
    if (authorQuery !== undefined) filterQuery.userId = authorQuery;
    if (statusQuery !== undefined) filterQuery.status = statusQuery;

    // soft delete filter
    const filter = { ...filterQuery, destroyTime: null };

    // blog data with model fields
    const blogDataWithoutDetails = await res.getModelList(Blog, filter, [
      { path: "userId", select: "username email" },
      { path: "categoryId", select: "name" },
    ]);

    // blog data with extra fields
    const result = await blogDetail(blogDataWithoutDetails);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Blog, filter),
      result,
    });
  },
  create: async (req, res) => {
    /*
      #swagger.tags = ["Blogs"]
      #swagger.summary = "Create Blog <Permissions: Login>"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          userId: "65343222b67e9681f937f003",
          categoryId: "65343222b67e9681f937f106",
          title: "Sample Travel Blog - Test",
          content:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam eligendi, aliquam sequi fuga velit aperiam aut optio ipsam et inventore fugiat consequatur, provident debitis amet harum recusandae, minus incidunt sint assumenda repellat adipisci enim! Unde provident a necessitatibus quia sunt. Aut porro doloremque facilis, exercitationem, dicta veniam tempore commodi totam dolorem laudantium quas. Neque libero dicta quasi accusantium amet doloribus, repellendus alias quidem praesentium itaque consequuntur culpa sunt ab eum hic labore perspiciatis a ex illum velit. Explicabo praesentium nemo eum, quos fugit ipsam enim asperiores animi magnam totam, sit vitae autem voluptatibus molestiae voluptate culpa, reprehenderit natus quidem earum?",
          image:
            "https://st3.depositphotos.com/3591429/14150/i/450/depositphotos_141509322-stock-photo-multiracial-people-with-digital-devices.jpg",
          status: "Published",
        }
      }
    */
    // soft delete icin destroyTime create ve update'te daima body'den silnir
    delete req.body?.destroyTime;

    // status published ise publish_date'i belirle.
    if (
      ["p", "published"].includes(
        req.body?.status ? req.body.status.toLowerCase() : undefined
      )
    ) {
      req.body.publish_date = new Date();
    }

    // userId verisini req.user'dan al
    const user = getUser(req);
    req.body.userId = user._id;

    const blog = await Blog.create(req.body);

    res.status(201).send({
      error: false,
      result: blog,
    });
  },
  read: async (req, res) => {
    /*
      #swagger.tags = ["Blogs"]
      #swagger.summary = "Get Single Blog <Permissions: Login>"
    */

    // soft delete filter
    const filter = { destroyTime: null };

    // blog data with model fields
    const blog = await Blog.findOne({
      _id: req.params.blogId,
      ...filter,
    }).populate([
      { path: "userId", select: "username email" },
      { path: "categoryId", select: "name" },
    ]);

    // blog view
    const viewHost = req.ip;
    // console.log("🔭 ~ read: ~ viewHost ➡ ➡ ", viewHost); // 🔭 ~ read: ~ viewHost ➡ ➡  127.0.0.1
    if (blog && !blog.visitors.includes(viewHost)) {
      // add visitor
      blog.visitors.push(viewHost);
      await blog.save();
    }
    // blog data with extra fields
    const result = await blogDetail(blog);
    res.status(200).send({
      error: false,
      result,
    });
  },
  update: async (req, res) => {
    /*
      #swagger.tags = ["Blogs"]
      #swagger.summary = "Update Blog <Permissions: Admin | Own>"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          userId: "65343222b67e9681f937f003",
          categoryId: "65343222b67e9681f937f106",
          title: "Sample Travel Blog - TestUP",
          content:
            "UPLorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam eligendi, aliquam sequi fuga velit aperiam aut optio ipsam et inventore fugiat consequatur, provident debitis amet harum recusandae, minus incidunt sint assumenda repellat adipisci enim! Unde provident a necessitatibus quia sunt. Aut porro doloremque facilis, exercitationem, dicta veniam tempore commodi totam dolorem laudantium quas. Neque libero dicta quasi accusantium amet doloribus, repellendus alias quidem praesentium itaque consequuntur culpa sunt ab eum hic labore perspiciatis a ex illum velit. Explicabo praesentium nemo eum, quos fugit ipsam enim asperiores animi magnam totam, sit vitae autem voluptatibus molestiae voluptate culpa, reprehenderit natus quidem earum?",
          image:
            "https://st3.depositphotos.com/3591429/14150/i/450/depositphotos_141509322-stock-photo-multiracial-people-with-digital-devices.jpg",
          status: "Published",
        }
      }
    */
    // soft delete icin destroyTime create ve update'te daima body'den silnir
    delete req.body?.destroyTime;

    const blog = await Blog.findById(req.params.blogId);

    // body'de status varsa ve published ise publish_date'i guncelle.
    if (["p", "P", "Published", "published"].includes(req.body?.status)) {
      if (blog.publish_date) {
        req.body.updated_publish_date = new Date();
      } else {
        req.body.publish_date = new Date();
      }
    }

    // body'de status varsa ve draft ise publish_date'i ve updated_publish_date'i null yap.
    if (["d", "D", "Draft", "draft"].includes(req.body?.status)) {
      delete req.body?.publish_date;
      delete req.body?.updated_publish_date;
      blog.publish_date = null;
      blog.updated_publish_date = null;
    }

    const schemaKeys = Object.keys(Blog.schema.paths);

    // req.body içindeki key'leri döngü ile işle
    Object.keys(req.body).forEach((key) => {
      // Eğer key schema'da varsa, document değerini güncelle
      if (schemaKeys.includes(key)) {
        blog[key] = req.body[key];
      }
    });

    const updatedBlog = await blog.save({ runValidators: true });

    // const updatedBlog = await Blog.findOneAndUpdate(
    //   { _id: req.params.blogId },
    //   req.body,
    //   {
    //     new: true,
    //     runValidators: true,
    //   }
    // );

    // blog data with extra fields
    const newData = await blogDetail(updatedBlog);

    res.status(202).send({
      error: false,
      body: req.body,
      new: newData,
    });
  },
  destroy: async (req, res) => {
    /*
      #swagger.tags = ["Blogs"]
      #swagger.summary = "Delete Blog <Permissions: Admin | Own>"
    */
    // Soft delete:
    const blog = await Blog.findById(req.params.blogId);
    if (blog) {
      const localeDate = new Date();

      blog.destroyTime = localeDate;

      const deletedBlog = await blog.save();

      res.status(204).send({
        error: false,
        deletedBlog,
      });
    } else {
      res.status(404).send({
        error: true,
        message: "Blog not found",
      });
    }

    // // mevcut blog quantity'i al
    // const currentBlog = await Blog.findOne({
    //   _id: req.params.blogId,
    // });

    // const data = await Blog.deleteOne({ _id: req.params.blogId });

    // // quantity'i product quantity'den cikar, stok guncellensin
    // await Product.findOneAndUpdate(
    //   { _id: currentBlog.productId },
    //   { $inc: { quantity: -currentBlog.quantity } },
    //   { new: true, runValidators: true }
    // );
    // // typeof -"5" -> Number

    // res.status(data.deletedCount ? 204 : 404).send({
    //   error: !data.deletedCount,
    //   result: data,
    // });
  },
};
