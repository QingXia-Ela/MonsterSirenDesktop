import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import { FunctionComponent, PropsWithChildren, useState } from "react";

interface DialogStoryProps extends PropsWithChildren {
  title: string
}

const DialogStory: FunctionComponent<DialogStoryProps> = ({ title, children }) => {
  const [open, setOpen] = useState(false)
  const handleClose = () => {

    setOpen(false)
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <Dialog
        title={title}
        onClose={handleClose}
        open={open}
      >{children}</Dialog>
    </>
  );
}

export default DialogStory;