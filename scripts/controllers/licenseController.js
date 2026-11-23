import { License } from '../types/license.js';

export class LicenseController {
    constructor(licensesData = []) {
        this.licenses = licensesData.map((item) => new License(item));
    }

    compareVersions(versionA, versionB) {
        const partsA = String(versionA).split('.').map((n) => parseFloat(n) || 0);
        const partsB = String(versionB).split('.').map((n) => parseFloat(n) || 0);
        const maxLen = Math.max(partsA.length, partsB.length);

        for (let i = 0; i < maxLen; i++) {
            const a = partsA[i] ?? 0;
            const b = partsB[i] ?? 0;
            if (a !== b) return a - b;
        }
        return 0;
    }

    renderList(list, parent) {
        if (!parent) return;
        parent.innerHTML = '';

        if (list.length === 0) {
            parent.innerHTML = '<p class="empty-message">No se encontraron licencias con esos criterios.</p>';
            return;
        }

        list.forEach((license) => license.Render(parent));
    }

    RenderFeatured(count, parent) {
        const featured = this.licenses
            .filter((license) => Boolean(license.featured))
            .slice(0, count);

        this.renderList(featured, parent);
    }

    RenderOffers(count, parent) {
        const offers = this.licenses
            .filter((license) => Number(license.discount) > 0)
            .sort((a, b) => Number(b.discount) - Number(a.discount))
            .slice(0, count);

        this.renderList(offers, parent);
    }

    RenderLatest(count, parent) {
        const latestBySoftware = new Map();

        for (const license of this.licenses) {
            const key = license.software.trim().toLowerCase();
            const current = latestBySoftware.get(key);

            if (!current || this.compareVersions(license.version, current.version) > 0) {
                latestBySoftware.set(key, license);
            }
        }

        const latestList = Array.from(latestBySoftware.values()).slice(0, count);
        this.renderList(latestList, parent);
    }

    RenderAll(count, parent, customList = null) {
        const source = Array.isArray(customList) ? [...customList] : [...this.licenses];

        for (let i = source.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [source[i], source[j]] = [source[j], source[i]];
        }

        const result = typeof count === 'number' && count > 0
            ? source.slice(0, count)
            : source;

        this.renderList(result, parent);
    }

    filterLicenses({ search = '', category = 'all', discountFilter = 'all' } = {}) {
        const normalizedSearch = search.trim().toLowerCase();

        return this.licenses.filter((license) => {
            const matchesSearch =
                !normalizedSearch ||
                license.software.toLowerCase().includes(normalizedSearch) ||
                String(license.version).toLowerCase().includes(normalizedSearch) ||
                license.description.toLowerCase().includes(normalizedSearch);

            const matchesCategory =
                category === 'all' || license.category === category;

            let matchesDiscount = true;
            if (discountFilter === 'discounted') {
                matchesDiscount = Number(license.discount) > 0;
            } else if (discountFilter === 'featured') {
                matchesDiscount = Boolean(license.featured);
            }

            return matchesSearch && matchesCategory && matchesDiscount;
        });
    }
}