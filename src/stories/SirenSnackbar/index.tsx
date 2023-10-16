import Button from "@/components/Button";
import Snackbar from "@/components/Snackbar";
import { IconButton, Slide, SlideProps } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";

type TransitionProps = Omit<SlideProps, 'direction'>;

function TransitionLeft(props: TransitionProps) {
  return <Slide {...props} direction="left" />;
}

function SnackbarStory() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const Action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <CloseIcon style={{
        fontSize: ".4rem"
      }} />
    </IconButton>
  )

  return (
    <>
      <Button onClick={handleClick}>Open Snackbar</Button>
      <Snackbar
        anchorOrigin={{ "horizontal": "right", "vertical": "bottom" }}
        title="标题"
        content="具体设置请参考 src/stories/SirenSnackbar/index.tsx"
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        TransitionComponent={TransitionLeft}
        action={Action}
      />
    </>
  );
}

export default SnackbarStory;