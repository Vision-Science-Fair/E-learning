const title = document.querySelector(".title");

  title.addEventListener("animationend", () => {
    title.style.borderRight = "none";
  });