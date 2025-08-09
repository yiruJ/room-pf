import { projects } from "../constants/index";


export function displayProjects() {
    // open pop-up
    const projectsPopup = document.getElementById('project-popup');
    const projectsPopupShadow = document.getElementById('project-popup-shadow');

    projectsPopupShadow.classList.remove('hidden');
    projectsPopupShadow.classList.add('translate-y-full', 'opacity-0');
    
    projectsPopup.classList.remove('hidden');
    projectsPopup.classList.add('translate-y-full', 'opacity-0');
    
    setTimeout(() => {
        requestAnimationFrame(() => {
            projectsPopupShadow.style.transform = 'translateY(4%)';
            projectsPopupShadow.classList.add('translate-y-0', 'opacity-100');

            projectsPopup.classList.remove('translate-y-full', 'opacity-0');
            projectsPopup.classList.add('translate-y-0', 'opacity-100');

            loadProjects();
        })
    }, 300)

}

export function hideProjects() {
    const projectsPopup = document.getElementById('project-popup');
    const projectsPopupShadow = document.getElementById('project-popup-shadow');

    projectsPopupShadow.classList.add('hidden');
    projectsPopupShadow.classList.remove('translate-y-full', 'opacity-0');
    
    projectsPopup.classList.add('hidden');
    projectsPopup.classList.remove('translate-y-full', 'opacity-0');
    
    setTimeout(() => {
        requestAnimationFrame(() => {
            projectsPopupShadow.style.transform = 'translateY(4%)';
            projectsPopupShadow.classList.remove('translate-y-0', 'opacity-100');

            projectsPopup.classList.add('translate-y-full', 'opacity-0');
            projectsPopup.classList.remove('translate-y-0', 'opacity-100');
        })
    }, 300)
}

function loadProjects() {
  const popup = document.getElementById('project-popup');

  // make sure it can scroll & has padding
  popup.classList.add('overflow-y-auto', 'p-6');

  const items = projects.map(p => `
    <article class="rounded-2xl bg-white/70 backdrop-blur-sm shadow-md hover:shadow-xl
                    transition p-4 md:p-5">
      <div class="flex gap-4">
        <img
          src="${p.image || 'images/placeholder.png'}"
          alt="${p.name}"
          class="w-24 h-24 md:w-28 md:h-28 object-cover rounded-xl border border-black/5"
        />
        <div class="flex-1">
          <h3 class="text-2xl md:text-3xl font-semibold text-[#4B3F33] leading-tight">
            ${p.name}
          </h3>
          <p class="text-[#4B3F33]/80 mt-2 md:mt-3 leading-snug">
            ${p.description}
          </p>
          <a href="${p.link}" target="_blank" rel="noopener"
             class="inline-flex items-center gap-2 mt-3 md:mt-4 px-4 py-2 rounded-xl
                    bg-[#ad9977] text-white font-medium hover:opacity-90">
            View project
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
        </div>
      </div>
    </article>
  `).join('');

  popup.innerHTML = `
    <header class="sticky top-0 z-10 bg-[#faeed0] pb-4">
      <p class="font text-5xl md:text-6xl text-center font-medium">PROJECTS</p>
    </header>

    <section class="grid gap-5 md:gap-6">
      ${items}
    </section>

    <div class="h-4"></div>
  `;
}
