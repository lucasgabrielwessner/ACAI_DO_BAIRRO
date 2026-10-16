const precos={300:14,500:20};
const adicionaisData={
  'leite em po':{nome:'Leite em pó',preco:2},
  'banana':{nome:'Banana',preco:2},
  'morango':{nome:'Morango',preco:3},
  'granolas':{nome:'Granola Crocante',preco:2},
  'creme de avela':{nome:'Creme de avelã',preco:4},
  'leite condensado':{nome:'Leite condensado',preco:2},
  'uvas':{nome:'Uvas Frescas',preco:3},
  'cereais':{nome:'Cereais',preco:2},
  'chocolate':{nome:'Chocolate',preco:3},
  'calda':{nome:'Calda Especial',preco:2},
  'pacoca':{nome:'Paçoca',preco:2}
};
const bairrosCampoLargo=[
'Águas Claras','Bateias','Bom Jesus','Botiatuva','Caiva','Campo do Meio','Centro','Cercadinho','Chacrinha Nossa Senhora do Rocio','Colônia Antônio Rebouças','Colônia Balbino Cunha','Colônia Dom Pedro II','Colônia Revier','Conjunto Habitacional Joaquim Celestino Ferreira','Conjunto Habitacional Monsenhor Francisco Gorski','Cristo Rei','Fazendinha','Ferrari','Ferraria','Itambezinho','Itaqui','Itaqui de Cima','Jardim Alvorada','Jardim Bela Vista','Jardim Boa Vista','Jardim Busmayer','Jardim Carmela','Jardim Céu Azul','Jardim das Acácias','Jardim das Américas','Jardim das Palmas','Jardim das Palmeiras','Jardim Emília','Jardim Esmeralda','Jardim Florestal','Jardim Guarany','Jardim Iruama','Jardim Itália','Jardim Itaqui','Jardim Keli Cristina','Jardim Lise','Jardim Lorenzete','Jardim Melyane','Jardim Nossa Senhora do Perpétuo Socorro','Jardim Padre José de Anchieta','Jardim Paraíso Mineral','Jardim Rivabem','Jardim Rondinha','Jardim Santa Luzia','Jardim São Vicente','Jardim Social','Jardim Três Rios','Jardim Tropical','Lagoa','Loteamento Bieda','Loteamento Cavalin','Loteamento Helvídia','Loteamento Itaboa','Loteamento Leal','Loteamento Miranda','Loteamento Santa Ana','Loteamento Santa Rita','Loteamento Santo André','Loteamento São Francisco de Assis','Loteamento São Gerônimo','Loteamento São José','Loteamento Vila Verde','Loteamento Vista Alegre','Loteamento Yara','Moradias Bom Jesus','Nova Trento','Nova Trento II','Núcleo Habitacional Doutor Abranches Guimarães','Núcleo Habitacional Mathias Batista','Ouro Verde','Palmital de São Silvestre','Parque Bom Jesus','Passauna','Rondinha','Salgadinho','Santa Cruz','Santa Nely','São João I','São Marcos','Três Córregos','Vila Alzira','Vila Andreassa Miranda','Vila Antares','Vila Antônio Seguro','Vila Bancária','Vila Campesi','Vila Cilka','Vila Conceição','Vila David Antônio','Vila Déa','Vila Delurdes','Vila Dom Pedro','Vila Dom Pedro II','Vila Dona Fina','Vila Elizabeth','Vila Ferrari II','Vila Gilcy','Vila Glória','Vila Itaqui','Vila Kuster','Vila Mariano Torres','Vila Nossa Senhora do Carmo','Vila Nova','Vila Operária','Vila Otto','Vila Pompéia','Vila Rivabem','Vila Santa Terezinha','Vila São Luiz','Vila Solene','Vila Torres','Vila Vista Alegre'
];

const cupons={'ACAI10':{tipo:'porcentagem',valor:10,desc:'10% OFF'},'BEMVINDO':{tipo:'fixo',valor:5,desc:'R$5 OFF'},'VERAO15':{tipo:'porcentagem',valor:15,min:30,desc:'15% OFF acima R$30'}};
const limites={300:2,500:4};
let tamanho=null,selecionados=[],carrinho=[],cupomAtivo=null;
let cliente={nome:'',telefone:'',bairro:''};
const els={};

