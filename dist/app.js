const trips = [
  { id: "barcelona", year: "2024", place: "Barcelona", country: "España", image: "./assets/barcelona.jpg", color: "#e76f51", blurb: { es: "Calles de piedra, helados al atardecer y la primera vez que vimos la ciudad desde las alturas.", fr: "Rues de pierre, glaces au coucher du soleil et notre première vue de la ville depuis les hauteurs." } },
  { id: "quebec", year: "2024", place: "Québec", country: "Canadá", image: "./assets/quebec.jpg", color: "#4f89a7", blurb: { es: "Un fin de semana de nieve, chocolate caliente y caminatas entre pinos.", fr: "Un week-end de neige, de chocolat chaud et de promenades parmi les pins." } },
  { id: "costa-rica", year: "2025", place: "Monteverde", country: "Costa Rica", image: "./assets/costa-rica.jpg", color: "#4f8a66", blurb: { es: "Puentes suspendidos, lluvia tibia y una cascada escondida en el bosque.", fr: "Ponts suspendus, pluie chaude et cascade cachée dans la forêt." } },
  { id: "kyoto", year: "2026", place: "Kyoto", country: "Japón", image: "./assets/kyoto.jpg", color: "#d9768b", blurb: { es: "Mañanas tranquilas, cerezos en flor y caminos que parecían detener el tiempo.", fr: "Matins calmes, cerisiers en fleurs et chemins où le temps semblait s'arrêter." } },
];

const memories = [
  ["bcn-1","barcelona","La bajada dorada","La descente dorée","Una caminata sin prisa antes de cenar.","Une promenade sans hâte avant le dîner.","atardecer calle familia","./assets/barcelona.jpg"],
  ["bcn-2","barcelona","La ciudad a nuestros pies","La ville à nos pieds","El momento en que todos guardamos silencio.","Le moment où nous sommes tous restés silencieux.","vista ciudad arquitectura","./assets/barcelona-2.jpg"],
  ["bcn-3","barcelona","Camino al parque","En route vers le parc","La mejor ruta fue la que no estaba planeada.","Le meilleur chemin n'était pas prévu.","parque paseo aventura","./assets/barcelona-3.jpg"],
  ["que-1","quebec","Huellas en la nieve","Traces dans la neige","Seguimos el sendero hasta encontrar la cabaña.","Nous avons suivi le sentier jusqu'à la cabane.","nieve sendero invierno","./assets/quebec.jpg"],
  ["que-2","quebec","El lago helado","Le lac gelé","Una pausa frente al paisaje más silencioso.","Une pause devant le paysage le plus silencieux.","lago montaña nieve","./assets/quebec-2.jpg"],
  ["que-3","quebec","Regreso a la cabaña","Retour à la cabane","Guantes mojados y chocolate caliente esperándonos.","Gants mouillés et chocolat chaud nous attendaient.","cabaña bosque chocolate","./assets/quebec-3.jpg"],
  ["cr-1","costa-rica","Sobre el bosque","Au-dessus de la forêt","Cruzamos juntos aunque alguno miró poco hacia abajo.","Nous avons traversé ensemble, même si certains ont peu regardé en bas.","puente selva familia","./assets/costa-rica.jpg"],
  ["cr-2","costa-rica","La cascada escondida","La cascade cachée","La escuchamos antes de verla.","Nous l'avons entendue avant de la voir.","cascada agua bosque","./assets/costa-rica-2.jpg"],
  ["cr-3","costa-rica","Después de la lluvia","Après la pluie","Todo olía a tierra y hojas nuevas.","Tout sentait la terre et les feuilles neuves.","lluvia hojas naturaleza","./assets/costa-rica-3.jpg"],
  ["kyo-1","kyoto","Pétalos en el camino","Pétales sur le chemin","La primavera nos acompañó durante todo el paseo.","Le printemps nous a accompagnés pendant toute la promenade.","primavera flores camino","./assets/kyoto.jpg"],
  ["kyo-2","kyoto","La mañana quieta","Le matin tranquille","Llegamos antes que la ciudad despertara.","Nous sommes arrivés avant le réveil de la ville.","mañana templo calma","./assets/kyoto-2.jpg"],
  ["kyo-3","kyoto","Bajo los cerezos","Sous les cerisiers","Elegimos este instante para recordar el viaje.","Nous avons choisi cet instant pour nous souvenir du voyage.","cerezos familia flores","./assets/kyoto-3.jpg"],
].map((m, index) => {
  const trip = trips.find(t => t.id === m[1]);
  return { id:m[0], tripId:m[1], title:{es:m[2],fr:m[3]}, caption:{es:m[4],fr:m[5]}, tags:m[6], image:m[7] || trip.image, place:trip.place, year:trip.year, index };
});

