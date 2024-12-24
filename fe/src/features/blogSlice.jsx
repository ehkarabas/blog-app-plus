import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchBlogDetail = createAsyncThunk(
  "blog/fetchBlogDetail",
  async (id, thunkAPI) => {
    const BASE_URL = process.env.REACT_APP_API_URL;
    const { token } = thunkAPI.getState().auth;

    const axiosWithToken = axios.create({
      baseURL: BASE_URL,
      headers: { Authorization: `Token ${token}` },
    });

    try {
      const { data } = await axiosWithToken.get(`api/blogs/${id}/`);
      return data.result;
    } catch (error) {
      let message;
      if (error.response) {
        message = `Error ${error.response.status}: ${
          error.response.data[Object.keys(error.response.data)[0]]
        }`;
      } else if (error.request) {
        message =
          "No response received from server. Check your network connection.";
      } else {
        message = "Error in setting up the request: " + error.message;
      }

      return thunkAPI.rejectWithValue({
        error: message,
      });
    }
  }
);

const blogSlice = createSlice({
  name: "blog",

  initialState: {
    loading: false,
    blogList: [],
    blogDetail: null,
    categories: [],
    error: false,
    likeCommentChange: false,
    commentsToggle: false,
    userBlogs: [],
  },

  reducers: {
    fetchStart: (state) => {
      state.loading = true;
    },
    blogSuccess: (state, { payload }) => {
      state.blogList = payload;
      state.error = false;
      state.loading = false;
    },
    categorySuccess: (state, { payload }) => {
      state.categories = payload;
      state.error = false;
      state.loading = false;
    },
    blogFail: (state, { payload }) => {
      state.blogList = [];
      state.error = payload;
      state.loading = false;
    },
    categoryFail: (state, { payload }) => {
      state.categories = [];
      state.error = payload.error;
      state.loading = false;
    },
    // Eski
    // likeCommentChange: (state) => {
    //   state.likeCommentChange = !state.likeCommentChange;
    //   state.error = false;
    //   state.loading = false;
    // },
    // Yeni
    updateLike: (state, { payload }) => {
      const { blogId, userId } = payload;
      const blog = state.blogList.find((blog) => blog._id === blogId);
      if (blog) {
        if (blog.likes_n.some((like) => like.user_id === userId)) {
          // Beğeniyi kaldır
          blog.likes_n = blog.likes_n.filter((like) => like.user_id !== userId);
          blog.likes = blog.likes_n.length;
          console.log(
            `Beğeni kaldırıldı: Blog ID ${blogId}, Yeni Beğeni Sayısı: ${blog.likes}`
          );
        } else {
          // Yeni beğeni ekle
          blog.likes_n.push({ user_id: userId });
          blog.likes = blog.likes_n.length;
          console.log(
            `Beğeni eklendi: Blog ID ${blogId}, Yeni Beğeni Sayısı: ${blog.likes}`
          );
        }
      }
    },
    toggleComments: (state, { payload }) => {
      state.commentsToggle = payload ?? !state.commentsToggle;
    },
    userBlogsSuccess: (state, { payload }) => {
      state.userBlogs = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("blog/resetLoading", (state) => {
        state.loading = false;
        state.error = false;
      })
      .addCase(fetchBlogDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.blogDetail = action.payload;

        // blogList içindeki ilgili blogu güncelleyin
        const updatedBlog = action.payload;
        const index = state.blogList.findIndex(
          (blog) => blog._id === updatedBlog._id
        );
        if (index !== -1) {
          state.blogList[index] = updatedBlog;
        } else {
          // Eğer blogList'te yoksa ekleyin
          state.blogList.push(updatedBlog);
        }

        // Başarılı bir şekilde blog detayı fetch edildiğinde, hem blogDetail güncellenir hem de blogList içerisindeki ilgili blog nesnesi güncellenir veya eklenir.

        // Bu sayede, blogList'i kullanan Dashboard bileşeni ve diğer bileşenler güncel veriyi alır.
      })
      .addCase(fetchBlogDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
  },
});

export const {
  fetchStart,
  blogSuccess,
  categorySuccess,
  blogFail,
  categoryFail,
  // likeCommentChange,
  updateLike,
  toggleComments,
  userBlogsSuccess,
} = blogSlice.actions;
export const blogResetLoading = { type: "blog/resetLoading" };
export default blogSlice.reducer;
