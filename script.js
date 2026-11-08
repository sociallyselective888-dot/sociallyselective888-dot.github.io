const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
let cart = [];
const menuToggle = $('#menuToggle'), mainNav = $('#mainNav');
menuToggle.addEventListener('click',()=>mainNav.classList.toggle('open'));
$$('.main-nav a').forEach(a=>a.addEventListener('click',()=>mainNav.classList.remove('open')));

const searchPanel=$('#searchPanel'), searchInput=$('#searchInput');
$('#searchToggle').addEventListener('click',()=>{searchPanel.classList.toggle('open'); if(searchPanel.classList.contains('open')) searchInput.focus();});
$('#searchClose').addEventListener('click',()=>{searchPanel.classList.remove('open');searchInput.value='';filterProducts('all');});
searchInput.addEventListener('input',()=>filterProducts('search',searchInput.value));

function filterProducts(category, term=''){
  const cards=$$('.product-card');
  const counts=new Map();
  cards.forEach(card=>{
    const show=category!=='search'||card.dataset.name.toLowerCase().includes(term.toLowerCase());
    card.style.display=show?'':'none';
    if(show) counts.set(card.closest('.collection-section')?.id,(counts.get(card.closest('.collection-section')?.id)||0)+1);
  });
  $$('.collection-section').forEach(section=>{
    const count=counts.get(section.id)||0;
    const label=section.querySelector('.results-count');
    if(label) label.textContent=`${String(count).padStart(2,'0')} MODELS`;
  });
}

function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),2300);}
$$('.quick-add').forEach(btn=>btn.addEventListener('click',()=>{
  const name=btn.dataset.product,price=Number(btn.dataset.price);
  const existing=cart.find(x=>x.name===name); if(existing)existing.qty++;else cart.push({name,price,qty:1});
  renderCart();toast(`${name} added to your garage`);
}));
$$('.heart').forEach(btn=>btn.addEventListener('click',()=>{btn.classList.toggle('liked');btn.textContent=btn.classList.contains('liked')?'♥':'♡';toast(btn.classList.contains('liked')?'Added to wishlist':'Removed from wishlist');}));

const drawer=$('#cartDrawer'),overlay=$('#drawerOverlay');
function openCart(){drawer.classList.add('open');overlay.classList.add('show');drawer.setAttribute('aria-hidden','false');}
function closeCart(){drawer.classList.remove('open');overlay.classList.remove('show');drawer.setAttribute('aria-hidden','true');}
$('#cartToggle').addEventListener('click',openCart);$('#cartClose').addEventListener('click',closeCart);overlay.addEventListener('click',closeCart);
function renderCart(){
  const count=cart.reduce((n,item)=>n+item.qty,0),total=cart.reduce((n,item)=>n+item.price*item.qty,0);
  $('#cartCount').textContent=count;$('#drawerCount').textContent=`(${count})`;$('#cartSubtotal').textContent=`₹${total.toLocaleString('en-IN')}`;
  const container=$('#cartItems');
  if(!cart.length){container.innerHTML='<p class="empty-cart">Your garage is waiting for its first legend.</p>';return;}
  container.innerHTML=cart.map((item,i)=>`<div class="cart-item"><div><strong>${escapeHTML(item.name)}</strong><span>₹${item.price.toLocaleString('en-IN')} × ${item.qty}</span></div><button data-remove="${i}">REMOVE</button></div>`).join('');
  $$('[data-remove]',container).forEach(btn=>btn.addEventListener('click',()=>{cart.splice(Number(btn.dataset.remove),1);renderCart();}));
}
function escapeHTML(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
$('#checkoutBtn').addEventListener('click',()=>toast('Demo only — connect a payment gateway to enable checkout.'));
$('#newsletterForm').addEventListener('submit',e=>{e.preventDefault();$('#newsletterMessage').textContent='YOU’RE ON THE LIST. SEE YOU AT THE GRID!';e.target.reset();});
$$('.faq-list details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open) $$('.faq-list details').filter(x=>x!==d).forEach(x=>x.open=false);}));
