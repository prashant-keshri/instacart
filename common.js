// ==================== COMMON.JS - FreshKart Global Functions ====================
// ==================== SECTION 1: EDITABLE CONFIGURATION ====================
const SITE_CONFIG = {
  FREE_DELIVERY_THRESHOLD: 499,
  MAX_CART_QUANTITY: 20,
  PLATFORM_FEE: 9,
  DELIVERY_CHARGE: 40,
  DEFAULT_INITIAL_ITEMS: 24,
  DEFAULT_LOAD_MORE_ITEMS: 12,
  DEFAULT_MAX_CYCLES: 10,
  DEFAULT_THEME: 'dark',
  STORAGE_KEYS: {
    CART: 'freshkart_cart',
    WISHLIST: 'freshkart_wishlist',
    RECENTLY_VIEWED: 'freshkart_recently',
    THEME: 'freshkart_theme',
    USER_DATA: 'freshkart_user_data',
    ADDRESSES: 'freshkart_addresses',
    ORDERS: 'freshkart_orders'
  }
};

// ==================== SECTION 1.5: EDITABLE CATEGORIES CONFIGURATION ====================
const CATEGORIES_CONFIG = {
  // Master list of all available categories (edit these as needed)
  allCategories: [
    { id: "all", name: "All", icon: "fa-th-large", emoji: "📦", showInNav: true, showInHome: true, showInOrders: true, showInSubscription: true, order: 0 },
    { id: "fruits", name: "Fruits", icon: "fa-apple", emoji: "🍎", showInNav: true, showInHome: true, showInOrders: true, showInSubscription: true, order: 1 },
    { id: "vegetables", name: "Vegetables", icon: "fa-carrot", emoji: "🥬", showInNav: true, showInHome: true, showInOrders: true, showInSubscription: true, order: 2 },
    { id: "beverages", name: "Beverages", icon: "fa-mug-saucer", emoji: "🥤", showInNav: true, showInHome: true, showInOrders: true, showInSubscription: true, order: 3 },
    { id: "cakes", name: "Cakes", icon: "fa-cake-candles", emoji: "🎂", showInNav: true, showInHome: false, showInOrders: true, showInSubscription: true, order: 4 },
    { id: "icecream", name: "Ice Cream", icon: "fa-ice-cream", emoji: "🍦", showInNav: true, showInHome: false, showInOrders: true, showInSubscription: true, order: 5 },
    { id: "snacks", name: "Snacks", icon: "fa-bowl-food", emoji: "🍿", showInNav: true, showInHome: true, showInOrders: true, showInSubscription: true, order: 6 },
    { id: "meals", name: "Meals", icon: "fa-utensils", emoji: "🍛", showInNav: true, showInHome: false, showInOrders: true, showInSubscription: true, order: 7 },
    { id: "meats", name: "Meats", icon: "fa-drumstick-bite", emoji: "🍗", showInNav: true, showInHome: false, showInOrders: true, showInSubscription: true, order: 8 },
    { id: "dairy", name: "Dairy", icon: "fa-cheese", emoji: "🥛", showInNav: true, showInHome: true, showInOrders: true, showInSubscription: true, order: 9 },
    { id: "bakery", name: "Bakery", icon: "fa-bread-slice", emoji: "🥖", showInNav: true, showInHome: false, showInOrders: true, showInSubscription: true, order: 10 },
    { id: "staples", name: "Staples", icon: "fa-box", emoji: "🍚", showInNav: true, showInHome: true, showInOrders: true, showInSubscription: true, order: 11 },
    { id: "groceries", name: "Groceries", icon: "fa-basket-shopping", emoji: "🛒", showInNav: true, showInHome: true, showInOrders: true, showInSubscription: true, order: 12 },
    { id: "subscription", name: "Subscriptions", icon: "fa-calendar-check", emoji: "📦", showInNav: true, showInHome: true, showInOrders: false, showInSubscription: true, order: 13 }
  ],
  
  // Number of categories to show on each page
  limits: {
    home: 8,      // Show first 8 categories on home page
    orders: 6,    // Show 6 categories on orders page
    subscription: 10, // Show 10 categories on subscription page
    categories: 14,   // Show all categories on categories page
    account: 4        // Show 4 categories on account page
  }
};

// Helper function to get categories for a specific page
function getCategoriesForPage(pageName) {
  const limit = CATEGORIES_CONFIG.limits[pageName] || CATEGORIES_CONFIG.limits.home;
  const filtered = CATEGORIES_CONFIG.allCategories
    .filter(cat => cat.showInNav === true)
    .sort((a, b) => a.order - b.order);
  
  if (limit === 'all') return filtered;
  return filtered.slice(0, limit);
}

// Render quick categories (horizontal scroll/navigation)
function renderQuickCategories(containerId, pageName, onClickCallback) {
  const container = document.getElementById(containerId);
  if (!container) return false;
  
  const categories = getCategoriesForPage(pageName);
  
  let html = '';
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    html += `
      <a href="#" class="cat-link" data-category="${cat.id}">
        <div class="cat-icon">${cat.emoji}</div>
        <span>${cat.name}</span>
      </a>
    `;
  }
  container.innerHTML = html;
  
  // Attach click handlers
  const links = container.querySelectorAll('.cat-link');
  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function(e) {
      e.preventDefault();
      const category = this.getAttribute('data-category');
      if (onClickCallback && typeof onClickCallback === 'function') {
        onClickCallback(category);
      } else {
        window.location.href = `categories.html?cat=${category}`;
      }
    });
  }
  return true;
}

// Render filter capsules (for categories page)
function renderFilterCapsules(containerId, activeCategory, onCategoryClick) {
  const container = document.getElementById(containerId);
  if (!container) return false;
  
  const categories = CATEGORIES_CONFIG.allCategories.filter(cat => cat.showInNav === true);
  
  let html = '';
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    const activeClass = (activeCategory === cat.id) ? 'active' : '';
    html += `<button class="filter-capsule ${activeClass}" data-category="${cat.id}"><i class="fas ${cat.icon}"></i> ${cat.name}</button>`;
  }
  container.innerHTML = html;
  
  const buttons = container.querySelectorAll('.filter-capsule');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      if (onCategoryClick && typeof onCategoryClick === 'function') {
        onCategoryClick(category);
      }
    });
  }
  return true;
}

// Render category cards (grid view for categories page)
function renderCategoryCardsGrid(containerId, activeCategory, onCategoryClick) {
  const container = document.getElementById(containerId);
  if (!container) return false;
  
  const categories = CATEGORIES_CONFIG.allCategories.filter(cat => cat.showInNav === true);
  
  let html = '';
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    const activeClass = (activeCategory === cat.id) ? 'active' : '';
    html += `
      <div class="category-card ${activeClass}" data-category="${cat.id}">
        <div class="category-card-icon">${cat.emoji}</div>
        <span>${cat.name}</span>
      </div>
    `;
  }
  container.innerHTML = html;
  
  const cards = container.querySelectorAll('.category-card');
  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      if (onCategoryClick && typeof onCategoryClick === 'function') {
        onCategoryClick(category);
      }
    });
  }
  return true;
}

// Render explore categories (for orders page and other sections)
function renderExploreCategories(containerId, limit = 8, onClickCallback) {
  const container = document.getElementById(containerId);
  if (!container) return false;
  
  const categories = CATEGORIES_CONFIG.allCategories
    .filter(cat => cat.showInNav === true && cat.id !== 'all')
    .slice(0, limit);
  
  let html = '';
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    html += `
      <a href="#" class="cat-link" data-category="${cat.id}">
        <div class="cat-icon">${cat.emoji}</div>
        <span>${cat.name}</span>
      </a>
    `;
  }
  container.innerHTML = html;
  
  const links = container.querySelectorAll('.cat-link');
  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function(e) {
      e.preventDefault();
      const category = this.getAttribute('data-category');
      if (onClickCallback && typeof onClickCallback === 'function') {
        onClickCallback(category);
      } else {
        window.location.href = `categories.html?cat=${category}`;
      }
    });
  }
  return true;
}

// ==================== SECTION 2: GLOBAL VARIABLES ====================
let cart = [];
let wishlist = [];
let recentlyViewed = [];
let allProductsData = [];

// ==================== SECTION 3: STORAGE FUNCTIONS ====================
function loadAllData() {
  try {
    const savedCart = localStorage.getItem(SITE_CONFIG.STORAGE_KEYS.CART);
    cart = savedCart ? JSON.parse(savedCart) : [];
    if (!Array.isArray(cart)) cart = [];
    
    const savedWishlist = localStorage.getItem(SITE_CONFIG.STORAGE_KEYS.WISHLIST);
    wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
    if (!Array.isArray(wishlist)) wishlist = [];
    
    const savedRecentlyViewed = localStorage.getItem(SITE_CONFIG.STORAGE_KEYS.RECENTLY_VIEWED);
    recentlyViewed = savedRecentlyViewed ? JSON.parse(savedRecentlyViewed) : [];
    if (!Array.isArray(recentlyViewed)) recentlyViewed = [];
  } catch(e) {
    console.error('Storage error:', e);
    cart = [];
    wishlist = [];
    recentlyViewed = [];
  }
}

function saveCart() {
  localStorage.setItem(SITE_CONFIG.STORAGE_KEYS.CART, JSON.stringify(cart));
}

