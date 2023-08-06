import { useEffect } from "react";

function useBackground(doc: Document) {
  const layout = doc.getElementById("layout") as HTMLDivElement;

  /** select element that class has page perfix */
  const pageList = layout.querySelectorAll("[class^='page']");
  console.log(pageList);


}

export default useBackground