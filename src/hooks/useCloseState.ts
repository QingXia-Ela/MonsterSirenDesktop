import IterParentElement from "@/utils/iterParentElement";
import { useState } from "react";

export default function useCloseState(parentAttr: string): [boolean, (e: React.MouseEvent) => void] {
  const [open, setOpen] = useState(false);

  const close = () => {
    window.removeEventListener("click", close);
    setOpen(false);
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!open) {
      setOpen(true);
      requestAnimationFrame(() => {
        window.addEventListener("click", close);
      });
    }
    if (IterParentElement(e.target as HTMLElement, (e) => e.hasAttribute(parentAttr))) {
      e.stopPropagation()
    }
  }

  return [open, handleClick]
}