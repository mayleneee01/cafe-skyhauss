/**
 * SKY HAUSSS • Zero-RAM Recommendation & Interactive App Engine
 * Pure Vanilla JavaScript
 */

let ALL_MENU_ITEMS = [];
let selectedMainItem = null;
let currentComboItems = [];
let orderCustomerData = { name: '', time: '' };
let currentProofDataUrl = '';

let isAdminLoggedIn = false;
let adminActiveTab = 'orders';
let adminSearchQuery = '';

// --- Initialization ---
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

function initApp() {
  initParticles();
  initAdminStorage();
  setupCards();
  setupTabs();
  setupCarousel();
  setupNavbarScroll();
  setupScrollReveal();
  setupModalListeners();

  // Intro Animation Sequence & Click-to-Skip
  const intro = document.getElementById('intro');
  if (intro) {
    intro.addEventListener('click', dismissIntro);
    setTimeout(dismissIntro, 2000);
  }
}

function dismissIntro() {
  const intro = document.getElementById('intro');
  if (!intro || intro.classList.contains('gone')) return;
  intro.classList.add('reveal');
  setTimeout(() => {
    intro.classList.add('gone');
    document.body.style.overflow = 'auto';
    document.querySelectorAll('#hero .reveal').forEach(el => el.classList.add('vis'));
  }, 1200);
}

// --- DOM Visual Effects & Sidebar ---

function toggleMobileSidebar(show) {
  const sidebar = document.getElementById('mobile-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar || !overlay) return;

  if (show) {
    lockBodyScroll();
    overlay.classList.remove('hidden');
    sidebar.classList.remove('translate-x-full');
    sidebar.classList.add('translate-x-0');
  } else {
    unlockBodyScroll();
    overlay.classList.add('hidden');
    sidebar.classList.remove('translate-x-0');
    sidebar.classList.add('translate-x-full');
  }
}

function initParticles() {
  const wrap = document.getElementById('particles');
  if (!wrap) return;
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top  = Math.random() * 100 + '%';
    p.style.animationDuration  = (4 + Math.random() * 8) + 's';
    p.style.animationDelay     = (Math.random() * 6) + 's';
    p.style.width  = p.style.height = (2 + Math.random() * 4) + 'px';
    p.style.opacity = (0.3 + Math.random() * 0.5).toString();
    wrap.appendChild(p);
  }
}

function setupNavbarScroll() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

function setupScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

function setupTabs() {
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      document.querySelectorAll('.menu-grid').forEach(g => g.classList.add('hidden'));
      const grid = document.getElementById('grid-' + tab);
      if (grid) {
        grid.classList.remove('hidden');
        grid.querySelectorAll('.reveal').forEach(el => {
          el.classList.remove('vis');
          requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('vis')));
        });
      }
    });
  });
}

function setupCarousel() {
  let offset = 0;
  const ITEM_W = 236; // 220 + 16 gap
  const track = document.getElementById('c-track');
  if (!track) return;
  const maxSlide = () => Math.max(0, (track.children.length - 2) * ITEM_W);

  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      offset = Math.min(offset + ITEM_W, maxSlide());
      track.style.transform = `translateX(-${offset}px)`;
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      offset = Math.max(offset - ITEM_W, 0);
      track.style.transform = `translateX(-${offset}px)`;
    });
  }
}

// --- Menu Cards & Recommendation Extraction ---

function setupCards() {
  ALL_MENU_ITEMS = [];
  document.querySelectorAll('.mcard').forEach((card, index) => {
    const nameEl = card.querySelector('.mcard-name');
    if (!nameEl) return;
    const name = nameEl.textContent.trim();
    const catEl = card.querySelector('.mcard-cat');
    const cat = catEl ? catEl.textContent.trim() : 'Minuman';
    const descEl = card.querySelector('.mcard-desc');
    const desc = descEl ? descEl.textContent.trim() : '';

    const priceEl = card.querySelector('.mcard-price');
    const priceText = priceEl ? priceEl.textContent.replace(/[^0-9]/g, '') : '35';
    const priceNumeric = parseInt(priceText) * 1000;
    const priceFormatted = 'Rp ' + priceNumeric.toLocaleString('id-ID');

    const imgEl = card.querySelector('.mcard-img');
    const img = imgEl ? imgEl.src : './public/hero_coffee_splash.png';

    let tags = [];
    const nameLower = name.toLowerCase();
    const catLower = cat.toLowerCase();

    if (catLower.includes('coffee') || catLower.includes('hot') || nameLower.includes('espresso') || nameLower.includes('latte')) {
      tags.push('coffee', 'bold');
      if (nameLower.includes('latte') || nameLower.includes('cappuccino') || nameLower.includes('velvet')) tags.push('milk', 'sweet');
    } else if (catLower.includes('pastry') || catLower.includes('dessert') || nameLower.includes('cake') || nameLower.includes('cookie')) {
      tags.push('sweet', 'pastry', 'snack');
    } else if (catLower.includes('breakfast') || catLower.includes('sandwich') || catLower.includes('meal') || nameLower.includes('sando') || nameLower.includes('pizza')) {
      tags.push('savory', 'heavy', 'meal');
    } else {
      tags.push('refresher', 'cold', 'fruity');
    }

    const itemObj = {
      id: 'item-' + index + '-' + nameLower.replace(/[^a-z0-9]/g, '-'),
      name,
      category: (catLower.includes('pastry') || catLower.includes('dessert') || catLower.includes('breakfast') || catLower.includes('meal') || catLower.includes('sandwich')) ? 'makanan' : 'minuman',
      priceNumeric,
      priceFormatted,
      img,
      tags,
      desc
    };
    ALL_MENU_ITEMS.push(itemObj);

    // Click handler for card
    card.addEventListener('click', (e) => {
      openCheckoutModal(itemObj);
    });

    // Add button feedback
    const addBtn = card.querySelector('.mcard-add');
    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addBtn.textContent = '✓';
        addBtn.style.cssText = 'background:var(--maroon);color:white;border-color:var(--maroon)';
        setTimeout(() => { addBtn.textContent = '+'; addBtn.style.cssText = ''; }, 1300);
        openCheckoutModal(itemObj);
      });
    }
  });
}

