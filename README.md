<div align=center>
	<h1>Blog APP Plus</h1>
</div>

<div align="center">
      <p>Live API (seperated from frontend for representation)</p>
	<a href="https://blog-api-plus-ehkarabas.onrender.com/api/documents/swagger/">
		<img src="https://img.shields.io/badge/live-%23.svg?&style=for-the-badge&logo=www&logoColor=white%22&color=black">
	</a>
	<hr>
</div>

<div align="center">
      <p>Live Blog APP+ (API + Client)</p>
	<a href="https://blog-app-plus-ehkarabas.vercel.app/">
		<img src="https://img.shields.io/badge/live-%23.svg?&style=for-the-badge&logo=www&logoColor=white%22&color=black">
	</a>
	<hr>
</div>

<div align="center">
      <p>You can check presentation as video from below</p>
</div>

[![Go To The Presentation Video](https://i.hizliresim.com/fg1xyfq.png)](https://youtu.be/Xl1HGCK7YE8)

<hr>

## Description

A comprehensive blog application featuring draft and publish systems. The admin can manage all posts, while other users can only edit and delete their own posts and comments. It includes like toggle and view count functionalities. There is a simple authentication system, and JWTs are automatically refreshed using an interceptor. Additionally, basic rate limiting is implemented on the backend.

**IMPORTANT NOTE:** _The rate limiting configurations have been removed from the open source._

## Backend Goals

In the backend, administrators have control over all content, while users are only able to manage their own content. A basic rate limiting mechanism and a simple authentication system are in place. Additionally, a middleware mechanism has been implemented to display the total view count of blogs.

## Frontend Goals

On the frontend, optimizations were implemented to prevent unnecessary renders, especially when a like is toggled. Users can access their own blogs from a separate section and can either save them as drafts or publish them. Users who are not logged in cannot utilize any features except for the blog listing page. JWTs are automatically refreshed using an interceptor.

## Technologies

Backend:

- NodeJS
- Express
- Swagger & Redoc
- Basic rate limiter

Frontend:

- React (w React Helmet)
- React Router v5
- Material UI (w modals, theme customization in assistance of Tailwind and so on)
- Tailwind (w layer overrides)
- Redux (w persist, slices, async thunk and extra reducers)
- JWT refreshing via interceptors
- Formik & Yup
- Custom Hooks
- Axios (w instances in a custom hook)
- Toastify

Frontend Hydration & Rendering:

- SPA (CRA)
  - Next Steps: Since this application includes SEO-critical content such as blogs, articles, and e-commerce, using SSR/SSG would be much more beneficial. Therefore, it should be migrated to Next.js, and with React Query, client-side request caching should be implemented to optimize the load on the server.

## Installation

To run this app on your local, run commands below on the terminal:

1. Clone the repo on your local.

   ```bash
   $ git clone https://github.com/ehkarabas/blog-app-plus.git
   ```

2. On this repo, open terminal in ./backend for the backend and:

   2.1. Make sure you've installed node and added node to the system path.

   2.2. Install packages of this repo.

   ```bash
   $ yarn install
   ```

   2.3. Run the server on your browser.

   ```bash
   $ yarn nodemon
   ```

3. On this repo, open terminal in ./frontend for the frontend and:

   3.1. Install node modules to this repo.

   ```bash
   $ yarn install
   ```

   3.2. Run the app on your browser.

   ```bash
   $ yarn start
   ```

## Resource Structure

```
blog_app_plus(folder)
│
├── LICENSE
├── README.md
├── be
│   ├── erdBlogAPI.png
│   ├── index.js
│   ├── logs
│   ├── package.json
│   ├── public
│   │   ├── _redirects
│   │   ├── images
│   │   └── index.html
│   ├── src
│   │   ├── configs
│   │   │   ├── dbConnection.js
│   │   │   ├── dbConnection_old.js
│   │   │   └── swagger.json
│   │   ├── controllers
│   │   │   ├── auth.js
│   │   │   ├── blog.js
│   │   │   ├── category.js
│   │   │   ├── comment.js
│   │   │   ├── like.js
│   │   │   ├── token.js
│   │   │   └── user.js
│   │   ├── errors
│   │   │   └── customError.js
│   │   ├── helpers
│   │   │   ├── blogDetails.js
│   │   │   ├── dateValidator.js
│   │   │   ├── emailFieldValidator.js
│   │   │   ├── logFolderCreate.js
│   │   │   ├── loginCredentialsGenerator.js
│   │   │   ├── modelDateTimeOffset.js
│   │   │   ├── passwordEncrypt.js
│   │   │   ├── projectNameGenerator.js
│   │   │   ├── refreshAccessToken.js
│   │   │   ├── swaggerAutogen.js
│   │   │   ├── sync.js
│   │   │   └── utcDateGenerator.js
│   │   ├── middlewares
│   │   │   ├── authentication.js
│   │   │   ├── combinedAuthentication.js
│   │   │   ├── cookieAuthentication.js
│   │   │   ├── corsCustom.js
│   │   │   ├── errorHandler.js
│   │   │   ├── findSearchSortPage.js
│   │   │   ├── fsLogging.js
│   │   │   ├── idValidation.js
│   │   │   ├── logger.js
│   │   │   ├── morganLogging.js
│   │   │   ├── permissions.js
│   │   │   ├── queryHandler.js
│   │   │   └── tokenAuthentication.js
│   │   ├── models
│   │   │   ├── blog.js
│   │   │   ├── category.js
│   │   │   ├── comment.js
│   │   │   ├── like.js
│   │   │   ├── token.js
│   │   │   └── user.js
│   │   └── routes
│   │       ├── auth.js
│   │       ├── blog.js
│   │       ├── category.js
│   │       ├── comment.js
│   │       ├── document.js
│   │       ├── index.js
│   │       ├── like.js
│   │       ├── token.js
│   │       └── user.js
│   └── yarn.lock
└── fe
    ├── README.md
    ├── package.json
    ├── public
    │   ├── _redirect
    │   ├── images
    │   │   └── ehlogo-transparent.png
    │   └── index.html
    ├── src
    │   ├── App.js
    │   ├── app
    │   │   └── store.js
    │   ├── assets
    │   │   └── FavIcon.js
    │   ├── components
    │   │   ├── FavComp.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── ThemeProviderWrapper.jsx
    │   │   ├── ThemeToggle.jsx
    │   │   ├── auth
    │   │   │   ├── LoginForm.jsx
    │   │   │   ├── PwResetForm.jsx
    │   │   │   └── RegisterForm.jsx
    │   │   └── blog
    │   │       ├── BlogActions.jsx
    │   │       ├── BlogCard.jsx
    │   │       ├── CommentActions.jsx
    │   │       ├── CommentCard.jsx
    │   │       ├── CommentForm.jsx
    │   │       ├── CommentModal.jsx
    │   │       ├── CommentUpdateForm.jsx
    │   │       ├── DeleteModal.jsx
    │   │       ├── DetailsBlogCard.jsx
    │   │       ├── MyBlogsBlogCard.jsx
    │   │       └── UpdateModal.jsx
    │   ├── features
    │   │   ├── authSlice.jsx
    │   │   ├── blogSlice.jsx
    │   │   └── themeSlice.jsx
    │   ├── helper
    │   │   ├── ErrorCatch.js
    │   │   ├── RefreshCheck.js
    │   │   └── ToastNotify.js
    │   ├── hooks
    │   │   ├── useAuthCall.jsx
    │   │   ├── useAxios.jsx
    │   │   ├── useAxios_old.jsx
    │   │   └── useBlogCall.jsx
    │   ├── index.css
    │   ├── index.js
    │   ├── pages
    │   │   ├── About.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Detail.jsx
    │   │   ├── Login.jsx
    │   │   ├── MyBlogs.jsx
    │   │   ├── NewBlog.jsx
    │   │   ├── NotFound.jsx
    │   │   ├── Profile.jsx
    │   │   ├── PwResetRequest.jsx
    │   │   └── Register.jsx
    │   └── rooter
    │       ├── AppRouter.jsx
    │       └── PrivateRouter.jsx
    ├── tailwind.config.js
    └── yarn.lock
```