const contributions = [
  { id:"contrib-1", tripId:"barcelona", author:"Sofía", title:{es:"La curva del parque",fr:"La courbe du parc"}, caption:{es:"Una foto enviada desde otro teléfono.",fr:"Une photo envoyée depuis un autre téléphone."}, image:"./assets/barcelona.jpg", crop:"78% center" },
  { id:"contrib-2", tripId:"costa-rica", author:"Mateo", title:{es:"El sonido del agua",fr:"Le bruit de l'eau"}, caption:{es:"El momento que faltaba en la historia.",fr:"Le moment qui manquait à l'histoire."}, image:"./assets/costa-rica.jpg", crop:"72% center" },
  { id:"contrib-3", tripId:"kyoto", author:"Sofía", title:{es:"Pétalos al vuelo",fr:"Pétales au vent"}, caption:{es:"Recibida después de volver del viaje.",fr:"Reçue après le retour du voyage."}, image:"./assets/kyoto.jpg", crop:"20% center" },
];
let contributionState = JSON.parse(localStorage.getItem('rumbo-contributions') || '{}');

const ui = {
  es: { gateEyebrow:"ATLAS FAMILIAR · DEMOSTRACIÓN", gateTitle:"Los recuerdos merecen un lugar al que volver.", gateCopy:"Introduce el código de demostración para recorrer una familia y unos viajes completamente ficticios.", codeLabel:"Código de acceso", enter:"Entrar", demoCode:"Código de prueba:", navAtlas:"Atlas", navContributions:"Aportes", navMemories:"Recuerdos", navCapsule:"Cápsula", heroEyebrow:"UN HOGAR PARA CADA AVENTURA", heroTitle:"Nuestra historia también se mide en lugares.", heroCopy:"Rumbo reúne fotos dispersas, las ordena por viaje y las convierte en pequeñas historias que la familia puede revivir desde cualquier país.", explore:"Explorar el atlas", createCapsule:"Crear una cápsula", trips:"viajes", memories:"recuerdos", continents:"continentes", atlasEyebrow:"EL MAPA DE LOS RECUERDOS", atlasTitle:"Cuatro viajes, una historia compartida.", atlasCopy:"Selecciona un punto para descubrir el viaje y saltar directamente a sus recuerdos.", globeTitle:"Globo de recuerdos", globeHelp:"Arrastra para girar · pulsa un destino", contribEyebrow:"UNA SOLA BANDEJA PARA TODA LA FAMILIA", contribTitle:"Cada teléfono guarda una parte del viaje.", contribCopy:"Los familiares envían sus fotos a una bandeja común. Quien organiza el álbum revisa cada aporte, lo asigna al viaje correcto y lo publica sin perseguir archivos por varios chats.", flowSend:"La familia aporta", flowSendCopy:"desde distintos teléfonos", flowReview:"Se revisa", flowReviewCopy:"antes de publicar", flowAlbum:"El álbum crece", flowAlbumCopy:"ordenado y compartible", sharedInbox:"BANDEJA COMPARTIDA", pending:"aportes pendientes", demo:"Demo", integrated:"integrados en el álbum", resetDemo:"Reiniciar demo", accept:"Integrar", dismiss:"Omitir", accepted:"Integrado", dismissed:"Omitido", memoriesEyebrow:"BUSCAR · RECORDAR · COMPARTIR", memoriesTitle:"Encuentra un momento, no una carpeta.", memoriesCopy:"Filtra por destino o escribe una palabra. Marca tus favoritos para crear una cápsula familiar.", searchLabel:"Buscar recuerdos", searchPlaceholder:"Buscar: nieve, puente, primavera…", favorites:"Favoritos", results:"recuerdos encontrados", emptyTitle:"Ese recuerdo todavía no aparece.", emptyCopy:"Prueba otra palabra o elimina los filtros.", capsuleEyebrow:"LA FUNCIÓN QUE ACERCA A LA FAMILIA", capsuleTitle:"Crea una cápsula para alguien que está lejos.", capsuleCopy:"Elige hasta seis recuerdos, escribe una dedicatoria y genera un enlace ligero. Quien lo reciba verá una historia breve, sin buscar entre cientos de archivos.", stepOne:"Marca recuerdos con el corazón.", stepTwo:"Añade un mensaje personal.", stepThree:"Genera y copia el enlace.", yourSelection:"TU SELECCIÓN", selected:"recuerdos", clear:"Vaciar", selectionEmpty:"Todavía no has marcado recuerdos.", messageLabel:"Dedicatoria", messagePlaceholder:"Abuela, escogimos estos momentos para que viajes con nosotros…", generateLink:"Generar enlace", shareReady:"Enlace listo para compartir", copy:"Copiar", preview:"Ver la cápsula", continueSite:"Continuar a Rumbo", footer:"Prototipo de competencia · Todos los nombres, imágenes y datos son ficticios.", backTop:"Volver arriba ↑", all:"Todos", view:"Ver recuerdos →", add:"Añadir a la cápsula", remove:"Quitar de la cápsula", wrong:"El código no coincide. Prueba VIAJE.", max:"La cápsula admite un máximo de seis recuerdos.", choose:"Marca al menos un recuerdo para crear la cápsula.", copied:"Enlace copiado.", capsuleFor:"Una cápsula para ti", fromFamily:"Una pequeña historia compartida por la familia", closeSession:"Cerrar sesión" },
  fr: { gateEyebrow:"ATLAS FAMILIAL · DÉMONSTRATION", gateTitle:"Les souvenirs méritent un lieu où revenir.", gateCopy:"Entrez le code de démonstration pour découvrir une famille et des voyages entièrement fictifs.", codeLabel:"Code d'accès", enter:"Entrer", demoCode:"Code d'essai :", navAtlas:"Atlas", navContributions:"Contributions", navMemories:"Souvenirs", navCapsule:"Capsule", heroEyebrow:"UN FOYER POUR CHAQUE AVENTURE", heroTitle:"Notre histoire se mesure aussi en lieux.", heroCopy:"Rumbo rassemble les photos dispersées, les organise par voyage et les transforme en petites histoires que la famille peut revivre depuis n'importe quel pays.", explore:"Explorer l'atlas", createCapsule:"Créer une capsule", trips:"voyages", memories:"souvenirs", continents:"continents", atlasEyebrow:"LA CARTE DES SOUVENIRS", atlasTitle:"Quatre voyages, une histoire partagée.", atlasCopy:"Choisissez un point pour découvrir le voyage et accéder directement à ses souvenirs.", globeTitle:"Globe des souvenirs", globeHelp:"Faites glisser pour tourner · choisissez une destination", contribEyebrow:"UNE SEULE BOÎTE POUR TOUTE LA FAMILLE", contribTitle:"Chaque téléphone garde une partie du voyage.", contribCopy:"Les proches envoient leurs photos dans une boîte commune. La personne qui organise vérifie chaque contribution, l associe au bon voyage et la publie sans chercher des fichiers dans plusieurs discussions.", flowSend:"La famille contribue", flowSendCopy:"depuis différents téléphones", flowReview:"On vérifie", flowReviewCopy:"avant de publier", flowAlbum:"L album grandit", flowAlbumCopy:"classé et partageable", sharedInbox:"BOÎTE PARTAGÉE", pending:"contributions en attente", demo:"Démo", integrated:"intégrées à l album", resetDemo:"Réinitialiser", accept:"Intégrer", dismiss:"Ignorer", accepted:"Intégrée", dismissed:"Ignorée", memoriesEyebrow:"CHERCHER · SE SOUVENIR · PARTAGER", memoriesTitle:"Retrouvez un moment, pas un dossier.", memoriesCopy:"Filtrez par destination ou saisissez un mot. Ajoutez vos favoris pour créer une capsule familiale.", searchLabel:"Chercher des souvenirs", searchPlaceholder:"Chercher : neige, pont, printemps…", favorites:"Favoris", results:"souvenirs trouvés", emptyTitle:"Ce souvenir n'apparaît pas encore.", emptyCopy:"Essayez un autre mot ou retirez les filtres.", capsuleEyebrow:"LA FONCTION QUI RAPPROCHE LA FAMILLE", capsuleTitle:"Créez une capsule pour quelqu'un qui est loin.", capsuleCopy:"Choisissez jusqu'à six souvenirs, écrivez un message et générez un lien léger. La personne qui le reçoit verra une histoire courte sans fouiller des centaines de fichiers.", stepOne:"Marquez les souvenirs avec le cœur.", stepTwo:"Ajoutez un message personnel.", stepThree:"Générez et copiez le lien.", yourSelection:"VOTRE SÉLECTION", selected:"souvenirs", clear:"Vider", selectionEmpty:"Vous n'avez pas encore marqué de souvenirs.", messageLabel:"Dédicace", messagePlaceholder:"Mamie, nous avons choisi ces moments pour que tu voyages avec nous…", generateLink:"Générer le lien", shareReady:"Lien prêt à partager", copy:"Copier", preview:"Voir la capsule", continueSite:"Continuer vers Rumbo", footer:"Prototype de concours · Tous les noms, images et données sont fictifs.", backTop:"Retour en haut ↑", all:"Tous", view:"Voir les souvenirs →", add:"Ajouter à la capsule", remove:"Retirer de la capsule", wrong:"Le code ne correspond pas. Essayez VIAJE.", max:"La capsule accepte au maximum six souvenirs.", choose:"Marquez au moins un souvenir pour créer la capsule.", copied:"Lien copié.", capsuleFor:"Une capsule pour vous", fromFamily:"Une petite histoire partagée par la famille", closeSession:"Fermer la session" }
};

