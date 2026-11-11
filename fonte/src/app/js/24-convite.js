/* ================= Convite pelo WhatsApp para entrar no painel ================= */
/* endereço do convite: o do próprio site quando hospedado (github.io); na versão de testes, o site oficial */
const conviteUrl=()=>/^https?:$/.test(location.protocol)&&/github\.io$/.test(location.hostname)?location.origin+location.pathname.replace(/index\.html$/,''):SITE_OFICIAL;
function conviteMsg(email,pid){const p=pubs[pid]||{};const nome=tc(String(p.nome||'').split(' ')[0]||'');
  if(!email)return conviteMsgSemEmail(pid);
  const google=/@(gmail|googlemail)\.com$/i.test(email),tel=String(email).startsWith('+');
  const passo=tel?`Toque em "Entrar com o celular (SMS)", digite o seu número ${idLbl(email)} e depois o código que chegar por SMS.`
    :google?`Toque em "Continuar com Google" e escolha a conta ${email}.`
    :`No campo "E-mail", digite ${email} e toque em "Enviar link de acesso". Abra o e-mail que chegar (se não aparecer, confira a pasta Spam) e toque no link, no mesmo celular.`;
  const cong=cfg.congregacao&&cfg.congregacao!=='Congregação'?'\nCongregação '+cfg.congregacao.replace(/^Congrega[cç][aã]o\s+/i,''):'';
  return`Olá${nome?', '+nome:''}!\n\nAgora você pode ver as suas designações da congregação pelo celular:\n${conviteUrl()}\n\nComo entrar:\n1. Abra o link.\n2. ${passo}\n3. Leia e aceite o termo de uso.\n\nDicas:\n• Para abrir como um aplicativo, toque em "Instalar" quando aparecer o aviso (ou use "Adicionar à tela inicial" no menu do navegador).\n• Para receber lembretes das suas designações, toque em "Ativar avisos".\n${cong}`}
/* convite para quem só tem telefone no cadastro: entra com a própria conta e o pedido chega aos administradores */
function conviteMsgSemEmail(pid){const p=pubs[pid]||{};const nome=tc(String(p.nome||'').split(' ')[0]||'');
  const cong=cfg.congregacao&&cfg.congregacao!=='Congregação'?'\nCongregação '+cfg.congregacao.replace(/^Congrega[cç][aã]o\s+/i,''):'';
  return`Olá${nome?', '+nome:''}!\n\nAgora você pode ver as suas designações da congregação pelo celular:\n${conviteUrl()}\n\nComo entrar:\n1. Abra o link.\n2. Se você tem Gmail, toque em "Continuar com Google" e escolha a sua conta. Se não tem, digite o seu e-mail no campo "E-mail", toque em "Enviar link de acesso", abra o e-mail que chegar (confira também a pasta Spam) e toque no link, no mesmo celular.\n3. Vai aparecer "Acesso ainda não liberado". É normal: o seu pedido chega para mim. Assim que eu liberar, é só abrir o link de novo.\n4. Leia e aceite o termo de uso.\n\nDicas:\n• Para abrir como um aplicativo, toque em "Instalar" quando aparecer o aviso (ou use "Adicionar à tela inicial" no menu do navegador).\n• Para receber lembretes das suas designações, toque em "Ativar avisos".\n${cong}`}
/* e-mail com que o publicador entra: o que já tem acesso ligado a ele ou o do cadastro */
function conviteEmail(pid){const a=(ui.acc||[]).find(x=>x.pub===pid);if(a)return a.email;const p=pubs[pid]||{};return p.email?idAcesso(p.email):null}
/* botão "Convidar" na ficha do publicador (só administradores, que podem liberar o acesso) */
function conviteBtn(pid){const F=window.FBX;if(!F||F.papel!=='admin'||!pid||!pubs[pid])return'';
  const e=conviteEmail(pid);const st=acessoDe(pid);
  const n=waNumber(pubs[pid].tel||'');const ela=pubs[pid].sexo==='F';
  if(!e&&!n)return`<p class="hint" style="margin:0">Para convidar ${esc(tc(shortName(pname(pid))))} a entrar no sistema, coloque o WhatsApp ou o e-mail ${ela?'dela':'dele'} acima e salve.</p>`;
  const msg=conviteMsg(e,pid);const quando=pubs[pid].convite?' Convite enviado em '+br(pubs[pid].convite)+'.':'';
  const info=st==='ativo'?'Já entrou no sistema.':st==='convidado'?'Já tem acesso, mas ainda não entrou.':e?'O acesso ao painel é liberado ao convidar.':`Sem e-mail no cadastro: o convite pede para ${ela?'ela':'ele'} entrar com a própria conta, e o pedido de acesso chega para você liberar.`;
  return`<div class="convbox"><div><b>Convidar para o sistema</b><span class="hint">${info}${e?' Entra com '+esc(e)+'.':''}${quando}</span></div><div class="instacts">
    ${n?`<a class="btn small wa" data-a="pconv" data-id="${esc(pid)}" target="_blank" rel="noopener" href="https://wa.me/${n}?text=${encodeURIComponent(msg)}">Convidar pelo WhatsApp</a>`:''}
    <button type="button" class="btn small${n?'':' primary'}" data-a="pconvcopy" data-id="${esc(pid)}">Copiar convite</button></div></div>`}
/* libera o acesso (nível Publicador) se ainda não tiver; quem já tem outro nível continua com ele */
function conviteMarcar(pid){const p=pubs[pid];if(!p)return;const d=Object.assign({},p,{convite:iso(new Date())});pubs[pid]=d;queueSave('publicadores',pid,d);setTimeout(()=>renderAll(true),400)}
async function conviteLiberar(pid){conviteMarcar(pid);const F=window.FBX;const e=conviteEmail(pid);if(!F||F.papel!=='admin'||!e)return;
  const a=(ui.acc||[]).find(x=>x.email===e);if(e===F.owner)return;
  try{if(!a)await F.setAccess(e,'publicador',pid);else if(!a.pub)await F.setAccess(e,a.papel,pid)}catch(err){toast('Não foi possível liberar o acesso ('+((err&&err.code)||'erro')+')')}}
Object.assign(PACTS,{
  pconv:b=>{conviteLiberar(b.dataset.id)},
  pconvcopy:async b=>{const id=b.dataset.id;const e=conviteEmail(id);conviteLiberar(id);
    try{await navigator.clipboard.writeText(conviteMsg(e,id));toast('Convite copiado. Cole no WhatsApp ou no e-mail.')}catch(err){toast('Não foi possível copiar')}}
});
