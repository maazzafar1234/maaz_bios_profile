/* ---------------- BOOT SEQUENCE ---------------- */
const bootLinesEl = document.getElementById('boot-lines');
const bootScreen = document.getElementById('boot-screen');
const poweron = document.getElementById('poweron');
const bootMessages = [
  "PHOSPHOR-BIOS (C) 2026 MAAZ SYSTEMS",
  "INITIALIZING SYSTEM...",
  "LOADING PROFILE: MAAZ_ZAFAR.SYS",
  "MEMORY CHECK: 8.71 GPA... OK",
  "MOUNTING SKILLS.DLL... OK",
  "MOUNTING EXPERIENCE.LOG... OK",
  "CONNECTING TO ADOBE_ENGAGEMENT.SYS... OK",
  "VERIFYING RAG_MODULE... OK",
  "BOOT COMPLETE."
];
let skipped = false;

function typeLine(lines, i, cb){
  if(skipped) return cb();
  if(i >= lines.length) return cb();
  const line = lines[i];
  let c = 0;
  const speed = 14;
  const interval = setInterval(()=>{
    if(skipped){ clearInterval(interval); return cb(); }
    bootLinesEl.textContent += line[c];
    c++;
    if(c >= line.length){
      clearInterval(interval);
      bootLinesEl.textContent += "\n";
      setTimeout(()=>typeLine(lines, i+1, cb), 90);
    }
  }, speed);
}

function finishBoot(){
  if(bootScreen.classList.contains('hide-boot')) return;
  poweron.classList.add('on');
  bootScreen.classList.add('hide-boot');
  document.body.style.cursor = 'none';
  setTimeout(()=>{ bootScreen.style.display = 'none'; }, 500);
}

typeLine(bootMessages, 0, finishBoot);

function doSkip(){
  if(skipped) return;
  skipped = true;
  finishBoot();
}
window.addEventListener('keydown', doSkip, {once:true});
bootScreen.addEventListener('click', doSkip, {once:true});
setTimeout(()=>{ if(!bootScreen.classList.contains('hide-boot')) finishBoot(); }, 6500);

/* ---------------- custom cursor ---------------- */
const cursorDot = document.getElementById('cursorDot');
window.addEventListener('mousemove', (e)=>{
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top = e.clientY + 'px';
});

/* ---------------- CRT + theme toggles ---------------- */
const crtToggle = document.getElementById('crtToggle');
crtToggle.addEventListener('click', ()=>{
  document.body.classList.toggle('no-crt');
  crtToggle.textContent = document.body.classList.contains('no-crt') ? 'CRT: OFF' : 'CRT: ON';
});
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', ()=>{
  const isAmber = document.documentElement.getAttribute('data-theme') === 'amber';
  document.documentElement.setAttribute('data-theme', isAmber ? '' : 'amber');
  themeToggle.textContent = isAmber ? 'PHOSPHOR: GREEN' : 'PHOSPHOR: AMBER';
});

/* ---------------- typewriter bio ---------------- */
const bioText = "Full Stack Developer (MERN/AWS) who architected a production NGO platform on AWS and shipped an AI-powered support chatbot for Adobe as the sole client-facing engineer on a 3-month engagement. Builds scalable React.js/Node.js applications with TypeScript, RESTful APIs, and cloud infrastructure (AWS, Docker, CI/CD).";
const twEl = document.getElementById('typewriter');
let twIndex = 0;
function typeBio(){
  if(twIndex <= bioText.length){
    twEl.innerHTML = bioText.slice(0, twIndex) + '<span class="type-cursor"></span>';
    twIndex++;
    setTimeout(typeBio, 14);
  }
}
setTimeout(typeBio, 1800);

/* ---------------- dynamic uptime ---------------- */
const startDate = new Date('2025-09-01T00:00:00');
function updateUptime(){
  const now = new Date();
  let diff = Math.floor((now - startDate)/1000);
  const days = Math.floor(diff/86400); diff -= days*86400;
  const hours = Math.floor(diff/3600); diff -= hours*3600;
  const mins = Math.floor(diff/60); diff -= mins*60;
  document.getElementById('uptime').textContent = `${days}d ${hours}h ${mins}m ${diff}s`;
}
updateUptime();
setInterval(updateUptime, 1000);

/* ---------------- flip cards ---------------- */
document.querySelectorAll('.flip-card').forEach(card=>{
  card.addEventListener('click', ()=> card.classList.toggle('flipped'));
  card.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); card.classList.toggle('flipped'); }
  });
  // tilt effect (desktop only)
  if(matchMedia('(hover:hover)').matches){
    card.addEventListener('mousemove', (e)=>{
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left)/rect.width - 0.5;
      const y = (e.clientY - rect.top)/rect.height - 0.5;
      const inner = card.querySelector('.flip-inner');
      const base = card.classList.contains('flipped') ? 180 : 0;
      inner.style.transform = `rotateY(${base + x*10}deg) rotateX(${-y*10}deg)`;
    });
    card.addEventListener('mouseleave', ()=>{
      const inner = card.querySelector('.flip-inner');
      const base = card.classList.contains('flipped') ? 180 : 0;
      inner.style.transform = `rotateY(${base}deg) rotateX(0deg)`;
    });
  }
});

