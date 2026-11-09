# AuricAI-Web — sitio de trabajo privado

**Repositorio privado de trabajo.** El sitio real se aloja en **Firebase Hosting**, no en GitHub Pages. Proyecto Firebase comunicado: `auric-apps-cloud`. Site ID: `auric-ai-web`. Dominio esperado: `https://auric-ai-web.web.app/` (verificar en Firebase después de desplegar).

Fuente web: `./` y sus archivos `index.html`, `instalar.html`, `style.css`, `app.js`, `assets/`, `release.json`. La carpeta `archivo/` no se sirve públicamente y contiene material histórico. El despliegue real se realiza desde el workflow centralizado en `MIDASYT/AuricAIPrivado/.github/workflows/deploy-shared-firebase.yml`, que tiene acceso autorizado a las dos webs privadas y a las credenciales protegidas de Firebase. Un commit en este repositorio privado de trabajo no equivale a un despliegue: es necesario ejecutar el workflow central. No reactivar Pages.

**Reglas de imagen y descarga:** tomar como referencia exacta la estructura y diseño de la web de AuricTurrets (solo lectura, jamás modificar). Portada con botones que van a `#descargar`; tarjetas por SO que ofrecen descarga directa solo si el EXE/APK está públicamente alojado, firmado/verificado, no mediante GitHub Releases privados; guía de instalación independiente; iconos oficiales; capturas REALES de las apps. No usar como capturas de app las capturas de navegador de la web. AuricCode y AuricAI deben ser coherentes. AuricQR permanece público en GitHub Pages.

**Distribución:** ahora los repositorios de las webs AuricAI-Web y AuricCode-Web son privados. Los enlaces antiguos a `MIDASYT/AuricAI` y `MIDASYT/AuricCode` NO constituyen descargas públicas. Marcar `publicDownloads=false` mientras no exista un canal de binarios público verificable. No comprometer credenciales, tokens ni datos de cuentas en HTML, JS o release.json.

La implementación y el contexto privado de las aplicaciones están en `MIDASYT/AuricAIPrivado/versiones/0.2.0/` y `MIDASYT/AuricCodePrivado/versiones/0.19.0/`. Claude devolverá ZIP que ChatGPT integrará, nunca debe editar repositorios.
