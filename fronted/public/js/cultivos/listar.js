document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("cultivos-list");

  try {
    const response = await fetch("http://localhost:3306/cultivo");
    if (!response.ok) throw new Error("Error al obtener cultivos");

    const cultivos = await response.json();

    cultivos.forEach(cultivo => {
      const div = document.createElement("div");
      div.classList.add("cultivo-card");
      div.innerHTML = `
        <h3>${cultivo.cultivoName}</h3>
        <p><strong>Tipo:</strong> ${cultivo.cultivoType}</p>
        <p><strong>ID:</strong> ${cultivo.cultivoID}</p>
        <p><strong>Tamaño:</strong> ${cultivo.size}</p>
        <p><strong>Ubicación:</strong> ${cultivo.location}</p>
        <p><strong>Estado:</strong> ${cultivo.state}</p>
        <p><strong>Descripción:</strong> ${cultivo.description}</p>
        ${cultivo.image ? `<img src="${cultivo.image}" alt="Imagen del cultivo">` : ""}
      `;
      contenedor.appendChild(div);
    });
  } catch (error) {
    contenedor.innerHTML = `<p class="error">No se pudieron cargar los cultivos.</p>`;
    console.error(error);
  }
});