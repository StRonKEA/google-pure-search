(async () => {
  const params = new URL(location.href).searchParams;
  const testCase = params.get('case');
  const byId = id => document.getElementById(id);
  const visible = el => !!el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
  const assertions = [];
  const check = (name, pass) => assertions.push({name, pass:!!pass});
  const settle = () => new Promise(resolve => setTimeout(resolve, 120));
  const card = byId('translation');
  if (testCase === 'german') {
    byId('original-title').lang = 'de'; byId('original-title').style.display = 'none';
    byId('original-snippet').lang = 'de'; byId('original-snippet').style.display = 'none';
    byId('original-button').textContent = 'Orijinali göster (Deutsch)';
  }
  if (testCase === 'missing') { byId('original-title').remove(); byId('original-snippet').remove(); }
  if (testCase === 'ambiguous') { const extra = byId('original-title').cloneNode(true); extra.id='extra-title'; card.querySelector('.yuRUbf').append(extra); }
  if (testCase === 'dynamic') card.remove();
  let clicks=0, queries=0, mutations=0, callbacks=0, callbackMs=0, maxCallbackMs=0;
  let frameMs=0, maxFrameMs=0, frames=0;
  const nativeFrame=window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame=callback=>nativeFrame(time=>{
    const start=performance.now();
    callback(time);
    const elapsed=performance.now()-start;
    frames++; frameMs+=elapsed; maxFrameMs=Math.max(maxFrameMs,elapsed);
  });
  byId('original-button')?.addEventListener('click', () => { clicks++; });
  const nativeQuery=Document.prototype.querySelectorAll;
  Document.prototype.querySelectorAll=function(...args) { queries++; return nativeQuery.apply(this,args); };
  const NativeObserver=window.MutationObserver;
  window.MutationObserver=class extends NativeObserver {
    constructor(callback) { super((records,observer)=>{const start=performance.now();callbacks++;callback(records,observer);const elapsed=performance.now()-start;callbackMs+=elapsed;maxCallbackMs=Math.max(maxCallbackMs,elapsed);}); }
  };
  const changes=new NativeObserver(records=>mutations+=records.length);
  changes.observe(document.body,{childList:true,subtree:true,attributes:true});
  const initialElements=[...document.querySelectorAll('#main *')];
  const manualHref=byId('explicit-translation').href;
  const source=await(await fetch(params.get('version')==='old'?'/tests/previous-v7.txt':'/clean-google-search.user.js')).text();
  const start=performance.now();
  try {(0,eval)(source);} catch(error){check('script runs without exception: '+error.message,false);}
  const initializationMs=performance.now()-start;
  await settle();
  if(testCase==='dynamic'){byId('rso').append(card);await settle();}
  check('normal film card stays visible',visible(byId('film-card')));
  check('normal navigation stays visible',visible(byId('images-tab'))&&visible(byId('all-tab')));
  check('ordinary result and sidebar stay visible',visible(byId('ordinary'))&&visible(byId('rhs')));
  check('all pre-existing elements are retained',initialElements.every(el=>el.isConnected));
  check('AI tab hidden but retained',!!byId('ai-tab')&&!visible(byId('ai-tab')));
  check('AI overview hidden but retained',!!byId('eKIzJc')&&!visible(byId('eKIzJc')));
  check('nested AI answer hidden; normal question retained',!visible(byId('nested-answer'))&&visible(byId('question-button'))&&visible(byId('ordinary-answer')));
  check('non-Google and other-mode links untouched',visible(byId('ordinary-udm'))&&visible(byId('udm-prefix')));
  check('manual translation link untouched',byId('explicit-translation').href===manualHref);
  if(testCase==='missing'||testCase==='ambiguous'){
    check('unverified translation remains usable',visible(byId('translated-title'))&&visible(byId('translation-bar')));
  }else{
    check('original title and snippet displayed',visible(byId('original-title'))&&visible(byId('original-snippet')));
    check('translated copies hidden',!visible(byId('translated-title'))&&!visible(byId('translated-snippet')));
    byId('original-title').style.display='none';
    await settle();
    check('Google style updates cannot re-hide original',visible(byId('original-title')));
    byId('original-title').href += '#updated';
    byId('translated-title').href += '#updated';
    await settle();
    check('link updates preserve original title and hide translation',visible(byId('original-title'))&&!visible(byId('translated-title')));
  }
  const beforeQueries=queries;
  for(let i=0;i<20;i++){byId('ordinary-answer').textContent='Normal '+i;await new Promise(resolve=>setTimeout(resolve,0));}
  await settle();
  check('no repeated translation clicks',clicks===0);
  check('unrelated updates do not rescan document',queries-beforeQueries===0);
  const burst=document.createElement('section');
  for(let i=0;i<1000;i++){const row=document.createElement('div');row.textContent='Ordinary result '+i;burst.append(row);}
  byId('rso').append(burst);
  await settle();
  check('1000 added ordinary elements remain visible',burst.children.length===1000&&[...burst.children].every(visible));
  const beforeIdle={mutations,callbacks};await settle();
  check('no idle mutation/observer loop',mutations===beforeIdle.mutations&&callbacks===beforeIdle.callbacks);
  parent.postMessage({kind:'test-result',testCase,assertions,metrics:{initializationMs,callbackMs,maxCallbackMs,frameMs,maxFrameMs,frames,callbacks,queries,clicks}},location.origin);
})();
