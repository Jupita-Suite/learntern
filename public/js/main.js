(function(){
  // Mobile menu
  var btn=document.querySelector('.menu-btn'),nav=document.querySelector('.nav');
  if(btn&&nav){btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o)})}

  // Reveal on scroll (respects reduced motion)
  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
    els.forEach(function(el){io.observe(el)});
  } else els.forEach(function(el){el.classList.add('in')});

  // Forms -> /api/*
  var T0=Date.now();
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[data-ad]');if(a&&window.dataLayer)window.dataLayer.push({event:'ad_click',ad_id:a.getAttribute('data-ad')})});
  document.querySelectorAll('form[data-endpoint]').forEach(function(f){
    f.addEventListener('submit',function(ev){
      ev.preventDefault();
      var msg=f.querySelector('.form-msg'),b=f.querySelector('button[type=submit]');
      var data=Object.fromEntries(new FormData(f).entries());
      data.source=f.getAttribute('data-source')||location.pathname;
      data._e=Date.now()-T0; // ms since page load: plain scripted POSTs do not send this
      msg.className='form-msg';msg.textContent='';
      b.disabled=true;var old=b.textContent;b.textContent='Sending…';
      fetch(f.getAttribute('data-endpoint'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
        .then(function(r){return r.json().then(function(j){return{ok:r.ok,j:j}})})
        .then(function(x){
          if(x.ok&&x.j.url){location.href=x.j.url;return}
          if(x.ok){msg.className='form-msg ok';msg.textContent=x.j.message||'Thank you. Your submission was received.';f.reset();
            if(window.dataLayer)window.dataLayer.push({event:'form_submit',form:f.getAttribute('data-source')});}
          else{msg.className='form-msg err';msg.textContent=x.j.error||'Something went wrong. Please try again.'}
        })
        .catch(function(){msg.className='form-msg err';msg.textContent='Network error. Please check your connection and try again.'})
        .finally(function(){b.disabled=false;b.textContent=old});
    });
  });

  // Paystack return: Paystack redirects back with ?checkout=return&reference=...; show the real payment status.
  (function(){
    var qs=new URLSearchParams(location.search),ref=qs.get('reference')||qs.get('trxref'),box=document.querySelector('.buy-box');
    if(qs.get('checkout')!=='return'||!ref||!box)return;
    var note=document.createElement('p');note.className='form-msg';note.setAttribute('role','status');note.textContent='Confirming your payment…';
    box.insertBefore(note,box.firstChild);
    fetch('/api/verify?reference='+encodeURIComponent(ref)).then(function(r){return r.json()}).then(function(j){
      if(j.status==='success'){note.className='form-msg ok';note.textContent='Payment received. Thank you! Your download link is being emailed to you (check spam if it does not arrive in a few minutes).';
        if(window.dataLayer)window.dataLayer.push({event:'purchase',reference:ref});}
      else if(j.status==='abandoned'||j.status==='failed'){note.className='form-msg err';note.textContent='Your payment was not completed. You have not been charged. Please try again.'}
      else{note.className='form-msg';note.textContent='We are still confirming your payment. If you were charged, your download link will be emailed shortly.'}
    }).catch(function(){note.className='form-msg';note.textContent='We could not confirm your payment status right now. If you were charged, your download link will be emailed shortly.'});
  })();

  // Learn library: search, filter, pagination
  var lib=document.getElementById('library');
  if(lib){
    var cards=[].slice.call(lib.querySelectorAll('[data-title]')),per=9,page=1,cat='All',q='';
    var empty=document.getElementById('empty'),pager=document.getElementById('pager');
    var qs=new URLSearchParams(location.search);
    if(qs.get('cat'))cat=qs.get('cat');if(qs.get('q')){q=qs.get('q').toLowerCase();document.getElementById('q').value=qs.get('q')}
    function render(){
      var m=cards.filter(function(c){
        var okc=cat==='All'||c.dataset.cat===cat;
        var okq=!q||(c.dataset.title+' '+c.dataset.excerpt+' '+c.dataset.cat).toLowerCase().indexOf(q)>-1;
        return okc&&okq});
      var pages=Math.max(1,Math.ceil(m.length/per));if(page>pages)page=1;
      cards.forEach(function(c){c.style.display='none'});
      m.slice((page-1)*per,page*per).forEach(function(c){c.style.display=''});
      empty.style.display=m.length?'none':'block';
      pager.innerHTML='';
      if(pages>1){for(var i=1;i<=pages;i++){(function(i){var b=document.createElement('button');b.textContent=i;b.setAttribute('aria-label','Page '+i);if(i===page)b.setAttribute('aria-current','true');b.onclick=function(){page=i;render();lib.scrollIntoView({behavior:'smooth'})};pager.appendChild(b)})(i)}}
      document.querySelectorAll('.chip').forEach(function(c){c.setAttribute('aria-pressed',c.dataset.cat===cat)});
    }
    document.querySelectorAll('.chip').forEach(function(c){c.onclick=function(){cat=c.dataset.cat;page=1;render()}});
    document.getElementById('q').addEventListener('input',function(e){q=e.target.value.toLowerCase().trim();page=1;render()});
    render();
  }
})();