let lang = localStorage.getItem("rumbo-lang") || "es";
let filter = "all";
let favorites = new Set(JSON.parse(localStorage.getItem("rumbo-favorites") || "[]"));
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const t = key => ui[lang][key] || key;

function setLanguage(next) {
  lang = next; localStorage.setItem("rumbo-lang", lang); document.documentElement.lang = lang;
  $$('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
  $$('[data-i18n-placeholder]').forEach(el => el.placeholder = t(el.dataset.i18nPlaceholder));
  $$('.language').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  $('#lock-button').setAttribute('aria-label', t('closeSession'));
  renderFilters(); renderAtlas(document.querySelector('.globe-destination.active')?.dataset.trip || 'costa-rica'); renderContributions(); renderMemories(); renderCapsule();
}

function renderFilters() {
  $('#filters').innerHTML = [{id:'all',place:t('all')}, ...trips].map(item => `<button type="button" class="filter ${filter===item.id?'active':''}" data-filter="${item.id}">${item.place}</button>`).join('');
  $$('#filters .filter').forEach(b => b.addEventListener('click', () => { filter=b.dataset.filter; renderFilters(); renderMemories(); }));
}

function renderAtlas(id='costa-rica') {
  const trip = trips.find(t => t.id === id) || trips[0];
  $$('.globe-destination').forEach(p => p.classList.toggle('active', p.dataset.trip === trip.id));
  focusGlobeTrip(trip.id);
  $('#atlas-detail').innerHTML = `<img src="${trip.image}" alt="${trip.place}"><div><small>${trip.country} · ${trip.year}</small><h3>${trip.place}</h3><p>${trip.blurb[lang]}</p><a href="#recuerdos" data-atlas-filter="${trip.id}">${t('view')}</a></div>`;
  $('[data-atlas-filter]').addEventListener('click', () => { filter=trip.id; renderFilters(); renderMemories(); });
}

const globeDestinations = {
  quebec: { lon:-71.21, lat:46.81, color:'#4f89a7' },
  'costa-rica': { lon:-84.09, lat:9.93, color:'#4f8a66' },
  barcelona: { lon:2.17, lat:41.38, color:'#e76f51' },
  kyoto: { lon:135.77, lat:35.01, color:'#d9768b' }
};

const globeState = { lon:-28, lat:15, targetLon:null, targetLat:null, dragging:false, moved:false, lastX:0, lastY:0, pinPositions:[] };

function insideEllipse(lon, lat, centerLon, centerLat, radiusLon, radiusLat, rotation=0) {
  const a=rotation*Math.PI/180, x=lon-centerLon, y=lat-centerLat;
  const xr=x*Math.cos(a)+y*Math.sin(a), yr=-x*Math.sin(a)+y*Math.cos(a);
  return (xr*xr)/(radiusLon*radiusLon)+(yr*yr)/(radiusLat*radiusLat) <= 1;
}

function looksLikeLand(lon, lat) {
  return insideEllipse(lon,lat,-108,48,45,26,-12) ||
    insideEllipse(lon,lat,-78,20,16,24,-30) ||
    insideEllipse(lon,lat,-61,-17,19,36,-12) ||
    insideEllipse(lon,lat,14,50,25,14,5) ||
    insideEllipse(lon,lat,19,7,23,34,8) ||
    insideEllipse(lon,lat,82,45,60,24,-4) ||
    insideEllipse(lon,lat,112,17,32,18,-10) ||
    insideEllipse(lon,lat,134,-25,19,13,8) ||
    insideEllipse(lon,lat,47,-19,5,9,12);
}

const globeLandDots = [];
for (let lat=-58; lat<=74; lat+=3.4) for (let lon=-178; lon<180; lon+=3.6) {
  if (looksLikeLand(lon,lat)) globeLandDots.push({lon:lon+Math.sin(lat*.7)*.8,lat});
}

function initGlobe() {
  const canvas=$('#travel-globe');
  if (!canvas) return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pointer=(event)=>{
    const rect=canvas.getBoundingClientRect();
    return {x:event.clientX-rect.left,y:event.clientY-rect.top};
  };
  canvas.addEventListener('pointerdown',event=>{
    const p=pointer(event); globeState.dragging=true; globeState.moved=false; globeState.lastX=p.x; globeState.lastY=p.y; globeState.targetLon=null; canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove',event=>{
    if(!globeState.dragging) return;
    const p=pointer(event), dx=p.x-globeState.lastX, dy=p.y-globeState.lastY;
    if(Math.abs(dx)+Math.abs(dy)>2) globeState.moved=true;
    globeState.lon-=dx*.32; globeState.lat=Math.max(-45,Math.min(55,globeState.lat+dy*.22)); globeState.lastX=p.x; globeState.lastY=p.y;
  });
  canvas.addEventListener('pointerup',event=>{
    const p=pointer(event); globeState.dragging=false;
    if(!globeState.moved) {
      const hit=globeState.pinPositions.find(pin=>Math.hypot(pin.x-p.x,pin.y-p.y)<28);
      if(hit) renderAtlas(hit.id);
    }
  });
  canvas.addEventListener('pointercancel',()=>globeState.dragging=false);
  canvas.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;
    event.preventDefault(); globeState.targetLon=null;
    if(event.key==='ArrowLeft') globeState.lon-=8;
    if(event.key==='ArrowRight') globeState.lon+=8;
    if(event.key==='ArrowUp') globeState.lat=Math.max(-45,globeState.lat-5);
    if(event.key==='ArrowDown') globeState.lat=Math.min(55,globeState.lat+5);
  });
  const observer=new ResizeObserver(()=>drawGlobe()); observer.observe(canvas);
  function animate(){
    if(globeState.targetLon!==null){
      let delta=((globeState.targetLon-globeState.lon+540)%360)-180;
      globeState.lon+=delta*.075; globeState.lat+=(globeState.targetLat-globeState.lat)*.075;
      if(Math.abs(delta)<.15 && Math.abs(globeState.targetLat-globeState.lat)<.15){globeState.lon=globeState.targetLon;globeState.lat=globeState.targetLat;globeState.targetLon=null;}
    } else if(!globeState.dragging && !reduced) globeState.lon+=.035;
    drawGlobe(); requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

function focusGlobeTrip(id) {
  const point=globeDestinations[id]; if(!point) return;
  globeState.targetLon=point.lon; globeState.targetLat=Math.max(-25,Math.min(32,point.lat*.35));
}

function drawGlobe() {
  const canvas=$('#travel-globe'); if(!canvas) return;
  const rect=canvas.getBoundingClientRect(); if(!rect.width||!rect.height) return;
  const dpr=Math.min(devicePixelRatio||1,2), width=rect.width, height=rect.height;
  if(canvas.width!==Math.round(width*dpr)||canvas.height!==Math.round(height*dpr)){canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);}
  const ctx=canvas.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,width,height);
  const radius=Math.min(width*.39,height*.38), cx=width*.5, cy=height*.48;
  const project=(lon,lat)=>{
    const lambda=(lon-globeState.lon)*Math.PI/180, phi=lat*Math.PI/180, tilt=globeState.lat*Math.PI/180;
    const x=Math.cos(phi)*Math.sin(lambda);
    const y=Math.sin(phi)*Math.cos(tilt)-Math.cos(phi)*Math.cos(lambda)*Math.sin(tilt);
    const z=Math.sin(phi)*Math.sin(tilt)+Math.cos(phi)*Math.cos(lambda)*Math.cos(tilt);
    return {x:cx+radius*x,y:cy-radius*y,z};
  };
  const glow=ctx.createRadialGradient(cx,cy,radius*.65,cx,cy,radius*1.28); glow.addColorStop(0,'rgba(80,206,191,.12)'); glow.addColorStop(.76,'rgba(35,150,149,.08)'); glow.addColorStop(1,'rgba(35,150,149,0)'); ctx.fillStyle=glow; ctx.beginPath(); ctx.arc(cx,cy,radius*1.3,0,Math.PI*2); ctx.fill();
  const ocean=ctx.createRadialGradient(cx-radius*.34,cy-radius*.38,radius*.08,cx,cy,radius); ocean.addColorStop(0,'#2b7880'); ocean.addColorStop(.5,'#17525a'); ocean.addColorStop(1,'#092b32'); ctx.fillStyle=ocean; ctx.beginPath(); ctx.arc(cx,cy,radius,0,Math.PI*2); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,radius,0,Math.PI*2); ctx.clip();
  const strokeCurve=(points,color,widthLine)=>{
    ctx.strokeStyle=color; ctx.lineWidth=widthLine; ctx.beginPath(); let drawing=false;
    points.forEach(item=>{const p=project(item.lon,item.lat); if(p.z>.015){if(!drawing){ctx.moveTo(p.x,p.y);drawing=true;}else ctx.lineTo(p.x,p.y);}else drawing=false;}); ctx.stroke();
  };
  for(let lat=-60;lat<=60;lat+=20){const pts=[];for(let lon=-180;lon<=180;lon+=4)pts.push({lon,lat});strokeCurve(pts,'rgba(171,224,215,.15)',.7);}
  for(let lon=-180;lon<180;lon+=30){const pts=[];for(let lat=-85;lat<=85;lat+=3)pts.push({lon,lat});strokeCurve(pts,'rgba(171,224,215,.12)',.7);}
  globeLandDots.forEach(dot=>{const p=project(dot.lon,dot.lat);if(p.z<=0)return;ctx.globalAlpha=.28+p.z*.55;ctx.fillStyle='#d9e5ce';ctx.beginPath();ctx.arc(p.x,p.y,.75+p.z*1.15,0,Math.PI*2);ctx.fill();});ctx.globalAlpha=1;
  const shade=ctx.createLinearGradient(cx-radius,cy,cx+radius,cy);shade.addColorStop(0,'rgba(1,15,18,.42)');shade.addColorStop(.48,'rgba(1,15,18,0)');shade.addColorStop(1,'rgba(1,15,18,.5)');ctx.fillStyle=shade;ctx.fillRect(cx-radius,cy-radius,radius*2,radius*2);ctx.restore();
  ctx.strokeStyle='rgba(165,237,224,.34)';ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(cx,cy,radius,0,Math.PI*2);ctx.stroke();
  globeState.pinPositions=[];
  Object.entries(globeDestinations).forEach(([id,destination])=>{
    const p=project(destination.lon,destination.lat); if(p.z<.05)return;
    const trip=trips.find(item=>item.id===id), active=document.querySelector(`.globe-destination[data-trip="${id}"]`)?.classList.contains('active');
    const pulse=active?9+Math.sin(Date.now()/260)*2:7;ctx.fillStyle=`${destination.color}45`;ctx.beginPath();ctx.arc(p.x,p.y,pulse,0,Math.PI*2);ctx.fill();ctx.fillStyle=destination.color;ctx.beginPath();ctx.arc(p.x,p.y,4.8,0,Math.PI*2);ctx.fill();ctx.strokeStyle='white';ctx.lineWidth=2;ctx.stroke();
    ctx.font='600 11px DM Sans, sans-serif';const text=trip.place, tw=ctx.measureText(text).width;ctx.fillStyle='rgba(7,31,35,.86)';ctx.beginPath();ctx.roundRect(p.x-tw/2-7,p.y+10,tw+14,23,11);ctx.fill();ctx.fillStyle='white';ctx.textAlign='center';ctx.fillText(text,p.x,p.y+26);globeState.pinPositions.push({id,x:p.x,y:p.y});
  });
}

