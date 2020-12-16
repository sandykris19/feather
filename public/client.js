console.log("Running client side JS");

const md_button = document.querySelector(".md-help button");
const md_text = document.querySelector(".md-text");
const textinput = document.getElementById("markdown");

md_button.addEventListener("click", (e) => {
  e.preventDefault();
  md_text.classList.toggle("hide");
});

textinput.addEventListener("keyup", (e) => {
  console.log(textinput.value);
  document.querySelector(".marked").innerHTML = marked(`${textinput.value}`);
});
