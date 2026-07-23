const SUPABASE_URL = 'https://ksdprcoizcfisfhvpacm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzZHByY29pemNmaXNmaHZwYWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MDIzOTEsImV4cCI6MjEwMDM3ODM5MX0.Um184pLkjjJQ3AGkh1HMu6krGdeeEkgPQ3Qb7OxZAbM';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentTab = 'products';

document.addEventListener('DOMContentLoaded', init);

async function init() {
  wireLogin();
  wireTabs();
  document.getElementById('logout-btn').addEventListener('click', () => sb.auth.signOut());

  const { data: { session } } = await sb.auth.getSession();
  applySession(session);
  sb.auth.onAuthStateChange((_event, session) => applySession(session));
}

function applySession(session) {
  const loggedIn = !!session;
  document.getElementById('login-view').hidden = loggedIn;
  document.getElementById('dashboard-view').hidden = !loggedIn;
  if (loggedIn) loadTab(currentTab);
}

function wireLogin() {
  const form = document.getElementById('login-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('login-submit');
    const errEl = document.getElementById('login-error');
    errEl.textContent = '';
    btn.disabled = true;
    const { error } = await sb.auth.signInWithPassword({ email, password });
    btn.disabled = false;
    if (error) errEl.textContent = error.message;
  });
}

function wireTabs() {
  document.querySelectorAll('.tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentTab = btn.dataset.tab;
      loadTab(currentTab);
    });
  });
}

function setActiveTabUI() {
  document.querySelectorAll('.tab').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === currentTab);
  });
}

function loadTab(tab) {
  setActiveTabUI();
  const renderers = { products: renderProducts, orders: renderOrders, activations: renderActivations, messages: renderMessages, settings: renderSettings };
  renderers[tab]();
}