function contributionMemories() {
  return contributions.map((c, index) => {
    const trip = trips.find(t => t.id === c.tripId);
    return { ...c, place:trip.place, year:trip.year, tags:`aporte ${c.author} ${trip.place}`, index:index+12 };
  });
}

function allPossibleMemories() { return [...memories, ...contributionMemories()]; }
function allMemories() { return [...memories, ...contributionMemories().filter(m => contributionState[m.id] === 'accepted')]; }

function renderContributions() {
  const pending = contributions.filter(c => !contributionState[c.id]).length;
  const accepted = contributions.filter(c => contributionState[c.id] === 'accepted').length;
  $('#pending-count').textContent = pending;
  $('#accepted-count').textContent = accepted;
  $('#hero-memory-count').textContent = memories.length + accepted;
  $('#contribution-list').innerHTML = contributions.map(c => {
    const state = contributionState[c.id];
    const trip = trips.find(t => t.id === c.tripId);
    return `<article class="contribution ${state === 'dismissed' ? 'dismissed' : ''}"><img src="${c.image}" style="object-position:${c.crop}" alt="${c.title[lang]}"><div><small>${c.author} · ${trip.place}</small><h4>${c.title[lang]}</h4><p>${c.caption[lang]}</p></div>${state ? `<span class="contribution-status">${t(state)}</span>` : `<div class="contribution-actions"><button type="button" class="accept" data-contribution="${c.id}" data-status="accepted" aria-label="${t('accept')}" title="${t('accept')}">✓</button><button type="button" data-contribution="${c.id}" data-status="dismissed" aria-label="${t('dismiss')}" title="${t('dismiss')}">×</button></div>`}</article>`;
  }).join('');
  $$('[data-contribution]').forEach(button => button.addEventListener('click', () => setContributionStatus(button.dataset.contribution, button.dataset.status)));
}

