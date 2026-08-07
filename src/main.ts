import './index.css';
import { CURRENCY, CONTACT_INFO, SITE_ASSETS, SITE_TEXT, PRODUCT_DATA, PAGE_HEADLINES, SERVICE_DOMAINS } from './data';

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw903DHo7bhOgBjFmbAHg011L4uuABUxB6bjjZOdJqGYNHjWTOS4gG5dxGkgFTME_qD/exec";

// ====== State ======
let cart: any[] = [];
let currentProducts = [...PRODUCT_DATA];
const PRODUCTS_PER_PAGE = 10;
let currentPage = 1;
let currentCategory = 'robots'; // default
let selectedDomains: string[] = [];
let autoSlideInterval: ReturnType<typeof setInterval>;
let discountApplied = false;

// ====== Portfolio Data ======
const portfolioVideos = [
  //{ id: 'dQw4w9WgXcQ', title: 'Line Follower Robot Demo' },
  //{ id: 'tPEE9ZwTmy0', title: 'Solar Panel Installation Timelapse' },
  //{ id: '5qap5aO4i9A', title: 'Custom AI Object Detection' },
  //{ id: '4CJ1-Rk2x1c', title: 'Drone Agriculture in Action' },
  //{ id: '9lXf8I-oF3U', title: 'Healthcare Assistant Robot' },
  //{ id: 'M-W-0t4K004', title: 'Industrial Automation Setup' },
  //{ id: 'Y88kGus7eYw', title: 'Security Surveillance System' },
  //{ id: 'qYmIb-QoJ34', title: 'R&D Lab Tour' },
  //{ id: 'W0LHTWG-UmQ', title: 'Smart Agriculture Robot' },
  //{ id: 'kJQP7kiw5Fk', title: 'Off-grid Solar Plant Setup' },
];

// ====== Elements ======
const appContainer = document.getElementById('app-container');
const views = document.querySelectorAll('.view');
const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileNav = document.getElementById('mobile-nav');

// ====== Cart Elements ======
const cartBtn = document.getElementById('header-cart-btn');
const cartBadge = document.getElementById('header-cart-badge');
const cartFloatingBtn = document.getElementById('cart-toggle-btn');
const cartFloatBadge = document.getElementById('cart-float-badge');

// Forms & specific inputs
const rndForm = document.getElementById('rnd-form') as HTMLFormElement;
const solarForm = document.getElementById('solar-form') as HTMLFormElement;
const smartHomeForm = document.getElementById('smart-home-form') as HTMLFormElement;
const checkoutForm = document.getElementById('checkout-form') as HTMLFormElement;
const checkoutItemsContainer = document.getElementById('checkout-items');
const checkoutTotal = document.getElementById('checkout-total');
const pmtModal = document.getElementById('payment-modal');

// Coupon Elements
const couponInput = document.getElementById('chk-coupon') as HTMLInputElement;
const couponBtn = document.getElementById('chk-coupon-btn');
const couponMsg = document.getElementById('coupon-msg');

// Product Detail Elements
const prodDetailImage = document.getElementById('product-detail-image') as HTMLImageElement;
const prodDetailDots = document.getElementById('product-detail-dots');
const prodDetailCategory = document.getElementById('product-detail-category');
const prodDetailTitle = document.getElementById('product-detail-title');
const prodDetailDesc = document.getElementById('product-detail-desc');
const prodDetailVariantsContainer = document.getElementById('product-detail-variants-container');
const prodDetailVariantSelect = document.getElementById('product-detail-variant-select') as HTMLSelectElement;
const prodDetailPrice = document.getElementById('product-detail-price');
const prodDetailAddBtn = document.getElementById('product-detail-add-btn');
const prodDetailWaBtn = document.getElementById('product-detail-wa-btn');
const prodDetailCartCount = document.getElementById('product-detail-in-cart-count');
const prodDetailLongDesc = document.getElementById('product-detail-long-desc');

// Portfolio Elements
const portfolioGrid = document.getElementById('portfolio-grid');

// E-commerce Elements
const productsGrid = document.getElementById('products-grid');
const tabs = document.querySelectorAll('.ecom-tab-btn');
const sortSelect = document.getElementById('product-sort') as HTMLSelectElement;
const paginationControls = document.getElementById('pagination-controls');
const pageNumbers = document.getElementById('page-numbers');
const prevPageBtn = document.getElementById('prev-page') as HTMLButtonElement;
const nextPageBtn = document.getElementById('next-page') as HTMLButtonElement;

// ====== Router logic ======
function navigateTo(routeId: string) {
  // Update views
  views.forEach(v => {
    if (v.id === `view-${routeId}`) {
      v.classList.remove('hidden');
      v.classList.add('active');
    } else {
      v.classList.add('hidden');
      v.classList.remove('active');
    }
  });

  // Update document.title
  switch (routeId) {
    case 'ecommerce':
      document.title = 'WingsTech - Robot Shop';
      break;
    case 'solar':
      document.title = 'WingsTech - Solar PV Setup';
      break;
    case 'rnd':
    case 'rnd-form':
      document.title = 'WingsTech - R&D Solutions';
      break;
    case 'smart-home':
      document.title = 'WingsTech - Smart Home';
      break;
    default:
      document.title = 'WingsTech';
  }

  // Update nav active states
  navLinks.forEach(link => {
    if (link.getAttribute('data-route') === routeId) {
      link.classList.add('text-cyan-600');
      link.classList.remove('text-slate-600');
    } else {
      link.classList.remove('text-cyan-600');
      link.classList.add('text-slate-600');
    }
  });

  mobileNav?.classList.add('hidden'); // Close mobile menu if open
  window.scrollTo(0, 0);

  // Hook specific route logic
  if (routeId === 'ecommerce') {
    renderProducts();
  } else if (routeId === 'checkout') {
    renderCheckoutSummary();
  } else if (routeId === 'portfolio') {
    renderPortfolio();
  }
}

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const route = link.getAttribute('data-route');
    if (route) {
      if (route === 'solar-install') {
        const formTitle = document.getElementById('rnd-form-title');
        if (formTitle) formTitle.textContent = 'Inquiry for: Solar Installation';
        const catInput = document.getElementById('rnd-category-input');
        if (catInput) catInput.setAttribute('value', 'Solar Installation');
        
        const otherContainer = document.getElementById('rnd-other-domain-container');
        if (otherContainer) otherContainer.classList.add('hidden');
        const otherInput = document.getElementById('rnd-other-domain') as HTMLInputElement;
        if (otherInput) otherInput.required = false;
        
        navigateTo('rnd-form');
        return;
      }
      
      navigateTo(route);
      const cat = link.getAttribute('data-category');
      if (cat && route === 'ecommerce') {
        currentCategory = cat;
        tabs.forEach(t => t.classList.remove('active', 'text-cyan-700', 'bg-cyan-50'));
        tabs.forEach(t => t.classList.add('text-slate-600'));
        const activeTab = document.querySelector(`.ecom-tab-btn[data-tab="${cat}"]`);
        activeTab?.classList.add('active', 'text-cyan-700', 'bg-cyan-50');
        activeTab?.classList.remove('text-slate-600');
        currentPage = 1;
        applyFiltersAndSort();
      }
    }
  });
});