function saveWishlist() {
  localStorage.setItem(SITE_CONFIG.STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
}

function saveRecentlyViewed() {
  localStorage.setItem(SITE_CONFIG.STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(recentlyViewed));
}

// ==================== SECTION 4: PRODUCT LOADING FROM JSON ====================
async function loadProductsFromJSON() {
  try {
    const response = await fetch('product.json');
    const data = await response.json();
    allProductsData = data.products.map(p => ({
      id: p.id, name: p.name, price: p.price, oldPrice: p.oldPrice,
      discountPercent: p.discountPercent || Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100),
      image: p.image, category: p.category, rating: p.rating,
      isFeatured: p.isFeatured || false, isBestSelling: p.isBestSelling || false,
      isNewArrival: p.isNewArrival || false, unit: p.unit, brand: p.brand
    }));
    window.allProducts = allProductsData;
    return true;
  } catch(e) {
    console.log('Using fallback products');
    allProductsData = [
      { id: 1, name: "Organic Apples", price: 120, oldPrice: 150, discountPercent: 20, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200", category: "fruits", isFeatured: true, isBestSelling: true },
      { id: 2, name: "Fresh Bananas", price: 49, oldPrice: 60, discountPercent: 18, image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200", category: "fruits", isFeatured: true, isBestSelling: true }
    ];
    window.allProducts = allProductsData;
    return false;
  }
}

// ==================== SECTION 5: CART FUNCTIONS ====================
// ==================== SECTION 5: CART FUNCTIONS (FIXED) ====================
function updatePriceBreakdown() {
  // Calculate subtotal (sum of all item prices * quantity)
  const subtotal = cart.reduce((sum, i) => sum + ((i.price || 0) * (i.qty || 0)), 0);
  
  // Calculate original total (sum of old prices * quantity)
  const originalTotal = cart.reduce((sum, i) => {
    const oldPrice = i.oldPrice || i.price || 0;
    return sum + (oldPrice * (i.qty || 0));
  }, 0);
  
  // Calculate total discount amount
  const totalDiscountAmount = originalTotal - subtotal;
  
  // Calculate total discount percentage
  let totalDiscountPercent = 0;
  if (originalTotal > 0) {
    totalDiscountPercent = Math.round((totalDiscountAmount / originalTotal) * 100);
  }
  
  // Calculate delivery charge (free above ₹499)
  const deliveryCharge = subtotal > SITE_CONFIG.FREE_DELIVERY_THRESHOLD ? 0 : SITE_CONFIG.DELIVERY_CHARGE;
  
  // Calculate platform fee
  const platformFee = SITE_CONFIG.PLATFORM_FEE;
  
  // Calculate total payable
  const totalPayable = subtotal + deliveryCharge + platformFee;
  
  // Get total items count
  const totalItems = cart.reduce((s, i) => s + (i.qty || 0), 0);
  
  // Update the breakdown display
  const breakdownBox = document.getElementById('priceBreakdownBox');
  if (breakdownBox) {
    breakdownBox.innerHTML = `
      <div class="breakdown-row">
        <span>Subtotal (${totalItems} items)</span>
        <span>₹${Math.round(subtotal)}</span>
      </div>
      ${totalDiscountAmount > 0 ? `
        <div class="breakdown-row discount-row">
          <span>Total Discount <strong style="color: var(--green-primary);">(${totalDiscountPercent}% OFF)</strong></span>
          <span style="color: var(--red-primary);">- ₹${Math.round(totalDiscountAmount)}</span>
        </div>
      ` : ''}
      <div class="breakdown-row">
        <span>Delivery Fee</span>
        <span>${deliveryCharge === 0 ? '<span style="color: var(--green-primary);">FREE</span>' : '₹' + deliveryCharge}</span>
      </div>
      <div class="breakdown-row">
        <span>Platform Fee</span>
        <span>₹${platformFee}</span>
      </div>
      <div class="breakdown-row total">
        <span>Total Amount</span>
        <span>₹${Math.round(totalPayable)}</span>
      </div>
      ${subtotal > 0 && subtotal < SITE_CONFIG.FREE_DELIVERY_THRESHOLD ? 
        `<div class="breakdown-row free-delivery-note" style="color: var(--orange-primary); font-size: 11px; margin-top: 8px; padding-top: 8px; border-top: 1px dashed var(--border-light);">
          <span><i class="fas fa-truck"></i> Add ₹${SITE_CONFIG.FREE_DELIVERY_THRESHOLD - subtotal} more for FREE delivery</span>
          <span></span>
        </div>` : 
        subtotal >= SITE_CONFIG.FREE_DELIVERY_THRESHOLD && subtotal > 0 ?
        `<div class="breakdown-row free-delivery-note" style="color: var(--green-primary); font-size: 11px; margin-top: 8px; padding-top: 8px; border-top: 1px dashed var(--border-light);">
          <span><i class="fas fa-check-circle"></i> You saved ₹${SITE_CONFIG.DELIVERY_CHARGE} on delivery!</span>
          <span></span>
        </div>` : ''
      }
      ${totalDiscountPercent > 0 ? `
        <div class="breakdown-row savings-note" style="color: var(--green-primary); font-size: 11px; margin-top: 4px;">
          <span><i class="fas fa-tags"></i> You saved ${totalDiscountPercent}% on this order!</span>
          <span></span>
        </div>
      ` : ''}
    `;
  }
  
  return { subtotal, originalTotal, totalDiscountAmount, totalDiscountPercent, deliveryCharge, platformFee, totalPayable };
}

function updateCartUI() {
  const totalItems = cart.reduce((s, i) => s + (i.qty || 0), 0);
  
  // Update cart count badges
  document.querySelectorAll('#cartCount, #bottomCartCount, #mobileCartCount').forEach(el => {
    if (el) el.innerText = totalItems;
  });
  
  // Update cart items list
  const cartList = document.getElementById('cartItemsList');
  if (cartList) {
    if (cart.length === 0) {
      cartList.innerHTML = '<div style="padding:30px;text-align:center; color: var(--text-muted);"><i class="fas fa-shopping-cart" style="font-size: 40px; margin-bottom: 10px; display: block;"></i>Your cart is empty<br><small>Add items to get started</small></div>';
    } else {
      let cartHtml = '';
      for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const discountPercent = item.discountPercent || (item.oldPrice ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100) : 0);
        const itemDiscount = item.oldPrice ? (item.oldPrice - item.price) * item.qty : 0;
        
        cartHtml += `
          <div class="cart-item" style="cursor:pointer;" onclick="window.viewProductFromCart(${item.id})">
            <img class="cart-item-img" src="${item.image || ''}" onerror="this.src='https://placehold.co/60'">
            <div class="cart-item-details">
              <div class="cart-item-name">${escapeHtml(item.name || 'Product')}</div>
              <div class="price-info">
                <span class="cart-current">₹${item.price || 0}</span>
                ${item.oldPrice ? `<span class="cart-old">₹${item.oldPrice}</span><span class="cart-discount">${discountPercent}% OFF</span>` : ''}
              </div>
              <div class="item-total-price" style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
                Total: ₹${(item.price || 0) * (item.qty || 0)}
                ${itemDiscount > 0 ? `<span style="color: var(--green-primary); margin-left: 8px;">(Saved ₹${itemDiscount})</span>` : ''}
              </div>
              <div class="quantity-control" onclick="event.stopPropagation()">
                <button onclick="window.updateQty(${item.id},-1)">-</button>
                <span>${item.qty || 0}</span>
                <button onclick="window.updateQty(${item.id},1)">+</button>
                <button onclick="window.removeItem(${item.id})" style="margin-left:8px;color:var(--red-primary);background:transparent;border:none;cursor:pointer;">Remove</button>
              </div>
            </div>
          </div>
        `;
      }
      cartList.innerHTML = cartHtml;
    }
  }
  
  // Update price breakdown
  updatePriceBreakdown();
}

function updateQty(id, delta) {
  const idx = cart.findIndex(i => i.id === id);
  if (idx !== -1) {
    let newQty = (cart[idx].qty || 0) + delta;
    if (newQty < 1) {
      cart.splice(idx, 1);
    } else if (newQty > SITE_CONFIG.MAX_CART_QUANTITY) {
      alert(`Max ${SITE_CONFIG.MAX_CART_QUANTITY} allowed`);
      return;
    } else {
      cart[idx].qty = newQty;
    }
    saveCart();
    updateCartUI();
  }
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

function addToCart(product) {
  if (!product || !product.id) return;
  
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    if ((existing.qty || 0) + 1 > SITE_CONFIG.MAX_CART_QUANTITY) {
      alert(`Max ${SITE_CONFIG.MAX_CART_QUANTITY} allowed`);
      return;
    }
    existing.qty = (existing.qty || 0) + 1;
  } else {
    cart.push({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      oldPrice: product.oldPrice,
      discountPercent: product.discountPercent,
      image: product.image, 
      qty: 1 
    });
  }
  saveCart();
  updateCartUI();
  showToast(`${product.name} added to cart!`);
}

function showToast(message) {
  // Remove existing toast
  const existingToast = document.querySelector('.custom-toast');
  if (existingToast) existingToast.remove();
  
  const toast = document.createElement('div');
  toast.className = 'custom-toast';
  toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--green-primary);color:white;padding:10px 20px;border-radius:40px;z-index:2000;font-size:14px;opacity:0;transition:opacity 0.3s;';
  toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
  document.body.appendChild(toast);
  
  setTimeout(() => { toast.style.opacity = '1'; }, 10);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 2000);
}