function setContributionStatus(id, status) {
  contributionState[id] = status;
  localStorage.setItem('rumbo-contributions', JSON.stringify(contributionState));
  renderContributions(); renderMemories(); renderCapsule();
  if (status === 'accepted') toast(t('accepted'));
}

function visibleMemories() {
  const q = $('#search').value.trim().toLowerCase();
  return allMemories().filter(m => (filter==='all' || m.tripId===filter) && (!q || `${m.title[lang]} ${m.caption[lang]} ${m.tags} ${m.place}`.toLowerCase().includes(q)));
}

function renderMemories() {
  const list = visibleMemories(); $('#result-count').textContent = list.length; $('#empty-state').hidden = list.length>0;
  $('#memory-grid').innerHTML = list.map(m => `<article class="memory-card" data-memory="${m.id}" data-index="${m.index%3}" tabindex="0"><button type="button" class="heart ${favorites.has(m.id)?'active':''}" data-heart="${m.id}" aria-label="${favorites.has(m.id)?t('remove'):t('add')}" aria-pressed="${favorites.has(m.id)}">♥</button><div class="memory-image"><img src="${m.image}" alt="${m.title[lang]}" loading="lazy"></div><div class="memory-body"><small>${m.place} · ${m.year}</small><h3>${m.title[lang]}</h3><p>${m.caption[lang]}</p></div></article>`).join('');
  $$('.memory-card').forEach(card => { card.addEventListener('click', e => { if(!e.target.closest('.heart')) openMemory(card.dataset.memory); }); card.addEventListener('keydown', e => { if(e.key==='Enter') openMemory(card.dataset.memory); }); });
  $$('[data-heart]').forEach(b => b.addEventListener('click', () => toggleFavorite(b.dataset.heart)));
  updateFavoriteCount();
}

