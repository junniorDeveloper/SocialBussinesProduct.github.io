// Variable global para almacenar todos los productos
let allProducts = [];

// Función para obtener productos desde un endpoint
async function fetchProducts(endpoint = '/active', tipo = 'Activos') {
    try {
        const response = await fetch(`${BASE_API_URL}${endpoint}`);
        const products = await response.json();
        allProducts = products; // Guardamos productos globalmente

        document.getElementById('page-title').textContent = `Lista de Productos ${tipo}`;
        renderProducts(allProducts); // Renderizamos al inicio
    } catch (error) {
        console.error('Error al obtener los productos:', error);
    }
}

// Función para renderizar productos en la tabla
function renderProducts(products) {
    const tableBody = document.getElementById('products-table-body');
    tableBody.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.classList.add('border-b');

        row.innerHTML = `
          <td class="px-4 py-2">
            <img src="https://qiziyaqqptpwcarbywsx.supabase.co/storage/v1/object/public/imagenes/products/${product.image}" alt="${product.name}" class="w-16 h-16 object-cover rounded" />
          </td>
          <td class="px-4 py-2">${product.name}</td>
          <td class="px-4 py-2">${product.category}</td>
          <td class="px-4 py-2 truncate-text">${product.description}</td>
          <td class="px-4 py-2">S/ ${product.price.toFixed(2)}</td>
          <td class="px-4 py-2">S/ ${product.price_end.toFixed(2)}</td>
          <td class="px-4 py-2">${product.stock}</td>
          <td class="px-4 py-2">${product.message_stock}</td>
          <td class="px-4 py-2">${product.state}</td>
        `;

        tableBody.appendChild(row);
    });
}


// Variables globales para filtros
let selectedCategory = 'all';
let selectedStock = 'all';

// Evento de búsqueda por texto
document.getElementById('searchInput').addEventListener('input', function () {
  applyFilters();
});

// Evento de selección de categoría
document.getElementById('categoryFilter').addEventListener('click', function (e) {
  if (e.target && e.target.matches('a.dropdown-item')) {
    selectedCategory = e.target.getAttribute('data-category');
    applyFilters();
  }
});

// Evento de selección de estado de stock
document.getElementById('stockFilter').addEventListener('click', function (e) {
  if (e.target && e.target.matches('a.dropdown-item')) {
    selectedStock = e.target.getAttribute('data-stock');
    applyFilters();
  }
});

// Función para aplicar todos los filtros combinados
function applyFilters() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();

  const filtered = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchInput) ||
                          product.category.toLowerCase().includes(searchInput);

    const matchesCategory = selectedCategory === 'all' ||
                            product.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesStock = selectedStock === 'all' ||
                         product.message_stock.toLowerCase() === selectedStock.toLowerCase();

    return matchesSearch && matchesCategory && matchesStock;
  });

  renderProducts(filtered);
}



// Al cargar la página, mostrar productos activos
window.onload = () => fetchProducts('/active', 'Activos');