function getRecommendations(baseItem, currentCombos = []) {
  const comboIds = new Set(currentCombos.map(c => c.id));
  comboIds.add(baseItem.id);

  const scored = ALL_MENU_ITEMS
    .filter(item => !comboIds.has(item.id))
    .map(item => {
      let score = 0;

      // Category synergy: Pair food with drinks
      if (item.category !== baseItem.category) {
        score += 4;
      }

      const baseTags = baseItem.tags || [];
      const itemTags = item.tags || [];

      // Sweet food pairs with bold or refreshing drinks
      if (baseTags.includes('sweet') && (itemTags.includes('bold') || itemTags.includes('refresher') || itemTags.includes('coffee'))) {
        score += 3;
      }
      // Savory meals pair with sweet milk coffees or fizzy drinks
      if (baseTags.includes('savory') && (itemTags.includes('milk') || itemTags.includes('fruity') || itemTags.includes('sweet'))) {
        score += 3;
      }
      // Coffee pairs perfectly with pastry
      if (baseTags.includes('coffee') && itemTags.includes('pastry')) {
        score += 4;
      }
      // Cold drinks pair with warm dishes
      if (baseTags.includes('cold') && itemTags.includes('meal')) {
        score += 2;
      }

      return { item, score };
    });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 4).map(s => s.item);
}

// --- Modal Management & Checkout Flow ---

function lockBodyScroll() {
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
}

function unlockBodyScroll() {
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
}

function closeModal() {
  ['modal-overlay', 'qris-overlay', 'reservation-overlay', 'admin-overlay', 'status-overlay', 'proof-overlay'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  selectedMainItem = null;
  currentComboItems = [];
  unlockBodyScroll();
}

function setupModalListeners() {
  ['modal-overlay', 'qris-overlay', 'reservation-overlay', 'admin-overlay', 'status-overlay', 'proof-overlay'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', (e) => {
        if (e.target.id === id) closeModal();
      });
    }
  });
}

function openCheckoutModal(item) {
  selectedMainItem = item;
  currentComboItems = [];
  renderCheckoutModal();
  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay) {
    lockBodyScroll();
    modalOverlay.classList.remove('hidden');
  }
}

function addComboItem(itemId) {
  const item = ALL_MENU_ITEMS.find(i => i.id === itemId);
  if (item && !currentComboItems.some(c => c.id === item.id)) {
    currentComboItems.push(item);
    renderCheckoutModal();
  }
}

function removeComboItem(index) {
  currentComboItems.splice(index, 1);
  renderCheckoutModal();
}