// View product from cart
function viewProductFromCart(productId) {
  if (!productId) return;
  
  if (window.allProducts) {
    const product = window.allProducts.find(p => p.id === productId);
    if (product) {
      let recentlyViewed = [];
      try {
        recentlyViewed = JSON.parse(localStorage.getItem('freshkart_recently')) || [];
      } catch(e) { recentlyViewed = []; }
      
      const filtered = recentlyViewed.filter(r => r.id !== productId);
      filtered.unshift(product);
      localStorage.setItem('freshkart_recently', JSON.stringify(filtered.slice(0, 30)));
    }
  }
  
  window.location.href = `description.html?id=${productId}`;
}
// ==================== SECTION 6: CART SIDEBAR FUNCTIONS ====================
function openCart() {
  updateCartUI();
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('overlay');
  if (sidebar) sidebar.classList.add('open');
  if (overlay) overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function bindCartEvents() {
  const cartBtn = document.getElementById('cartBtn');
  const bottomCartBtn = document.getElementById('bottomCartBtn');
  const mobileCartIcon = document.getElementById('mobileCartIcon');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const overlay = document.getElementById('overlay');
  const checkoutBtn = document.getElementById('checkoutBtn');
  
  if (cartBtn) {
    const newBtn = cartBtn.cloneNode(true);
    cartBtn.parentNode.replaceChild(newBtn, cartBtn);
    newBtn.addEventListener('click', (e) => { e.preventDefault(); openCart(); });
  }
  if (bottomCartBtn) {
    const newBottomBtn = bottomCartBtn.cloneNode(true);
    bottomCartBtn.parentNode.replaceChild(newBottomBtn, bottomCartBtn);
    newBottomBtn.addEventListener('click', (e) => { e.preventDefault(); openCart(); });
  }
  if (mobileCartIcon) {
    const newMobileIcon = mobileCartIcon.cloneNode(true);
    mobileCartIcon.parentNode.replaceChild(newMobileIcon, mobileCartIcon);
    newMobileIcon.addEventListener('click', (e) => { e.preventDefault(); openCart(); });
  }
  if (closeCartBtn) {
    const newCloseBtn = closeCartBtn.cloneNode(true);
    closeCartBtn.parentNode.replaceChild(newCloseBtn, closeCartBtn);
    newCloseBtn.addEventListener('click', closeCart);
  }
  if (overlay) {
    const newOverlay = overlay.cloneNode(true);
    overlay.parentNode.replaceChild(newOverlay, overlay);
    newOverlay.addEventListener('click', closeCart);
  }
  if (checkoutBtn) {
    const newCheckoutBtn = checkoutBtn.cloneNode(true);
    checkoutBtn.parentNode.replaceChild(newCheckoutBtn, checkoutBtn);
    newCheckoutBtn.addEventListener('click', () => {
      if (cart.length) {
        const subtotal = cart.reduce((s, i) => s + ((i.price || 0) * (i.qty || 0)), 0);
        const deliveryCharge = subtotal > SITE_CONFIG.FREE_DELIVERY_THRESHOLD ? 0 : SITE_CONFIG.DELIVERY_CHARGE;
        const total = subtotal + deliveryCharge + SITE_CONFIG.PLATFORM_FEE;
        
        // Create order object
        const order = {
          id: "ORD-" + Date.now(),
          date: new Date().toISOString().split('T')[0],
          status: "processing",
          subtotal: subtotal,
          deliveryFee: deliveryCharge,
          platformFee: SITE_CONFIG.PLATFORM_FEE,
          discount: subtotal - cart.reduce((s, i) => s + ((i.price || 0) * (i.qty || 0)), 0),
          total: total,
          items: cart.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            oldPrice: item.oldPrice,
            quantity: item.qty,
            image: item.image
          })),
          address: "Default Address"
        };
        
        // Save order to localStorage
        let existingOrders = [];
        try {
          existingOrders = JSON.parse(localStorage.getItem(SITE_CONFIG.STORAGE_KEYS.ORDERS)) || [];
        } catch(e) { existingOrders = []; }
        existingOrders.unshift(order);
        localStorage.setItem(SITE_CONFIG.STORAGE_KEYS.ORDERS, JSON.stringify(existingOrders));
        
        alert(`✅ Order placed successfully!\n\nOrder ID: ${order.id}\nTotal Amount: ₹${Math.round(total)}`);
        
        // Clear cart
        cart = [];
        saveCart();
        updateCartUI();
        closeCart();
        
        // Refresh if on orders page
        if (window.location.pathname.includes('orders.html')) {
          location.reload();
        }
      } else {
        alert('Your cart is empty!');
      }
    });
  }
}

// ==================== SECTION 7: WISHLIST FUNCTIONS ====================
// ==================== SECTION 7: WISHLIST FUNCTIONS (FIXED - NO REFRESH) ====================
function toggleWishlist(productId, event) {
  if (event) event.stopPropagation();
  
  const idx = wishlist.indexOf(productId);
  let isAdding = false;
  
  if (idx === -1) {
    wishlist.push(productId);
    isAdding = true;
  } else {
    wishlist.splice(idx, 1);
  }
  saveWishlist();
  
  // Update the heart icon in the current product card only (without refreshing the entire grid)
  if (event && event.target) {
    const icon = event.target.closest('.wishlist-icon')?.querySelector('i');
    if (icon) {
      if (isAdding) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        showToast('Added to wishlist! ❤️');
      } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        showToast('Removed from wishlist 💔');
      }
    }
  }
  
  // DO NOT refresh all show more managers - this causes the product shuffle
  // The UI update should be handled by updating just the specific button
}

// Alternative: Update wishlist without refresh
function updateWishlistUI(productId, isWishlisted) {
  // Find all wishlist buttons for this product and update them
  const allWishlistButtons = document.querySelectorAll(`.wishlist-icon[data-product-id="${productId}"] i, .wishlist-detail i`);
  allWishlistButtons.forEach(icon => {
    if (isWishlisted) {
      icon.classList.remove('far');
      icon.classList.add('fas');
    } else {
      icon.classList.remove('fas');
      icon.classList.add('far');
    }
  });
}

function isInWishlist(productId) {
  return wishlist.includes(productId);
}

function getWishlistProducts() {
  if (!allProductsData || !Array.isArray(allProductsData)) return [];
  return allProductsData.filter(p => wishlist.includes(p.id));
}

// Improved toast function with better visibility
function showToast(message, type = 'success') {
  // Remove existing toast
  const existingToast = document.querySelector('.custom-toast');
  if (existingToast) existingToast.remove();
  
  const toast = document.createElement('div');
  toast.className = 'custom-toast';
  const bgColor = type === 'success' ? 'var(--green-primary)' : type === 'error' ? 'var(--red-primary)' : 'var(--orange-primary)';
  toast.style.cssText = `position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:${bgColor};color:white;padding:10px 20px;border-radius:40px;z-index:2000;font-size:14px;opacity:0;transition:opacity 0.3s;white-space:nowrap;`;
  toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-heart' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i> ${message}`;
  document.body.appendChild(toast);
  
  setTimeout(() => { toast.style.opacity = '1'; }, 10);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 2000);
}