function toast(message, isError) {
  const root = document.getElementById('toast-root');
  const el = document.createElement('div');
  el.className = 'toast' + (isError ? ' error' : '');
  el.textContent = message;
  root.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

function fmtMoney(n) {
  return n == null ? '—' : '$' + Number(n).toFixed(2);
}
function fmtDate(iso) {
  return new Date(iso).toLocaleString();
}
function esc(s) {
  const d = document.createElement('div');
  d.textContent = s == null ? '' : String(s);
  return d.innerHTML;
}
function slugify(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
function loadingView(title) {
  return '<h1>' + esc(title) + '</h1><div class="muted">Loading…</div>';
}
function errorView(title, message) {
  return '<h1>' + esc(title) + '</h1><div class="muted" style="color:#f5b7b7;">' + esc(message) + '</div>';
}
function closeModal() {
  document.getElementById('modal-root').innerHTML = '';
}
function openModal(html) {
  document.getElementById('modal-root').innerHTML =
    '<div class="modal-backdrop" id="modal-backdrop"><div class="modal">' + html + '</div></div>';
  document.getElementById('modal-backdrop').addEventListener('click', (e) => {
    if (e.target.id === 'modal-backdrop') closeModal();
  });
}

// ---------------- PRODUCTS ----------------

async function renderProducts() {
  const content = document.getElementById('content');
  content.innerHTML = loadingView('Products');
  const { data, error } = await sb.from('products').select('*').order('created_at', { ascending: false });
  if (error) { content.innerHTML = errorView('Products', error.message); return; }

  const rows = data.map((p) => `
    <tr>
      <td>${p.image_url ? `<img class="thumb" src="${esc(p.image_url)}">` : '<div class="thumb"></div>'}</td>
      <td>${esc(p.title)}<div class="muted">/${esc(p.slug)}</div></td>
      <td>${fmtMoney(p.regular_price)}</td>
      <td>${p.sale_price ? fmtMoney(p.sale_price) : '—'}</td>
      <td>${p.is_active ? '<span class="badge">Active</span>' : '<span class="muted">Hidden</span>'}</td>
      <td>
        <button class="secondary" data-edit="${p.id}">Edit</button>
        <button class="danger" data-delete="${p.id}">Delete</button>
      </td>
    </tr>`).join('');

  content.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
      <h1 style="margin:0;">Products</h1>
      <button id="add-product">Add product</button>
    </div>
    <div class="card">
      <table>
        <thead><tr><th></th><th>Title</th><th>Regular</th><th>Sale</th><th>Status</th><th></th></tr></thead>
        <tbody>${rows || '<tr><td class="muted" colspan="6">No products yet.</td></tr>'}</tbody>
      </table>
    </div>`;

  document.getElementById('add-product').addEventListener('click', () => openProductForm(null));
  content.querySelectorAll('[data-edit]').forEach((btn) =>
    btn.addEventListener('click', () => openProductForm(data.find((p) => p.id === btn.dataset.edit))));
  content.querySelectorAll('[data-delete]').forEach((btn) =>
    btn.addEventListener('click', () => deleteProduct(btn.dataset.delete)));
}

function openProductForm(product) {
  const isEdit = !!product;
  openModal(`
    <h2>${isEdit ? 'Edit product' : 'Add product'}</h2>
    <form id="product-form">
      <div class="field"><label>Title</label><input id="pf-title" required value="${isEdit ? esc(product.title) : ''}"></div>
      <div class="field"><label>URL slug</label><input id="pf-slug" required value="${isEdit ? esc(product.slug) : ''}"></div>
      <div class="field"><label>Short description</label><textarea id="pf-desc" rows="3">${isEdit ? esc(product.short_description) : ''}</textarea></div>
      <div class="row">
        <div class="field"><label>Regular price</label><input id="pf-regular" type="number" step="0.01" min="0" required value="${isEdit ? product.regular_price : ''}"></div>
        <div class="field"><label>Sale price (optional)</label><input id="pf-sale" type="number" step="0.01" min="0" value="${isEdit && product.sale_price != null ? product.sale_price : ''}"></div>
      </div>
      <div class="field"><label>Product image</label><input id="pf-image" type="file" accept="image/*"></div>
      <div class="field" style="display:flex;align-items:center;gap:8px;">
        <input id="pf-active" type="checkbox" style="width:auto;" ${!isEdit || product.is_active ? 'checked' : ''}>
        <label style="margin:0;" for="pf-active">Visible in shop</label>
      </div>
      <div id="pf-error" class="muted" style="color:#f5b7b7;"></div>
      <div class="modal-actions">
        <button type="button" class="secondary" id="pf-cancel">Cancel</button>
        <button type="submit" id="pf-submit">${isEdit ? 'Save' : 'Add product'}</button>
      </div>
    </form>`);

  document.getElementById('pf-cancel').addEventListener('click', closeModal);
  const titleEl = document.getElementById('pf-title');
  const slugEl = document.getElementById('pf-slug');
  let slugTouched = isEdit;
  slugEl.addEventListener('input', () => { slugTouched = true; });
  titleEl.addEventListener('input', () => { if (!slugTouched) slugEl.value = slugify(titleEl.value); });

  document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('pf-submit');
    const errEl = document.getElementById('pf-error');
    errEl.textContent = '';
    submitBtn.disabled = true;
    try {
      let image_url = isEdit ? product.image_url : null;
      const file = document.getElementById('pf-image').files[0];
      if (file) {
        const path = Date.now() + '-' + slugify(file.name);
        const { error: upErr } = await sb.storage.from('product-images').upload(path, file, { upsert: true });
        if (upErr) throw upErr;
        image_url = sb.storage.from('product-images').getPublicUrl(path).data.publicUrl;
      }
      const payload = {
        title: titleEl.value.trim(),
        slug: slugEl.value.trim(),
        short_description: document.getElementById('pf-desc').value.trim(),
        regular_price: Number(document.getElementById('pf-regular').value),
        sale_price: document.getElementById('pf-sale').value ? Number(document.getElementById('pf-sale').value) : null,
        image_url,
        is_active: document.getElementById('pf-active').checked,
      };
      const { error } = isEdit
        ? await sb.from('products').update(payload).eq('id', product.id)
        : await sb.from('products').insert(payload);
      if (error) throw error;
      closeModal();
      toast(isEdit ? 'Product updated.' : 'Product added.');
      renderProducts();
    } catch (err) {
      errEl.textContent = err.message;
      submitBtn.disabled = false;
    }
  });
}

async function deleteProduct(id) {
  if (!confirm('Delete this product? This cannot be undone.')) return;
  const { error } = await sb.from('products').delete().eq('id', id);
  if (error) { toast(error.message, true); return; }
  toast('Product deleted.');
  renderProducts();
}

// ---------------- ORDERS ----------------

async function renderOrders() {
  const content = document.getElementById('content');
  content.innerHTML = loadingView('Orders');
  const { data, error } = await sb.from('orders').select('*').order('created_at', { ascending: false });
  if (error) { content.innerHTML = errorView('Orders', error.message); return; }

  const statusOptions = ['pending', 'fulfilled', 'cancelled'];
  const rows = data.map((o) => `
    <tr>
      <td>${fmtDate(o.created_at)}</td>
      <td>${esc(o.product_title)}<div class="muted">${fmtMoney(o.product_price)} × ${o.quantity}</div></td>
      <td>${esc(o.full_name)}<div class="muted">${esc(o.phone)}</div></td>
      <td style="max-width:220px;">${esc(o.address)}</td>
      <td>
        <select data-status="${o.id}">
          ${statusOptions.map((s) => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </td>
    </tr>`).join('');

  content.innerHTML = `
    <h1>Orders</h1>
    <div class="card">
      <table>
        <thead><tr><th>Date</th><th>Product</th><th>Customer</th><th>Address</th><th>Status</th></tr></thead>
        <tbody>${rows || '<tr><td class="muted" colspan="5">No orders yet.</td></tr>'}</tbody>
      </table>
    </div>`;

  content.querySelectorAll('[data-status]').forEach((sel) => {
    sel.addEventListener('change', async () => {
      const { error } = await sb.from('orders').update({ status: sel.value }).eq('id', sel.dataset.status);
      if (error) toast(error.message, true); else toast('Order status updated.');
    });
  });
}

// ---------------- ACTIVATIONS ----------------

async function renderActivations() {
  const content = document.getElementById('content');
  content.innerHTML = loadingView('Activations');
  const { data, error } = await sb.from('activations').select('*').order('created_at', { ascending: false });
  if (error) { content.innerHTML = errorView('Activations', error.message); return; }

  const rows = data.map((a) => `
    <tr><td>${fmtDate(a.created_at)}</td><td>${esc(a.name)}</td><td>${esc(a.phone)}</td><td>${esc(a.email)}</td></tr>
  `).join('');

  content.innerHTML = `
    <h1>Activations</h1>
    <div class="card">
      <table>
        <thead><tr><th>Date</th><th>Name</th><th>Phone</th><th>Email</th></tr></thead>
        <tbody>${rows || '<tr><td class="muted" colspan="4">No activations yet.</td></tr>'}</tbody>
      </table>
    </div>`;
}

// ---------------- MESSAGES ----------------

async function renderMessages() {
  const content = document.getElementById('content');
  content.innerHTML = loadingView('Messages');
  const { data, error } = await sb.from('messages').select('*').order('created_at', { ascending: false });
  if (error) { content.innerHTML = errorView('Messages', error.message); return; }

  const rows = data.map((m) => `
    <tr>
      <td>${fmtDate(m.created_at)}</td>
      <td>${esc(m.first_name)} ${esc(m.last_name || '')}<div class="muted">${esc(m.email)}</div></td>
      <td>${esc(m.subject || '—')}</td>
      <td style="max-width:320px;white-space:pre-wrap;">${esc(m.message)}</td>
    </tr>`).join('');

  content.innerHTML = `
    <h1>Messages</h1>
    <div class="card">
      <table>
        <thead><tr><th>Date</th><th>From</th><th>Subject</th><th>Message</th></tr></thead>
        <tbody>${rows || '<tr><td class="muted" colspan="4">No messages yet.</td></tr>'}</tbody>
      </table>
    </div>`;
}

// ---------------- SETTINGS ----------------

async function renderSettings() {
  const content = document.getElementById('content');
  content.innerHTML = loadingView('Settings');
  const { data, error } = await sb.from('settings').select('*').eq('id', 1).single();
  if (error) { content.innerHTML = errorView('Settings', error.message); return; }

  content.innerHTML = `
    <h1>Settings</h1>
    <div class="card" style="max-width:480px;">
      <form id="settings-form">
        <div class="field"><label>Activation discount text (shown to customers)</label><input id="sf-discount" value="${esc(data.discount_text)}"></div>
        <div class="field"><label>Free PDF download link</label><input id="sf-pdf" value="${esc(data.pdf_url || '')}"></div>
        <div class="field"><label>Play Store app link</label><input id="sf-play" value="${esc(data.playstore_url || '')}"></div>
        <div id="sf-error" class="muted" style="color:#f5b7b7;"></div>
        <button type="submit" id="sf-submit">Save settings</button>
      </form>
    </div>`;

  document.getElementById('settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('sf-submit');
    const errEl = document.getElementById('sf-error');
    btn.disabled = true;
    errEl.textContent = '';
    const { error } = await sb.from('settings').update({
      discount_text: document.getElementById('sf-discount').value.trim(),
      pdf_url: document.getElementById('sf-pdf').value.trim(),
      playstore_url: document.getElementById('sf-play').value.trim(),
    }).eq('id', 1);
    btn.disabled = false;
    if (error) { errEl.textContent = error.message; return; }
    toast('Settings saved.');
  });
}
