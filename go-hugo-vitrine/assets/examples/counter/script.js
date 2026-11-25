const button = document.getElementById("counter");
const output = button.querySelector("output");
let count = 0;

button.addEventListener("click", () => {
  count += 1;
  output.value = count;
});