// ==================== SECTION 8: DARK MODE ====================
function initDarkMode() {
  const savedTheme = localStorage.getItem(SITE_CONFIG.STORAGE_KEYS.THEME) || SITE_CONFIG.DEFAULT_THEME;
  document.body.setAttribute('data-theme', savedTheme);
  const toggleBtn = document.getElementById('darkModeToggle');
  if (toggleBtn) toggleBtn.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

function toggleDarkMode() {
  const cur = document.body.getAttribute('data-theme');
  const nxt = cur === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', nxt);
  localStorage.setItem(SITE_CONFIG.STORAGE_KEYS.THEME, nxt);
  const toggleBtn = document.getElementById('darkModeToggle');
  if (toggleBtn) toggleBtn.innerHTML = nxt === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// ==================== SECTION 9: PRODUCT CARD RENDERER ====================

// ==================== SECTION 9: PRODUCT CARD RENDERER ====================
function renderProductCard(product) {
  if (!product) return '';
  const isWishlisted = wishlist.includes(product.id);
  const discountValue = product.discountPercent || (product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0);
  const isSubscription = product.category === "subscription" || product.subscriptionType;
  
  return `
    <div class="product-card" data-product-id="${product.id}" onclick="viewProduct(${product.id})">
      <div class="product-image">
        <img src="${product.image}" onerror="this.src='https://placehold.co/200'">
        ${discountValue ? `<div class="product-badge">${discountValue}% OFF</div>` : ''}
        ${isSubscription ? `<div class="subscription-badge"><i class="fas fa-calendar-check"></i> Subscription</div>` : ''}
        <div class="wishlist-icon" data-product-id="${product.id}" onclick="event.stopPropagation();toggleWishlist(${product.id}, event)">
          <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
        </div>
      </div>
      <div class="product-info-card">
        <div class="product-name">${escapeHtml(product.name)}</div>
        <div class="price-row-card">
          <span class="current-price-card">₹${product.price}</span>
          ${product.oldPrice ? `<span class="old-price-card">₹${product.oldPrice}</span>` : ''}
        </div>
        ${isSubscription ? `<div class="subscription-delivery-info"><i class="fas fa-truck"></i> ${product.deliverySchedule || 'Flexible delivery'}</div>` : ''}
        <button class="add-to-cart-card" onclick="event.stopPropagation();addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
          <i class="fas fa-shopping-cart"></i> ${isSubscription ? 'Subscribe Now' : 'Add to Cart'}
        </button>
      </div>
    </div>
  `;
}

// Update viewProduct function to handle subscription products
function viewProduct(productId) {
  // Store product in recently viewed
  const product = window.allProducts?.find(p => p.id === productId);
  if (product) {
    let recentlyViewed = [];
    try {
      recentlyViewed = JSON.parse(localStorage.getItem('freshkart_recently')) || [];
    } catch(e) { recentlyViewed = []; }
    
    const filtered = recentlyViewed.filter(r => r.id !== productId);
    filtered.unshift(product);
    localStorage.setItem('freshkart_recently', JSON.stringify(filtered.slice(0, 30)));
  }
  
  // Navigate to description page (works for both regular and subscription products)
  window.location.href = `description.html?id=${productId}`;
}

function viewProduct(productId) {
  window.location.href = `description.html?id=${productId}`;
}

// ==================== SECTION 10: SHOW MORE MANAGER CLASS (INFINITE LOADING) ====================
// ==================== SECTION 10: SHOW MORE MANAGER CLASS (ENHANCED INFINITE RANDOM CYCLING) ====================
// ==================== SECTION 10: SHOW MORE MANAGER CLASS (PRIORITIZE UNSHOWN PRODUCTS) ====================
class ShowMoreManager {
  constructor(containerId, buttonId, getFilteredProducts, options = {}) {
    this.containerId = containerId;
    this.buttonId = buttonId;
    this.getFilteredProducts = getFilteredProducts;
    this.options = {
      initialItems: options.initialItems || SITE_CONFIG.DEFAULT_INITIAL_ITEMS,
      loadMoreItems: options.loadMoreItems || SITE_CONFIG.DEFAULT_LOAD_MORE_ITEMS,
      maxCycles: options.maxCycles || SITE_CONFIG.DEFAULT_MAX_CYCLES,
      showCycleNotification: options.showCycleNotification !== undefined ? options.showCycleNotification : true
    };
    
    // Track shown products across all cycles
    this.shownProductIds = new Set();      // All products ever shown
    this.currentCycleShownIds = new Set(); // Products shown in current cycle
    this.availableUnshownProducts = [];     // Products not yet shown
    this.allProductsList = [];              // Complete list of products
    this.currentDisplayedIds = [];
    this.cycleCount = 1;
    this.isActive = true;
    this.hasCompletedFullCycle = false;     // Track if all products have been shown at least once
  }
  
  init() { 
    this.reset(); 
    this.bindEvents(); 
  }
  
  // In the ShowMoreManager class, update the reset method to preserve the current display
reset() {
  this.shownProductIds.clear();
  this.currentCycleShownIds.clear();
  this.currentDisplayedIds = [];
  this.cycleCount = 1;
  this.isActive = true;
  this.hasCompletedFullCycle = false;
  
  const filtered = this.getFilteredProducts();
  this.allProductsList = [...filtered];
  
  if (filtered.length === 0) { 
    this.showEmptyState(); 
    return; 
  }
  
  this.availableUnshownProducts = this.shuffleArray([...filtered]);
  this.loadInitialProducts();
  this.updateButtonState();
}

// Add a method to update just the wishlist state without refreshing
updateWishlistState(productId, isWishlisted) {
  // Find all product cards with this product ID and update the wishlist icon
  const productCards = document.querySelectorAll(`.product-card[data-product-id="${productId}"] .wishlist-icon i`);
  productCards.forEach(icon => {
    if (isWishlisted) {
      icon.classList.remove('far');
      icon.classList.add('fas');
    } else {
      icon.classList.remove('fas');
      icon.classList.add('far');
    }
  });
}
  
  loadInitialProducts() {
    // Take initial products from unshown pool
    const initialProducts = this.getProductsFromPool(this.options.initialItems);
    this.currentDisplayedIds = initialProducts.map(p => p.id);
    
    // Mark these as shown
    initialProducts.forEach(p => {
      this.shownProductIds.add(p.id);
      this.currentCycleShownIds.add(p.id);
    });
    
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = initialProducts.map(p => renderProductCard(p)).join('');
    }
  }
  
  // Get products from the appropriate pool (unshown first, then repeat)
  getProductsFromPool(count) {
    const productsToReturn = [];
    
    // First, try to get unshown products
    while (productsToReturn.length < count && this.availableUnshownProducts.length > 0) {
      const product = this.availableUnshownProducts.shift();
      productsToReturn.push(product);
    }
    
    // If we still need more products, we've shown all products at least once
    if (productsToReturn.length < count) {
      if (!this.hasCompletedFullCycle) {
        this.hasCompletedFullCycle = true;
        
        // Show notification that we've completed showing all products
        if (this.options.showCycleNotification) {
          this.showNotification(`🎉 You've seen all ${this.allProductsList.length} products! Now showing random repeats...`);
        }
      }
      
      // Now repeat products randomly (excluding the most recent ones to avoid immediate repeats)
      const remainingNeeded = count - productsToReturn.length;
      const repeatProducts = this.getRandomRepeatProducts(remainingNeeded);
      productsToReturn.push(...repeatProducts);
    }
    
    return productsToReturn;
  }
  
  // Get random products for repetition (avoiding immediate duplicates)
  getRandomRepeatProducts(count) {
    const repeats = [];
    const availableForRepeat = [...this.allProductsList];
    
    // Shuffle available products for randomness
    const shuffled = this.shuffleArray([...availableForRepeat]);
    
    for (let i = 0; i < count && i < shuffled.length; i++) {
      repeats.push(shuffled[i]);
    }
    
    return repeats;
  }
  
  loadMore() {
    if (!this.isActive) return;
    
    // Check if we've reached max cycles
    if (this.cycleCount > this.options.maxCycles) {
      this.complete();
      return;
    }
    
    // Get new products (prioritizes unshown)
    const newProducts = this.getProductsFromPool(this.options.loadMoreItems);
    
    if (newProducts.length === 0) {
      // No more products available, start new cycle if within limits
      if (this.cycleCount < this.options.maxCycles) {
        this.startNewCycle();
      } else {
        this.complete();
      }
      return;
    }
    
    // Add new products to display
    newProducts.forEach(p => {
      this.currentDisplayedIds.push(p.id);
      this.shownProductIds.add(p.id);
      this.currentCycleShownIds.add(p.id);
    });
    
    const container = document.getElementById(this.containerId);
    if (container) {
      container.insertAdjacentHTML('beforeend', newProducts.map(p => renderProductCard(p)).join(''));
    }
    
    this.updateButtonState();
  }
  
  startNewCycle() {
    this.cycleCount++;
    
    // Reset cycle tracking but keep overall shown products
    this.currentCycleShownIds.clear();
    
    // Reset unshown products for the new cycle
    // Only include products that haven't been shown in this cycle
    // But since it's a new cycle, all products are eligible again
    this.availableUnshownProducts = this.shuffleArray([...this.allProductsList]);
    
    // Show notification for new cycle
    if (this.options.showCycleNotification) {
      this.showNotification(`🔄 Starting Round ${this.cycleCount} of ${this.options.maxCycles}! Loading fresh products...`);
    }
    
    // Load initial products for the new cycle
    const newInitialProducts = this.getProductsFromPool(this.options.initialItems);
    this.currentDisplayedIds = newInitialProducts.map(p => p.id);
    
    // Mark as shown
    newInitialProducts.forEach(p => {
      this.shownProductIds.add(p.id);
      this.currentCycleShownIds.add(p.id);
    });
    
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = newInitialProducts.map(p => renderProductCard(p)).join('');
    }
    
    this.updateButtonState();
  }
  
  complete() {
    this.isActive = false;
    const button = document.getElementById(this.buttonId);
    if (button) { 
      button.textContent = "🏁 All Products Explored! (" + this.options.maxCycles + " cycles complete)"; 
      button.disabled = true;
      button.style.opacity = '0.6';
      button.style.cursor = 'not-allowed';
    }
    if (this.options.showCycleNotification) {
      this.showNotification(`✨ Thank you for exploring all ${this.options.maxCycles} cycles! ✨`);
    }
  }
  
  showEmptyState() {
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = '<div class="empty-state"><i class="fas fa-box-open"></i><p>No products available in this category</p></div>';
    }
    const button = document.getElementById(this.buttonId);
    if (button) button.style.display = 'none';
  }
  
  updateButtonState() {
    const button = document.getElementById(this.buttonId);
    if (!button) return;
    
    // Calculate remaining products
    const unshownCount = this.availableUnshownProducts.length;
    const remainingCycles = this.options.maxCycles - this.cycleCount;
    
    if (unshownCount === 0 && this.hasCompletedFullCycle) {
      if (this.cycleCount < this.options.maxCycles) {
        // More cycles available - show cycle start button
        button.textContent = `🔄 Start Round ${this.cycleCount + 1} (${this.options.loadMoreItems} fresh repeats) →`;
        button.disabled = false;
        button.style.opacity = '1';
      } else if (this.cycleCount === this.options.maxCycles) {
        // Final cycle, check if we have more to show in current cycle
        button.textContent = `Show More (${this.options.loadMoreItems} repeats) → Round ${this.cycleCount}/${this.options.maxCycles}`;
        button.disabled = false;
        button.style.opacity = '1';
      } else {
        // All cycles complete
        button.textContent = `🏁 Complete! (${this.options.maxCycles}/${this.options.maxCycles} cycles)`;
        button.disabled = true;
        button.style.opacity = '0.6';
      }
    } else if (unshownCount > 0) {
      // Still have unshown products
      const remainingToShow = Math.min(this.options.loadMoreItems, unshownCount);
      button.textContent = `Show More (${remainingToShow} new products) → Round ${this.cycleCount}/${this.options.maxCycles}`;
      button.disabled = false;
      button.style.opacity = '1';
    } else {
      // No unshown products, showing repeats
      button.textContent = `Show More (${this.options.loadMoreItems} products) → Round ${this.cycleCount}/${this.options.maxCycles}`;
      button.disabled = false;
      button.style.opacity = '1';
    }
  }
  
  showNotification(message) {
    // Remove any existing notification banners
    const existingBanners = document.querySelectorAll('.cycle-notification');
    existingBanners.forEach(banner => banner.remove());
    
    // Create new notification banner
    const banner = document.createElement('div');
    banner.className = 'cycle-notification';
    banner.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--orange-primary);
      color: white;
      padding: 12px 24px;
      border-radius: 50px;
      z-index: 2000;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      animation: slideUpFade 3s ease forwards;
      white-space: nowrap;
      pointer-events: none;
    `;
    banner.innerHTML = `<i class="fas fa-sync-alt"></i> ${message}`;
    document.body.appendChild(banner);
    
    // Add animation styles if not present
    if (!document.querySelector('#cycle-notification-styles')) {
      const style = document.createElement('style');
      style.id = 'cycle-notification-styles';
      style.textContent = `
        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
          15% { opacity: 1; transform: translateX(-50%) translateY(0); }
          85% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-20px); visibility: hidden; }
        }
        @media (max-width: 768px) {
          .cycle-notification {
            white-space: normal;
            text-align: center;
            max-width: 90%;
            font-size: 12px;
            padding: 10px 18px;
            bottom: 70px;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Auto-remove after animation
    setTimeout(() => {
      if (banner && banner.parentNode) banner.remove();
    }, 3000);
  }
  
  shuffleArray(array) {
    // Fisher-Yates shuffle algorithm for true randomness
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  refresh() { 
    this.reset(); 
  }
  
  getStats() {
    return {
      currentCycle: this.cycleCount,
      maxCycles: this.options.maxCycles,
      totalProducts: this.allProductsList.length,
      shownProductsCount: this.shownProductIds.size,
      unshownProductsCount: this.availableUnshownProducts.length,
      hasCompletedFullCycle: this.hasCompletedFullCycle,
      isActive: this.isActive
    };
  }
  
  bindEvents() {
    const button = document.getElementById(this.buttonId);
    if (button) {
      // Remove existing listeners by cloning
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      newButton.addEventListener('click', () => this.loadMore());
    }
  }
}

// Helper function to create show more manager
function createShowMoreManager(name, containerId, buttonId, getFilteredProducts, options = {}) {
  const manager = new ShowMoreManager(containerId, buttonId, getFilteredProducts, options);
  if (!window.showMoreManagers) window.showMoreManagers = {};
  window.showMoreManagers[name] = manager;
  return manager;
}

// Function to refresh all active show more managers
function refreshAllShowMoreManagers() {
  if (window.showMoreManagers) {
    Object.values(window.showMoreManagers).forEach(manager => {
      if (manager && typeof manager.refresh === 'function') {
        manager.refresh();
      }
    });
  }
}

// Function to get stats for debugging
function getShowMoreManagerStats(name) {
  if (window.showMoreManagers && window.showMoreManagers[name]) {
    return window.showMoreManagers[name].getStats();
  }
  return null;
}
// ==================== SECTION 11: SKELETON LOADING FUNCTIONS ====================
function showProductsSkeleton(containerId, count = 8) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '<div class="products-skeleton-grid">' + Array(count).fill(`
    <div class="product-skeleton">
      <div class="image-skeleton skeleton"></div>
      <div class="info-skeleton">
        <div class="title-skeleton skeleton"></div>
        <div class="price-skeleton skeleton"></div>
        <div class="button-skeleton skeleton"></div>
      </div>
    </div>
  `).join('') + '</div>';
}

