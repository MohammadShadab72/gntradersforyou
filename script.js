// ============ GLOBAL VARIABLES ============
const WHATSAPP_NUMBER = '919587716650';

// ============ UPDATE SELECTED COUNT (Only if elements exist) ============
function updateSelectedCount() {
    const selectedCountEl = document.getElementById('selectedCount');
    const sendBulkOrderBtn = document.getElementById('sendBulkOrderBtn');
    const checkedBoxes = document.querySelectorAll('.product-select:checked');
    
    if (selectedCountEl) {
        selectedCountEl.textContent = checkedBoxes.length;
    }
    if (sendBulkOrderBtn) {
        sendBulkOrderBtn.disabled = (checkedBoxes.length === 0);
        sendBulkOrderBtn.style.opacity = (checkedBoxes.length === 0) ? '0.6' : '1';
    }
}

const allCheckboxes = document.querySelectorAll('.product-select');
if (allCheckboxes.length > 0) {
    allCheckboxes.forEach(cb => {
        cb.addEventListener('change', updateSelectedCount);
    });
    updateSelectedCount();
}

// ============ LIVE SEARCH FILTER ============
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

function filterProducts() {
    if (!searchInput) return;
    const query = searchInput.value.toLowerCase().trim();
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const title = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
        const price = card.querySelector('.price') ? card.querySelector('.price').textContent.toLowerCase() : '';
        const brand = card.querySelector('.brand-tag') ? card.querySelector('.brand-tag').textContent.toLowerCase() : '';

        if (title.includes(query) || price.includes(query) || brand.includes(query)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

if (searchInput) searchInput.addEventListener('keyup', filterProducts);
if (searchBtn) searchBtn.addEventListener('click', filterProducts);

// ============ SINGLE PRODUCT "BUY NOW" (WHATSAPP) ============
function sendSingleOrder(button, productName, unit) {
    const card = button.closest('.product-card');
    const qtyInput = card ? card.querySelector('.product-qty') : null;
    const quantity = qtyInput ? qtyInput.value : 1;

    const message = `🛒 *New Single Order Enquiry*%0A%0A📦 *Product:* ${productName}%0A🔢 *Quantity:* ${quantity} ${unit}%0A💰 *Price:* (Please confirm current mandi rate)%0A%0A➡️ From: Website Order`;
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappURL, '_blank');
}

// ============ MULTI-ORDER WHATSAPP ============
function sendMultiOrderWhatsApp() {
    const checkedBoxes = document.querySelectorAll('.product-select:checked');
    if (checkedBoxes.length === 0) {
        alert('⚠️ Kripya kam se kam ek grocery item select karein!');
        return;
    }

    let orderLines = '';
    checkedBoxes.forEach(cb => {
        const card = cb.closest('.product-card');
        const name = cb.getAttribute('data-name');
        const unit = cb.getAttribute('data-unit');
        const qtyInput = card ? card.querySelector('.product-qty') : null;
        const quantity = qtyInput ? qtyInput.value : 1;
        orderLines += `• ${name} — ${quantity} ${unit}%0A`;
    });

    const message = `📋 *Bulk Grocery Order Enquiry*%0A%0A${orderLines}%0A📍 *Delivery:* Banswara%0A💰 *Kripya mandi wholesale rates batayein*%0A%0A➡️ From: Website Order`;
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappURL, '_blank');
}

// ============ ORDER FORM SUBMISSION ============
const orderForm = document.getElementById('orderForm');
if (orderForm) {
    orderForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const clientName = document.getElementById('clientName') ? document.getElementById('clientName').value.trim() : '';
        const businessType = document.getElementById('businessType') ? document.getElementById('businessType').value : '';
        const phoneNumber = document.getElementById('phoneNumber') ? document.getElementById('phoneNumber').value.trim() : '';
        const orderDetails = document.getElementById('orderDetails') ? document.getElementById('orderDetails').value.trim() : '';

        if (!clientName || !phoneNumber || !orderDetails) {
            alert('⚠️ Kripya sabhi required fields bharein!');
            return;
        }

        const message = `📝 *New Order / Rate Quotation Request*%0A%0A👤 *Name:* ${encodeURIComponent(clientName)}%0A🏢 *Business:* ${encodeURIComponent(businessType)}%0A📞 *Phone:* ${encodeURIComponent(phoneNumber)}%0A%0A📦 *Order Details:*%0A${encodeURIComponent(orderDetails)}%0A%0A➡️ From: Website Order`;
        const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
        window.open(whatsappURL, '_blank');

        this.reset();
        alert('✅ Aapka order WhatsApp par bhej diya gaya hai!');
    });
}

// ============ STICKY MULTI-ORDER BAR VISIBILITY ============
const productsSection = document.getElementById('products');
const multiOrderBar = document.querySelector('.multi-order-bar');

function toggleMultiOrderBar() {
    if (!productsSection || !multiOrderBar) return;
    const rect = productsSection.getBoundingClientRect();
    const isVisible = rect.bottom > 200 && rect.top < window.innerHeight;
    multiOrderBar.style.display = isVisible ? 'flex' : 'none';
}

if (productsSection && multiOrderBar) {
    window.addEventListener('scroll', toggleMultiOrderBar);
    toggleMultiOrderBar();
}

document.addEventListener('DOMContentLoaded', () => {
    // getElementsByClassName ya querySelectorAll use karenge taaki sabhi pages par chale
    const menuToggles = document.querySelectorAll('.menu-toggle');
    const navLinksList = document.querySelectorAll('.nav-links');
    const body = document.body;

    menuToggles.forEach((menuToggle, index) => {
        const navLinks = navLinksList[index] || document.querySelector('.nav-links');

        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                navLinks.classList.toggle('active');
                body.classList.toggle('menu-open');

                // Icon toggle between Bars and Cross (X)
                const icon = menuToggle.querySelector('i');
                if (navLinks.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });

            // Jab user menu ke kisi link par click kare, toh menu auto-close ho jaye
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    body.classList.remove('menu-open');
                    const icon = menuToggle.querySelector('i');
                    if(icon) {
                        icon.classList.remove('fa-xmark');
                        icon.classList.add('fa-bars');
                    }
                });
            });
        }
    });

    // Dark overlay background par click karne se menu band ho jaye
    document.addEventListener('click', (e) => {
        navLinksList.forEach((navLinks, index) => {
            const menuToggle = menuToggles[index];
            if (navLinks && navLinks.classList.contains('active') && !navLinks.contains(e.target) && menuToggle && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
                const icon = menuToggle.querySelector('i');
                if(icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });
});

// 1. Thumbnail click hone par Main Image badalne ke liye
function switchMedia(mainImageId, newSource) {
    const mainImg = document.getElementById(mainImageId);
    if(mainImg) {
        mainImg.src = newSource;
    }
    
    // Active thumbnail class handle karne ke liye
    const currentThumb = event.currentTarget;
    const parentContainer = currentThumb.parentElement;
    const allThumbs = parentContainer.querySelectorAll('.thumb');
    
    allThumbs.forEach(thumb => thumb.classList.remove('active'));
    currentThumb.classList.add('active');
}