mobileMenuBtn?.addEventListener('click', () => {
  mobileNav?.classList.toggle('hidden');
});

// ====== Hero section carousel ======
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.hero-dot');
const heroNext = document.getElementById('hero-next');
let currentSlide = 0;

function showSlide(index: number) {
  heroSlides.forEach((slide, i) => {
    if (i === index) {
      slide.classList.replace('opacity-0', 'opacity-100');
      slide.classList.replace('z-0', 'z-10');
      heroDots[i].classList.replace('opacity-50', 'opacity-100');
    } else {
      slide.classList.replace('opacity-100', 'opacity-0');
      slide.classList.replace('z-10', 'z-0');
      heroDots[i].classList.replace('opacity-100', 'opacity-50');
    }
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % heroSlides.length;
  showSlide(currentSlide);
}

autoSlideInterval = setInterval(nextSlide, 5000);

heroNext?.addEventListener('click', () => {
  clearInterval(autoSlideInterval);
  nextSlide();
});

heroDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    clearInterval(autoSlideInterval);
    currentSlide = index;
    showSlide(currentSlide);
  });
});

// ====== Ecommerce rendering with Sort & Pagination ======
tabs.forEach(tab => {
  tab.addEventListener('click', (e) => {
    tabs.forEach(t => {
      t.classList.remove('active', 'text-cyan-700', 'bg-cyan-50');
      t.classList.add('text-slate-600');
    });
    
    const target = e.currentTarget as HTMLElement;
    target.classList.add('active', 'text-cyan-700', 'bg-cyan-50');
    target.classList.remove('text-slate-600');
    
    currentCategory = target.getAttribute('data-tab') || 'robots';
    currentPage = 1;
    applyFiltersAndSort();
  });
});

sortSelect?.addEventListener('change', () => {
  currentPage = 1;
  applyFiltersAndSort();
});

function applyFiltersAndSort() {
  let filtered = PRODUCT_DATA.filter(p => p.category === currentCategory);
  
  const sortVal = sortSelect.value;
  if (sortVal === 'price-asc') {
    filtered.sort((a, b) => (a.variants && a.variants.length > 0 ? a.variants[0].price : 0) - (b.variants && b.variants.length > 0 ? b.variants[0].price : 0));
  } else if (sortVal === 'price-desc') {
    filtered.sort((a, b) => (b.variants && b.variants.length > 0 ? b.variants[0].price : 0) - (a.variants && a.variants.length > 0 ? a.variants[0].price : 0));
  } else if (sortVal === 'name-asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  currentProducts = filtered;
  renderProducts();
}

function renderProducts() {
  if (!productsGrid) return;
  productsGrid.innerHTML = '';
  
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedItems = currentProducts.slice(startIndex, endIndex);

  paginatedItems.forEach(product => {
    let currentImageIndex = 0;
    let currentVariantIndex = 0;

    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col group';
    
    let dotsHtml = '';
    if (product.images && product.images.length > 1) {
      dotsHtml = `<div class="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">`;
      product.images.forEach((_, idx) => {
        dotsHtml += `<div class="w-2 h-2 rounded-full cursor-pointer transition-colors ${idx === 0 ? 'bg-cyan-500' : 'bg-white/50 hover:bg-white/80'} img-dot" data-img-idx="${idx}"></div>`;
      });
      dotsHtml += `</div>`;
    }

    let variantHtml = '';
    if (product.variants && product.variants.length > 0) {
      variantHtml = `<select class="variant-select w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-slate-700 font-medium mb-3 focus:outline-none focus:ring-1 focus:ring-cyan-500">`;
      product.variants.forEach((v, idx) => {
        variantHtml += `<option value="${idx}">${v.name}</option>`;
      });
      variantHtml += `</select>`;
    }

    const priceToDisplay = product.variants && product.variants.length > 0 ? product.variants[0].price : 0;
    const initialImage = product.images && product.images.length > 0 ? product.images[0] : '';

    card.innerHTML = `
      <div class="h-48 overflow-hidden bg-slate-100 relative group-hover:opacity-95">
         <img src="${initialImage}" loading="lazy" alt="${product.name}" class="card-img w-full h-full object-cover group-hover:scale-105 transition-all duration-300 cursor-pointer"/>
         <div class="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-slate-800 shadow-sm uppercase tracking-wider cursor-default">${currentCategory}</div>
         ${dotsHtml}
      </div>
      <div class="p-5 flex-grow flex flex-col">
         <h3 class="font-bold text-lg text-slate-800 mb-2 cursor-pointer hover:text-cyan-600 transition-colors product-title">${product.name}</h3>
         ${variantHtml}
         <div class="text-cyan-600 font-bold text-xl mb-4 price-display">${CURRENCY}${priceToDisplay.toLocaleString()}</div>
         <button class="add-to-cart-btn-list mt-auto w-full bg-slate-100 hover:bg-cyan-600 hover:text-white text-slate-800 font-semibold py-2 rounded-lg transition-colors flex justify-center items-center gap-2" data-id="${product.id}">
            <i class="fa-solid fa-cart-plus"></i> Add to cart <span class="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs hidden item-badge">0</span>
         </button>
      </div>
    `;
    productsGrid.appendChild(card);

    const imgEl = card.querySelector('.card-img') as HTMLImageElement;
    const priceDisplay = card.querySelector('.price-display');
    const variantSelect = card.querySelector('.variant-select') as HTMLSelectElement;
    const addBtn = card.querySelector('.add-to-cart-btn-list');
    const imgDots = card.querySelectorAll('.img-dot');

    imgEl?.addEventListener('click', () => {
       showProductDetails(product.id, currentVariantIndex);
    });
    const titleArea = card.querySelector('.product-title');
    titleArea?.addEventListener('click', () => {
       showProductDetails(product.id, currentVariantIndex);
    });

    imgDots.forEach((dot: Element) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(dot.getAttribute('data-img-idx') || '0');
        currentImageIndex = idx;
        
        imgEl.style.opacity = '0.7';
        setTimeout(() => {
          imgEl.src = product.images[idx];
          imgEl.style.opacity = '1';
        }, 150);

        imgDots.forEach((d: Element, i) => {
          if (i === idx) {
            d.className = "w-2 h-2 rounded-full cursor-pointer transition-colors bg-cyan-500 img-dot";
          } else {
            d.className = "w-2 h-2 rounded-full cursor-pointer transition-colors bg-white/50 hover:bg-white/80 img-dot";
          }
        });
      });
    });

    variantSelect?.addEventListener('change', (e) => {
      currentVariantIndex = parseInt((e.target as HTMLSelectElement).value);
      if (priceDisplay && product.variants) {
        priceDisplay.textContent = `${CURRENCY}${product.variants[currentVariantIndex].price.toLocaleString()}`;
      }
    });

    addBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(product.id, currentVariantIndex);
      
      const originalText = addBtn.innerHTML;
      addBtn.classList.remove('bg-slate-100', 'text-slate-800', 'bg-cyan-600');
      addBtn.classList.add('bg-green-500', 'text-white');
      addBtn.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
      
      setTimeout(() => {
        addBtn.classList.remove('bg-green-500', 'text-white');
        addBtn.innerHTML = originalText;
        updateCartUI(); // restore proper cyan/slate cart styles
      }, 1500);
    });
  });

  renderPagination();
  updateCartUI();
}