function toggleFavorite(id) {
  if (favorites.has(id)) favorites.delete(id); else { if (favorites.size>=6) return toast(t('max')); favorites.add(id); }
  localStorage.setItem('rumbo-favorites', JSON.stringify([...favorites])); renderMemories(); renderCapsule();
}

function updateFavoriteCount() { $('#favorite-count').textContent=favorites.size; $('#capsule-count').textContent=favorites.size; }

function renderCapsule() {
  const selected = allPossibleMemories().filter(m => favorites.has(m.id)); updateFavoriteCount();
  $('#capsule-strip').innerHTML = selected.length ? selected.map(m => `<div class="capsule-thumb"><img src="${m.image}" alt="${m.title[lang]}"><button type="button" data-remove="${m.id}" aria-label="${t('remove')}">×</button></div>`).join('') : `<p>${t('selectionEmpty')}</p>`;
  $$('[data-remove]').forEach(b => b.addEventListener('click', () => toggleFavorite(b.dataset.remove)));
}

function openMemory(id) {
  const m=allPossibleMemories().find(x=>x.id===id); const trip=trips.find(x=>x.id===m.tripId); const modal=$('#memory-modal');
  $('#modal-content').innerHTML=`<div class="modal-memory"><img src="${m.image}" alt="${m.title[lang]}"><div class="modal-copy"><p class="eyebrow">${trip.country} · ${m.year}</p><h2>${m.title[lang]}</h2><p>${m.caption[lang]} ${trip.blurb[lang]}</p><button class="button ${favorites.has(m.id)?'button-ink':'button-coral'}" type="button" data-modal-heart="${m.id}">${favorites.has(m.id)?t('remove'):t('add')}</button></div></div>`;
  $('[data-modal-heart]').addEventListener('click', ()=>{ toggleFavorite(m.id); modal.close(); }); modal.showModal();
}