function showHeroSkeleton() {
  const container = document.getElementById('heroSlider');
  if (!container) return;
  container.innerHTML = `<div class="swiper-slide"><div class="hero-skeleton skeleton"></div></div>`;
}

function showCategoriesSkeleton() {
  const container = document.getElementById('quickCatLinks');
  if (!container) return;
  container.innerHTML = Array(6).fill(`<div class="cat-skeleton"><div class="cat-icon-skeleton skeleton"></div><div class="cat-text-skeleton skeleton"></div></div>`).join('');
}

// ==================== SECTION 12: HEADER COMPONENTS ====================
function initGlobalSearch() {
  const searchInput = document.getElementById('globalSearch');
  if (searchInput && allProductsData) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = allProductsData.filter(p => p.name && p.name.toLowerCase().includes(term));
      if (filtered.length) window.location.href = `description.html?id=${filtered[0].id}`;
    });
  }
}

function initLocationSelector() {
  const locationSelect = document.getElementById('locationSelect');
  if (locationSelect) {
    locationSelect.addEventListener('change', (e) => showToast(`📍 Location changed to ${e.target.value}`));
  }
}

// ==================== SECTION 13: MAIN INITIALIZATION ====================
async function initCommon(customInitCallback) {
  await loadProductsFromJSON();
  loadAllData();
  initDarkMode();
  updateCartUI();
  bindCartEvents();
  initGlobalSearch();
  initLocationSelector();
  if (customInitCallback) customInitCallback();
}


// ==================== SECTION 14: HELPER FUNCTIONS ====================
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// ==================== SECTION 15: CATEGORY COMMON SECTION ====================


// ==================== SECTION 16: COMMON CATEGORY FUNCTIONS ====================
const COMMON_CATEGORIES = [
  { name: "All", icon: "fa-th-large", emoji: "📦", cat: "all", color: "#f97316" },
  { name: "Fruits", icon: "fa-apple", emoji: "🍎", cat: "fruits", color: "#e74c3c" },
  { name: "Vegetables", icon: "fa-carrot", emoji: "🥬", cat: "vegetables", color: "#27ae60" },
  { name: "Beverages", icon: "fa-mug-saucer", emoji: "🥤", cat: "beverages", color: "#3498db" },
  { name: "Cakes", icon: "fa-cake-candles", emoji: "🎂", cat: "cakes", color: "#e84393" },
  { name: "Ice Cream", icon: "fa-ice-cream", emoji: "🍦", cat: "icecream", color: "#f39c12" },
  { name: "Snacks", icon: "fa-bowl-food", emoji: "🍿", cat: "snacks", color: "#e67e22" },
  { name: "Meals", icon: "fa-utensils", emoji: "🍛", cat: "meals", color: "#d35400" },
  { name: "Meats", icon: "fa-drumstick-bite", emoji: "🍗", cat: "meats", color: "#c0392b" },
  { name: "Dairy", icon: "fa-cheese", emoji: "🥛", cat: "dairy", color: "#3498db" },
  { name: "Bakery", icon: "fa-bread-slice", emoji: "🥖", cat: "bakery", color: "#d35400" },
  { name: "Staples", icon: "fa-box", emoji: "🍚", cat: "staples", color: "#7f8c8d" },
  { name: "Groceries", icon: "fa-basket-shopping", emoji: "🛒", cat: "groceries", color: "#16a085" },
  { name: "Subscriptions", icon: "fa-calendar-check", emoji: "📦", cat: "subscription", color: "#8e44ad" }
];

// Render category pills (filter buttons)
function renderCategoryPills(containerId, activeCategory, onCategoryClick) {
  const container = document.getElementById(containerId);
  if (!container) return false;
  
  let html = '';
  for (let i = 0; i < COMMON_CATEGORIES.length; i++) {
    const cat = COMMON_CATEGORIES[i];
    const activeClass = (activeCategory === cat.cat) ? 'active' : '';
    html += `<button class="filter-capsule ${activeClass}" data-category="${cat.cat}"><i class="fas ${cat.icon}"></i> ${cat.name}</button>`;
  }
  container.innerHTML = html;
  
  // Attach event listeners
  const buttons = container.querySelectorAll('.filter-capsule');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function(e) {
      const category = this.getAttribute('data-category');
      if (onCategoryClick && typeof onCategoryClick === 'function') {
        onCategoryClick(category);
      }
    });
  }
  return true;
}

// Render category cards (grid view)
function renderCategoryCards(containerId, activeCategory, onCategoryClick) {
  const container = document.getElementById(containerId);
  if (!container) return false;
  
  let html = '';
  for (let i = 0; i < COMMON_CATEGORIES.length; i++) {
    const cat = COMMON_CATEGORIES[i];
    const activeClass = (activeCategory === cat.cat) ? 'active' : '';
    html += `<div class="category-card ${activeClass}" data-category="${cat.cat}">
      <div class="category-card-icon">${cat.emoji}</div>
      <span>${cat.name}</span>
    </div>`;
  }
  container.innerHTML = html;
  
  // Attach event listeners
  const cards = container.querySelectorAll('.category-card');
  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      if (onCategoryClick && typeof onCategoryClick === 'function') {
        onCategoryClick(category);
      }
    });
  }
  return true;
}

// Function to view product from cart
function viewProductFromCart(productId) {
  if (!productId) return;
  
  // Save to recently viewed if product exists
  if (window.allProducts) {
    const product = window.allProducts.find(p => p.id === productId);
    if (product) {
      let recentlyViewed = [];
      try {
        recentlyViewed = JSON.parse(localStorage.getItem('freshkart_recently')) || [];
      } catch(e) { recentlyViewed = []; }
      
      const filtered = recentlyViewed.filter(r => r.id !== productId);
      filtered.unshift(product);
      localStorage.setItem('freshkart_recently', JSON.stringify(filtered.slice(0, 30)));
    }
  }
  
  window.location.href = `description.html?id=${productId}`;
}