function initializeSiteContent() {
  const headerLogo = document.getElementById('global-logo-header') as HTMLImageElement;
  if (headerLogo && SITE_ASSETS.logoURL) headerLogo.src = SITE_ASSETS.logoURL;
  const footerLogo = document.getElementById('global-logo-footer') as HTMLImageElement;
  if (footerLogo && SITE_ASSETS.logoURL) footerLogo.src = SITE_ASSETS.logoURL;

  if (SITE_ASSETS.faviconUrl) {
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = SITE_ASSETS.faviconUrl;
  }

  // Set Page Titles
  const globalLogoText = document.getElementById('global-logo-text');
  if (globalLogoText) globalLogoText.innerHTML = `${PAGE_HEADLINES.home.substring(0, PAGE_HEADLINES.home.length - 4)}<span class="text-cyan-600">${PAGE_HEADLINES.home.substring(PAGE_HEADLINES.home.length - 4)}</span>`;

  const viewRndTitle = document.getElementById('view-rnd-title');
  if (viewRndTitle) viewRndTitle.textContent = PAGE_HEADLINES.services;
  
  const ecomGridTitle = document.getElementById('ecom-grid-title');
  if (ecomGridTitle) ecomGridTitle.textContent = PAGE_HEADLINES.products;
  
  const viewSolarTitle = document.querySelector('#view-solar h2');
  if (viewSolarTitle) viewSolarTitle.textContent = PAGE_HEADLINES.solar;
  
  const contactTitle = document.querySelector('#view-contact h1');
  if (contactTitle) contactTitle.textContent = PAGE_HEADLINES.contact;
  
  const rndFormTitle = document.getElementById('rnd-form-title');
  if (rndFormTitle) rndFormTitle.textContent = PAGE_HEADLINES.inquiryForm;

  // Render Service Domains
  renderServiceDomains();

  const h1bg = document.getElementById('hero-1-bg');
  if (h1bg) h1bg.style.backgroundImage = `url('${SITE_ASSETS.hero_rnd}')`;
  const h1t = document.getElementById('hero-1-title');
  if (h1t) h1t.textContent = SITE_TEXT.hero_1_title;
  const h1d = document.getElementById('hero-1-desc');
  if (h1d) h1d.textContent = SITE_TEXT.hero_1_desc;

  const h2bg = document.getElementById('hero-2-bg');
  if (h2bg) h2bg.style.backgroundImage = `url('${SITE_ASSETS.hero_robots}')`;
  const h2t = document.getElementById('hero-2-title');
  if (h2t) h2t.textContent = SITE_TEXT.hero_2_title;
  const h2d = document.getElementById('hero-2-desc');
  if (h2d) h2d.textContent = SITE_TEXT.hero_2_desc;

  const h3bg = document.getElementById('hero-3-bg');
  if (h3bg) h3bg.style.backgroundImage = `url('${SITE_ASSETS.hero_solar}')`;
  const h3t = document.getElementById('hero-3-title');
  if (h3t) h3t.textContent = SITE_TEXT.hero_3_title;
  const h3d = document.getElementById('hero-3-desc');
  if (h3d) h3d.textContent = SITE_TEXT.hero_3_desc;

  const a1t = document.getElementById('action-1-title');
  if (a1t) a1t.textContent = SITE_TEXT.action_card_1_title;
  const a1d = document.getElementById('action-1-desc');
  if (a1d) a1d.textContent = SITE_TEXT.action_card_1_desc;

  const a2t = document.getElementById('action-2-title');
  if (a2t) a2t.textContent = SITE_TEXT.action_card_2_title;
  const a2d = document.getElementById('action-2-desc');
  if (a2d) a2d.textContent = SITE_TEXT.action_card_2_desc;

  const a3t = document.getElementById('action-3-title');
  if (a3t) a3t.textContent = SITE_TEXT.action_card_3_title;
  const a3d = document.getElementById('action-3-desc');
  if (a3d) a3d.textContent = SITE_TEXT.action_card_3_desc;

  const aboutT = document.getElementById('about-title');
  if (aboutT) aboutT.textContent = SITE_TEXT.about_us_title;
  const aboutD = document.getElementById('about-text');
  if (aboutD) aboutD.textContent = SITE_TEXT.about_us_text;

  const whyT = document.getElementById('why-title');
  if (whyT) whyT.textContent = SITE_TEXT.why_us_title;
  const portfolioWhyT = document.getElementById('portfolio-why-title');
  if (portfolioWhyT) portfolioWhyT.textContent = SITE_TEXT.why_us_title;

  const whyGrid = document.getElementById('why-grid');
  const portfolioWhyGrid = document.getElementById('portfolio-why-grid');
  
  if (whyGrid) {
    whyGrid.innerHTML = '';
    if (portfolioWhyGrid) portfolioWhyGrid.innerHTML = '';
    
    SITE_TEXT.why_us_points.forEach(point => {
      const cardHtml = `
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
           <h4 class="font-bold text-slate-800 text-lg">${point.title}</h4>
           <p class="text-slate-600 text-sm leading-relaxed">${point.desc}</p>
        </div>
      `;
      whyGrid.innerHTML += cardHtml;
      if (portfolioWhyGrid) portfolioWhyGrid.innerHTML += cardHtml;
    });
  }

  // Contact Info
  const contactEmailElem = document.getElementById('contact-email') as HTMLAnchorElement;
  if (contactEmailElem) {
    contactEmailElem.textContent = CONTACT_INFO.email;
    contactEmailElem.href = `mailto:${CONTACT_INFO.email}`;
  }

  const contactPhoneElem = document.getElementById('contact-phone') as HTMLAnchorElement;
  if (contactPhoneElem) {
    contactPhoneElem.textContent = CONTACT_INFO.phone;
    contactPhoneElem.href = `tel:${CONTACT_INFO.phone.replace(/[^0-9+]/g, '')}`;
  }

  const contactAddressElem = document.getElementById('contact-address');
  if (contactAddressElem) {
    contactAddressElem.textContent = `Address: ${CONTACT_INFO.officeAddress}`;
  }

  const contactSocialsElem = document.getElementById('contact-socials');
  if (contactSocialsElem && CONTACT_INFO.socialLinks) {
    contactSocialsElem.innerHTML = '';
    const iconsMap: Record<string, string> = {
      facebook: 'fa-facebook',
      linkedin: 'fa-linkedin',
      twitter: 'fa-x-twitter'
    };
    for (const [platform, url] of Object.entries(CONTACT_INFO.socialLinks)) {
      if (url) {
        const iconClass = iconsMap[platform] || 'fa-link';
        contactSocialsElem.innerHTML += `<a href="${url}" target="_blank" class="hover:text-cyan-600 transition-colors"><i class="fa-brands ${iconClass}"></i></a>`;
      }
    }
  }

  const contactWaLink = document.getElementById('contact-wa-link') as HTMLAnchorElement;
  if (contactWaLink) {
    contactWaLink.href = `https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(CONTACT_INFO.defaultMessage)}`;
  }
}