function capsulePayload() { return { ids:[...favorites], message:$('#capsule-message').value.trim(), lang }; }
function encodeCapsule(data) { return btoa(unescape(encodeURIComponent(JSON.stringify(data)))); }
function decodeCapsule(value) { try { return JSON.parse(decodeURIComponent(escape(atob(value)))); } catch { return null; } }
function generateLink() {
  if(!favorites.size) return toast(t('choose'));
  const url=`${location.origin}${location.pathname}#capsule=${encodeCapsule(capsulePayload())}`; $('#share-url').value=url; $('#share-result').hidden=false; history.replaceState(null,'',`#capsule=${encodeCapsule(capsulePayload())}`); previewCapsule(capsulePayload());
}
function previewCapsule(data, open=true, recipient=false) {
  const selected=(data.ids||[]).map(id=>allPossibleMemories().find(m=>m.id===id)).filter(Boolean); if(!selected.length) return;
  const shareUrl=$('#share-url').value || location.href;
  const action=recipient
    ? `<div class="capsule-continue"><button class="button button-coral" id="capsule-continue" type="button">${t('continueSite')} →</button></div>`
    : `<div class="capsule-share"><label for="modal-share-url">${t('shareReady')}</label><div><input id="modal-share-url" value="${escapeHTML(shareUrl)}" readonly><button class="button button-coral" id="modal-copy-link" type="button">${t('copy')}</button></div></div>`;
  $('#capsule-preview-content').innerHTML=`<article class="capsule-story"><header><p class="eyebrow">RUMBO · ${t('capsuleFor')}</p><h2>${t('fromFamily')}</h2>${data.message?`<blockquote>“${escapeHTML(data.message)}”</blockquote>`:''}</header><div class="story-grid">${selected.map(m=>`<figure><img src="${m.image}" alt="${m.title[lang]}"><figcaption>${m.title[lang]} · ${m.place}</figcaption></figure>`).join('')}</div>${action}</article>`;
  $('#capsule-modal').dataset.recipient=recipient?'true':'false';
  if(recipient) $('#capsule-continue').addEventListener('click',continueFromCapsule);
  else $('#modal-copy-link').addEventListener('click',()=>copyCapsuleLink(shareUrl,'#modal-share-url'));
  if(open) $('#capsule-modal').showModal();
}
function escapeHTML(str) { const el=document.createElement('div'); el.textContent=str; return el.innerHTML; }
function toast(message) { const el=$('#toast'); el.textContent=message; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),2400); }
async function copyCapsuleLink(url,inputSelector='#share-url') { try { await navigator.clipboard.writeText(url); toast(t('copied')); } catch { $(inputSelector).select(); document.execCommand('copy'); toast(t('copied')); } }
function continueFromCapsule() {
  const modal=$('#capsule-modal');
  if(modal.open) modal.close();
  sessionStorage.removeItem('rumbo-unlocked');
  $('#app').hidden=true;
  $('#gate').hidden=false;
  $('#access-code').value='';
  $('#gate-error').textContent='';
  history.replaceState(null,'',location.pathname);
  window.scrollTo(0,0);
  $('#access-code').focus();
}

