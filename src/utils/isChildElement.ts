function isChildElement(childElement: HTMLElement, parentElement: HTMLElement) {
  let currentElement = childElement.parentNode;

  while (currentElement !== null) {
    if (currentElement === parentElement) {
      return true; // childElement是parentElement的子元素
    }
    currentElement = currentElement.parentNode;
  }

  return false; // childElement不是parentElement的子元素
}

export default isChildElement;
