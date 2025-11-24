
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const sortCasinos = (list) =>
  [...list].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

export { debounce, sortCasinos };