// Initialize on load
initializeSiteContent();

function renderPagination() {
  if (!paginationControls || !pageNumbers) return;
  
  const totalPages = Math.ceil(currentProducts.length / PRODUCTS_PER_PAGE);
  if (totalPages <= 1) {
    paginationControls.classList.add('hidden');
    return;
  }
  paginationControls.classList.remove('hidden');
  
  // Controls
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
  
  // Page Numbers
  pageNumbers.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = `px-3 py-1 rounded-md border ${i === currentPage ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`;
    btn.textContent = String(i);
    btn.addEventListener('click', () => {
      currentPage = i;
      renderProducts();
    });
    pageNumbers.appendChild(btn);
  }
}

prevPageBtn?.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderProducts();
  }
});
nextPageBtn?.addEventListener('click', () => {
  const totalPages = Math.ceil(currentProducts.length / PRODUCTS_PER_PAGE);
  if (currentPage < totalPages) {
    currentPage++;
    renderProducts();
  }
});


// ====== Product Details ======
function showProductDetails(id: string, variantIndex: number = 0) {
  const product = PRODUCT_DATA.find(p => p.id === id);
  if (!product) return;

  const initialImage = product.images && product.images.length > 0 ? product.images[0] : '';
  let currentPrice = product.variants && product.variants.length > 0 ? product.variants[variantIndex].price : 0;
  let variantText = product.variants && product.variants.length > 0 ? ` - ${product.variants[variantIndex].name}` : '';

  if (prodDetailImage) prodDetailImage.src = initialImage;
  
  if (prodDetailDots) {
    if (product.images && product.images.length > 1) {
      prodDetailDots.innerHTML = '';
      product.images.forEach((imgSrc, idx) => {
        const dot = document.createElement('div');
        dot.className = `w-3 h-3 rounded-full cursor-pointer transition-colors ${idx === 0 ? 'bg-cyan-500' : 'bg-slate-300 hover:bg-slate-400'}`;
        dot.addEventListener('click', () => {
          if (prodDetailImage) {
            prodDetailImage.style.opacity = '0.7';
            setTimeout(() => {
              prodDetailImage.src = imgSrc;
              prodDetailImage.style.opacity = '1';
            }, 150);
          }
          Array.from(prodDetailDots.children).forEach((child, i) => {
            child.className = `w-3 h-3 rounded-full cursor-pointer transition-colors ${i === idx ? 'bg-cyan-500' : 'bg-slate-300 hover:bg-slate-400'}`;
          });
        });
        prodDetailDots.appendChild(dot);
      });
    } else {
      prodDetailDots.innerHTML = ''; // Clear if only 1 image or none
    }
  }

  if (prodDetailTitle) prodDetailTitle.textContent = product.name;
  if (prodDetailCategory) prodDetailCategory.textContent = product.category;
  if (prodDetailDesc) prodDetailDesc.textContent = product.description || "A high-quality product from WingsTech.";
  
  const updatePriceDisplay = () => {
     if (prodDetailPrice) prodDetailPrice.textContent = `${CURRENCY}${currentPrice.toLocaleString()}`;
  }

  if (prodDetailVariantsContainer && prodDetailVariantSelect) {
    if (product.variants && product.variants.length > 0) {
      prodDetailVariantsContainer.classList.remove('hidden');
      prodDetailVariantSelect.innerHTML = '';
      product.variants.forEach((v, idx) => {
        const option = document.createElement('option');
        option.value = idx.toString();
        option.textContent = v.name;
        if (idx === variantIndex) option.selected = true;
        prodDetailVariantSelect.appendChild(option);
      });
      
      // Remove any previously attached listeners
      const newSelect = prodDetailVariantSelect.cloneNode(true);
      prodDetailVariantSelect.parentNode?.replaceChild(newSelect, prodDetailVariantSelect);
      const updatedSelect = document.getElementById('product-detail-variant-select') as HTMLSelectElement;
      
      updatedSelect.addEventListener('change', (e) => {
        const newVariantIndex = parseInt((e.target as HTMLSelectElement).value);
        currentPrice = product.variants[newVariantIndex].price;
        variantText = ` - ${product.variants[newVariantIndex].name}`;
        updatePriceDisplay();
        if (prodDetailAddBtn) {
           prodDetailAddBtn.onclick = () => {
              addToCart(product.id, newVariantIndex);
              
              const textSpan = document.getElementById('product-detail-add-text');
              prodDetailAddBtn.classList.remove('bg-slate-100', 'text-slate-800', 'bg-cyan-600');
              prodDetailAddBtn.classList.add('bg-green-500', 'text-white');
              if (textSpan) textSpan.textContent = 'Added!';
              
              setTimeout(() => {
                 prodDetailAddBtn.classList.remove('bg-green-500', 'text-white');
                 updateCartUI();
              }, 1500);
           };
        }
      });
    } else {
      prodDetailVariantsContainer.classList.add('hidden');
    }
  }

  updatePriceDisplay();

  if (prodDetailAddBtn) {
     prodDetailAddBtn.setAttribute('data-id', product.id);
     prodDetailAddBtn.onclick = () => {
        addToCart(product.id, variantIndex);
        
        // Temporary visual feedback
        const originalBg = prodDetailAddBtn.className;
        const textSpan = document.getElementById('product-detail-add-text');
        const originalText = textSpan ? textSpan.textContent : 'Add to Cart';
        
        prodDetailAddBtn.classList.remove('bg-slate-100', 'text-slate-800', 'bg-cyan-600');
        prodDetailAddBtn.classList.add('bg-green-500', 'text-white');
        if (textSpan) textSpan.textContent = 'Added!';
        
        setTimeout(() => {
           prodDetailAddBtn.classList.remove('bg-green-500', 'text-white');
           // Re-run updateCartUI to restore the correct classes based on cart state
           updateCartUI();
        }, 1500);
     };
  }
  updateCartUI(); // to reflect the cart count inside the product detail view

  navigateTo('product');
}

