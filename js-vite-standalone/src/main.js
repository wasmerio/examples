let count = 0;

const button = document.querySelector('#counter');
button.addEventListener('click', () => {
  count += 1;
  button.textContent = `count is ${count}`;
});
