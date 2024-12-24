"use strict";

module.exports = async function (bool) {
  // return null;
  if (!bool) {
    return null;
  } else {
    // MOCK USERS
    // const User = require("../models/user");
    // for (let i in [...Array(200)]) {
    //   await User.create({
    //     username: "mock" + String(i),
    //     password: "Qwer1234!",
    //     email: "mock" + String(i) + "@site.com",
    //     firstName: "mock" + String(i),
    //     lastName: "mock" + String(i),
    //     isActive: !!(Math.random() < 0.5),
    //     isAdmin: false,
    //     isLead: false,
    //   });
    // }
    // MOCK USERS
    // mongosh toplu silme
    // use dbName(show dbs)
    // db.user.deleteMany({ "username": /mock/ })
    // /*
    // REMOVE DATABASE
    const { mongoose } = require("../configs/dbConnection");
    if (process.env.NODE_ENV !== "production") {
      // ? production'da mongo cloud database'ini kullanacagindan ve tanimli user'in database drop'lama yetkisi olmadigindan, sadece collection sifirlama(deleteMany) ile collection bosaltilip yeni veri eklenir, database'i komple silmek icin mongo cloud'ta daha yetkili bir kullanici kullanilmalidir.
      await mongoose.connection.dropDatabase();
      console.log("- Database and all data DELETED!");
      // REMOVE DATABASE
    }

    // User
    const User = require("../models/user");
    await User.deleteMany(); // !!! Clear collection.
    await User.create({
      _id: "65343222b67e9681f937f001",
      username: "admin",
      password: "Qwer1234!",
      email: "admin@site.com",
      firstName: "admin",
      lastName: "admin",
      isActive: true,
      isStaff: true,
      isAdmin: true,
    });
    await User.create({
      _id: "65343222b67e9681f937f002",
      username: "staff",
      password: "Qwer1234!",
      email: "staff@site.com",
      firstName: "staff",
      lastName: "staff",
      isActive: true,
      isStaff: true,
      isAdmin: false,
    });
    await User.create({
      _id: "65343222b67e9681f937f003",
      username: "user",
      password: "Qwer1234!",
      email: "user@site.com",
      firstName: "user",
      lastName: "user",
      isActive: true,
      isStaff: false,
      isAdmin: false,
    });
    await User.create({
      _id: "65343222b67e9681f937f004",
      username: "superuser",
      password: "Asdf1234!",
      email: "superuser@site.com",
      firstName: "superuser",
      lastName: "superuser",
      isActive: true,
      isStaff: true,
      isAdmin: true,
    });
    await User.create({
      _id: "65343222b67e9681f937f005",
      username: "testuser",
      password: "Asdf1234!",
      email: "testuser@site.com",
      firstName: "testuser",
      lastName: "testuser",
      isActive: true,
      isStaff: false,
      isAdmin: false,
    });
    // User

    // Token
    const Token = require("../models/token");
    await Token.deleteMany(); // !!! Clear collection.
    // admin token
    await Token.create({
      _id: "65343222b67e9681f937f700",
      userId: "65343222b67e9681f937f001",
      token: "27b9cb186c1742b5460732f4e6f70242f092055de26ecc8a434db72ec87c2bc3",
    });
    // staff token
    await Token.create({
      _id: "65343222b67e9681f937f701",
      userId: "65343222b67e9681f937f002",
      token: "a717077bd9b40efa593c9637ca39a69b1d8f6547caa9e671b7da055e6c0a410b",
    });
    // user token
    await Token.create({
      _id: "65343222b67e9681f937f702",
      userId: "65343222b67e9681f937f003",
      token: "ac317724e3c77da600f6fc66846f807f33a3cab2ef39fd15a5412921a358edce",
    });
    // Token

    // Category
    const Category = require("../models/category");
    await Category.deleteMany(); // !!! Clear collection.
    await Category.create({
      _id: "65343222b67e9681f937f101",
      name: "administration",
    });
    await Category.create({
      _id: "65343222b67e9681f937f102",
      name: "Life",
    });
    await Category.create({
      _id: "65343222b67e9681f937f103",
      name: "Technology",
    });
    await Category.create({
      _id: "65343222b67e9681f937f104",
      name: "Science",
    });
    await Category.create({
      _id: "65343222b67e9681f937f105",
      name: "Health",
    });
    await Category.create({
      _id: "65343222b67e9681f937f106",
      name: "Travel",
    });
    // Category

    // Blog
    const Blog = require("../models/blog");
    await Blog.deleteMany(); // !!! Clear collection.
    await Blog.create({
      _id: "65343222b67e9681f937f201",
      userId: "65343222b67e9681f937f001",
      categoryId: "65343222b67e9681f937f102",
      title: "Sample Life Blog - 0",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam eligendi, aliquam sequi fuga velit aperiam aut optio ipsam et inventore fugiat consequatur, provident debitis amet harum recusandae, minus incidunt sint assumenda repellat adipisci enim! Unde provident a necessitatibus quia sunt. Aut porro doloremque facilis, exercitationem, dicta veniam tempore commodi totam dolorem laudantium quas. Neque libero dicta quasi accusantium amet doloribus, repellendus alias quidem praesentium itaque consequuntur culpa sunt ab eum hic labore perspiciatis a ex illum velit. Explicabo praesentium nemo eum, quos fugit ipsam enim asperiores animi magnam totam, sit vitae autem voluptatibus molestiae voluptate culpa, reprehenderit natus quidem earum?",
      image:
        "https://www.completeonline.co.uk/wp-content/uploads/2022/08/A-guide-to-writing-a-good-blog-post.jpeg",
      status: "Published",
      publish_date: new Date(),
    });
    await Blog.create({
      _id: "65343222b67e9681f937f202",
      userId: "65343222b67e9681f937f001",
      categoryId: "65343222b67e9681f937f103",
      title: "Sample Technology Blog - 0",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam eligendi, aliquam sequi fuga velit aperiam aut optio ipsam et inventore fugiat consequatur, provident debitis amet harum recusandae, minus incidunt sint assumenda repellat adipisci enim! Unde provident a necessitatibus quia sunt. Aut porro doloremque facilis, exercitationem, dicta veniam tempore commodi totam dolorem laudantium quas. Neque libero dicta quasi accusantium amet doloribus, repellendus alias quidem praesentium itaque consequuntur culpa sunt ab eum hic labore perspiciatis a ex illum velit. Explicabo praesentium nemo eum, quos fugit ipsam enim asperiores animi magnam totam, sit vitae autem voluptatibus molestiae voluptate culpa, reprehenderit natus quidem earum?",
      image:
        "https://www.completeonline.co.uk/wp-content/uploads/2022/08/A-guide-to-writing-a-good-blog-post.jpehttps://techstory.in/wp-content/uploads/2022/11/Blogging.jpg",
      status: "Published",
      publish_date: new Date(),
    });
    await Blog.create({
      _id: "65343222b67e9681f937f203",
      userId: "65343222b67e9681f937f001",
      categoryId: "65343222b67e9681f937f104",
      title: "Sample Science Blog - 0",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam eligendi, aliquam sequi fuga velit aperiam aut optio ipsam et inventore fugiat consequatur, provident debitis amet harum recusandae, minus incidunt sint assumenda repellat adipisci enim! Unde provident a necessitatibus quia sunt. Aut porro doloremque facilis, exercitationem, dicta veniam tempore commodi totam dolorem laudantium quas. Neque libero dicta quasi accusantium amet doloribus, repellendus alias quidem praesentium itaque consequuntur culpa sunt ab eum hic labore perspiciatis a ex illum velit. Explicabo praesentium nemo eum, quos fugit ipsam enim asperiores animi magnam totam, sit vitae autem voluptatibus molestiae voluptate culpa, reprehenderit natus quidem earum?",
      image:
        "https://st3.depositphotos.com/3591429/14150/i/450/depositphotos_141509322-stock-photo-multiracial-people-with-digital-devices.jpg",
    });
    // Blog

    // Comment
    const Comment = require("../models/comment");
    await Comment.deleteMany(); // !!! Clear collection.
    await Comment.create({
      _id: "65343222b67e9681f937f301",
      userId: "65343222b67e9681f937f001",
      blogId: "65343222b67e9681f937f201",
      content: "Awesome blog, keep going.",
    });
    await Comment.create({
      _id: "65343222b67e9681f937f302",
      userId: "65343222b67e9681f937f001",
      blogId: "65343222b67e9681f937f202",
      content: "Fantastic.",
    });
    await Comment.create({
      _id: "65343222b67e9681f937f303",
      userId: "65343222b67e9681f937f001",
      blogId: "65343222b67e9681f937f203",
      content: "So riveting.",
    });
    // Comment

    // Like
    const Like = require("../models/like");
    await Like.deleteMany(); // !!! Clear collection.
    await Like.create({
      userId: "65343222b67e9681f937f001",
      blogId: "65343222b67e9681f937f201",
    });
    await Like.create({
      userId: "65343222b67e9681f937f002",
      blogId: "65343222b67e9681f937f201",
    });
    await Like.create({
      userId: "65343222b67e9681f937f001",
      blogId: "65343222b67e9681f937f202",
    });
    // Like
    // */

    /* Finished */
    console.log("* Synchronized.");
  }
};