// Update cart UI to make items clickable
function updateCartUIClickable() {
  const totalItems = cart.reduce((s, i) => s + (i.qty || 0), 0);
  
  document.querySelectorAll('#cartCount, #bottomCartCount, #mobileCartCount').forEach(el => {
    if (el) el.innerText = totalItems;
  });
  
  const cartList = document.getElementById('cartItemsList');
  if (cartList) {
    if (cart.length === 0) {
      cartList.innerHTML = '<div style="padding:30px;text-align:center;">Cart empty</div>';
    } else {
      let cartHtml = '';
      for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const discountPercent = item.discountPercent || (item.oldPrice ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100) : 0);
        cartHtml += `
          <div class="cart-item" style="cursor:pointer;" onclick="window.viewProductFromCart(${item.id})">
            <img class="cart-item-img" src="${item.image || ''}" onerror="this.src='https://placehold.co/60'">
            <div class="cart-item-details">
              <div class="cart-item-name">${escapeHtml(item.name || 'Product')}</div>
              <div class="price-info">
                <span class="cart-current">₹${item.price || 0}</span>
                ${item.oldPrice ? `<span class="cart-old">₹${item.oldPrice}</span><span class="cart-discount">${discountPercent}% off</span>` : ''}
              </div>
              <div class="quantity-control" onclick="event.stopPropagation()">
                <button onclick="window.updateQty(${item.id},-1)">-</button>
                <span>${item.qty || 0}</span>
                <button onclick="window.updateQty(${item.id},1)">+</button>
                <button onclick="window.removeItem(${item.id})" style="margin-left:8px;color:var(--red-primary);background:transparent;border:none;cursor:pointer;">Remove</button>
              </div>
            </div>
          </div>
        `;
      }
      cartList.innerHTML = cartHtml;
    }
  }
  updatePriceBreakdown();
}

// Override the original updateCartUI with the clickable version
const originalUpdateCartUI = updateCartUI;
window.updateCartUI = updateCartUIClickable;

// ==================== SECTION 17: SUBSCRIPTION CATEGORY FUNCTIONS ====================
const SUBSCRIPTION_CATEGORIES = [
  { id: "all", name: "All Plans", icon: "fa-th-large", emoji: "📦" },
  { id: "daily", name: "Daily Delivery", icon: "fa-sun", emoji: "🌅" },
  { id: "weekly", name: "Weekly Delivery", icon: "fa-calendar-week", emoji: "📅" },
  { id: "monthly", name: "Monthly Delivery", icon: "fa-calendar-alt", emoji: "🗓️" },
  { id: "meal", name: "Meal Plans", icon: "fa-utensils", emoji: "🍽️" },
  { id: "grocery", name: "Grocery", icon: "fa-basket-shopping", emoji: "🛒" },
  { id: "dairy", name: "Dairy", icon: "fa-cheese", emoji: "🥛" },
  { id: "organic", name: "Organic", icon: "fa-leaf", emoji: "🌿" },
  { id: "fitness", name: "Fitness", icon: "fa-dumbbell", emoji: "💪" },
  { id: "pet", name: "Pet", icon: "fa-paw", emoji: "🐾" }
];

function renderSubscriptionCategoryPills(containerId, activeCategory, onCategoryClick) {
  const container = document.getElementById(containerId);
  if (!container) return false;
  
  let html = '';
  for (let i = 0; i < SUBSCRIPTION_CATEGORIES.length; i++) {
    const cat = SUBSCRIPTION_CATEGORIES[i];
    const activeClass = (activeCategory === cat.id) ? 'active' : '';
    html += `
      <button class="subscription-filter-pill ${activeClass}" data-sub-category="${cat.id}">
        <i class="fas ${cat.icon}"></i> ${cat.name}
      </button>
    `;
  }
  container.innerHTML = html;
  
  // Attach event listeners
  const buttons = container.querySelectorAll('.subscription-filter-pill');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function() {
      const category = this.getAttribute('data-sub-category');
      if (onCategoryClick && typeof onCategoryClick === 'function') {
        onCategoryClick(category);
      }
    });
  }
  return true;
}

// Smaller subscription card (matches normal product card size)
function renderSmallSubscriptionCard(sub) {
  if (!sub) return '';
  const discount = sub.discountPercent || Math.round(((sub.oldPrice - sub.price) / sub.oldPrice) * 100);
  const typeIcon = sub.subscriptionType === 'daily' ? 'fa-sun' : (sub.subscriptionType === 'weekly' ? 'fa-calendar-week' : 'fa-calendar-alt');
  const typeText = sub.subscriptionType === 'daily' ? 'Daily' : (sub.subscriptionType === 'weekly' ? 'Weekly' : 'Monthly');
  const isWishlisted = wishlist.includes(sub.id);
  
  return `
    <div class="product-card subscription-small-card" data-product-id="${sub.id}" onclick="viewProduct(${sub.id})">
      <div class="product-image">
        <img src="${sub.image}" onerror="this.src='https://placehold.co/200'">
        <div class="product-badge subscription-badge-small"><i class="fas ${typeIcon}"></i> ${typeText}</div>
        ${discount ? `<div class="product-badge discount-badge">${discount}% OFF</div>` : ''}
        <div class="wishlist-icon" data-product-id="${sub.id}" onclick="event.stopPropagation();toggleWishlist(${sub.id}, event)">
          <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
        </div>
      </div>
      <div class="product-info-card">
        <div class="product-name">${escapeHtml(sub.name)}</div>
        <div class="price-row-card">
          <span class="current-price-card">₹${sub.price}</span>
          ${sub.oldPrice ? `<span class="old-price-card">₹${sub.oldPrice}</span>` : ''}
        </div>
        <div class="subscription-delivery-info"><i class="fas fa-truck"></i> ${sub.deliverySchedule || 'Flexible'}</div>
        <button class="add-to-cart-card" onclick="event.stopPropagation();addSubscriptionToCartGlobal(${sub.id})">
          <i class="fas fa-shopping-cart"></i> Subscribe
        </button>
      </div>
    </div>
  `;
}

// Global function to add subscription to cart
async function addSubscriptionToCartGlobal(productId) {
  try {
    const response = await fetch('product.json');
    const data = await response.json();
    const product = data.products.find(p => p.id === productId);
    
    if (product) {
      const existing = cart.find(i => i.id === product.id);
      if (existing) {
        if ((existing.qty || 0) + 1 > SITE_CONFIG.MAX_CART_QUANTITY) {
          alert(`Max ${SITE_CONFIG.MAX_CART_QUANTITY} allowed`);
          return;
        }
        existing.qty = (existing.qty || 0) + 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          oldPrice: product.oldPrice,
          discountPercent: product.discountPercent,
          image: product.image,
          qty: 1,
          isSubscription: true,
          subscriptionType: product.subscriptionType,
          deliverySchedule: product.deliverySchedule
        });
      }
      saveCart();
      updateCartUI();
      showToast(`${product.name} added to cart!`);
    }
  } catch(e) {
    console.error('Error adding to cart:', e);
    alert('Error adding to cart. Please try again.');
  }
}