// ====== Portfolio Rendering ======
function renderPortfolio() {
  if (!portfolioGrid) return;
  if (portfolioGrid.children.length > 0) return; // already rendered

  portfolioVideos.forEach(v => {
    const item = document.createElement('div');
    item.className = 'bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col';
    item.innerHTML = `
      <div class="aspect-video relative bg-slate-900">
         <iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/${v.id}" title="${v.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <div class="p-4 border-t border-slate-100">
         <h4 class="font-bold text-slate-800 text-lg">${v.title}</h4>
      </div>
    `;
    portfolioGrid.appendChild(item);
  });
}

// ====== Cart logic ======

cartBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  navigateTo('checkout');
});

cartFloatingBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  navigateTo('checkout');
});

function addToCart(id: string, variantIndex: number = 0) {
  const product = PRODUCT_DATA.find(p => p.id === id);
  if (!product) return;
  const variant = product.variants && product.variants.length > 0 ? product.variants[variantIndex] : null;
  if (!variant) return;

  const cartItemId = `${id}-${variantIndex}`;
  const existing = cart.find(item => item.cartItemId === cartItemId);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ 
      cartItemId, 
      id: product.id, 
      name: `${product.name} - ${variant.name}`, 
      price: variant.price, 
      image: product.images && product.images.length > 0 ? product.images[0] : '',
      quantity: 1 
    });
  }

  updateCartUI();
  
  if (cartFloatingBtn) {
    cartFloatingBtn.classList.add('scale-125');
    setTimeout(() => cartFloatingBtn.classList.remove('scale-125'), 300);
  }
}

function updateCartUI() {
  let count = 0;

  cart.forEach(item => {
    count += item.quantity;
  });

  if (cartBadge) {
     cartBadge.textContent = count.toString();
     cartBadge.classList.toggle('hidden', count === 0);
  }
  if (cartFloatBadge) cartFloatBadge.textContent = count.toString();
  if (cartFloatingBtn) cartFloatingBtn.classList.toggle('hidden', count === 0);

  if (prodDetailAddBtn) {
    const currentProductId = prodDetailAddBtn.getAttribute('data-id');
    if (currentProductId && prodDetailCartCount) {
      const items = cart.filter(c => c.id === currentProductId);
      const sum = items.reduce((a, b) => a + b.quantity, 0);
      const textSpan = document.getElementById('product-detail-add-text');
      if (sum > 0) {
        prodDetailCartCount.textContent = sum.toString();
        prodDetailCartCount.classList.remove('hidden');
        prodDetailAddBtn.classList.add('bg-cyan-600', 'text-white');
        prodDetailAddBtn.classList.remove('bg-slate-100', 'text-slate-800');
        if (textSpan) textSpan.textContent = 'In Cart';
      } else {
        prodDetailCartCount.classList.add('hidden');
        prodDetailAddBtn.classList.remove('bg-cyan-600', 'text-white');
        prodDetailAddBtn.classList.add('bg-slate-100', 'text-slate-800');
        if (textSpan) textSpan.textContent = 'Add to Cart';
      }
    }
  }

  const listBtns = document.querySelectorAll('.add-to-cart-btn-list');
  listBtns.forEach(btn => {
    const id = btn.getAttribute('data-id');
    const badge = btn.querySelector('.item-badge');
    if (id && badge) {
      const items = cart.filter(c => c.id === id);
      const sum = items.reduce((a, b) => a + b.quantity, 0);
      if (sum > 0) {
        badge.textContent = sum.toString();
        badge.classList.remove('hidden');
        btn.classList.add('bg-cyan-600', 'text-white');
        btn.classList.remove('bg-slate-100', 'text-slate-800');
      } else {
        badge.classList.add('hidden');
        btn.classList.remove('bg-cyan-600', 'text-white');
        btn.classList.add('bg-slate-100', 'text-slate-800');
      }
    }
  });
}

// ====== Checkout Logic ======
couponBtn?.addEventListener('click', () => {
  if (couponInput.value.trim().toUpperCase() === 'DISCOUNT10' || couponInput.value.trim().toUpperCase() === 'WINGSTECH') {
    discountApplied = true;
    couponMsg?.classList.remove('hidden');
    renderCheckoutSummary();
  } else {
    discountApplied = false;
    couponMsg?.classList.add('hidden');
    alert('wrong coupon added');
    renderCheckoutSummary();
  }
});

