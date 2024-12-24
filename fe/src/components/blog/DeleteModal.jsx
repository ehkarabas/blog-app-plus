import Button from "@mui/material/Button";
import useBlogCall from "../../hooks/useBlogCall";
import { useNavigate } from "react-router-dom";
import { Modal, Paper, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { fetchBlogDetail } from "../../features/blogSlice";
import { useDispatch } from "react-redux";

const deleteModalStyle = {
  position: "absolute",
  top: "50vh",
  left: "50vw",
  transform: "translate(-50%, -50%)",
  minWidth: "270px",
  width: "50%",
  maxWidth: "768px",
  p: 2,
};

const DeleteModal = ({
  id,
  item,
  deleteModalOpen,
  setDeleteModalOpen,
  comment,
}) => {
  const { deleteBlogData, deleteComment } = useBlogCall();
  const { blogDetail } = useSelector((state) => state.blog);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClose = () => {
    setDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (item === "blog") {
      await deleteBlogData(id);
      handleClose();
      navigate("/");
    }
    if (item === "comment") {
      await deleteComment(id, comment);
      // await dispatch(fetchBlogDetail(comment.blogId._id));
      handleClose();
      navigate(`/detail/${blogDetail._id}`);
    }
  };

  return (
    <div>
      <Modal
        open={deleteModalOpen}
        onClose={handleClose}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <Paper sx={deleteModalStyle} elevation={5}>
          <Stack spacing={2}>
            <Typography variant="h5">
              {`Would you like to delete this ${item}?`}
            </Typography>
            <Typography variant="h6">
              This action cannot be revertable.
            </Typography>
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button onClick={handleClose}>No</Button>
              <Button onClick={handleDelete}>Yes</Button>
            </Stack>
          </Stack>
        </Paper>
      </Modal>
    </div>
  );
};

export default DeleteModal;