// ==================== SECTION 16: MODULAR CATEGORY SYSTEM ====================
// Master Category Configuration - Edit this to change categories across the entire site
const MASTER_CATEGORIES = {
  // Main product categories (used across all pages)
  productCategories: [
    { id: "all", name: "All", icon: "fa-th-large", emoji: "📦", type: "product", showInNav: true, showInHome: true, showInOrders: true, order: 0 },
    { id: "fruits", name: "Fruits", icon: "fa-apple", emoji: "🍎", type: "product", showInNav: true, showInHome: true, showInOrders: true, order: 1 },
    { id: "vegetables", name: "Vegetables", icon: "fa-carrot", emoji: "🥬", type: "product", showInNav: true, showInHome: true, showInOrders: true, order: 2 },
    { id: "beverages", name: "Beverages", icon: "fa-mug-saucer", emoji: "🥤", type: "product", showInNav: true, showInHome: true, showInOrders: true, order: 3 },
    { id: "cakes", name: "Cakes", icon: "fa-cake-candles", emoji: "🎂", type: "product", showInNav: true, showInHome: false, showInOrders: true, order: 4 },
    { id: "icecream", name: "Ice Cream", icon: "fa-ice-cream", emoji: "🍦", type: "product", showInNav: true, showInHome: false, showInOrders: true, order: 5 },
    { id: "snacks", name: "Snacks", icon: "fa-bowl-food", emoji: "🍿", type: "product", showInNav: true, showInHome: true, showInOrders: true, order: 6 },
    { id: "meals", name: "Meals", icon: "fa-utensils", emoji: "🍛", type: "product", showInNav: true, showInHome: false, showInOrders: true, order: 7 },
    { id: "meats", name: "Meats", icon: "fa-drumstick-bite", emoji: "🍗", type: "product", showInNav: true, showInHome: false, showInOrders: true, order: 8 },
    { id: "dairy", name: "Dairy", icon: "fa-cheese", emoji: "🥛", type: "product", showInNav: true, showInHome: true, showInOrders: true, order: 9 },
    { id: "bakery", name: "Bakery", icon: "fa-bread-slice", emoji: "🥖", type: "product", showInNav: true, showInHome: false, showInOrders: true, order: 10 },
    { id: "staples", name: "Staples", icon: "fa-box", emoji: "🍚", type: "product", showInNav: true, showInHome: true, showInOrders: true, order: 11 },
    { id: "groceries", name: "Groceries", icon: "fa-basket-shopping", emoji: "🛒", type: "product", showInNav: true, showInHome: true, showInOrders: true, order: 12 }
  ],
  
  // Subscription categories (used on subscription page)
  subscriptionCategories: [
    { id: "all", name: "All Plans", icon: "fa-th-large", emoji: "📦", type: "subscription", order: 0 },
    { id: "daily", name: "Daily Delivery", icon: "fa-sun", emoji: "🌅", type: "subscription", order: 1 },
    { id: "weekly", name: "Weekly Delivery", icon: "fa-calendar-week", emoji: "📅", type: "subscription", order: 2 },
    { id: "monthly", name: "Monthly Delivery", icon: "fa-calendar-alt", emoji: "🗓️", type: "subscription", order: 3 },
    { id: "meal", name: "Meal Plans", icon: "fa-utensils", emoji: "🍽️", type: "subscription", order: 4 },
    { id: "grocery", name: "Grocery", icon: "fa-basket-shopping", emoji: "🛒", type: "subscription", order: 5 },
    { id: "dairy", name: "Dairy", icon: "fa-cheese", emoji: "🥛", type: "subscription", order: 6 },
    { id: "organic", name: "Organic", icon: "fa-leaf", emoji: "🌿", type: "subscription", order: 7 },
    { id: "fitness", name: "Fitness", icon: "fa-dumbbell", emoji: "💪", type: "subscription", order: 8 },
    { id: "pet", name: "Pet", icon: "fa-paw", emoji: "🐾", type: "subscription", order: 9 },
    { id: "baby", name: "Baby", icon: "fa-baby", emoji: "👶", type: "subscription", order: 10 },
    { id: "senior", name: "Senior Care", icon: "fa-heartbeat", emoji: "❤️", type: "subscription", order: 11 }
  ],
  
  // Timeline options (for subscription page)
  timelineOptions: [
    { id: "all", name: "All Timelines", icon: "fa-calendar", emoji: "📅", order: 0 },
    { id: "daily", name: "Daily", icon: "fa-sun", emoji: "🌅", order: 1 },
    { id: "weekly", name: "Weekly", icon: "fa-calendar-week", emoji: "📅", order: 2 },
    { id: "biweekly", name: "Bi-Weekly", icon: "fa-calendar-alt", emoji: "📆", order: 3 },
    { id: "monthly", name: "Monthly", icon: "fa-calendar-alt", emoji: "📅", order: 4 },
    { id: "quarterly", name: "Quarterly", icon: "fa-calendar-check", emoji: "📊", order: 5 }
  ],
  
  // Page-specific limits (how many categories to show on each page)
  pageLimits: {
    home: 8,
    orders: 6,
    categories: 'all',
    account: 4,
    subscription: 'all'
  }
};

// ==================== CATEGORY RENDER FUNCTIONS ====================

/**
 * Render category pills (horizontal filter buttons)
 * @param {string} containerId - ID of container element
 * @param {string} activeId - Currently active category ID
 * @param {function} onClick - Callback function when category is clicked
 * @param {string} categoryType - 'product' or 'subscription'
 * @param {number} limit - Number of categories to show (optional)
 */
function renderCategoryPills(containerId, activeId, onClick, categoryType = 'product', limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return false;
  
  let categories = categoryType === 'subscription' 
    ? MASTER_CATEGORIES.subscriptionCategories 
    : MASTER_CATEGORIES.productCategories;
  
  // Apply limit if specified
  if (limit && limit !== 'all') {
    categories = categories.slice(0, limit);
  }
  
  let html = '';
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    const activeClass = (activeId === cat.id) ? 'active' : '';
    html += `
      <button class="filter-pill ${activeClass}" data-category-id="${cat.id}" data-category-type="${categoryType}">
        <i class="fas ${cat.icon}"></i> ${cat.name}
      </button>
    `;
  }
  container.innerHTML = html;
  
  // Attach event listeners
  const buttons = container.querySelectorAll('.filter-pill');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function() {
      const categoryId = this.getAttribute('data-category-id');
      if (onClick && typeof onClick === 'function') {
        onClick(categoryId);
      }
    });
  }
  return true;
}

/**
 * Render category cards (grid style like home page)
 * @param {string} containerId - ID of container element
 * @param {string} activeId - Currently active category ID
 * @param {function} onClick - Callback function when category is clicked
 * @param {string} categoryType - 'product' or 'subscription'
 * @param {number} limit - Number of categories to show (optional)
 */
function renderCategoryCards(containerId, activeId, onClick, categoryType = 'product', limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return false;
  
  let categories = categoryType === 'subscription' 
    ? MASTER_CATEGORIES.subscriptionCategories 
    : MASTER_CATEGORIES.productCategories;
  
  // Apply limit if specified
  if (limit && limit !== 'all') {
    categories = categories.slice(0, limit);
  }
  
  container.style.display = 'flex';
  container.style.flexWrap = 'wrap';
  container.style.justifyContent = 'center';
  container.style.gap = '14px';
  container.style.margin = '20px 0';
  
  let html = '';
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    const activeClass = (activeId === cat.id) ? 'active' : '';
    html += `
      <div class="category-card ${activeClass}" data-category-id="${cat.id}" data-category-type="${categoryType}">
        <div class="category-card-icon">${cat.emoji}</div>
        <span>${cat.name}</span>
      </div>
    `;
  }
  container.innerHTML = html;
  
  // Attach event listeners
  const cards = container.querySelectorAll('.category-card');
  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', function() {
      const categoryId = this.getAttribute('data-category-id');
      if (onClick && typeof onClick === 'function') {
        onClick(categoryId);
      }
    });
  }
  return true;
}

/**
 * Render timeline pills (for subscription page)
 * @param {string} containerId - ID of container element
 * @param {string} activeId - Currently active timeline ID
 * @param {function} onClick - Callback function when timeline is clicked
 */
function renderTimelinePills(containerId, activeId, onClick) {
  const container = document.getElementById(containerId);
  if (!container) return false;
  
  const timelines = MASTER_CATEGORIES.timelineOptions;
  
  let html = '';
  for (let i = 0; i < timelines.length; i++) {
    const timeline = timelines[i];
    const activeClass = (activeId === timeline.id) ? 'active' : '';
    html += `
      <button class="timeline-pill ${activeClass}" data-timeline-id="${timeline.id}">
        <i class="fas ${timeline.icon}"></i> ${timeline.name}
      </button>
    `;
  }
  container.innerHTML = html;
  
  // Attach event listeners
  const buttons = container.querySelectorAll('.timeline-pill');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function() {
      const timelineId = this.getAttribute('data-timeline-id');
      if (onClick && typeof onClick === 'function') {
        onClick(timelineId);
      }
    });
  }
  return true;
}

/**
 * Get categories for a specific page
 * @param {string} pageName - 'home', 'orders', 'categories', 'account', 'subscription'
 * @param {string} categoryType - 'product' or 'subscription'
 * @returns {array} Array of categories
 */
function getCategoriesForPage(pageName, categoryType = 'product') {
  const limit = MASTER_CATEGORIES.pageLimits[pageName] || 'all';
  let categories = categoryType === 'subscription' 
    ? MASTER_CATEGORIES.subscriptionCategories 
    : MASTER_CATEGORIES.productCategories;
  
  if (limit !== 'all') {
    categories = categories.slice(0, limit);
  }
  return categories;
}

/**
 * Get category name by ID
 * @param {string} categoryId - Category ID
 * @param {string} categoryType - 'product' or 'subscription'
 * @returns {string} Category name
 */
function getCategoryName(categoryId, categoryType = 'product') {
  const categories = categoryType === 'subscription' 
    ? MASTER_CATEGORIES.subscriptionCategories 
    : MASTER_CATEGORIES.productCategories;
  const cat = categories.find(c => c.id === categoryId);
  return cat ? cat.name : categoryId;
}

/**
 * Get timeline name by ID
 * @param {string} timelineId - Timeline ID
 * @returns {string} Timeline name
 */
function getTimelineName(timelineId) {
  const timeline = MASTER_CATEGORIES.timelineOptions.find(t => t.id === timelineId);
  return timeline ? timeline.name : timelineId;
}

// ==================== SECTION 18: MODULAR SUBSCRIPTION SECTION ====================

// Configuration for subscription section
const SUBSCRIPTION_SECTION_CONFIG = {
  // How many subscription products to show on each page
  productLimits: {
    home: 6,
    categories: 6,
    orders: 4,
    description: 4,
    account: 4
  },
  
  // Category cards to show in the subscription section
  categoryCards: [
    { id: "daily", name: "Daily", icon: "fa-sun", emoji: "🌅", color: "#f97316" },
    { id: "weekly", name: "Weekly", icon: "fa-calendar-week", emoji: "📅", color: "#3b82f6" },
    { id: "monthly", name: "Monthly", icon: "fa-calendar-alt", emoji: "🗓️", color: "#8b5cf6" },
    { id: "meal", name: "Meals", icon: "fa-utensils", emoji: "🍽️", color: "#ef4444" },
    { id: "grocery", name: "Grocery", icon: "fa-basket-shopping", emoji: "🛒", color: "#10b981" },
    { id: "organic", name: "Organic", icon: "fa-leaf", emoji: "🌿", color: "#22c55e" }
  ],
  
  // Button text
  viewAllButtonText: "View All Subscription Plans",
  
  // Section title
  sectionTitle: "Subscription Plans"
};

