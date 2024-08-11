function addZero(num: number) {
  return num < 10 ? `0${num}` : num;
}

export default function getTime() {
  // hh:mm:ss
  const date = new Date();

  return `${addZero(date.getHours())}:${addZero(date.getMinutes())}:${addZero(
    date.getSeconds(),
  )}`;
}
