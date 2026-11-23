import { LicenseController } from './controllers/licenseController.js';

const DATA_URL = './data/licenses.json';

const containers = {
    featured: document.getElementById('featured-container'),
    offers: document.getElementById('offers-container'),
    latest: document.getElementById('latest-container'),
    all: document.getElementById('all-container')
};

const filters = {
    searchInput: document.getElementById('filter-search'),
    categorySelect: document.getElementById('filter-category'),
    discountSelect: document.getElementById('filter-discount'),
    resetButton: document.getElementById('filter-reset')
};

const modal = {
    overlay: document.getElementById('license-modal'),
    closeBtn: document.getElementById('modal-close'),
    copyBtn: document.getElementById('modal-copy'),
    keyCode: document.getElementById('modal-key')
};

let controller = null;

function applyCatalogFilters() {
    if (!controller) return;

    const filtered = controller.filterLicenses({
        search: filters.searchInput ? filters.searchInput.value : '',
        category: filters.categorySelect ? filters.categorySelect.value : 'all',
        discountFilter: filters.discountSelect ? filters.discountSelect.value : 'all'
    });


    controller.RenderAll(null, containers.all, filtered);
}

function initFilters() {
    if (filters.searchInput) {
        filters.searchInput.addEventListener('input', applyCatalogFilters);
    }
    if (filters.categorySelect) {
        filters.categorySelect.addEventListener('change', applyCatalogFilters);
    }
    if (filters.discountSelect) {
        filters.discountSelect.addEventListener('change', applyCatalogFilters);
    }
    if (filters.resetButton) {
        filters.resetButton.addEventListener('click', () => {
            if (filters.searchInput) filters.searchInput.value = '';
            if (filters.categorySelect) filters.categorySelect.value = 'all';
            if (filters.discountSelect) filters.discountSelect.value = 'all';
            applyCatalogFilters();
        });
    }
}

function initModal() {
    if (!modal.overlay) return;

    const closeModal = () => {
        modal.overlay.classList.remove('active');
        if (modal.copyBtn) modal.copyBtn.textContent = 'Copiar';
    };

    if (modal.closeBtn) {
        modal.closeBtn.addEventListener('click', closeModal);
    }

    modal.overlay.addEventListener('click', (event) => {
        if (event.target === modal.overlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.overlay.classList.contains('active')) {
            closeModal();
        }
    });

    if (modal.copyBtn && modal.keyCode) {
        modal.copyBtn.addEventListener('click', async () => {
            const keyText = modal.keyCode.textContent.trim();
            if (!keyText) return;

            try {
                await navigator.clipboard.writeText(keyText);
                modal.copyBtn.textContent = '¡Copiada!';
                setTimeout(() => {
                    modal.copyBtn.textContent = 'Copiar';
                }, 1800);
            } catch {
                modal.copyBtn.textContent = 'Error';
            }
        });
    }
}

async function initApp() {
    initFilters();
    initModal();

    try {
        const response = await fetch(DATA_URL);
        if (!response.ok) {
            throw new Error(`No se pudo cargar ${DATA_URL} (estado ${response.status})`);
        }

        const licensesData = await response.json();
        controller = new LicenseController(licensesData);

        controller.RenderFeatured(3, containers.featured);
        controller.RenderOffers(3, containers.offers);
        controller.RenderLatest(3, containers.latest);
        controller.RenderAll(null, containers.all);
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        Object.values(containers).forEach((container) => {
            if (container) {
                container.innerHTML = '<p class="error-message">No se pudieron cargar las licencias. Revisa que estés ejecutando un servidor local.</p>';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', initApp);