/**
 * Render a complete subscription section (header + category cards + products)
 * @param {string} containerId - ID of container element
 * @param {string} pageName - 'home', 'categories', 'orders', 'description', 'account'
 * @param {function} onViewAllClick - Callback when View All button is clicked
 */
async function renderSubscriptionSection(containerId, pageName, onViewAllClick) {
  const container = document.getElementById(containerId);
  if (!container) return false;
  
  const productLimit = SUBSCRIPTION_SECTION_CONFIG.productLimits[pageName] || 6;
  
  // Load subscription products
  let subscriptionProducts = [];
  try {
    const response = await fetch('product.json');
    const data = await response.json();
    subscriptionProducts = data.products.filter(p => p.category === "subscription" || p.subscriptionType);
  } catch(e) {
    console.error('Error loading subscription products:', e);
  }
  
  // Limit products
  const displayProducts = subscriptionProducts.slice(0, productLimit);
  
  // Build HTML
  let html = `
    <div class="subscription-module">
      <!-- Header with View All button -->
      <div class="subscription-module-header">
        <h2 class="subscription-module-title">
          <i class="fas fa-calendar-check"></i> ${SUBSCRIPTION_SECTION_CONFIG.sectionTitle}
        </h2>
        <button class="subscription-view-all-btn" id="viewAllSubscriptionsBtn-${pageName}">
          ${SUBSCRIPTION_SECTION_CONFIG.viewAllButtonText} <i class="fas fa-arrow-right"></i>
        </button>
      </div>
      
      <!-- Category Cards Row -->
      <div class="subscription-category-row" id="subscriptionCategoryRow-${pageName}">
        ${SUBSCRIPTION_SECTION_CONFIG.categoryCards.map(cat => `
          <div class="subscription-category-item" data-category="${cat.id}">
            <div class="subscription-category-icon">${cat.emoji}</div>
            <span class="subscription-category-name">${cat.name}</span>
          </div>
        `).join('')}
      </div>
      
      <!-- Products Grid -->
      <div class="subscription-products-row" id="subscriptionProductsRow-${pageName}">
        ${displayProducts.map(product => renderSubscriptionProductCard(product)).join('')}
      </div>
    </div>
  `;
  
  container.innerHTML = html;
  
  // Attach event listeners for category cards
  const categoryItems = document.querySelectorAll(`#subscriptionCategoryRow-${pageName} .subscription-category-item`);
  categoryItems.forEach(item => {
    item.addEventListener('click', () => {
      const category = item.getAttribute('data-category');
      if (onViewAllClick) {
        onViewAllClick(category);
      } else {
        window.location.href = `subscription.html?cat=${category}`;
      }
    });
  });
  
  // Attach event listener for View All button
  const viewAllBtn = document.getElementById(`viewAllSubscriptionsBtn-${pageName}`);
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      if (onViewAllClick && typeof onViewAllClick === 'function') {
        onViewAllClick('all');
      } else {
        window.location.href = 'subscription.html';
      }
    });
  }
  
  // Attach product card click events
  const productCards = document.querySelectorAll(`#subscriptionProductsRow-${pageName} .subscription-product-card`);
  productCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.add-to-cart-btn')) {
        const productId = card.getAttribute('data-product-id');
        window.location.href = `description.html?id=${productId}`;
      }
    });
  });
  
  return true;
}

/**
 * Render a single subscription product card (same size as normal product cards)
 * @param {object} product - Product object
 * @returns {string} HTML string
 */
function renderSubscriptionProductCard(product) {
  const discount = product.discountPercent || Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  const typeIcon = product.subscriptionType === 'daily' ? 'fa-sun' : (product.subscriptionType === 'weekly' ? 'fa-calendar-week' : 'fa-calendar-alt');
  const typeText = product.subscriptionType === 'daily' ? 'Daily' : (product.subscriptionType === 'weekly' ? 'Weekly' : 'Monthly');
  const isWishlisted = wishlist.includes(product.id);
  
  return `
    <div class="subscription-product-card" data-product-id="${product.id}">
      <div class="subscription-product-image">
        <img src="${product.image}" onerror="this.src='https://placehold.co/200'" alt="${product.name}">
        <div class="subscription-product-badge"><i class="fas ${typeIcon}"></i> ${typeText}</div>
        ${discount ? `<div class="subscription-product-discount">${discount}% OFF</div>` : ''}
        <div class="wishlist-icon" data-product-id="${product.id}" onclick="event.stopPropagation();toggleWishlist(${product.id}, event)">
          <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
        </div>
      </div>
      <div class="subscription-product-info">
        <div class="subscription-product-name">${escapeHtml(product.name)}</div>
        <div class="subscription-product-price">
          <span class="current-price">₹${product.price}</span>
          ${product.oldPrice ? `<span class="old-price">₹${product.oldPrice}</span>` : ''}
        </div>
        <div class="subscription-product-delivery">
          <i class="fas fa-truck"></i> ${product.deliverySchedule || 'Flexible delivery'}
        </div>
        <button class="add-to-cart-btn" onclick="event.stopPropagation();addSubscriptionToCartModule(${product.id})">
          <i class="fas fa-shopping-cart"></i> Subscribe
        </button>
      </div>
    </div>
  `;
}

/**
 * Add subscription to cart (global function)
 * @param {number} productId - Product ID
 */
async function addSubscriptionToCartModule(productId) {
  try {
    const response = await fetch('product.json');
    const data = await response.json();
    const product = data.products.find(p => p.id === productId);
    
    if (product) {
      const existing = cart.find(i => i.id === product.id);
      if (existing) {
        if ((existing.qty || 0) + 1 > SITE_CONFIG.MAX_CART_QUANTITY) {
          alert(`Max ${SITE_CONFIG.MAX_CART_QUANTITY} allowed`);
          return;
        }
        existing.qty = (existing.qty || 0) + 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          oldPrice: product.oldPrice,
          discountPercent: product.discountPercent,
          image: product.image,
          qty: 1,
          isSubscription: true,
          subscriptionType: product.subscriptionType,
          deliverySchedule: product.deliverySchedule
        });
      }
      saveCart();
      updateCartUI();
      showSubscriptionToast(`${product.name} added to cart!`);
    }
  } catch(e) {
    console.error('Error adding to cart:', e);
    alert('Error adding to cart. Please try again.');
  }
}

function showSubscriptionToast(message) {
  let toast = document.querySelector('.subscription-module-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'subscription-module-toast';
    toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--green-primary);color:white;padding:10px 20px;border-radius:40px;z-index:2000;font-size:13px;opacity:0;transition:opacity 0.3s;';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 2000);
}

// ==================== SECTION 15: EXPOSE GLOBALS ====================
window.SITE_CONFIG = SITE_CONFIG;
window.cart = cart;
window.wishlist = wishlist;
window.allProductsData = allProductsData;
window.loadAllData = loadAllData;
window.saveCart = saveCart;
window.saveWishlist = saveWishlist;
window.updateCartUI = updateCartUIClickable;
window.updateQty = updateQty;
window.removeItem = removeItem;
window.addToCart = addToCart;
window.toggleWishlist = toggleWishlist;
window.isInWishlist = isInWishlist;
window.getWishlistProducts = getWishlistProducts;
window.viewProduct = viewProduct;
window.openCart = openCart;
window.closeCart = closeCart;
window.renderProductCard = renderProductCard;
window.createShowMoreManager = createShowMoreManager;
window.showProductsSkeleton = showProductsSkeleton;
window.showHeroSkeleton = showHeroSkeleton;
window.showCategoriesSkeleton = showCategoriesSkeleton;
window.initCommon = initCommon;
window.initDarkMode = initDarkMode;
window.toggleDarkMode = toggleDarkMode;
window.bindCartEvents = bindCartEvents;
window.viewProductFromCart = viewProductFromCart;
window.renderCategoryPills = renderCategoryPills;
window.renderCategoryCards = renderCategoryCards;
window.COMMON_CATEGORIES = COMMON_CATEGORIES;





// // ==================== SECTION 17: EXPOSE GLOBALS ====================
// window.SITE_CONFIG = SITE_CONFIG;
// window.cart = cart;
// window.wishlist = wishlist;
// window.allProductsData = allProductsData;
// window.loadAllData = loadAllData;
// window.saveCart = saveCart;
// window.saveWishlist = saveWishlist;
// window.updateCartUI = updateCartUI;
// window.updateQty = updateQty;
// window.removeItem = removeItem;
// window.addToCart = addToCart;
// window.toggleWishlist = toggleWishlist;
// window.isInWishlist = isInWishlist;
// window.getWishlistProducts = getWishlistProducts;
// window.viewProduct = viewProduct;
// window.openCart = openCart;
// window.closeCart = closeCart;
// window.renderProductCard = renderProductCard;
// window.createShowMoreManager = createShowMoreManager;
// window.showProductsSkeleton = showProductsSkeleton;
// window.showHeroSkeleton = showHeroSkeleton;
// window.showCategoriesSkeleton = showCategoriesSkeleton;
// window.initCommon = initCommon;
// window.initDarkMode = initDarkMode;
// window.toggleDarkMode = toggleDarkMode;
// window.bindCartEvents = bindCartEvents;
// window.COMMON_CATEGORIES = COMMON_CATEGORIES;
// window.renderCategoryPills = renderCategoryPills;
// window.renderCategoryCards = renderCategoryCards;
// window.renderCompactCategories = renderCompactCategories;
// window.getCategoryName = getCategoryName;
// window.getCategoryIcon = getCategoryIcon;
// window.viewProductFromCart = viewProductFromCart;