document.addEventListener('DOMContentLoaded',()=>{
  els.sizeBtns=document.querySelectorAll('.size-option');
  els.selectsGrid=document.getElementById('selects-grid');
  els.emptyAdic=document.getElementById('empty-adicionais');
  els.hint=document.getElementById('adicionais-hint');
  els.resumoBox=document.getElementById('resumo-box');
  els.currentTotal=document.getElementById('current-total');
  els.btnAddCart=document.getElementById('btn-add-cart');
  els.cartList=document.getElementById('cart-list');
  els.cartCount=document.getElementById('cart-count');
  els.cartSubtotal=document.getElementById('cart-subtotal');
  els.cartDiscount=document.getElementById('cart-discount');
  els.cartTotal=document.getElementById('cart-total');
  els.discountLine=document.getElementById('discount-line');
  els.discountCode=document.getElementById('discount-code');
  els.couponInput=document.getElementById('coupon-input');
  els.couponFeedback=document.getElementById('coupon-feedback');
  els.btnClear=document.getElementById('btn-clear-cart');
  els.btnCheckout=document.getElementById('btn-checkout');
  els.nome=document.getElementById('cliente-nome');
  els.telefone=document.getElementById('cliente-telefone');
  els.bairroWrapper=document.getElementById('bairro-wrapper');
  els.bairroTrigger=document.getElementById('bairro-trigger');
  els.bairroDropdown=document.getElementById('bairro-dropdown');
  els.bairro={}; // compat placeholder
  els.deliveryFee=document.getElementById('delivery-fee');
  els.deliveryLabel=document.getElementById('delivery-bairro-label');
  els.bairroHint=document.getElementById('bairro-hint');
  carregarStorage(); bindEvents(); gerarBairroSelect(); bindBairroSelect(); renderCarrinho(); if(tamanho) restaurarTamanho(); atualizarTaxaEntrega(); atualizarBairroTrigger();
});

