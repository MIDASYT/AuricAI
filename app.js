'use strict';
(async function publishAuricDownloads(){
  const status=document.getElementById('downloadStatus');
  const links=[...document.querySelectorAll('a[data-platform]')];
  function unavailable(message){
    for(const a of links){a.removeAttribute('href');a.removeAttribute('download');a.setAttribute('aria-disabled','true');a.textContent='Descarga no disponible';}
    if(status)status.textContent=message;
  }
  unavailable('Comprobando la publicación oficial…');
  try{
    const response=await fetch('./release.json',{cache:'no-store'});
    if(!response.ok)throw Error('Falta el manifiesto.');
    const release=await response.json();
    if(release.publicDownloads!==true || release.channel!=='verified' || !/^\d+\.\d+\.\d+$/.test(release.version||''))throw Error('No hay versión pública.');
    for(const platform of ['windows','android']){
      const info=release[platform],a=document.querySelector('a[data-platform="'+platform+'"]');
      const expectedName=platform==='windows'?'AuricAI_'+release.version+'_x64-setup.exe':'AuricAI-'+release.version+'-Android-ARM64.apk';
      if(!info || info.file!==expectedName || !/^[a-f0-9]{64}$/i.test(info.sha256||'') || !Number.isSafeInteger(info.bytes) || info.bytes<100000 || !a)throw Error('Metadatos inválidos.');
      const expected='https://github.com/MIDASYT/AuricAI-Web/releases/download/v'+release.version+'/'+expectedName;
      if(info.url!==expected)throw Error('El enlace no corresponde a la publicación.');
      a.href=expected;
      a.removeAttribute('aria-disabled');
      a.textContent='Descargar '+(platform==='windows'?'EXE':'APK')+' · '+release.version+' ↓';
      const hash=document.querySelector('[data-hash="'+platform+'"]');
      if(hash)hash.textContent='SHA-256: '+info.sha256;
    }
    document.querySelectorAll('[data-version]').forEach(x=>x.textContent=release.version);
    if(status)status.textContent='Descargas públicas verificadas para AuricAI '+release.version+'. Las compilaciones posteriores de desarrollo todavía no son versiones estables.';
  }catch(error){unavailable('No se pudo validar la publicación. Comprueba la disponibilidad del sitio oficial.');}
})();