function unlock(scrollToStory=false) {
  $('#gate').hidden=true;
  $('#app').hidden=false;
  sessionStorage.setItem('rumbo-unlocked','1');
  window.scrollTo(0,0);
  if(scrollToStory) requestAnimationFrame(()=>document.querySelector('#inicio h1').scrollIntoView({behavior:'smooth',block:'center'}));
}
$('#gate-form').addEventListener('submit', e => { e.preventDefault(); if($('#access-code').value.trim().toUpperCase()==='VIAJE') { $('#gate-error').textContent=''; unlock(true); } else $('#gate-error').textContent=t('wrong'); });
$('#fill-code').addEventListener('click',()=>{ $('#access-code').value='VIAJE'; $('#access-code').focus(); });
$('#lock-button').addEventListener('click',()=>{ sessionStorage.removeItem('rumbo-unlocked'); $('#app').hidden=true; $('#gate').hidden=false; $('#access-code').value=''; });
$$('.language').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lang)));
$$('.globe-destination').forEach(p=>p.addEventListener('click',()=>renderAtlas(p.dataset.trip)));
$('#search').addEventListener('input',renderMemories);
$('#favorites-shortcut').addEventListener('click',()=>document.querySelector('#capsula').scrollIntoView());
$('#clear-favorites').addEventListener('click',()=>{ favorites.clear(); localStorage.setItem('rumbo-favorites','[]'); renderMemories(); renderCapsule(); $('#share-result').hidden=true; });
$('#reset-contributions').addEventListener('click',()=>{ contributionState={}; localStorage.removeItem('rumbo-contributions'); renderContributions(); renderMemories(); renderCapsule(); });
$('#capsule-message').addEventListener('input',e=>$('#message-count').textContent=e.target.value.length);
$('#create-capsule').addEventListener('click',generateLink);
$('#preview-capsule').addEventListener('click',()=>previewCapsule(capsulePayload()));
$('#copy-link').addEventListener('click',()=>copyCapsuleLink($('#share-url').value));
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>{ const d=b.closest('dialog'); if(d.id==='capsule-modal'&&d.dataset.recipient==='true') continueFromCapsule(); else d.close(); }));
$$('dialog').forEach(d=>d.addEventListener('click',e=>{ if(e.target===d) { if(d.id==='capsule-modal'&&d.dataset.recipient==='true') continueFromCapsule(); else d.close(); } }));

initGlobe();
setLanguage(lang);
if(sessionStorage.getItem('rumbo-unlocked')==='1') unlock();
const shared=location.hash.startsWith('#capsule=')?decodeCapsule(location.hash.slice(9)):null;
if(shared?.ids?.length) { favorites=new Set(shared.ids.slice(0,6)); localStorage.setItem('rumbo-favorites',JSON.stringify([...favorites])); $('#capsule-message').value=shared.message||''; $('#message-count').textContent=($('#capsule-message').value||'').length; renderMemories(); renderCapsule(); setTimeout(()=>previewCapsule(shared,true,true),400); }
