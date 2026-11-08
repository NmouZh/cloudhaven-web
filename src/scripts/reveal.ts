const REDUCED = '(prefers-reduced-motion: reduce)';

export const initReveal = (): void => {
  const targets = Array.from(
    document.querySelectorAll<HTMLElement>('[data-reveal]')
  );

  if (window.matchMedia(REDUCED).matches) {
    targets.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const pending = targets.filter(
    (el) => el.getBoundingClientRect().top > window.innerHeight
  );
  pending.forEach((el) => el.classList.add('is-pending'));

  if (!('IntersectionObserver' in window)) {
    pending.forEach((el) => {
      el.classList.remove('is-pending');
      el.classList.add('is-revealed');
    });
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.classList.remove('is-pending');
        el.classList.add('is-revealed');
        io.unobserve(el);
      }
    },
    { rootMargin: '0px 0px -12% 0px' }
  );

  pending.forEach((el) => io.observe(el));
};
