import { useDispatch, useSelector } from "react-redux";
import useAxios from "./useAxios";
import {
  blogFail,
  blogSuccess,
  resetLoading,
  categoryFail,
  categorySuccess,
  fetchStart,
  // likeCommentChange,
  updateLike,
  toggleComments,
  userBlogsSuccess,
} from "../features/blogSlice";
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";
import useAuthCall from "./useAuthCall";
import { useEffect, useState } from "react";
import ErrorCatcher from "../helper/ErrorCatch";
import { fetchBlogDetail } from "../features/blogSlice";

const useBlogCall = () => {
  const dispatch = useDispatch();
  const { axiosWithToken, axiosPublic, axiosWithJWT } = useAxios();
  const currentUser = useSelector((state) => state.auth);

  const getAllBlogsData = async (page = 1) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosPublic(`api/blogs/?status=p&page=${page}`);
      console.log("🔭 ~ getAllBlogsData ~ data ➡ ➡ ", data);
      if (data.error) {
        ErrorCatcher(data, "getAllBlogsData");
      } else {
        dispatch(blogSuccess(data?.result));
        return data;
      }
    } catch (error) {
      console.error("🔭 ~ getAllBlogsData ~ error ➡ ➡ ", error);
      const err = `Error ${error.response.status}: ${
        error.response?.data?.message ?? error.response?.statusText
      }`;
      dispatch(blogFail(error));
      toastErrorNotify(err);
    }
  };

  // const getAllBlogsData = useCallback(
  //   async (page = 1) => {
  //     dispatch(fetchStart());
  //     try {
  //       const { data } = await axiosPublic(`api/blogs/?status=p&page=${page}`);
  //       console.log("🔭 ~ getAllBlogsData ~ data ➡ ➡ ", data);
  //       if (data.error) {
  //         ErrorCatcher(data, "getAllBlogsData");
  //       } else {
  //         dispatch(blogSuccess(data?.result));
  //         return data;
  //       }
  //     } catch (error) {
  //       console.error("🔭 ~ getAllBlogsData ~ error ➡ ➡ ", error);
  //       const err = `Error ${error.response.status}: ${
  //         error.response?.data?.message ?? error.response?.statusText
  //       }`;
  //       dispatch(blogFail(error));
  //       toastErrorNotify(err);
  //     }
  //   },
  //   [dispatch, axiosPublic]
  // );

  const getBlogData = async (id) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithJWT(`api/blogs/${id}/`);
      console.log("🔭 ~ getBlogData hook ~ data ➡ ➡ ", data);
      if (data.error) {
        ErrorCatcher(data, "getBlogData");
      } else {
        return data?.result;
      }
    } catch (error) {
      console.error("🔭 ~ getBlogData ~ error ➡ ➡ ", error);
      const err = `Error ${error.response.status}: ${
        error.response?.data?.message ?? error.response?.statusText
      }`;
      dispatch(blogFail(error));
      toastErrorNotify(err);
    }
  };

  const postBlogData = async (blogData) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithJWT.post(`api/blogs/`, blogData);
      if (data.error) {
        ErrorCatcher(data, "postBlogData");
      } else {
        getAllBlogsData();
        toastSuccessNotify(`Blog posted successfully.`);
      }
    } catch (error) {
      console.error("🔭 ~ postBlogData ~ error ➡ ➡ ", error);
      const err = `Error ${error.response.status}: ${
        error.response?.data?.message ?? error.response?.statusText
      }`;
      dispatch(blogFail(error));
      toastErrorNotify(err);
    }
  };

  const editBlogData = async (id, editedBlogData) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithJWT.put(
        `api/blogs/${id}/`,
        editedBlogData
      );
      if (data.error) {
        ErrorCatcher(data, "editBlogData");
      } else {
        await getBlogData(id);
        toastSuccessNotify(`Blog posted successfully.`);
      }
    } catch (error) {
      console.error("🔭 ~ editBlogData ~ error ➡ ➡ ", error);
      const err = `Error ${error.response.status}: ${
        error.response?.data?.message ?? error.response?.statusText
      }`;
      dispatch(blogFail(error));
      toastErrorNotify(err);
    }
  };

  const deleteBlogData = async (id) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithJWT.delete(`api/blogs/${id}/`);
      if (data.error) {
        ErrorCatcher(data, "deleteBlogData");
      } else {
        await getAllBlogsData();
        toastSuccessNotify(`Blog deleted successfully.`);
      }
    } catch (error) {
      console.error("🔭 ~ deleteBlogData ~ error ➡ ➡ ", error);
      const err = `Error ${error.response.status}: ${
        error.response?.data?.message ?? error.response?.statusText
      }`;
      dispatch(blogFail(error));
      toastErrorNotify(err);
    }
  };

  const getUserBlogsData = async (page = 1) => {
    dispatch(fetchStart());

    try {
      const { data } = await axiosWithJWT(
        `api/blogs/?author=${currentUser?.id}&page=${page}`
      );
      if (data.error) {
        ErrorCatcher(data, "getUserBlogsData");
      } else {
        dispatch(userBlogsSuccess(data.result));
        return data;
      }
    } catch (error) {
      console.error("🔭 ~ getUserBlogsData ~ error ➡ ➡ ", error);
      const err = `Error ${error.response.status}: ${
        error.response?.data?.message ?? error.response?.statusText
      }`;
      dispatch(blogFail(error));
      toastErrorNotify(err);
    }
  };

  const getBlogCategories = async () => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithJWT(`api/categories/`);
      if (data.error) {
        ErrorCatcher(data, "getBlogCategories");
      } else {
        const filteredData = data?.result.filter((ctg) =>
          currentUser.isStaff || currentUser.isAdmin
            ? true
            : ctg.name.toLowerCase() !== "administration"
        );
        dispatch(categorySuccess(filteredData));
        return filteredData;
      }
    } catch (error) {
      console.error("🔭 ~ getBlogCategories ~ error ➡ ➡ ", error);
      const err = `Error ${error.response.status}: ${
        error.response?.data?.message ?? error.response?.statusText
      }`;
      dispatch(blogFail(error));
      toastErrorNotify(err);
    }
  };

  const likeCreate = async (id, like) => {
    // Eski
    // dispatch(fetchStart());
    // try {
    //   const { data } = await axiosWithJWT.post(`api/likes/create/${id}/`, like);
    //   if (data.error) {
    //     ErrorCatcher(data, "likeCreate");
    //   } else {
    //     // toastSuccessNotify("Beğeni başarıyla güncellendi.");
    //     // Eğer sunucu yanıtı ek güncellemeler gerektiriyorsa burada yapabilirsiniz

    //     const data = await getAllBlogsData();
    //     dispatch(likeCommentChange());
    //     return data.result.filter((blog) => blog._id === id)[0];
    //   }
    // } catch (error) {
    //   console.error("🔭 ~ likeCreate ~ error ➡ ➡ ", error);
    //   const err = `Error ${error.response.status}: ${
    //     error.response?.data?.message ?? error.response?.statusText
    //   }`;
    //   dispatch(blogFail(error));
    //   toastErrorNotify(err);
    // }

    // Yeni
    try {
      // Optimistik güncelleme: İlk olarak Redux store'u güncelleyin
      dispatch(updateLike({ blogId: id, userId: like.userId }));

      // Beğeni isteğini sunucuya gönderin
      const { data } = await axiosWithJWT.post(`api/likes/create/${id}/`, like);
      if (data.error) {
        ErrorCatcher(data, "likeCreate");
      } else {
        // toastSuccessNotify("Beğeni başarıyla güncellendi.");
        // Eğer sunucu yanıtı ek güncellemeler gerektiriyorsa burada yapabilirsiniz
      }
    } catch (error) {
      console.error("🔭 ~ likeCreate ~ error ➡ ➡ ", error);
      const err = `Error ${error.response.status}: ${
        error.response?.data?.message ?? error.response?.statusText
      }`;
      dispatch(blogFail(error));
      toastErrorNotify(err);
      // Hata durumunda optimistik güncellemeyi geri alın
      dispatch(updateLike({ blogId: id, userId: like.userId }));
    }
  };

  const commentCreate = async (id, comment) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithJWT.post(
        `api/comments/create/${id}/`,
        comment
      );
      if (data.error) {
        ErrorCatcher(data, "commentCreate");
      } else {
        // Eski
        // const data = await getAllBlogsData();
        // dispatch(likeCommentChange());
        // return data.result.filter((blog) => blog._id === id)[0];

        // Yeni
        // Yorum oluşturulduktan sonra blog detaylarını yeniden fetch edin
        const updatedBlog = await getBlogData(id);
        if (updatedBlog) {
          dispatch(fetchBlogDetail.fulfilled(updatedBlog));
        }
        toastSuccessNotify("Comment successfully created.");
      }
    } catch (error) {
      console.error("🔭 ~ commentCreate ~ error ➡ ➡ ", error);
      const err = `Error ${error.response.status}: ${
        error.response?.data?.message ?? error.response?.statusText
      }`;
      dispatch(blogFail(error));
      toastErrorNotify(err);
    }
  };

  const editComment = async (id, comment) => {
    console.log("🔭 ~ editComment ~ comment ➡ ➡ ", comment);
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithJWT.put(`api/comments/${id}/`, comment);
      if (data.error) {
        ErrorCatcher(data, "editComment");
      } else {
        // Eski
        // await dispatch(fetchBlogDetail(comment.blogId._id));
        // dispatch(likeCommentChange());
        // const data = await getAllBlogsData();
        // return data.result.filter((blog) => blog._id === id)[0];

        // Yeni
        // Yorum düzenlendikten sonra ilgili blogun detaylarını yeniden fetch edin
        const updatedBlog = await getBlogData(comment.blogId._id);
        if (updatedBlog) {
          dispatch(fetchBlogDetail.fulfilled(updatedBlog));
        }
        toastSuccessNotify("Comment successfully edited.");
      }
    } catch (error) {
      console.error("🔭 ~ editComment ~ error ➡ ➡ ", error);
      const err = `Error ${error.response.status}: ${
        error.response?.data?.message ?? error.response?.statusText
      }`;
      dispatch(blogFail(error));
      toastErrorNotify(err);
    }
  };

  const deleteComment = async (id, comment) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithJWT.delete(`api/comments/${id}/`);
      if (data.error) {
        ErrorCatcher(data, "deleteComment");
      } else {
        // Eski
        // await dispatch(fetchBlogDetail(comment.blogId._id));
        // dispatch(likeCommentChange());
        // const data = await getAllBlogsData();
        // return data.result.filter((blog) => blog._id === id)[0];

        // Yeni
        // Yorum silindikten sonra ilgili blogun detaylarını yeniden fetch edin
        const updatedBlog = await getBlogData(comment.blogId._id);
        if (updatedBlog) {
          dispatch(fetchBlogDetail.fulfilled(updatedBlog));
        }
        toastSuccessNotify("Comment successfully deleted.");
      }
    } catch (error) {
      console.error("🔭 ~ deleteComment ~ error ➡ ➡ ", error);
      const err = `Error ${error.response.status}: ${
        error.response?.data?.message ?? error.response?.statusText
      }`;
      dispatch(blogFail(error));
      toastErrorNotify(err);
    }
  };

  const commentsToggler = (bool) => {
    dispatch(toggleComments(bool));
  };

  return {
    getAllBlogsData,
    getBlogData,
    postBlogData,
    editBlogData,
    deleteBlogData,
    getBlogCategories,
    likeCreate,
    commentCreate,
    editComment,
    deleteComment,
    commentsToggler,
    getUserBlogsData,
  };
};

export default useBlogCall;