/* ---------------- skill bars fill on view ---------------- */
const skillObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const fill = entry.target.getAttribute('data-fill');
      entry.target.querySelector('.skill-bar-fill').style.width = fill + '%';
      skillObserver.unobserve(entry.target);
    }
  });
},{threshold:0.3});
document.querySelectorAll('[data-fill]').forEach(el=>skillObserver.observe(el));

/* ---------------- reveal on scroll ---------------- */
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){ entry.target.classList.add('in'); revealObserver.unobserve(entry.target); }
  });
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

/* ---------------- contact form: real send via mailto ---------------- */
/*
  This is a static, backend-free site, so the form uses a mailto: link to hand the
  message to the visitor's own email app, pre-addressed and pre-filled, ready to send
  to maazzafar156@gmail.com. This works everywhere with zero setup.

  Want silent/no-redirect delivery instead (message sent straight from the page,
  no mail app popup)? Sign up free at https://formspree.io, create a form pointed at
  maazzafar156@gmail.com, and replace FORMSPREE_ENDPOINT below with your form URL —
  then flip USE_FORMSPREE to true.
*/
const USE_FORMSPREE = false;
const FORMSPREE_ENDPOINT = "https://formspree.io/f/your_form_id";
const DEST_EMAIL = "maazzafar156@gmail.com";

const contactForm = document.getElementById('contactForm');
const sentMsg = document.getElementById('sentMsg');
const fallbackLink = document.getElementById('fallbackMailLink');

contactForm.addEventListener('submit', async (e)=>{
  e.preventDefault();

  const nameEl = document.getElementById('cf_name');
  const emailEl = document.getElementById('cf_email');
  const messageEl = document.getElementById('cf_message');

  // Manual validation (more reliable across browsers than relying on native
  // required-field popups, which can be swallowed inside embedded/sandboxed views)
  if(!nameEl.value.trim() || !emailEl.value.trim() || !messageEl.value.trim()){
    sentMsg.textContent = "✗ FILL IN ALL FIELDS FIRST";
    sentMsg.style.color = "#ff6b6b";
    sentMsg.style.opacity = 1;
    setTimeout(()=>{ sentMsg.style.opacity = 0; sentMsg.style.color = "var(--phosphor)"; }, 3000);
    return;
  }

  const name = nameEl.value.trim();
  const email = emailEl.value.trim();
  const message = messageEl.value.trim();

  if(USE_FORMSPREE){
    try{
      sentMsg.textContent = "▸ TRANSMITTING...";
      sentMsg.style.opacity = 1;
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method:"POST",
        headers:{ "Accept":"application/json" },
        body: new FormData(contactForm)
      });
      if(res.ok){
        sentMsg.textContent = "✓ MESSAGE TRANSMITTED";
        contactForm.reset();
      } else {
        sentMsg.textContent = "✗ TRANSMISSION FAILED — USE THE LINK BELOW";
        fallbackLink.style.display = "inline-flex";
      }
    } catch(err){
      sentMsg.textContent = "✗ TRANSMISSION FAILED — USE THE LINK BELOW";
      fallbackLink.style.display = "inline-flex";
    }
    setTimeout(()=>sentMsg.style.opacity=0, 4500);
    return;
  }

  // Default: mailto handoff, triggered via a temporary real <a> click.
  // This is more reliable than setting window.location.href directly, which
  // some browsers/embedded or sandboxed views (e.g. in-app previews) silently block.
  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
  const mailtoUrl = `mailto:${DEST_EMAIL}?subject=${subject}&body=${body}`;

  const tempLink = document.createElement('a');
  tempLink.href = mailtoUrl;
  tempLink.style.display = 'none';
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);

  // Always show a visible fallback in case no mail client is configured
  // (very common on phones/Chromebooks/embedded browsers), so the message
  // is never silently lost.
  fallbackLink.href = mailtoUrl;
  fallbackLink.style.display = "inline-flex";
  sentMsg.textContent = "✓ OPENING MAIL CLIENT — OR USE THE LINK BELOW";
  sentMsg.style.opacity = 1;
  setTimeout(()=>sentMsg.style.opacity=0, 6000);
});

/* ---------------- resume download ---------------- */
const resumeDownload = document.getElementById('resumeDownload');
const resumeMeta = document.getElementById('resumeMeta');

fetch(resumeDownload.href, { method:'HEAD' })
  .then(res=>{
    const bytes = res.headers.get('content-length');
    const kb = bytes ? Math.round(bytes/1024) : null;
    resumeMeta.textContent = `SIZE: ${kb ? kb + ' KB' : '—'}  ·  UPDATED: 2026  ·  FORMAT: PDF`;
  })
  .catch(()=>{ /* file size stays as placeholder if HEAD isn't supported */ });

resumeDownload.addEventListener('click', ()=>{
  resumeDownload.classList.add('downloading');
  const original = resumeDownload.innerHTML;
  resumeDownload.innerHTML = '<span class="dl-icon">⬇</span> DOWNLOADING...';
  setTimeout(()=>{
    resumeDownload.innerHTML = original;
    resumeDownload.classList.remove('downloading');
  }, 1200);
});

/* ---------------- nav active state ---------------- */
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('main section');
const navObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      navLinks.forEach(l=>l.classList.remove('active'));
      const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if(link) link.classList.add('active');
    }
  });
},{rootMargin:'-40% 0px -50% 0px'});
sections.forEach(s=>navObserver.observe(s));