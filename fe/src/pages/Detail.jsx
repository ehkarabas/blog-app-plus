import { useLocation, useParams } from "react-router-dom";
import useBlogCall from "../hooks/useBlogCall";
import { useCallback, useEffect, useState } from "react";
import DetailsBlogCard from "../components/blog/DetailsBlogCard";
import { Helmet } from "react-helmet";
import { CircularProgress, Stack } from "@mui/material";
import { useSelector } from "react-redux";

const Detail = () => {
  const { getBlogData } = useBlogCall();
  const [detailBlog, setDetailBlog] = useState(null);
  const { id } = useParams();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  console.log("🔭 ~ Detail ~ state ➡ ➡ ", state);

  // onDataChange fonksiyonunu useCallback ile sarmalayarak memoize edin. Bu, fonksiyonun referansının sabit kalmasını sağlar ve useEffect içinde güvenli bir şekilde kullanılmasını mümkün kılar.
  const onDataChange = useCallback(async () => {
    setIsLoading(true);
    const data = await getBlogData(id);
    console.log("🔭 ~ onDataChange ~ data ➡ ➡ ", data);
    setDetailBlog(data);
    setIsLoading(false);
  }, [getBlogData, id]);

  useEffect(() => {
    if (state?.dashboardBlogDetail) {
      setDetailBlog(state?.dashboardBlogDetail);
    } else if (state?.userBlogDetail) {
      setDetailBlog(state?.userBlogDetail);
    } else {
      onDataChange();
    }
  }, []);

  if (isLoading) {
    return (
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        mt={2}
        sx={{
          width: "100%",
        }}
      >
        <CircularProgress color="success" />
      </Stack>
    );
  }

  return (
    <>
      <Helmet>
        <title>BlogApp - Detail</title>
      </Helmet>

      <DetailsBlogCard
        detailBlog={detailBlog}
        onDataChange={onDataChange}
        sx={{ margin: "auto !important" }}
      />
    </>
  );
};

export default Detail;
