/**
 * GOATFLOW — Digital Livestock Ownership & Investment Platform
 * Core Application Engine & Interactive Simulator
 */

'use strict';

// ─── CONFIGURATION & EXCHANGE RATES ─────────────────────────────────────────
const USD_TO_PKR = 280;
const CRYPTO_WALLETS = {
  usdt: 'TQv8N3ZzY1jB7H5Xq4F9pL2cW6mK8xP9aB',
  binance: '894271053',
  btc: 'bc1q9x3d8y2m7k4p5w6f8z1n3j7c9h2v4l5a6b7c8'
};

// ─── PACKAGES DATA ──────────────────────────────────────────────────────────
const PACKAGES = {
  starter: { name: 'Starter', usd: 50, pkr: 13000, monthlyPct: 20, share: '1% Goat Share' },
  growth: { name: 'Growth', usd: 100, pkr: 28000, monthlyPct: 20, share: '2% Goat Share' },
  premium: { name: 'Premium', usd: 150, pkr: 45000, monthlyPct: 20, share: '3% Goat Share' },
  advanced: { name: 'Advanced', usd: 200, pkr: 60000, monthlyPct: 20, share: '4% Goat Share' },
  elite: { name: 'Elite', usd: 300, pkr: 85000, monthlyPct: 20, share: '5% Full Asset Share' }
};

// ─── INITIALIZATION ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initRoiCalculator();
  initFaqAccordion();
  initWithdrawalCalculator();
});

// ─── ROI CALCULATOR ─────────────────────────────────────────────────────────
function initRoiCalculator() {
  const slider = document.getElementById('roiSlider');
  if (!slider) return;
  slider.addEventListener('input', (e) => {
    updateRoi(parseInt(e.target.value, 10));
  });
  updateRoi(150);
}

function updateRoi(amount) {
  const slider = document.getElementById('roiSlider');
  if (slider) slider.value = amount;

  const usdDisp = document.getElementById('calcUsdAmount');
  const pkrDisp = document.getElementById('calcPkrAmount');
  const monthlyDisp = document.getElementById('calcMonthlyReturn');
  const sixMoDisp = document.getElementById('calcTotalReturn');

  if (usdDisp) usdDisp.textContent = `$${amount.toLocaleString()}`;
  if (pkrDisp) pkrDisp.textContent = `PKR ${(amount * USD_TO_PKR).toLocaleString()}`;

  // Up to 20% monthly return
  const monthly = Math.round(amount * 0.20);
  const sixMonthTotal = Math.round(amount + (monthly * 6));

  if (monthlyDisp) monthlyDisp.textContent = `$${monthly}/mo (PKR ${(monthly * USD_TO_PKR).toLocaleString()})`;
  if (sixMoDisp) sixMoDisp.textContent = `$${sixMonthTotal} (PKR ${(sixMonthTotal * USD_TO_PKR).toLocaleString()})`;
}

// ─── MODAL CONTROLS ─────────────────────────────────────────────────────────
let currentSelectedPackage = 'elite';

function openPaymentModal(pkgKey = 'elite') {
  currentSelectedPackage = pkgKey;
  const pkg = PACKAGES[pkgKey] || PACKAGES.elite;
  
  const title = document.getElementById('modalPkgTitle');
  const price = document.getElementById('modalPkgPrice');
  if (title) title.textContent = `${pkg.name} Package Investment`;
  if (price) price.textContent = `$${pkg.usd} (PKR ${pkg.pkr.toLocaleString()}) — ${pkg.share}`;

  setCryptoCurrency('usdt');
  const modal = document.getElementById('paymentModal');
  if (modal) modal.classList.add('active');
}

function closePaymentModal() {
  const modal = document.getElementById('paymentModal');
  if (modal) modal.classList.remove('active');
}

function setCryptoCurrency(type) {
  const addressEl = document.getElementById('cryptoWalletAddress');
  const qrImg = document.getElementById('cryptoQrImg');
  const label = document.getElementById('cryptoTypeLabel');

  const addr = CRYPTO_WALLETS[type] || CRYPTO_WALLETS.usdt;
  if (addressEl) addressEl.textContent = addr;

  if (label) {
    label.textContent = type === 'usdt' ? 'USDT (TRC20 Network)' : type === 'binance' ? 'Binance Pay ID' : 'Bitcoin (BTC)';
  }

  // Update QR Code using quickchart.io QR API
  if (qrImg) {
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(addr)}`;
  }

  // Toggle button active states
  document.querySelectorAll('.crypto-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.crypto === type);
  });
}

function copyWalletAddress() {
  const addressEl = document.getElementById('cryptoWalletAddress');
  if (!addressEl) return;
  navigator.clipboard.writeText(addressEl.textContent.trim()).then(() => {
    showToast('📋 Address copied to clipboard!');
  });
}

// ─── PAYMENT PROOF SUBMISSION SIMULATOR ─────────────────────────────────────
function submitPaymentProof(e) {
  e.preventDefault();
  const txid = document.getElementById('txidInput')?.value;
  const name = document.getElementById('investorNameInput')?.value;

  if (!txid || !name) {
    alert('Please enter your full name and Transaction ID (TXID).');
    return;
  }

  const submitBtn = document.getElementById('paymentSubmitBtn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Verifying on blockchain…';
  }

  setTimeout(() => {
    closePaymentModal();
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Proof for Activation';
    }
    showToast('✅ Payment Proof Submitted! Admin review underway (1-2 hours).');
    
    // Smoothly scroll down to the Dashboard highlights section so user sees live simulation
    const dbSection = document.getElementById('dashboard-preview');
    if (dbSection) dbSection.scrollIntoView({ behavior: 'smooth' });
  }, 1200);
}

// ─── WITHDRAWAL CALCULATOR ──────────────────────────────────────────────────
function initWithdrawalCalculator() {
  const inp = document.getElementById('withAmountInput');
  if (!inp) return;
  inp.addEventListener('input', () => {
    const val = parseFloat(inp.value) || 0;
    const fee = val * 0.05;
    const net = Math.max(0, val - fee);

    const feeEl = document.getElementById('withFee');
    const netEl = document.getElementById('withNet');

    if (feeEl) feeEl.textContent = `$${fee.toFixed(2)}`;
    if (netEl) netEl.textContent = `$${net.toFixed(2)} (PKR ${(net * USD_TO_PKR).toLocaleString()})`;
  });
}

function executeDemoWithdrawal() {
  const inp = document.getElementById('withAmountInput');
  const val = parseFloat(inp?.value) || 0;
  if (val < 10) {
    alert('Minimum withdrawal amount is $10.');
    return;
  }
  showToast(`💸 Withdrawal Request of $${val} submitted! Funds arriving in 24-48 hours.`);
}

// ─── FAQ ACCORDION ──────────────────────────────────────────────────────────
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-q');
    if (header) {
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });
}

// ─── TOAST NOTIFICATION ────────────────────────────────────────────────────
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3500);
}

// ─── MOBILE DRAWER TOGGLE ───────────────────────────────────────────────────
function toggleMobileMenu() {
  const links = document.querySelector('.nav-links');
  if (links) {
    links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
    links.style.flexDirection = 'column';
    links.style.position = 'absolute';
    links.style.top = '100%';
    links.style.left = '0';
    links.style.width = '100%';
    links.style.background = '#07120c';
    links.style.padding = '20px';
    links.style.borderBottom = '1px solid rgba(52, 211, 153, 0.2)';
  }
}
