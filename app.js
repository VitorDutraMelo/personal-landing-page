const projects = [
  {
    name: "The Club",
    description: "Aplicação fitness social com desafios, rankings e recompensas.",
    tags: ["Node.js", "TypeScript", "PostgreSQL"],
    image: "assets/projects/the-club.png",
    githubUrl: ""
  },
  {
    name: "PIKO",
    description: "Assistente virtual infantil com tarefas, recompensas e aplicativo dos pais.",
    tags: ["LVGL", "ESP32"],
    image: "assets/projects/piko.png",
    githubUrl: ""
  },
  {
    name: "TradePulse",
    description: "Plataforma de análise de mercado, sinais e indicadores.",
    tags: ["Python"],
    image: "assets/projects/tradepulse.png",
    githubUrl: ""
  },
  {
    name: "LoyaltyQR",
    description: "Plataforma de fidelidade digital com QR Code para negócios locais.",
    tags: ["Em desenvolvimento"],
    image: "assets/projects/loyaltyqr.png",
    githubUrl: ""
  }
];

const githubProfile = "https://github.com/VitorDutraMelo";

const escapeHtml = value => String(value).replace(
  /[&<>"']/g,
  char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char])
);

document.getElementById("projects-grid").innerHTML =
  projects.map(project => {
    const name = escapeHtml(project.name);
    const description = escapeHtml(project.description);
    const image = escapeHtml(project.image);

    const url = /^https:\/\/github\.com\/[\w.-]+(?:\/[\w.-]+)?\/?$/i.test(
      project.githubUrl
    ) ? project.githubUrl : githubProfile;

    return `
      <article class="project-card">
        <div class="project-copy">
          <h3>${name}</h3>
          <p>${description}</p>
          <ul>
            ${project.tags.map(tag =>
              `<li>${escapeHtml(tag)}</li>`
            ).join("")}
          </ul>

          
        </div>
      </article>
    `;
  }).join("");
const technologies=[['Node.js','nodedotjs'],['TypeScript','typescript'],['PostgreSQL','postgresql'],['Prisma','prisma'],['Express','express'],['React','react'],['Python','python'],['Git','git'],['Docker','docker']];
document.getElementById('technologies').innerHTML=technologies.map(([name,icon])=>`<article class="tech"><img src="https://cdn.simpleicons.org/${icon}/ffffff" alt="Logotipo ${name}" loading="lazy"/><span>${name}</span></article>`).join('');
const menu=document.querySelector('.menu'),nav=document.querySelector('#nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});const navLinks=[...nav.querySelectorAll('a')];navLinks.forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');navLinks.forEach(item=>item.classList.toggle('active',item===link))}));const sectionLinks=navLinks.map(link=>[link,document.querySelector(link.getAttribute('href'))]).filter(([,section])=>section);sectionLinks.forEach(([,section])=>new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${entry.target.id}`))}}),{rootMargin:'-30% 0px -60% 0px'}).observe(section));document.head.insertAdjacentHTML('beforeend','<style>.hero-art{display:grid;place-items:center;background:#08080f}.hero-art img{object-fit:contain!important}.title-row a{color:var(--lime);font-size:14px;font-weight:700;text-decoration:none}.title-row a:hover{text-decoration:underline}</style>');document.getElementById('year').textContent=new Date().getFullYear();

/* === JANELA MINHA JORNADA === */
(() => {
  const dialog = document.getElementById("journey-dialog");
  const trigger = document.getElementById("open-journey");
  const closeButton = document.getElementById("close-journey");
  const chapters = document.getElementById("journey-chapters");

  if (!dialog || !trigger || !closeButton || !chapters) return;

  const colors = ["lime", "cyan", "pink", "purple"];

  chapters.replaceChildren();

  (window.VITOR_JOURNEY || []).forEach((chapter, index) => {
    const article = document.createElement("article");
    article.className =
      `journey-chapter journey-${colors[index % colors.length]}`;

    const tag = document.createElement("small");
    tag.textContent = chapter.tag;

    const title = document.createElement("h3");
    title.textContent = chapter.title;

    const text = document.createElement("p");
    text.textContent = chapter.text;

    article.append(tag, title, text);
    chapters.appendChild(article);
  });

  let previousOverflow = "";

  trigger.addEventListener("click", () => {
    if (dialog.open) return;

    previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";

    const scroll = dialog.querySelector(".journey-scroll");
    scroll.scrollTop = 0;
    closeButton.focus();
  });

  closeButton.addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("close", () => {
    document.body.style.overflow = previousOverflow;
    trigger.focus();
  });
})();





// VITORMELO BLOG MODAL
(() => {
  const dialog = document.getElementById("blog-dialog");
  const triggers = document.querySelectorAll("[data-open-blog]");
  const closeButton = dialog?.querySelector(".blog-dialog-close");
  const countdown = document.getElementById("blog-countdown-value");
  const destination = document.getElementById("blog");

  if (!dialog || !triggers.length || !countdown || !destination) {
    return;
  }

  let intervalId = null;
  let timeoutId = null;
  let shouldNavigate = false;

  const clearCountdown = () => {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }

    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const startCountdown = () => {
    clearCountdown();

    let remaining = 3;
    countdown.textContent = String(remaining);
    shouldNavigate = true;

    intervalId = window.setInterval(() => {
      remaining -= 1;

      if (remaining > 0) {
        countdown.textContent = String(remaining);
        return;
      }

      clearCountdown();

      if (!dialog.open || !shouldNavigate) return;

      dialog.close();

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      timeoutId = window.setTimeout(() => {
        destination.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start"
        });
        timeoutId = null;
      }, 80);
    }, 1000);
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();

      if (!dialog.open) {
        dialog.showModal();
        startCountdown();
      }
    });
  });

  closeButton?.addEventListener("click", () => {
    shouldNavigate = false;
    clearCountdown();
    dialog.close();
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      shouldNavigate = false;
      clearCountdown();
      dialog.close();
    }
  });

  dialog.addEventListener("cancel", () => {
    shouldNavigate = false;
    clearCountdown();
  });

  dialog.addEventListener("close", () => {
    clearCountdown();
  });
})();


