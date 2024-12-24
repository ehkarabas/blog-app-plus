import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CircularProgress, Stack, Typography } from "@mui/material";
import useBlogCall from "../hooks/useBlogCall";
import MyBlogsBlogCard from "../components/blog/MyBlogsBlogCard";
import { Helmet } from "react-helmet";
import TablePagination from "@mui/material/TablePagination";
import Box from "@mui/material/Box";

const MyBlogs = () => {
  const { isDark } = useSelector((state) => state.theme);
  const { getUserBlogsData } = useBlogCall();
  const { userBlogs: userBlogsStore } = useSelector((state) => state.blog);
  const [userBlogs, setUserBlogs] = useState(userBlogsStore);
  const [isSingle, setIsSingle] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getUserBlogsData(page + 1);
      setUserBlogs(data.result);
      setTotalCount(data.details.totalRecord);
      setIsSingle(data.result.length <= 1);
      setIsLoading(false);
    };
    fetchData();
  }, [page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

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
        <title>BlogApp - User Blogs</title>
      </Helmet>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-evenly"
        flexWrap="wrap"
        sx={{ minHeight: "70vh" }}
      >
        {userBlogs.length === 0 ? (
          <Typography>No blogs to show</Typography>
        ) : (
          userBlogs.map((userBlog, index) => (
            <MyBlogsBlogCard
              userBlog={userBlog}
              isSingle={isSingle}
              key={`userblog-${index}`}
            />
          ))
        )}
      </Stack>

      <Box display="flex" justifyContent="center" padding="2em">
        <TablePagination
          component="div"
          count={totalCount ? totalCount : 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) =>
            setRowsPerPage(parseInt(event.target.value, 10))
          }
          rowsPerPageOptions={[10]}
          sx={{ textAlign: "center", color: isDark ? "yellow" : "black" }}
        />
      </Box>
    </>
  );
};

export default MyBlogs;