function renderCheckoutModal() {
  if (!selectedMainItem) return;
  const modalBox = document.getElementById('checkout-modal-content');
  if (!modalBox) return;

  const totalNumeric = selectedMainItem.priceNumeric + currentComboItems.reduce((sum, i) => sum + i.priceNumeric, 0);
  const totalFormatted = 'Rp ' + totalNumeric.toLocaleString('id-ID');

  const recommendations = getRecommendations(selectedMainItem, currentComboItems);

  let comboHtml = '';
  if (currentComboItems.length > 0) {
    comboHtml = `
      <div class="mt-5 pt-4 border-t border-gray-100">
        <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-syne">Combo Additions:</p>
        <div class="flex flex-col gap-2">
          ${currentComboItems.map((c, idx) => `
            <div class="flex items-center justify-between text-sm bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100">
              <span class="font-semibold text-gray-800">+ ${c.name}</span>
              <div class="flex items-center gap-3">
                <span class="text-maroon font-bold">${c.priceFormatted}</span>
                <button onclick="removeComboItem(${idx})" class="text-xs text-red-500 hover:font-bold p-1">✕</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  let recsHtml = '';
  if (recommendations.length > 0) {
    recsHtml = `
      <div class="mt-8 bg-off-white p-5 rounded-2xl border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-xs font-bold uppercase tracking-widest text-maroon flex items-center gap-2 font-syne">
            <span>Perfect Pairing Synergy</span>
          </h4>
          <span class="text-[10px] bg-maroon/10 text-maroon px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Chef Recommended</span>
        </div>
        <p class="text-xs text-gray-500 mb-4 font-light">Elevate your order with our algorithm-tailored pairings.</p>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${recommendations.map(rec => `
            <div class="bg-white p-3.5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between gap-3 hover:border-maroon/40 transition-all">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-12 h-12 bg-off-white rounded-lg p-1 flex-shrink-0 flex items-center justify-center">
                  <img src="${rec.img}" alt="" class="w-full h-full object-contain" />
                </div>
                <div class="min-w-0 flex-grow">
                  <h5 class="font-bold text-xs text-gray-900 truncate">${rec.name}</h5>
                  <p class="text-[11px] text-maroon font-semibold">${rec.priceFormatted}</p>
                </div>
              </div>
              <button onclick="addComboItem('${rec.id}')" class="px-3 py-1.5 bg-maroon text-white text-[11px] font-bold uppercase rounded-lg hover:bg-maroon-dark transition-colors flex-shrink-0 shadow-sm font-syne">
                + Add
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  modalBox.innerHTML = `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl md:text-3xl font-bold text-gray-900 font-syne">Order Summary</h2>
      <button onclick="closeModal()" class="cursor-pointer active:scale-95 p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all flex items-center justify-center flex-shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>

    <!-- Main Selected Item -->
    <div class="flex items-center gap-5 p-4 bg-off-white rounded-2xl border border-gray-100 shadow-sm">
      <div class="w-20 h-20 bg-white rounded-xl overflow-hidden p-2 flex-shrink-0 shadow-inner flex items-center justify-center">
        <img src="${selectedMainItem.img}" alt="${selectedMainItem.name}" class="w-full h-full object-contain" />
      </div>
      <div class="min-w-0 flex-grow">
        <span class="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-gray-200 text-gray-700 rounded-md inline-block mb-1">${selectedMainItem.category}</span>
        <h3 class="font-bold text-lg text-gray-900 truncate font-serif">${selectedMainItem.name}</h3>
        <p class="text-maroon font-bold">${selectedMainItem.priceFormatted}</p>
      </div>
    </div>

    ${comboHtml}
    ${recsHtml}

    <form id="pickup-form" onsubmit="handleConfirmOrder(event)" class="space-y-3 mt-4 pt-4 border-t border-gray-100 font-sans pb-2">
      <div>
        <label class="block text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-1 text-left">Your Full Name</label>
        <input type="text" id="cust-name" required value="${orderCustomerData.name}" placeholder="Enter your name" class="w-full px-3.5 py-2.5 bg-off-white rounded-xl focus:ring-2 focus:ring-maroon outline-none transition-all text-gray-900 border border-gray-200 font-medium text-xs" />
      </div>
      <div>
        <label class="block text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-1 text-left">Self Pick-up Time</label>
        <input type="time" id="cust-time" required value="${orderCustomerData.time || '15:00'}" class="w-full px-3.5 py-2.5 bg-off-white rounded-xl focus:ring-2 focus:ring-maroon outline-none transition-all text-gray-900 border border-gray-200 font-medium text-xs" />
        <p class="text-[10px] text-gray-400 mt-1 font-light text-left">Freshly prepared and waiting at the pickup counter.</p>
      </div>

      <div class="pt-3 border-t border-gray-100 flex justify-between items-center mb-3">
        <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Pay</span>
        <span class="text-xl sm:text-2xl font-black text-maroon font-syne">${totalFormatted}</span>
      </div>

      <div class="grid grid-cols-2 gap-2.5 pt-1">
        <button type="button" onclick="closeModal()" class="cursor-pointer active:scale-95 py-3 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 rounded-xl font-bold uppercase tracking-wider transition-all font-syne text-xs border border-gray-200 shadow-2xs flex items-center justify-center gap-1.5">
          <svg class="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          <span>Batalkan</span>
        </button>
        <button type="submit" class="cursor-pointer active:scale-95 py-3 bg-maroon text-white rounded-xl font-bold uppercase tracking-widest hover:bg-[#4A0A12] transition-all shadow-md font-syne text-xs flex items-center justify-center gap-1">
          <span>Bayar QRIS →</span>
        </button>
      </div>
    </form>
  `;
}

function handleConfirmOrder(e) {
  e.preventDefault();
  const nameInput = document.getElementById('cust-name').value;
  const timeInput = document.getElementById('cust-time').value;
  if (!nameInput || !timeInput) return;

  orderCustomerData.name = nameInput;
  orderCustomerData.time = timeInput;
  currentProofDataUrl = ''; // Reset proof

  document.getElementById('modal-overlay').classList.add('hidden');
  renderQrisModal();
  lockBodyScroll();
  document.getElementById('qris-overlay').classList.remove('hidden');
}

function renderQrisModal() {
  const modalBox = document.getElementById('qris-modal-content');
  if (!modalBox) return;

  const totalNumeric = selectedMainItem.priceNumeric + currentComboItems.reduce((sum, i) => sum + i.priceNumeric, 0);
  const totalFormatted = 'Rp ' + totalNumeric.toLocaleString('id-ID');
  const allItemNames = [selectedMainItem.name, ...currentComboItems.map(c => c.name)].join(', ');

  modalBox.innerHTML = `
    <button onclick="closeModal()" class="cursor-pointer active:scale-95 absolute top-5 right-5 p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all z-50 flex items-center justify-center shadow-2xs">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
    
    <div class="w-16 h-16 bg-[#C4920A]/10 text-[#C4920A] rounded-2xl flex items-center justify-center mb-4 shadow-inner">
       <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
    </div>

    <h2 class="text-2xl font-bold text-gray-900 font-syne mb-1">Scan QRIS to Pay</h2>
    <p class="text-xs text-maroon font-semibold uppercase tracking-wider mb-6">Verified Direct Payment</p>

    <div class="w-56 h-56 bg-white rounded-2xl shadow-inner flex items-center justify-center p-4 mb-6 mx-auto border border-gray-100">
      <div class="w-full h-full border-4 border-gray-900 border-dashed rounded-xl flex items-center justify-center bg-gray-50 relative">
        <div class="absolute inset-3 border-4 border-gray-900 rounded-lg"></div>
        <div class="w-14 h-14 bg-maroon rounded-xl shadow-lg z-10 flex items-center justify-center animate-pulse-glow">
          <span class="text-white font-black text-sm tracking-tighter">QRIS</span>
        </div>
        <div class="absolute top-5 left-5 w-4 h-4 bg-gray-900 rounded-sm"></div>
        <div class="absolute top-5 right-5 w-4 h-4 bg-gray-900 rounded-sm"></div>
        <div class="absolute bottom-5 left-5 w-4 h-4 bg-gray-900 rounded-sm"></div>
      </div>
    </div>

    <div class="w-full bg-off-white rounded-xl p-4 text-left border border-gray-200 mb-6 space-y-2 font-sans">
      <div class="flex justify-between text-xs">
        <span class="text-gray-500">Customer Name</span>
        <span class="font-bold text-gray-900">${orderCustomerData.name}</span>
      </div>
      <div class="flex justify-between text-xs">
        <span class="text-gray-500">Self Pick-up Time</span>
        <span class="font-bold text-maroon">${orderCustomerData.time}</span>
      </div>
      <div class="flex justify-between text-xs">
        <span class="text-gray-500">Ordered Items</span>
        <span class="font-medium text-gray-800 max-w-[180px] truncate">${allItemNames}</span>
      </div>
      <div class="pt-2 border-t border-gray-200 flex justify-between text-sm">
        <span class="font-bold text-gray-900">Total Pay</span>
        <span class="font-black text-maroon">${totalFormatted}</span>
      </div>
    </div>

    <!-- Upload Bukti Pembayaran -->
    <div class="w-full text-left mb-6 font-sans">
      <label class="block text-xs uppercase tracking-wider font-bold text-gray-600 mb-2">Upload Bukti Transfer / Screenshot (Opsional)</label>
      <div class="flex items-center gap-3">
        <input type="file" id="proof-upload-input" accept="image/*" onchange="handleProofUpload(event)" class="hidden" />
        <label for="proof-upload-input" class="cursor-pointer px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl border border-gray-300 flex items-center gap-2 transition-all flex-shrink-0 shadow-sm">
          <svg class="w-4 h-4 text-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
          <span>Pilih Foto Bukti</span>
        </label>
        <span id="proof-file-name" class="text-xs text-gray-500 truncate max-w-[160px] font-medium">Belum ada foto</span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2.5 w-full mt-2 pb-1">
      <button onclick="closeModal()" class="cursor-pointer active:scale-95 py-3 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 rounded-xl font-bold uppercase tracking-wider transition-all font-syne text-xs border border-gray-200 shadow-2xs flex items-center justify-center gap-1.5">
        <svg class="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
        <span>Batal Bayar</span>
      </button>
      <button onclick="confirmPayment()" class="cursor-pointer active:scale-95 py-3 bg-gray-900 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-black transition-all shadow-md font-syne text-xs flex items-center justify-center gap-1.5">
        <span>Sudah Transfer</span>
      </button>
    </div>
  `;
}

function handleProofUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  document.getElementById('proof-file-name').textContent = file.name;
  const reader = new FileReader();
  reader.onload = function(evt) {
    currentProofDataUrl = evt.target.result;
  };
  reader.readAsDataURL(file);
}

function confirmPayment() {
  const allItemNames = [selectedMainItem.name, ...currentComboItems.map(c => c.name)].join(', ');
  const totalNumeric = selectedMainItem.priceNumeric + currentComboItems.reduce((sum, i) => sum + i.priceNumeric, 0);
  const totalFormatted = 'Rp ' + totalNumeric.toLocaleString('id-ID');

  // Fallback simulated payment proof image if user didn't upload
  const proofUrl = currentProofDataUrl || './public/hero_coffee_splash.png';

  const newOrder = {
    id: 'ORD-' + Math.floor(100 + Math.random() * 900),
    customer: orderCustomerData.name,
    time: orderCustomerData.time || '15:00',
    items: allItemNames,
    total: totalFormatted,
    status: 'pending', // pending/on progress
    proof: proofUrl,
    date: 'Today'
  };

  const existing = JSON.parse(localStorage.getItem('skyhaus_orders') || '[]');
  existing.unshift(newOrder);
  localStorage.setItem('skyhaus_orders', JSON.stringify(existing));

  alert(`Bukti Pembayaran Diterima!\n\nTerima kasih ${orderCustomerData.name}. Pesanan Anda (${newOrder.id}) telah masuk dengan status [Pending / On Progress] menunggu verifikasi admin.\nSilakan pantau menu Cek Pesanan.`);
  closeModal();
  openOrderStatusModal();
}

// --- Order Status Tracking for User ---

function openOrderStatusModal() {
  closeModal();
  const modalBox = document.getElementById('status-modal-content');
  const overlay = document.getElementById('status-overlay');
  if (!modalBox || !overlay) return;

  const orders = JSON.parse(localStorage.getItem('skyhaus_orders') || '[]');

  let ordersHtml = '';
  if (orders.length === 0) {
    ordersHtml = `
      <div class="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 my-4">
        <div class="w-12 h-12 rounded-full bg-maroon/10 text-maroon mx-auto mb-3 flex items-center justify-center"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg></div>
        <h4 class="text-sm font-bold text-gray-700 uppercase tracking-wider mb-1">Belum ada pesanan</h4>
        <p class="text-xs text-gray-400">Pilih menu favoritmu dan pesan sekarang!</p>
      </div>
    `;
  } else {
    ordersHtml = `
      <div class="space-y-4 my-6">
        ${orders.map(o => {
          const isDone = o.status === 'completed' || o.status === 'Selesai';
          const badgeClass = isDone 
            ? 'bg-green-100 text-green-800 border-green-200' 
            : 'bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse';
          const badgeText = isDone ? 'Selesai / Siap Diambil' : 'Pending / On Progress';

          return `
            <div class="p-4 sm:p-5 bg-off-white rounded-2xl border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:shadow-md text-left">
              <div class="w-full">
                <div class="flex flex-wrap items-center gap-2.5 mb-1.5 font-syne">
                  <span class="text-xs font-bold text-gray-900 font-mono bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">${o.id}</span>
                  <span class="text-sm font-bold text-gray-900">${o.customer}</span>
                  <span class="text-[11px] text-gray-500 ml-auto">Waktu Ambil @ <span class="font-bold text-maroon">${o.time}</span></span>
                </div>
                <p class="text-xs font-medium text-gray-700 mt-2 leading-relaxed">${o.items}</p>
                <div class="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-gray-200/80">
                  <span class="text-sm font-black text-maroon">${o.total}</span>
                  ${o.proof ? `
                    <button onclick="openProofModal('${o.id}')" class="text-[11px] text-gray-600 hover:text-maroon underline font-bold flex items-center gap-1.5 ml-auto">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                      <span>Lihat Struk Bukti</span>
                    </button>
                  ` : ''}
                </div>
              </div>
              <div class="flex items-center gap-3 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-gray-200">
                <span class="px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider border ${badgeClass}">
                  ${badgeText}
                </span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  modalBox.innerHTML = `
    <div class="flex justify-between items-center mb-2 border-b border-gray-100 pb-4 text-left font-syne">
      <div>
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900">Status Pesanan Saya</h2>
        <p class="text-xs text-maroon font-semibold uppercase tracking-widest mt-1">Real-Time Order Tracking</p>
      </div>
      <button onclick="closeModal()" class="cursor-pointer active:scale-95 p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all flex items-center justify-center flex-shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    <p class="text-xs text-gray-500 mb-2 font-light text-left">Daftar riwayat pesanan dari perangkat ini beserta status verifikasi pembayaran.</p>
    
    ${ordersHtml}

    <div class="mt-4 pt-4 border-t border-gray-100 flex justify-end">
      <button onclick="closeModal()" class="px-6 py-3 bg-maroon text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-maroon-dark transition-all shadow font-syne">
        Tutup Jendela
      </button>
    </div>
  `;
  lockBodyScroll();
  overlay.classList.remove('hidden');
}

function openProofModal(orderId) {
  const orders = JSON.parse(localStorage.getItem('skyhaus_orders') || '[]');
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  const overlay = document.getElementById('proof-overlay');
  const imgView = document.getElementById('proof-image-view');
  const idText = document.getElementById('proof-order-id');

  if (!overlay || !imgView) return;

  imgView.src = order.proof || './public/hero_coffee_splash.png';
  idText.textContent = `Order ID: ${order.id} (${order.customer})`;
  lockBodyScroll();
  overlay.classList.remove('hidden');
}

function closeProofModal() {
  const overlay = document.getElementById('proof-overlay');
  if (overlay) overlay.classList.add('hidden');
  unlockBodyScroll();
}

// --- Reservation Booking ---

function openReservationModal() {
  closeModal();
  const modal = document.getElementById('reservation-overlay');
  if (modal) {
    lockBodyScroll();
    modal.classList.remove('hidden');
  }
}

function handleReservation(e) {
  e.preventDefault();
  const name = document.getElementById('res-name').value;
  const guests = document.getElementById('res-guests').value;
  const date = document.getElementById('res-date').value;
  const time = document.getElementById('res-time').value;

  const newRes = {
    id: 'RES-' + Math.floor(200 + Math.random() * 800),
    customer: name,
    guests: guests + (guests === '1' ? ' Person' : ' People'),
    date: date,
    time: time,
    status: 'confirmed'
  };

  const existing = JSON.parse(localStorage.getItem('skyhaus_reservations') || '[]');
  existing.unshift(newRes);
  localStorage.setItem('skyhaus_reservations', JSON.stringify(existing));

  alert(`Table Reserved!\n\nThank you ${name}. Your table for ${newRes.guests} on ${date} at ${time} is confirmed.\nWe look forward to welcoming you at SKY HAUS.`);
  closeModal();
}

// --- Live Operational Admin Portal ---

function initAdminStorage() {
  if (!localStorage.getItem('skyhaus_orders')) {
    const demoOrders = [
      { id: 'ORD-101', customer: 'Anindita Kirana', time: '16:30', items: 'Wagyu Beef Sando, Signature Iced Latte', total: 'Rp 120.000', status: 'pending', proof: './public/hero_coffee_splash.png', date: 'Today' },
      { id: 'ORD-102', customer: 'Bima Satria', time: '17:15', items: 'Truffle Butter Croissant, Uji Matcha Fusion', total: 'Rp 88.000', status: 'pending', proof: './public/menu_matcha_latte.png', date: 'Today' },
      { id: 'ORD-100', customer: 'Carissa Maharani', time: '14:00', items: 'Maroon Velvet Cake Slice, Cremoso Pistachio Latte', total: 'Rp 100.000', status: 'completed', proof: './public/menu_croissant.png', date: 'Today' }
    ];
    localStorage.setItem('skyhaus_orders', JSON.stringify(demoOrders));
  }
  if (!localStorage.getItem('skyhaus_reservations')) {
    const demoRes = [
      { id: 'RES-201', customer: 'Derry Adrian', guests: '2 People', date: '2026-05-18', time: '19:00', status: 'confirmed' },
      { id: 'RES-202', customer: 'Evelyn Winata', guests: '4 People', date: '2026-05-20', time: '15:30', status: 'confirmed' }
    ];
    localStorage.setItem('skyhaus_reservations', JSON.stringify(demoRes));
  }
}

function openAdminAuthModal() {
  closeModal();
  const overlay = document.getElementById('admin-overlay');
  if (overlay) {
    lockBodyScroll();
    overlay.classList.remove('hidden');
  }

  if (isAdminLoggedIn) {
    renderAdminDashboard();
  } else {
    renderAdminAuthScreen();
  }
}

function renderAdminAuthScreen() {
  const content = document.getElementById('admin-modal-content');
  if (!content) return;
  content.innerHTML = `
    <button onclick="closeModal()" class="cursor-pointer active:scale-95 absolute top-5 right-5 p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all z-50 flex items-center justify-center shadow-2xs">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
    <div class="max-w-sm mx-auto text-center py-8">
      <div class="w-16 h-16 bg-maroon/10 rounded-2xl flex items-center justify-center text-maroon mx-auto mb-6 shadow-inner">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
      </div>
      <h3 class="text-2xl font-black text-gray-900 font-syne mb-1">Admin Portal Access</h3>
      <p class="text-xs font-semibold text-maroon uppercase tracking-widest mb-6 font-syne">Security Authorization</p>
      <p class="text-xs text-gray-500 mb-8 font-light">Enter your 6-digit administrative security PIN to manage orders, verify payment proofs, and cafe inventory.</p>
      
      <form onsubmit="handleAdminLogin(event)" class="space-y-6 font-sans">
        <input type="password" id="admin-pin" required maxlength="6" placeholder="••••••" class="w-full text-center tracking-[1em] font-mono text-2xl py-4 bg-off-white rounded-xl border border-gray-200 focus:border-maroon focus:ring-2 focus:ring-maroon outline-none text-gray-900 font-bold transition-all" />
        <button type="submit" class="w-full py-4 bg-gray-900 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-maroon transition-all shadow-lg font-syne">
          Verify Security PIN
        </button>
      </form>
    </div>
  `;
}

function handleAdminLogin(e) {
  e.preventDefault();
  const pin = document.getElementById('admin-pin').value;
  if (pin === '123456') {
    isAdminLoggedIn = true;
    renderAdminDashboard();
  } else {
    alert('Invalid Security PIN!');
  }
}

function logoutAdmin() {
  isAdminLoggedIn = false;
  renderAdminAuthScreen();
}

function renderAdminDashboard() {
  const content = document.getElementById('admin-modal-content');
  if (!content) return;
  const orders = JSON.parse(localStorage.getItem('skyhaus_orders') || '[]');
  const reservations = JSON.parse(localStorage.getItem('skyhaus_reservations') || '[]');

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  
  let tabHtml = '';
  if (adminActiveTab === 'orders') {
    tabHtml = `
      <div class="space-y-4 font-sans">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-sm font-bold text-gray-800 uppercase tracking-wider font-syne">Customer Orders (${orders.length})</h4>
          <span class="text-xs px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-bold">${pendingOrders} Menunggu Verifikasi</span>
        </div>
        
        <div class="mb-4">
          <div class="relative flex items-center">
            <input type="text" id="admin-search-input" value="${adminSearchQuery}" oninput="handleAdminSearch(event)" placeholder="🔍 Cari ID pesanan, nama pelanggan, atau item menu..." class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 outline-none focus:ring-2 focus:ring-maroon font-medium transition-all shadow-sm" />
            <button id="admin-search-clear" onclick="clearAdminSearch()" class="absolute right-3.5 text-xs bg-gray-200 text-gray-600 hover:bg-maroon hover:text-white rounded-full w-5 h-5 flex items-center justify-center transition-colors font-bold" style="${adminSearchQuery ? '' : 'display: none'}">✕</button>
          </div>
        </div>

        <div class="space-y-3">
          ${orders.map(o => `
            <div class="admin-order-card p-4 bg-off-white rounded-2xl border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-maroon/30 text-left shadow-sm">
              <div class="w-full">
                <div class="flex flex-wrap items-center gap-2 mb-1.5 font-syne">
                  <span class="text-xs font-bold text-gray-900 font-mono bg-white px-2 py-0.5 rounded border border-gray-200">${o.id}</span>
                  <span class="text-sm font-bold text-gray-900">${o.customer}</span>
                  <span class="text-[11px] text-gray-500 ml-auto md:ml-3">Waktu Ambil @ <span class="font-bold text-maroon">${o.time}</span></span>
                </div>
                <p class="text-xs font-medium text-gray-700 mt-1 max-w-lg">${o.items}</p>
                <div class="flex flex-wrap items-center justify-between gap-3 mt-3 pt-2 border-t border-gray-200/60">
                  <span class="text-xs font-bold text-maroon">${o.total}</span>
                  ${o.proof ? `
                    <button onclick="openProofModal('${o.id}')" class="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-800 text-[11px] font-bold rounded-lg border border-gray-300 transition-all flex items-center gap-1.5 shadow-sm ml-auto md:ml-0">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                      <span>Lihat Bukti Bayar</span>
                    </button>
                  ` : ''}
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-gray-200">
                <span class="text-[11px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider ${o.status === 'completed' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'}">
                  ${o.status === 'completed' ? 'Selesai / Siap Diambil' : 'Pending / On Progress'}
                </span>
                ${o.status === 'pending' ? `
                  <button onclick="markOrderCompleted('${o.id}')" class="px-4 py-2 bg-maroon text-white text-[11px] font-bold uppercase rounded-xl hover:bg-maroon-dark transition-all shadow-md font-syne tracking-wider flex-shrink-0 ml-auto md:ml-0">
                    Verifikasi & Selesai
                  </button>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (adminActiveTab === 'reservations') {
    tabHtml = `
      <div class="space-y-4 font-sans">
        <h4 class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2 font-syne text-left">Table Reservations (${reservations.length})</h4>
        <div class="space-y-3">
          ${reservations.map(r => `
            <div class="p-4 bg-off-white rounded-2xl border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-left shadow-sm">
              <div class="w-full">
                <div class="flex flex-wrap items-center gap-2.5 mb-1 font-syne">
                  <span class="text-xs font-bold text-gray-900 font-mono bg-white px-2 py-0.5 rounded border border-gray-200">${r.id}</span>
                  <span class="text-sm font-bold text-gray-900">${r.customer}</span>
                </div>
                <div class="flex justify-between items-center text-xs mt-2">
                  <span class="font-medium text-gray-600">Party of <span class="font-bold text-gray-900">${r.guests}</span></span>
                  <span class="font-bold text-maroon">${r.date} @ ${r.time}</span>
                </div>
              </div>
              <div class="pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200 w-full sm:w-auto flex justify-end">
                <span class="text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-green-100 text-green-800 border border-green-200">
                  ${r.status}
                </span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (adminActiveTab === 'menu') {
    tabHtml = `
      <div class="space-y-4 font-sans">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-sm font-bold text-gray-800 uppercase tracking-wider font-syne">Menu Catalog Inventory</h4>
          <span class="text-xs text-gray-500 font-light">32 Total Items</span>
        </div>

        <div class="mb-4">
          <div class="relative flex items-center">
            <input type="text" id="admin-search-input" value="${adminSearchQuery}" oninput="handleAdminSearch(event)" placeholder="🔍 Cari nama menu, kategori, atau harga..." class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 outline-none focus:ring-2 focus:ring-maroon font-medium transition-all shadow-sm" />
            <button id="admin-search-clear" onclick="clearAdminSearch()" class="absolute right-3.5 text-xs bg-gray-200 text-gray-600 hover:bg-maroon hover:text-white rounded-full w-5 h-5 flex items-center justify-center transition-colors font-bold" style="${adminSearchQuery ? '' : 'display: none'}">✕</button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${ALL_MENU_ITEMS.map(item => `
            <div class="admin-menu-card p-3 bg-off-white rounded-2xl border border-gray-200 flex items-center justify-between gap-3 text-left shadow-sm">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 bg-white rounded-lg p-1 flex-shrink-0 flex items-center justify-center">
                  <img src="${item.img}" alt="" class="w-full h-full object-contain" onerror="this.src='./public/hero_coffee_splash.png'" />
                </div>
                <div class="min-w-0 flex-grow">
                  <h5 class="font-bold text-xs text-gray-900 truncate">${item.name}</h5>
                  <p class="text-[11px] text-maroon font-semibold">${item.priceFormatted}</p>
                </div>
              </div>
              <span class="px-2.5 py-1 bg-green-100 text-green-800 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-green-200">Available</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  content.innerHTML = `
    <!-- STICKY TOP HEADER -->
    <div class="sticky top-0 bg-white z-[60] pb-3 border-b border-gray-100 mb-4 pt-1">
      <div class="flex justify-between items-center mb-3">
        <div>
          <h2 class="text-xl md:text-3xl font-black text-gray-900 font-syne flex items-center gap-2">
            <span>SKY HAUS Manager</span>
            <span class="text-[10px] bg-maroon text-white px-2 py-0.5 rounded-full uppercase tracking-widest font-mono">LIVE</span>
          </h2>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          <button onclick="logoutAdmin()" class="cursor-pointer active:scale-95 px-4 py-2 bg-gray-100 text-gray-800 hover:bg-maroon hover:text-white text-xs font-bold uppercase rounded-xl transition-all font-syne shadow-2xs flex items-center gap-1">
            <span>Logout</span>
          </button>
          <button onclick="closeModal()" class="cursor-pointer active:scale-95 p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl transition-all flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </div>

      <!-- Dashboard Navigation Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto whitespace-nowrap flex-nowrap font-syne max-w-full pt-1">
        <button onclick="switchAdminTab('orders')" class="cursor-pointer active:scale-95 flex-shrink-0 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${adminActiveTab === 'orders' ? 'bg-maroon text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">
          Orders (${orders.length})
        </button>
        <button onclick="switchAdminTab('reservations')" class="cursor-pointer active:scale-95 flex-shrink-0 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${adminActiveTab === 'reservations' ? 'bg-maroon text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">
          Reservations (${reservations.length})
        </button>
        <button onclick="switchAdminTab('menu')" class="cursor-pointer active:scale-95 flex-shrink-0 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${adminActiveTab === 'menu' ? 'bg-maroon text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">
          Menu Catalog (32)
        </button>
      </div>
    </div>

    <!-- Active Tab Content -->
    <div class="flex-grow overflow-y-auto pr-2 space-y-4">
      ${tabHtml}
    </div>
  `;
}

function switchAdminTab(tab) {
  adminActiveTab = tab;
  adminSearchQuery = '';
  renderAdminDashboard();
}

function handleAdminSearch(e) {
  adminSearchQuery = e.target.value.toLowerCase();
  if (adminActiveTab === 'orders') {
    document.querySelectorAll('.admin-order-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(adminSearchQuery) ? '' : 'none';
    });
  } else if (adminActiveTab === 'menu') {
    document.querySelectorAll('.admin-menu-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(adminSearchQuery) ? '' : 'none';
    });
  }
  const clearBtn = document.getElementById('admin-search-clear');
  if (clearBtn) clearBtn.style.display = adminSearchQuery ? '' : 'none';
}

function clearAdminSearch() {
  adminSearchQuery = '';
  const input = document.getElementById('admin-search-input');
  if (input) input.value = '';
  handleAdminSearch({ target: { value: '' } });
}

function markOrderCompleted(orderId) {
  const orders = JSON.parse(localStorage.getItem('skyhaus_orders') || '[]');
  const target = orders.find(o => o.id === orderId);
  if (target) {
    target.status = 'completed';
    localStorage.setItem('skyhaus_orders', JSON.stringify(orders));
    renderAdminDashboard();
  }
}
