import { useEffect, useState } from "react";
import useBlogCall from "../hooks/useBlogCall";
import {
  Stack,
  Box,
  TablePagination,
  Typography,
  CircularProgress,
} from "@mui/material";
import BlogCard from "../components/blog/BlogCard";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";

// 1. Beğeni Butonuna Tıklama:
// likeCreate fonksiyonu çağrılır.
// updateLike aksiyonu dispatch edilir ve Redux store'daki ilgili blog nesnesi güncellenir.
// blogList array'inin referansı değişir çünkü Immer, nested değişiklikler yapıldığında array'in referansını günceller.

// 2. Dashboard Bileşeni:
// useSelector ile bağlanan blogList güncellenir.
// Dashboard yeniden render edilir ve blogList.map ile yeni BlogCard bileşenleri oluşturulur.
// Ancak, React.memo sayesinde sadece blog prop'u değişen BlogCard yeniden render edilir.

// 3.BlogCard Bileşeni:
// Güncellenen blog nesnesi için React.memo sayesinde BlogCard yeniden render edilir ve yeni beğeni sayısını gösterir.
// Diğer BlogCard bileşenleri aynı referanslara sahip oldukları için yeniden render edilmezler.

// useSelector hook'u, Redux store'undaki belirli bir state parçasını seçmenizi sağlar. Bu state parçası değiştiğinde, useSelector'u kullanan bileşen otomatik olarak yeniden render edilir.

// react useEffect dependency'deki ref degisikliginde calisiyor ama aslinda burada olan sey tum component'i render'a tetiklememesi, sadece bir sideEffect kontrolu var, component body'e koyulan console.log lar calismaz. eger bu sideEffect icinde state degisirse tum component yeniden render oluyor, component body'e koyulan console.log lar calisiyor bu durumda.

// redux state'indeki degisiklik de react state degisikligine benzer calisiyor. useSelector ile cagiran bir component varsa, o state'te bir ref degisikligi oldugunda bu component tamamen rerender oluyor, bir side effect durumu yok yani, component body'e koyulan console.log lar calisiyor.

// react memo kullanilmazsa dashboard'ta cagirilan blogList ref'i degistigi icin dashboard tamamen rerender oluyor ve alt bilesenleri de oyle. ama kullanilirsa sadece prop'u degisenler rerender oluyor ve bir optimizasyon saglaniyor.

const Dashboard = () => {
  const { isDark } = useSelector((state) => state.theme);
  // const { blogList, likeCommentChange } = useSelector((state) => state.blog);
  const { blogList } = useSelector((state) => state.blog);
  const { getAllBlogsData } = useBlogCall();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getAllBlogsData(page + 1);
      setTotalCount(data.details.totalRecords);
      setIsLoading(false);
    };
    fetchData();
  }, [page]);
  // }, [page, likeCommentChange]);

  // uncomment to understand react memo and redux useSelector state change effect
  // console.log("DASHBOARD RERENDER");

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
        <title>BlogApp - Dashboard</title>
      </Helmet>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-evenly"
        flexWrap="wrap"
        sx={{ minHeight: "70vh" }}
      >
        {blogList.length === 0 ? (
          <Typography>No blogs to show</Typography>
        ) : (
          blogList.map((blog) => {
            return <BlogCard key={blog._id} blog={blog} />;
          })
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

export default Dashboard;
