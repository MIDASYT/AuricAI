'use strict';
// Sólo archivos de la carpeta pública de AuricAI; nunca redirigir a otro repositorio.
// El manifiesto contiene rutas relativas y SHA-256 calculados durante la publicación.
(async function startAuricDownloads(){
  const status=document.getElementById('downloadStatus');
  const links=Array.from(document.querySelectorAll('[data-platform]'));
  const disable=(message)=>{
    links.forEach(link=>{link.removeAttribute('href');link.removeAttribute('download');link.setAttribute('aria-disabled','true');link.textContent='Descarga no publicada';});
    if(status)status.textContent=message;
  };
  try{
    const response=await fetch('./release.json',{cache:'no-store'});
    if(!response.ok)throw new Error('La información de esta versión aún no se ha publicado.');
    const data=await response.json();
    if(!/^\d+\.\d+\.\d+$/.test(data.version||''))throw new Error('Versión no válida.');
    // Never offer incomplete/test builds as consumer downloads. A deployment
    // manifest is promotable only after Firebase, shared Worker and permanent
    // signing have been checked by the production release workflow.
    if(data.channel!=='verified' || data.firebaseConfigured!==true || data.gatewayConfigured!==true) {
      disable('La próxima versión oficial de AuricAI aún no está disponible.');
      return;
    }
    const platforms=['windows','android'];
    const verified=[];
    for(const platform of platforms){
      const info=data[platform], ext=platform==='windows'?'exe':'apk';
      if(!info || typeof info.file!=='string' ||
         !new RegExp('^AuricAI[-_][A-Za-z0-9._-]+\\.'+ext+'$','i').test(info.file) ||
         !/^[a-f0-9]{64}$/i.test(info.sha256||''))throw new Error('Falta el instalador '+platform+'.');
      const url=new URL('downloads/'+encodeURIComponent(info.file),location.href);
      if(url.origin!==location.origin||!url.pathname.startsWith(new URL('./downloads/',location.href).pathname))
        throw new Error('Descarga fuera del sitio oficial.');
      const r=await fetch(url,{method:'HEAD',cache:'no-store'});
      if(!r.ok)throw new Error('El instalador de '+platform+' aún no está disponible.');
      if(r.headers.get('content-length') && Number(r.headers.get('content-length'))!==info.bytes)
        throw new Error('El archivo de '+platform+' no coincide con la publicación.');
      verified.push({platform,url,info});
    }
    for(const {platform,url,info} of verified){
      const link=document.querySelector('[data-platform="'+platform+'"]');
      link.href=url.href;link.setAttribute('download',info.file);link.removeAttribute('aria-disabled');link.textContent='Descargar '+(platform==='windows'?'EXE':'APK')+' · '+data.version;
      const hash=document.querySelector('[data-hash="'+platform+'"]');if(hash)hash.textContent=info.sha256;
    }
    document.querySelectorAll('[data-version]').forEach(el=>{el.textContent=data.version;});
    const version=document.getElementById('siteVersion');
    if(version)version.textContent='· Versión '+data.version;
    if(status)status.textContent=data.channel==='verified'?
      'Descargas disponibles. Compara el SHA-256 publicado antes de instalar.':
      'Descargas de prueba disponibles. La activación del servicio y las pruebas finales aún no están verificadas.';
    const prior=Array.isArray(data.history)?data.history:[];
    const list=document.getElementById('releaseHistory');
    if(list && prior.length){
      list.replaceChildren();
      for(const item of prior){
        if(!/^\d+\.\d+\.\d+$/.test(item.version||''))continue;
        for(const platform of platforms){
          const file=item[platform];
          if(typeof file!=='string'||!/^AuricAI[-_][A-Za-z0-9._-]+\.(exe|apk)$/i.test(file))continue;
          const a=document.createElement('a');
          a.href='downloads/'+encodeURIComponent(file);
          a.download=file;
          a.textContent='AuricAI '+item.version+' · '+(platform==='windows'?'Windows':'Android');
          list.append(a);
        }
      }
    }
  }catch(error){
    disable('Los archivos todavía no están publicados en la web oficial de AuricAI.');
  }
})();