console.log("filteranimals loaded");

const animalFilterForm = document.querySelector("#animalFilter");
const typeCheckbox = document.querySelector(".typeCheckbox");

console.log(animalFilterForm);

animalFilterForm.addEventListener("change", (event) => {
  animalFilterForm.submit();
});
