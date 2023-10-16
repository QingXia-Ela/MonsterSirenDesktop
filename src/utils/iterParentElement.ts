export default function IterParentElement(
  element: HTMLElement,
  callback: (element: HTMLElement) => boolean,
) {
  let currentElement = element;

  while (currentElement !== null) {
    if (callback(currentElement)) {
      console.log(1);

      return true; // childElement是parentElement的子元素
    }
    currentElement = currentElement.parentNode as HTMLElement;
  }

  return false;
}