function bindEvents(){
  els.sizeBtns.forEach(btn=>{
    btn.addEventListener('click',()=>{
      const s=parseInt(btn.dataset.size);
      if(tamanho===s) return;
      tamanho=s;
      els.sizeBtns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      els.hint.textContent=s===300?'2 adicionais obrigatórios - escolha 2 sabores':'4 adicionais obrigatórios - escolha 4 sabores';
      gerarSelectsCorrigido(limites[s]);
      salvarStorage(); atualizarResumoAtual();
    });
  });
  document.getElementById('btn-apply-coupon').addEventListener('click',aplicarCupom);
  els.couponInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();aplicarCupom()}});
  document.querySelectorAll('.coupon-tags span').forEach(s=>s.addEventListener('click',()=>{els.couponInput.value=s.dataset.code;aplicarCupom()}));
  els.btnAddCart.addEventListener('click',adicionarAoCarrinho);
  els.btnClear.addEventListener('click',limparCarrinho);
  els.btnCheckout.addEventListener('click',finalizarPedido);
  document.getElementById('btn-close-modal').addEventListener('click',()=>document.getElementById('modal-overlay').classList.remove('show'));
  document.getElementById('cart-toggle').addEventListener('click',()=>document.getElementById('cart-panel').scrollIntoView({behavior:'smooth'}));
  document.addEventListener('click',e=>{ if(!e.target.closest('.cs-wrapper')){ document.querySelectorAll('.cs-wrapper.open').forEach(w=>{w.classList.remove('open'); w.style.zIndex='1';}); document.querySelectorAll('.custom-field').forEach(f=>{f.style.zIndex='1'; f.classList.remove('is-open');}); document.querySelectorAll('.field').forEach(f=>{f.style.zIndex='1'; f.classList.remove('is-open');}); } });
  // Campos entrega com validação corrigida
  els.nome.addEventListener('input',()=>{cliente.nome=els.nome.value.trim(); validarCampo('nome');});
  els.nome.addEventListener('blur',()=>{cliente.nome=els.nome.value.trim(); validarCampo('nome'); salvarStorage(); renderCarrinho();});
  els.telefone.addEventListener('input',(e)=>{
    let digits=e.target.value.replace(/\D/g,'').slice(0,11);
    let masked=digits;
    if(digits.length>=2) masked=`(${digits.slice(0,2)}) ${digits.slice(2)}`;
    if(digits.length>=7) masked=`(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
    else if(digits.length>=3) masked=`(${digits.slice(0,2)}) ${digits.slice(2)}`;
    e.target.value=masked;
    cliente.telefone=masked;
    validarCampo('telefone');
  });
  els.telefone.addEventListener('blur',()=>{cliente.telefone=els.telefone.value.trim(); validarCampo('telefone'); salvarStorage(); renderCarrinho();});
  // bairro agora é select custom - listeners no gerarBairroSelect
}

function validarCampo(campo){
  const errNome=document.getElementById('err-nome'),errTel=document.getElementById('err-telefone'),errBairro=document.getElementById('err-bairro');
  let ok=true;
  if(campo==='nome'||campo==='all'){
    if(!cliente.nome||cliente.nome.length<3){errNome.textContent='Nome obrigatório (mín 3 letras)';els.nome.classList.add('invalid');ok=false}else{errNome.textContent='';els.nome.classList.remove('invalid')}
  }
  if(campo==='telefone'||campo==='all'){
    const digits=(cliente.telefone||'').replace(/\D/g,'');
    if(digits.length<10||digits.length>11){errTel.textContent='Telefone com DDD obrigatório (10 ou 11 dígitos)';els.telefone.classList.add('invalid');ok=false}else{errTel.textContent='';els.telefone.classList.remove('invalid')}
  }
  if(campo==='bairro'||campo==='all'){
    if(!cliente.bairro||cliente.bairro.length<2){errBairro.textContent='Bairro obrigatório * selecione um bairro'; if(els.bairroWrapper) els.bairroWrapper.querySelector('.cs-trigger').classList.add('invalid'); ok=false}else{errBairro.textContent=''; if(els.bairroWrapper) els.bairroWrapper.querySelector('.cs-trigger').classList.remove('invalid');}
  }
  return ok;
}
function validarTodos(){let n=validarCampo('nome'),t=validarCampo('telefone'),b=validarCampo('bairro');return n&&t&&b}
function getTaxaEntrega(){if(!cliente.bairro) return 0; return cliente.bairro.toLowerCase().trim()==='centro'?5:10}
function atualizarTaxaEntrega(){
  const taxa=getTaxaEntrega();
  els.deliveryLabel.textContent=cliente.bairro||'-';
  els.deliveryFee.textContent=taxa===0?'R$ 0,00':'R$ '+taxa.toFixed(2).replace('.',',');
  if(!cliente.bairro){els.bairroHint.textContent='';els.bairroHint.className='field-hint';}
  else if(cliente.bairro.toLowerCase().trim()==='centro'){els.bairroHint.textContent='✓ Centro: taxa R$ 5,00';els.bairroHint.className='field-hint centro';}
  else{els.bairroHint.textContent='Taxa R$ 10,00 para '+cliente.bairro;els.bairroHint.className='field-hint outro';}
}

function gerarBairroSelect(){
  if(!els.bairroDropdown) return;
  els.bairroDropdown.innerHTML='';
  // opção vazia
  const optEmpty=document.createElement('div');
  optEmpty.className='cs-option'+(!cliente.bairro?' selected':'');
  optEmpty.dataset.value='';
  optEmpty.innerHTML=`<span class="cs-opt-left"><span class="cs-opt-dot" style="background:#e5e7eb"></span><span class="cs-opt-name">Selecione seu bairro</span></span><span class="cs-opt-price">-</span>`;
  optEmpty.addEventListener('click',(e)=>{e.stopPropagation(); selecionarBairro('')});
  els.bairroDropdown.appendChild(optEmpty);
  bairrosCampoLargo.forEach(bairro=>{
    const isSelected=cliente.bairro===bairro;
    const isCentro=bairro.toLowerCase()==='centro';
    const opt=document.createElement('div');
    opt.className='cs-option'+(isSelected?' selected':'');
    opt.dataset.value=bairro;
    const taxa=isCentro?'R$ 5,00':'R$ 10,00';
    const cor=isCentro?'#10b981':'#8b5cf6';
    opt.innerHTML=`<span class="cs-opt-left"><span class="cs-opt-dot" style="background:${cor}"></span><span class="cs-opt-name">${bairro}</span></span><span class="cs-opt-price">${taxa}</span>`;
    opt.addEventListener('click',(e)=>{e.stopPropagation(); selecionarBairro(bairro)});
    els.bairroDropdown.appendChild(opt);
  });
  atualizarBairroTrigger();
}

function atualizarBairroTrigger(){
  const valueEl=els.bairroTrigger?.querySelector('.cs-value');
  if(!valueEl) return;
  if(!cliente.bairro){
    valueEl.innerHTML='<span class="cs-placeholder">Selecione seu bairro</span>';
  }else{
    const taxa=getTaxaEntrega();
    valueEl.innerHTML=`<span class="cs-value-text">${cliente.bairro}</span><span class="cs-price">R$ ${taxa.toFixed(2).replace('.',',')}</span>`;
  }
}

function selecionarBairro(bairro){
  cliente.bairro=bairro;
  document.querySelectorAll('.custom-field').forEach(f=>{f.style.zIndex='1'; f.classList.remove('is-open');});
  document.querySelectorAll('.cs-wrapper.open').forEach(w=>{w.classList.remove('open'); w.style.zIndex='1';});
  gerarBairroSelect();
  validarCampo('bairro');
  atualizarTaxaEntrega();
  salvarStorage();
  renderCarrinho();
}

function bindBairroSelect(){
  if(!els.bairroWrapper || !els.bairroTrigger) return;
  const newTrigger=els.bairroTrigger.cloneNode(true);
  els.bairroTrigger.parentNode.replaceChild(newTrigger, els.bairroTrigger);
  els.bairroTrigger=newTrigger;
  els.bairroTrigger.addEventListener('click',(e)=>{
    e.stopPropagation();
    const isOpen=els.bairroWrapper.classList.contains('open');
    document.querySelectorAll('.custom-field').forEach(f=>{f.style.zIndex='1'; f.classList.remove('is-open');});
    document.querySelectorAll('.cs-wrapper.open').forEach(w=>{w.classList.remove('open'); w.style.zIndex='1';});
    if(!isOpen){
      els.bairroWrapper.classList.add('open');
      els.bairroTrigger.setAttribute('aria-expanded','true');
      const field=els.bairroWrapper.closest('.field') || els.bairroWrapper.closest('.custom-field') || els.bairroWrapper.parentElement;
      if(field){ field.style.zIndex='9999'; field.classList.add('is-open'); }
      els.bairroWrapper.style.zIndex='10000';
    }
  });
}


// === FIX SELECT PROBLEM ===
function gerarSelectsCorrigido(qtd){
  els.emptyAdic.style.display='none';
  els.selectsGrid.innerHTML='';
  els.selectsGrid.className='custom-selects-grid'+(qtd===4?' four':'');
  // preserva valores existentes corretamente
  const antigos=[...selecionados];
  selecionados=[];
  for(let i=0;i<qtd;i++){
    const valorExistente=antigos[i]||'';
    selecionados.push(valorExistente);
    const field=document.createElement('div');
    field.className='custom-field';
    field.style.animationDelay=(i*80)+'ms';
    field.innerHTML=`
      <label>Adicional ${i+1} *</label>
      <div class="cs-wrapper" data-index="${i}">
        <button type="button" class="cs-trigger" aria-haspopup="listbox" aria-expanded="false">
          <span class="cs-value"><span class="cs-placeholder">Selecione</span></span>
          <span class="cs-arrow">▼</span>
        </button>
        <div class="cs-dropdown" role="listbox"></div>
      </div>
    `;
    els.selectsGrid.appendChild(field);
  }
  renderDropdownsFix();
  atualizarTriggersFix();
}

function renderDropdownsFix(){
  const wrappers=els.selectsGrid.querySelectorAll('.cs-wrapper');
  wrappers.forEach(wrapper=>{
    const idx=parseInt(wrapper.dataset.index);
    const dropdown=wrapper.querySelector('.cs-dropdown');
    dropdown.innerHTML='';
    // Opção vazia sempre primeiro
    const optEmpty=document.createElement('div');
    optEmpty.className='cs-option'+(selecionados[idx]===''?' selected':'');
    optEmpty.dataset.value='';
    optEmpty.setAttribute('role','option');
    optEmpty.innerHTML=`<span class="cs-opt-left"><span class="cs-opt-dot" style="background:#e5e7eb"></span><span class="cs-opt-name">Nenhum</span></span><span class="cs-opt-price">-</span>`;
    optEmpty.addEventListener('click',(e)=>{e.stopPropagation(); selecionarCorrigido(idx,'')});
    dropdown.appendChild(optEmpty);

    Object.keys(adicionaisData).forEach(key=>{
      const data=adicionaisData[key];
      const isUsed=selecionados.includes(key) && selecionados[idx]!==key;
      const isSelected=selecionados[idx]===key;
      const opt=document.createElement('div');
      opt.className='cs-option'+(isSelected?' selected':'')+(isUsed?' disabled':'');
      opt.dataset.value=key;
      opt.setAttribute('role','option');
      opt.setAttribute('aria-selected',isSelected?'true':'false');
      const corDot=isSelected?'#fff':(key==='morango'?'#fca5a5':key==='banana'?'#fde68a':key==='chocolate'?'#d6c7b8':'#c4b5fd');
      opt.innerHTML=`<span class="cs-opt-left"><span class="cs-opt-dot" style="background:${corDot}"></span><span class="cs-opt-name">${data.nome}</span></span><span class="cs-opt-price">R$ ${data.preco.toFixed(2).replace('.',',')}</span>`;
      if(!isUsed){
        opt.addEventListener('click',(e)=>{e.stopPropagation(); selecionarCorrigido(idx,key)});
      }
      dropdown.appendChild(opt);
    });

    const trigger=wrapper.querySelector('.cs-trigger');
    // remove listeners antigos clonando
    const newTrigger=trigger.cloneNode(true);
    trigger.parentNode.replaceChild(newTrigger,trigger);
    newTrigger.addEventListener('click',(e)=>{
      e.stopPropagation();
      const isOpen=wrapper.classList.contains('open');
      // Fecha todos e reseta z-index
      document.querySelectorAll('.custom-field').forEach(f=>{f.style.zIndex='1'; f.classList.remove('is-open');});
      document.querySelectorAll('.cs-wrapper.open').forEach(w=>{w.classList.remove('open'); w.style.zIndex='1'; const t=w.querySelector('.cs-trigger'); if(t) t.setAttribute('aria-expanded','false');});
      if(!isOpen){
        wrapper.classList.add('open');
        newTrigger.setAttribute('aria-expanded','true');
        const field = wrapper.closest('.custom-field');
        if(field){ field.style.zIndex='9999'; field.classList.add('is-open'); }
        wrapper.style.zIndex='10000';
      }
    });
  });
}

function selecionarCorrigido(index, valor){
  selecionados[index]=valor;
  // Fecha tudo primeiro
  document.querySelectorAll('.custom-field').forEach(f=>{f.style.zIndex='1'; f.classList.remove('is-open');});
  document.querySelectorAll('.cs-wrapper.open').forEach(w=>{w.classList.remove('open'); w.style.zIndex='1';});
  // Atualiza visual
  atualizarTriggersFix();
  renderDropdownsFix();
  atualizarTriggersFix();
  atualizarResumoAtual();
  salvarStorage();
}

function atualizarTriggersFix(){
  const wrappers=els.selectsGrid.querySelectorAll('.cs-wrapper');
  wrappers.forEach(w=>{
    const idx=parseInt(w.dataset.index);
    const val=selecionados[idx];
    const valueEl=w.querySelector('.cs-value');
    if(!val || val===''){
      valueEl.innerHTML='<span class="cs-placeholder">Selecione um adicional</span>';
    }else{
      const d=adicionaisData[val];
      valueEl.innerHTML=`<span class="cs-value-text">${d.nome}</span><span class="cs-price">R$ ${d.preco.toFixed(2).replace('.',',')}</span>`;
    }
  });
}

function atualizarResumoAtual(){
  if(!tamanho){els.resumoBox.innerHTML='<div class="resumo-empty">Escolha o tamanho para montar seu açaí</div>';els.currentTotal.textContent='R$ 0,00';els.btnAddCart.disabled=true;return;}
  const base=precos[tamanho];let total=base;const filtrados=selecionados.filter(v=>v&&v!=='');
  filtrados.forEach(k=>total+=adicionaisData[k].preco);
  let html=`<div class="resumo-item"><span>Copo ${tamanho}ml - Base cremosa</span><span>R$ ${base.toFixed(2).replace('.',',')}</span></div>`;
  filtrados.forEach(k=>{const d=adicionaisData[k];html+=`<div class="resumo-item"><span>+ ${d.nome}</span><span>R$ ${d.preco.toFixed(2).replace('.',',')}</span></div>`;});
  const esperado=limites[tamanho];
  if(filtrados.length<esperado){html+=`<div class="resumo-empty">Faltam ${esperado-filtrados.length} adicional(is) para completar</div>`;}
  else{html+=`<div style="margin-top:8px;padding:8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:11px;color:#059669;font-weight:700;text-align:center">✓ Açaí completo pronto para adicionar</div>`;}
  els.resumoBox.innerHTML=html;
  els.currentTotal.textContent=`R$ ${total.toFixed(2).replace('.',',')}`;
  els.btnAddCart.disabled=filtrados.length!==esperado;
}

function adicionarAoCarrinho(){
  if(!tamanho) return;
  const filtrados=selecionados.filter(v=>v&&v!=='');
  if(filtrados.length!==limites[tamanho]) return;
  let total=precos[tamanho]; filtrados.forEach(k=>total+=adicionaisData[k].preco);
  carrinho.push({id:Date.now(),tamanho,adicionais:[...filtrados],total});
  tamanho=null; selecionados=[];
  els.sizeBtns.forEach(b=>b.classList.remove('active'));
  els.selectsGrid.innerHTML=''; els.emptyAdic.style.display='block'; els.hint.textContent='Escolha o tamanho primeiro';
  atualizarResumoAtual(); renderCarrinho(); salvarStorage();
}

function renderCarrinho(){
  els.cartCount.textContent=carrinho.length;
  if(carrinho.length===0){els.cartList.innerHTML='<div class="cart-empty"><strong>Carrinho vazio</strong><span>Monte seu açaí</span></div>';}
  else{
    els.cartList.innerHTML='';
    carrinho.forEach(item=>{
      const nomes=item.adicionais.map(k=>adicionaisData[k].nome).join(', ');
      const div=document.createElement('div'); div.className='cart-item';
      div.innerHTML=`<div class="cart-item-info"><strong>${item.tamanho}ml • R$ ${item.total.toFixed(2).replace('.',',')}</strong><span>${nomes}</span></div><div style="display:flex;flex-direction:column;align-items:end;gap:6px"><span class="cart-item-price">R$ ${item.total.toFixed(2).replace('.',',')}</span><button class="cart-item-remove" data-id="${item.id}">×</button></div>`;
      els.cartList.appendChild(div);
    });
    els.cartList.querySelectorAll('.cart-item-remove').forEach(btn=>{btn.addEventListener('click',()=>{carrinho=carrinho.filter(i=>i.id!=parseInt(btn.dataset.id)); renderCarrinho(); salvarStorage();});});
  }
  let subtotal=carrinho.reduce((s,i)=>s+i.total,0); let desconto=0;
  if(cupomAtivo){const c=cupons[cupomAtivo]; if(c){ if(c.tipo==='porcentagem'){ if(!c.min||subtotal>=c.min) desconto=subtotal*(c.valor/100);} else desconto=Math.min(c.valor,subtotal);} }
  const taxa=carrinho.length>0?getTaxaEntrega():0;
  els.cartSubtotal.textContent=`R$ ${subtotal.toFixed(2).replace('.',',')}`;
  if(desconto>0){els.discountLine.style.display='flex'; els.discountCode.textContent=cupomAtivo; els.cartDiscount.textContent=`-R$ ${desconto.toFixed(2).replace('.',',')}`;} else els.discountLine.style.display='none';
  els.cartTotal.textContent=`R$ ${Math.max(0,subtotal-desconto+taxa).toFixed(2).replace('.',',')}`;
  const camposOk=validarTodos(); els.btnCheckout.disabled=carrinho.length===0||!camposOk;
  els.btnClear.style.display=carrinho.length?'block':'none';
}

function aplicarCupom(){
  const code=els.couponInput.value.trim().toUpperCase();
  if(!code){els.couponFeedback.textContent='Digite um cupom'; els.couponFeedback.className='coupon-feedback err'; return;}
  const cupom=cupons[code];
  if(!cupom){els.couponFeedback.textContent='Cupom inválido'; els.couponFeedback.className='coupon-feedback err'; cupomAtivo=null; salvarStorage(); renderCarrinho(); return;}
  let subtotal=carrinho.reduce((s,i)=>s+i.total,0);
  if(cupom.min&&subtotal<cupom.min){els.couponFeedback.textContent=`Mínimo R$ ${cupom.min.toFixed(2)}`; els.couponFeedback.className='coupon-feedback err'; return;}
  cupomAtivo=code; els.couponFeedback.textContent=`✓ Cupom ${code}: ${cupom.desc}`; els.couponFeedback.className='coupon-feedback ok'; salvarStorage(); renderCarrinho();
}

function limparCarrinho(){carrinho=[]; cupomAtivo=null; els.couponInput.value=''; els.couponFeedback.textContent=''; renderCarrinho(); salvarStorage();}

function finalizarPedido(){
  if(carrinho.length===0) return;
  if(!validarTodos()){els.couponFeedback.textContent='⚠️ Preencha Nome, Telefone com DDD e Bairro!'; els.couponFeedback.className='coupon-feedback err'; document.querySelector('.delivery-card').scrollIntoView({behavior:'smooth'}); return;}
  let subtotal=carrinho.reduce((s,i)=>s+i.total,0); let desconto=0;
  if(cupomAtivo){const c=cupons[cupomAtivo]; if(c.tipo==='porcentagem') desconto=subtotal*(c.valor/100); else desconto=Math.min(c.valor,subtotal);}
  const taxa=getTaxaEntrega(); const total=subtotal-desconto+taxa;
  let html=''; carrinho.forEach((item,i)=>{const nomes=item.adicionais.map(k=>adicionaisData[k].nome).join(', '); html+=`<div class="modal-item"><span>${i+1}. ${item.tamanho}ml (${nomes})</span><strong>R$ ${item.total.toFixed(2).replace('.',',')}</strong></div>`;});
  html+=`<div class="modal-item"><span>Subtotal</span><span>R$ ${subtotal.toFixed(2).replace('.',',')}</span></div>`;
  if(desconto>0) html+=`<div class="modal-item"><span>Desconto ${cupomAtivo}</span><span>-R$ ${desconto.toFixed(2).replace('.',',')}</span></div>`;
  html+=`<div class="modal-item"><span>Taxa entrega (${cliente.bairro})</span><span>R$ ${taxa.toFixed(2).replace('.',',')}</span></div>`;
  html+=`<div class="modal-item" style="font-weight:800;border-top:2px solid #0f0a1e;margin-top:8px;padding-top:10px"><span>Total final</span><strong>R$ ${total.toFixed(2).replace('.',',')}</strong></div>`;
  document.getElementById('modal-content').innerHTML=html;
  document.getElementById('modal-delivery').innerHTML=`<div style="margin:14px 20px 0;padding:12px;background:#f8f6ff;border-radius:12px;font-size:12px;border:1px solid #ede9fe"><strong>Entrega:</strong> ${cliente.nome}<br><strong>Tel:</strong> ${cliente.telefone}<br><strong>Bairro:</strong> ${cliente.bairro} - Taxa R$ ${taxa.toFixed(2).replace('.',',')}<br><span style="font-size:10px;color:#059669;font-weight:700">✓ Dados validados - AÇAÍ DO BAIRRO</span></div>`;
  document.getElementById('modal-overlay').classList.add('show');
  limparCarrinho();
}

function salvarStorage(){try{localStorage.setItem('acai_bairro_cart',JSON.stringify(carrinho)); localStorage.setItem('acai_bairro_config',JSON.stringify({tamanho,selecionados,cliente})); if(cupomAtivo) localStorage.setItem('acai_bairro_coupon',cupomAtivo); else localStorage.removeItem('acai_bairro_coupon');}catch(e){}}
function carregarStorage(){try{const c=localStorage.getItem('acai_bairro_cart'); if(c) carrinho=JSON.parse(c); const cfg=localStorage.getItem('acai_bairro_config'); if(cfg){const p=JSON.parse(cfg); tamanho=p.tamanho; selecionados=p.selecionados||[]; if(p.cliente){cliente=p.cliente; setTimeout(()=>{els.nome.value=cliente.nome||''; els.telefone.value=cliente.telefone||''; els.bairro.value=cliente.bairro||'';},60);}} const cup=localStorage.getItem('acai_bairro_coupon'); if(cup&&cupons[cup]){cupomAtivo=cup; setTimeout(()=>{els.couponInput.value=cup;},80);}}catch(e){}}
function restaurarTamanho(){const btn=document.getElementById('size-'+tamanho); if(btn){btn.classList.add('active'); gerarSelectsCorrigido(limites[tamanho]); els.hint.textContent=tamanho===300?'2 adicionais obrigatórios':'4 adicionais obrigatórios'; atualizarResumoAtual();}}