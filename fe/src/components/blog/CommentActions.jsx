import { Button, Stack } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CloseIcon from "@mui/icons-material/Close";

const CommentActions = ({ isEditing, setIsEditing, setDeleteModalOpen }) => {
  return (
    <Stack direction="row" spacing={1}>
      <Button
        variant="contained"
        color="warning"
        onClick={() => setIsEditing(true)}
      >
        <EditIcon />
      </Button>

      <Button
        variant="contained"
        color="error"
        onClick={(e) => {
          setDeleteModalOpen(true);
        }}
      >
        <DeleteForeverIcon />
      </Button>

      {isEditing && (
        <Button variant="outlined" onClick={() => setIsEditing(false)}>
          <CloseIcon />
        </Button>
      )}
    </Stack>
  );
};

export default CommentActions;
