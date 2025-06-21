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
          <td class="px-4 py-2  bg-white sticky left-0 z-10">
            <img src="https://qiziyaqqptpwcarbywsx.supabase.co/storage/v1/object/public/imagenes/products/${product.image}" alt="${product.name}" class="w-16 h-16 object-cover rounded" />
          </td>
          <td class="px-4 py-2 ">${product.name}</td>
          <td class="px-4 py-2">${product.brand}</td>
          <td class="px-4 py-2">${product.category}</td>
          <td class="px-4 py-2 hidden md:table-cell">S/ ${product.price.toFixed(2)}</td>
          <td class="px-4 py-2">S/ ${product.price_end.toFixed(2)}</td>
          <td class="px-4 py-2">${product.stock}</td>
          <td class="px-4 py-2 hidden  md:table-cell">${product.message_stock}</td>
          <td class="px-4 py-2">
            <div class="btn-group" role="group">
               ${product.state === 'A'
                  ? `<button type="button" class="btn btn-danger btn-sm me-2" title="Eliminar" onclick="setProductState(${product.id_product}, 'inactive')">
                        <i class="fas fa-trash-alt"></i>
                    </button>`
                  : `<button type="button" class="btn btn-success btn-sm me-2" title="Restaurar" onclick="setProductState(${product.id_product}, 'active')">
                        <i class="fas fa-undo-alt"></i>
                    </button>`
                }
              <button type="button" class="btn btn-secondary btn-sm me-2" title="Vista Previa" onclick="showPreviewModal(${allProducts.indexOf(product)})">
                <i class="fas fa-eye"></i>
              </button>
              <button type="button" class="btn btn-primary btn-sm me-2" title="Editar">
                  <i class="fas fa-edit"></i>
              </button>
            </div>
          </td>
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
    const matchesSearch = (product.name?.toLowerCase().includes(searchInput) || false) ||
                          (product.category?.toLowerCase().includes(searchInput) || false) ||
                          (product.brand?.toLowerCase().includes(searchInput) || false);

    const matchesCategory = selectedCategory === 'all' ||
                            product.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesStock = selectedStock === 'all' ||
                         product.message_stock.toLowerCase() === selectedStock.toLowerCase();

    return matchesSearch && matchesCategory && matchesStock;
  });

  renderProducts(filtered);
}

// FUNCION PARA ELIMINAR Y RESTAURAR
async function setProductState(id_product, action) {
    try {
        const response = await fetch(`${BASE_API_URL}/${id_product}/${action}`, {
            method: 'PUT',
        });

        if (!response.ok) throw new Error(`No se pudo ${action === 'inactive' ? 'eliminar' : 'restaurar'} el producto`);

        await fetchProducts(); // recarga la lista actual
    } catch (error) {
        console.error(error);
        alert('Error al actualizar el estado del producto');
    }
}




// Al cargar la página, mostrar productos activos
window.onload = () => fetchProducts('/active', 'Activos');