function renderCheckoutSummary() {
  if (!checkoutItemsContainer || !checkoutTotal) return;
  checkoutItemsContainer.innerHTML = '';
  
  // Restore submit button if replaced
  const submitContainer = document.getElementById('submit-btn-container');
  if (submitContainer && !document.getElementById('checkout-submit-btn')) {
    submitContainer.innerHTML = `
      <button type="submit" id="checkout-submit-btn" disabled class="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl transition-colors shadow-md mt-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed">
         Complete & Send via WhatsApp
      </button>
    `;
    const termsCheckbox = document.getElementById('chk-terms') as HTMLInputElement | null;
    if (termsCheckbox) termsCheckbox.checked = false;
  }

  let total = 0;
  
  const termsCheckbox = document.getElementById('chk-terms') as HTMLInputElement | null;
  const submitBtn = document.getElementById('checkout-submit-btn') as HTMLButtonElement | null;
  if (cart.length === 0) {
    checkoutItemsContainer.innerHTML = '<p class="text-slate-500 italic">Your cart is empty.</p>';
    if (submitBtn) submitBtn.disabled = true;
  } else {
    if (submitBtn) {
      submitBtn.disabled = !(termsCheckbox && termsCheckbox.checked);
    }
  }

  cart.forEach(item => {
    total += item.price * item.quantity;
    const row = document.createElement('div');
    row.className = 'flex flex-col gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100';
    row.innerHTML = `
      <div class="flex justify-between items-center">
        <span class="font-bold text-slate-800">${item.name}</span>
        <span class="font-mono text-cyan-700 font-bold">${CURRENCY}${(item.price * item.quantity).toLocaleString()}</span>
      </div>
      <div class="flex justify-between items-center border-t border-slate-200 pt-2 mt-1">
        <div class="flex items-center bg-white border border-slate-200 rounded text-sm shadow-sm">
           <button type="button" class="cart-qty-btn px-3 py-1 text-slate-600 hover:text-cyan-600 hover:bg-slate-100 font-bold" data-action="minus" data-id="${item.cartItemId}">-</button>
           <span class="w-8 text-center font-bold text-slate-800">${item.quantity}</span>
           <button type="button" class="cart-qty-btn px-3 py-1 text-slate-600 hover:text-cyan-600 hover:bg-slate-100 font-bold" data-action="plus" data-id="${item.cartItemId}">+</button>
        </div>
        <button type="button" class="cart-rm-btn text-xs text-red-500 hover:text-red-700 underline font-medium" data-id="${item.cartItemId}">Remove</button>
      </div>
    `;
    checkoutItemsContainer.appendChild(row);
  });
  
  const subtotalEl = document.getElementById('checkout-subtotal');
  const deliveryEl = document.getElementById('checkout-delivery');
  
  let discountedSubtotal = total;
  if (discountApplied) {
    discountedSubtotal = total * 0.9;
  }

  if (subtotalEl) {
    if (discountApplied) {
      subtotalEl.innerHTML = `<span class="line-through text-slate-400 text-sm mr-2">${CURRENCY}${total.toLocaleString()}</span>${CURRENCY}${discountedSubtotal.toLocaleString()}`;
    } else {
      subtotalEl.textContent = `${CURRENCY}${total.toLocaleString()}`;
    }
  }

  const deliveryFee = cart.length > 0 ? 100 : 0;
  if (deliveryEl) {
    deliveryEl.textContent = `${CURRENCY}${deliveryFee}`;
  }

  const finalTotal = cart.length > 0 ? discountedSubtotal + deliveryFee : 0;
  if (checkoutTotal) {
    checkoutTotal.textContent = `${CURRENCY}${finalTotal.toLocaleString()}`;
  }

  // Attach listeners for these checkout items
  const qtyBtns = checkoutItemsContainer.querySelectorAll('.cart-qty-btn');
  qtyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = e.currentTarget as HTMLElement;
      const action = target.getAttribute('data-action');
      const id = target.getAttribute('data-id');
      if (!id) return;
      
      const item = cart.find(i => i.cartItemId === id);
      if (!item) return;

      if (action === 'plus') {
        item.quantity++;
      } else if (action === 'minus') {
        item.quantity--;
        if (item.quantity <= 0) {
          cart = cart.filter(i => i.cartItemId !== id);
        }
      }
      updateCartUI();
      renderCheckoutSummary();
    });
  });

  const rmBtns = checkoutItemsContainer.querySelectorAll('.cart-rm-btn');
  rmBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
      cart = cart.filter(i => i.cartItemId !== id);
      updateCartUI();
      renderCheckoutSummary();
    });
  });
}

checkoutForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (cart.length === 0) return;

  const paymentMethod = (document.getElementById('checkout-payment-method') as HTMLInputElement).value;
  const name = (document.getElementById('chk-name') as HTMLInputElement).value;
  const phone = (document.getElementById('chk-phone') as HTMLInputElement).value;
  const address = (document.getElementById('chk-address') as HTMLTextAreaElement).value;
  const org = (document.getElementById('chk-org') as HTMLInputElement).value || 'N/A';
  const notes = (document.getElementById('chk-notes') as HTMLTextAreaElement).value || 'None';

  const orderId = 'WT-' + Math.random().toString(36).substr(2, 6).toUpperCase();

  const completeOrderInfo = () => {
    let subtotal = 0;
    const orderDetailsList: string[] = [];
    cart.forEach(item => {
      subtotal += item.price * item.quantity;
      orderDetailsList.push(`${item.name} - ${item.quantity}pc`);
    });

    const finalTotal = discountApplied ? subtotal * 0.9 : subtotal;
    const finalTotalWithDelivery = finalTotal + 100;

    const payload = {
      formType: "purchase",
      name: name,
      organization: org,
      contact: phone,
      fullAddress: address,
      specialInstructions: notes,
      orderDetails: orderDetailsList.join('\n'),
      totalAmount: `BDT ${finalTotalWithDelivery}`,
      paymentMethod: paymentMethod,
      transactionId: orderId || ""
    };

    const submitBtn = document.getElementById('checkout-submit-btn') as HTMLButtonElement;
    const originalText = submitBtn.textContent || "Complete & Send via WhatsApp";
    
    if (submitBtn) {
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
    }

    fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    })
    .then(async (res) => {
      if (res.ok) {
        const waText = `*New Order: ${payload.transactionId}*\n*Name:* ${payload.name}\n*Organization:* ${payload.organization}\n*Contact:* ${payload.contact}\n*Address:* ${payload.fullAddress}\n*Notes:* ${payload.specialInstructions}\n*Total:* ${payload.totalAmount}\n*Payment Method:* ${payload.paymentMethod}`;
        const waLink = `https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(waText)}`;
        
        if (submitBtn) {
          submitBtn.outerHTML = `
          <div class="text-center mt-4 p-4 border-2 border-green-200 bg-green-50 rounded-xl">
            <p class="text-xl font-bold text-green-700 mb-4">Order Submitted!</p>
            <a href="${waLink}" target="_blank" class="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg shadow">
              <i class="fa-brands fa-whatsapp text-2xl"></i> WhatsApp Now
            </a>
          </div>
          `;
        }
        
        // Clear cart states
        cart = [];
        updateCartUI();
        checkoutForm.reset();
      } else {
        throw new Error('Network response was not ok');
      }
    })
    .catch((err) => {
      console.error('Error submitting form:', err);
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  };

  completeOrderInfo();
});

