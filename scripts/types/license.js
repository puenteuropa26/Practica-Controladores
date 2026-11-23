export class License {
    constructor({ id, software, version, price, key, featured, discount, category = '', description = '', image = '' }) {
        this.id = id;
        this.software = software;
        this.version = version;
        this.price = price;
        this.key = key;
        this.featured = featured;
        this.discount = discount;
        this.category = category;
        this.description = description;
        this.image = image;
    }

    getFinalPrice() {
        if (this.discount > 0) {
            return (this.price * (1 - this.discount / 100)).toFixed(2);
        }
        return this.price.toFixed(2);
    }

    
    Render(parent) {
        const card = document.createElement('article');
        card.className = 'license-card';
        if (this.featured) card.classList.add('featured');

        const finalPrice = this.getFinalPrice();
        const hasDiscount = this.discount > 0;

        card.innerHTML = `
            <div class="card-header">
                ${this.image ? `<img src="${this.image}" alt="${this.software}" class="card-img">` : ''}
                ${hasDiscount ? `<span class="badge-discount">-${this.discount}%</span>` : ''}
                ${this.featured ? `<span class="badge-featured">Destacado</span>` : ''}
            </div>
            <div class="card-body">
                <span class="card-category">${this.category}</span>
                <h3 class="card-title">${this.software} <small>v${this.version}</small></h3>
                <p class="card-desc">${this.description}</p>
            </div>
            <div class="card-footer">
                <div class="price-box">
                    ${hasDiscount ? `<span class="old-price">${this.price.toFixed(2)} €</span>` : ''}
                    <span class="final-price">${finalPrice} €</span>
                </div>
                <button type="button" class="btn-buy">Comprar</button>
            </div>
        `;

        const buyButton = card.querySelector('.btn-buy');
        buyButton.addEventListener('click', () => this.Buy());

        parent.appendChild(card);
    }

    Buy() {
        const modal = document.getElementById('license-modal');
        
        if (modal) {
            modal.querySelector('#modal-software').textContent = `${this.software} (v${this.version})`;
            modal.querySelector('#modal-key').textContent = this.key;
            modal.classList.add('active');
        } else {
            alert(`¡Gracias por tu compra!\n\nSoftware: ${this.software} v${this.version}\nTu clave de licencia: ${this.key}`);
        }
    }
}