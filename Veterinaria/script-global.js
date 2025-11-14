// script-global.js — global helpers: menu, theme (session-only) and in-memory data functions
(function(){
  // apply classes if previously set in session (sessionStorage ephemeral) - optional
  if(sessionStorage.getItem('role')) {
    const role = sessionStorage.getItem('role');
    if(role === 'client') document.body.classList.add('client');
    if(role === 'employee') document.body.classList.add('employee');
  } else {
    // default to client pages (safer); pages may add body.client themselves.
  }
})();

/* THEME: session-only (not localStorage) */
function toggleTheme(){
  document.body.classList.toggle('dark');
  // keep in session only
  sessionStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}
(function(){
  // restore theme from session (ephemeral)
  if(sessionStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
})();

/* SIDE MENU controls */
function openSideMenu(){
  const overlay = document.querySelector('.side-menu-overlay');
  const menu = document.querySelector('.side-menu');
  if(!overlay || !menu) return;
  overlay.classList.add('open');
  menu.classList.add('open');
  // lock scroll
  document.documentElement.style.overflow = 'hidden';
}
function closeSideMenu(){
  const overlay = document.querySelector('.side-menu-overlay');
  const menu = document.querySelector('.side-menu');
  if(!overlay || !menu) return;
  overlay.classList.remove('open');
  menu.classList.remove('open');
  document.documentElement.style.overflow = '';
}
// close when clicking overlay
document.addEventListener('click', function(e){
  const overlay = document.querySelector('.side-menu-overlay.open');
  if(overlay && e.target === overlay) closeSideMenu();
});

/* -------------------------
   In-memory data structures (session-only)
   keep same function names requested earlier
   -------------------------*/
const __MEM = {
  cadastros: [],    // pets & clients
  consultas: [],
  exames: [],
  chat: []          // messages: {id, quem:'cliente'|'funcionario', texto}
};

/* Helpers to expose (global) */
function salvarLS(key, arr){
  // renamed semantic: does NOT persist, simply updates memory object
  __MEM[key] = arr;
}
function carregarLS(key){
  return __MEM[key] || [];
}

/* Pet helpers (same names preserved) */
function cadastrarPet(petObj){
  const arr = carregarLS('cadastros');
  arr.push(petObj);
  salvarLS('cadastros', arr);
}
function listarPets(){
  return carregarLS('cadastros');
}

/* Consultas / Exames / Chat */
function salvarConsulta(obj){ const arr = carregarLS('consultas'); arr.push(obj); salvarLS('consultas', arr); }
function salvarExame(obj){ const arr = carregarLS('exames'); arr.push(obj); salvarLS('exames', arr); }
function salvarMensagem(chatKey, msgObj){ const arr = carregarLS(chatKey); arr.push(msgObj); salvarLS(chatKey, arr); }

/* Render helpers (to be used in pages) */
function renderPetList(selector){
  const container = document.querySelector(selector);
  if(!container) return;
  const pets = listarPets();
  container.innerHTML = '';
  if(!pets.length){
    container.innerHTML = '<div class="small">Nenhum pet cadastrado.</div>';
    return;
  }
  pets.forEach(p=>{
    const div = document.createElement('div');
    div.className = 'pet-item';
    div.innerHTML = `
      <div class="pet-avatar"><img src="${p.avatar || 'assets/pet-placeholder.png'}" style="width:100%;height:100%;object-fit:cover"></div>
      <div style="flex:1">
        <div class="pet-name">${p.nome}</div>
        <div class="small">Espécie: ${p.especie}</div>
      </div>
      <div style="width:44px;text-align:center"><button title="Editar" onclick="alert('Editar não implementado')">✏️</button></div>
    `;
    container.appendChild(div);
  });
}

// expose in global scope for pages
window.cadastrarPet = cadastrarPet;
window.listarPets = listarPets;
window.salvarConsulta = salvarConsulta;
window.salvarExame = salvarExame;
window.salvarMensagem = salvarMensagem;
window.renderPetList = renderPetList;
window.openSideMenu = openSideMenu;
window.closeSideMenu = closeSideMenu;
window.toggleTheme = toggleTheme;
window.carregarLS = carregarLS; // readonly access if needed
