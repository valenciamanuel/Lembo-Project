// /fronted/public/js/componets/gov.js
document.addEventListener("DOMContentLoaded", () => {

  // Header GOV.CO
  fetch("/fronted/public/css/componentshtml/header.html")
    .then(res => {
      if (!res.ok) throw new Error("No se pudo cargar header.html");
      return res.text();
    })
    .then(html => {
      document.body.insertAdjacentHTML("afterbegin", html);
    })
    .catch(err => console.error("Error cargando header:", err));

  // Footer GOV.CO
  fetch("/fronted/public/css/componentshtml/footer.html")
    .then(res => {
      if (!res.ok) throw new Error("No se pudo cargar footer.html");
      return res.text();
    })
    .then(html => {
      document.body.insertAdjacentHTML("beforeend", html);
    })
    .catch(err => console.error("Error cargando footer:", err));

});
