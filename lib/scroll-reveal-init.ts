"use client";

/**
 * Inicializa o sistema de Scroll Reveal
 * Deve ser chamado uma vez quando a página carrega
 */
export function initScrollReveal() {
  if (typeof window === "undefined") return;

  const reveals = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  reveals.forEach((reveal) => {
    revealObserver.observe(reveal);
  });
}