// Setup custom Payment Method Selector Toggle and Details Logic
document.querySelectorAll('.payment-option-container').forEach(container => {
  container.addEventListener('click', () => {
    const selectedVal = container.getAttribute('data-value') || 'Cash on Delivery';
    
    // Update hidden input
    const hiddenInput = document.getElementById('checkout-payment-method') as HTMLInputElement;
    if (hiddenInput) {
      hiddenInput.value = selectedVal;
    }

    // Toggle styles and details visibility for all options
    document.querySelectorAll('.payment-option-container').forEach(opt => {
      const isCurrent = opt === container;
      const optVal = opt.getAttribute('data-value');
      
      // Toggle card border and background
      if (isCurrent) {
        opt.classList.remove('border-slate-200', 'hover:border-cyan-200');
        opt.classList.add('border-cyan-500', 'bg-cyan-50/30');
      } else {
        opt.classList.remove('border-cyan-500', 'bg-cyan-50/30');
        opt.classList.add('border-slate-200', 'hover:border-cyan-200');
      }

      // Toggle details block
      const detailsBlock = opt.querySelector('.payment-option-details');
      if (detailsBlock) {
        if (isCurrent) {
          detailsBlock.classList.remove('hidden');
        } else {
          detailsBlock.classList.add('hidden');
        }
      }

      // Toggle arrow icon rotation
      const arrowIcon = opt.querySelector('.fa-chevron-down');
      if (arrowIcon) {
        if (isCurrent) {
          arrowIcon.classList.add('rotate-180');
        } else {
          arrowIcon.classList.remove('rotate-180');
        }
      }

      // Toggle custom radio indicator inner dot
      const dotEl = opt.querySelector('[id^="payment-dot-"]');
      if (dotEl) {
        if (isCurrent) {
          dotEl.classList.remove('bg-transparent');
          dotEl.classList.add('bg-cyan-500');
          dotEl.parentElement?.classList.remove('border-slate-300');
          dotEl.parentElement?.classList.add('border-cyan-500');
        } else {
          dotEl.classList.remove('bg-cyan-500');
          dotEl.classList.add('bg-transparent');
          dotEl.parentElement?.classList.remove('border-cyan-500');
          dotEl.parentElement?.classList.add('border-slate-300');
        }
      }
    });
  });
});

// Terms and Conditions checkbox handling
const termsCheckboxEl = document.getElementById('chk-terms') as HTMLInputElement | null;
if (termsCheckboxEl) {
  termsCheckboxEl.addEventListener('change', () => {
    const submitBtn = document.getElementById('checkout-submit-btn') as HTMLButtonElement | null;
    if (submitBtn && cart.length > 0) {
      submitBtn.disabled = !termsCheckboxEl.checked;
    }
  });
}

// ====== R&D and Solar logic ======

function renderServiceDomains() {
  const container = document.getElementById('rnd-categories');
  if (!container) return;
  container.innerHTML = '';

  SERVICE_DOMAINS.forEach(domain => {
    const btn = document.createElement('button');
    const isSelected = selectedDomains.includes(domain.label);
    
    if (isSelected) {
      btn.className = 'rnd-cat-btn bg-cyan-50 border-[3px] border-cyan-600 p-6 rounded-xl font-semibold text-slate-700 hover:shadow-md transition-all flex flex-col items-center gap-3';
    } else {
      btn.className = 'rnd-cat-btn bg-white border-2 border-slate-200 p-6 rounded-xl font-semibold text-slate-700 hover:border-cyan-500 hover:shadow-md transition-all flex flex-col items-center gap-3';
    }

    const iconColor = isSelected ? 'text-cyan-700' : 'text-cyan-500';
    btn.innerHTML = `<i class="fa-solid ${domain.icon} text-3xl ${iconColor} mb-2 icon-el"></i> ${domain.label}`;
    
    btn.addEventListener('click', (e) => {
      const val = domain.label;
      if (selectedDomains.includes(val)) {
        selectedDomains = selectedDomains.filter(d => d !== val);
      } else {
        selectedDomains.push(val);
      }
      renderServiceDomains(); // Re-render to update classes
      updateRndActionBar();
    });

    container.appendChild(btn);
  });
}

function updateRndActionBar() {
  const bar = document.getElementById('rnd-action-bar');
  if (selectedDomains.length > 0) {
    bar?.classList.remove('hidden');
    bar?.classList.add('grid');
  } else {
    bar?.classList.remove('grid');
    bar?.classList.add('hidden');
  }
}

document.getElementById('rnd-clear-btn')?.addEventListener('click', () => {
  selectedDomains = [];
  renderServiceDomains();
  updateRndActionBar();
});

document.getElementById('rnd-proceed-btn')?.addEventListener('click', () => {
    document.getElementById('rnd-category-input')?.setAttribute('value', selectedDomains.join(', '));
    const formTitle = document.getElementById('rnd-form-title');
    if (formTitle) formTitle.textContent = selectedDomains.length > 0 ? `Inquiry for: ${selectedDomains.join(', ')}` : 'Tell us about your need';

    const otherContainer = document.getElementById('rnd-other-domain-container');
    const otherInput = document.getElementById('rnd-other-domain') as HTMLInputElement;
    if (selectedDomains.includes('Others')) {
      otherContainer?.classList.remove('hidden');
      otherInput.required = true;
    } else {
      otherContainer?.classList.add('hidden');
      otherInput.required = false;
    }

    navigateTo('rnd-form');
});

rndForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = (document.getElementById('rnd-name') as HTMLInputElement).value;
  const org = (document.getElementById('rnd-org') as HTMLInputElement).value;
  const role = (document.getElementById('rnd-role') as HTMLInputElement).value;
  const loc = (document.getElementById('rnd-location') as HTMLInputElement).value;
  const phone = (document.getElementById('rnd-phone') as HTMLInputElement).value;
  const email = (document.getElementById('rnd-email') as HTMLInputElement).value;
  const desc = (document.getElementById('rnd-desc') as HTMLTextAreaElement).value;
  let cat = (document.getElementById('rnd-category-input') as HTMLInputElement).value || 'General R&D';
  
  if (selectedDomains.includes('Others')) {
     const otherCat = (document.getElementById('rnd-other-domain') as HTMLInputElement).value;
     cat = cat.replace('Others', `Others (${otherCat})`);
  }

  const payload = {
    formType: "inquiry",
    domain: cat,
    name: name,
    organization: org,
    role: role,
    location: loc,
    contact: phone,
    emailAddress: email,
    problem: desc
  };

  const submitBtn = rndForm?.querySelector('button[type="submit"]') as HTMLButtonElement | null;
  const originalText = submitBtn?.textContent || "Submit Request";

  if (submitBtn) {
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
  }

  fetch(APPS_SCRIPT_URL, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  })
  .then(async (res) => {
    if (res.ok) {
      const waText = `*New Inquiry*\n*Domain:* ${payload.domain}\n*Name:* ${payload.name}\n*Organization:* ${payload.organization}\n*Role:* ${payload.role}\n*Location:* ${payload.location}\n*Contact:* ${payload.contact}\n*Email:* ${payload.emailAddress}\n*Problem:* ${payload.problem}`;
      const waLink = `https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(waText)}`;
      
      if (submitBtn) {
        submitBtn.outerHTML = `
        <div class="text-center mt-4 p-4 border-2 border-green-200 bg-green-50 rounded-xl">
          <p class="text-xl font-bold text-green-700 mb-4">Request Submitted!</p>
          <a href="${waLink}" target="_blank" class="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg shadow">
            <i class="fa-brands fa-whatsapp text-2xl"></i> WhatsApp Now
          </a>
        </div>
        `;
      }
      
      rndForm.reset();
      selectedDomains = [];
      renderServiceDomains();
      updateRndActionBar();
    } else {
      throw new Error('Network response was not ok');
    }
  })
  .catch((err) => {
    console.error('Error submitting form:', err);
    if (submitBtn) {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
});

document.querySelectorAll('.solar-action-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const val = (e.currentTarget as HTMLElement).getAttribute('data-type') || '';
    document.getElementById('solar-type-input')?.setAttribute('value', val);
    const formContainer = document.getElementById('solar-form-container');
    formContainer?.classList.remove('hidden');
    formContainer?.scrollIntoView({ behavior: 'smooth' });
  });
});

solarForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const type = (document.getElementById('solar-type-input') as HTMLInputElement).value;
  const name = (document.getElementById('solar-name') as HTMLInputElement).value;
  const desc = (document.getElementById('solar-desc') as HTMLTextAreaElement).value;

  const payload = {
    formType: 'solar',
    type,
    name,
    problem: desc
  };

  const submitBtn = solarForm?.querySelector('button[type="submit"]') as HTMLButtonElement | null;
  const originalText = submitBtn?.innerHTML || '<i class="fa-brands fa-whatsapp text-xl"></i> Contact via WhatsApp';

  if (submitBtn) {
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
  }

  fetch(APPS_SCRIPT_URL, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  })
  .then(async (res) => {
    if (res.ok) {
      const msg = `*Solar Solutions Inquiry*\nType: ${type}\nName: ${name}\n\nRequirements:\n${desc}`;
      const waLink = `https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(msg)}`;
      
      if (submitBtn) {
        submitBtn.outerHTML = `
        <div class="text-center mt-4 p-4 border-2 border-green-200 bg-green-50 rounded-xl">
          <p class="text-xl font-bold text-green-700 mb-4">Request Submitted!</p>
          <a href="${waLink}" target="_blank" class="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg shadow">
            <i class="fa-brands fa-whatsapp text-2xl"></i> WhatsApp Now
          </a>
        </div>
        `;
      }
      
      solarForm.reset();
    } else {
      throw new Error('Network response was not ok');
    }
  })
  .catch((err) => {
    console.error('Error submitting form:', err);
    if (submitBtn) {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
});


document.querySelectorAll('.smart-home-action-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const val = (e.currentTarget as HTMLElement).getAttribute('data-type') || '';
    document.getElementById('smart-home-type-input')?.setAttribute('value', val);
    const formContainer = document.getElementById('smart-home-form-container');
    formContainer?.classList.remove('hidden');
    formContainer?.scrollIntoView({ behavior: 'smooth' });
  });
});

smartHomeForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = (document.getElementById('smart-home-name') as HTMLInputElement).value;
  const org = (document.getElementById('smart-home-org') as HTMLInputElement).value;
  const role = (document.getElementById('smart-home-role') as HTMLInputElement).value;
  const loc = (document.getElementById('smart-home-location') as HTMLInputElement).value;
  const phone = (document.getElementById('smart-home-phone') as HTMLInputElement).value;
  const email = (document.getElementById('smart-home-email') as HTMLInputElement).value;
  const desc = (document.getElementById('smart-home-desc') as HTMLTextAreaElement).value;

  const payload = {
    formType: 'inquiry',
    domain: 'Smart Home Automation',
    name,
    problem: desc,
    organization: org,
    role,
    location: loc,
    contact: phone,
    emailAddress: email
  };

  const submitBtn = smartHomeForm?.querySelector('button[type="submit"]') as HTMLButtonElement | null;
  const originalText = submitBtn?.innerHTML || 'Submit Request';

  if (submitBtn) {
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
  }

  fetch(APPS_SCRIPT_URL, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  })
  .then(async (res) => {
    if (res.ok) {
      const waText = `*New Inquiry*\n*Domain:* ${payload.domain}\n*Name:* ${payload.name}\n*Organization:* ${payload.organization}\n*Role:* ${payload.role}\n*Location:* ${payload.location}\n*Contact:* ${payload.contact}\n*Email:* ${payload.emailAddress}\n*Problem:* ${payload.problem}`;
      const waLink = `https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(waText)}`;
      
      if (submitBtn) {
        submitBtn.outerHTML = `
        <div class="text-center mt-4 p-4 border-2 border-green-200 bg-green-50 rounded-xl">
          <p class="text-xl font-bold text-green-700 mb-4">Request Submitted!</p>
          <a href="${waLink}" target="_blank" class="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg shadow">
            <i class="fa-brands fa-whatsapp text-2xl"></i> WhatsApp Now
          </a>
        </div>
        `;
      }
      
      smartHomeForm.reset();
    } else {
      throw new Error('Network response was not ok');
    }
  })
  .catch((err) => {
    console.error('Error submitting form:', err);
    if (submitBtn) {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
});


// Initialization
updateCartUI();
// Route based on hash or default to home
const initHash = window.location.hash.replace('#', '') || 'home';
navigateTo(initHash);
