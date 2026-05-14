(() => {
  const DOT_COUNT = 18;
  const TRAIL_COUNT = 5;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const createSnakeScroll = () => {
    const root = document.createElement("div");
    root.className = "snake-scroll";
    root.setAttribute("aria-hidden", "true");

    const track = document.createElement("div");
    track.className = "snake-scroll__track";

    const dots = Array.from({ length: DOT_COUNT }, (_, index) => {
      const dot = document.createElement("span");
      dot.className = "snake-scroll__dot";
      dot.style.top = `${(index / (DOT_COUNT - 1)) * 100}%`;
      track.appendChild(dot);
      return dot;
    });

    const trail = Array.from({ length: TRAIL_COUNT }, () => {
      const segment = document.createElement("span");
      segment.className = "snake-scroll__trail";
      track.appendChild(segment);
      return segment;
    });

    const head = document.createElement("span");
    head.className = "snake-scroll__head";
    track.appendChild(head);
    root.appendChild(track);
    document.body.appendChild(root);

    let ticking = false;

    const update = () => {
      const doc = document.documentElement;
      const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
      const progress = clamp(window.scrollY / maxScroll, 0, 1);
      const trackHeight = track.getBoundingClientRect().height;
      const y = progress * trackHeight;
      const eatenIndex = Math.floor(progress * (DOT_COUNT - 1));

      head.style.top = `${y}px`;

      dots.forEach((dot, index) => {
        dot.classList.toggle("is-eaten", index <= eatenIndex);
      });

      trail.forEach((segment, index) => {
        const distance = (index + 1) * 13;
        const segmentY = clamp(y - distance, 0, trackHeight);
        const visible = y > distance * 0.6;

        segment.style.top = `${segmentY}px`;
        segment.style.opacity = visible ? `${0.52 - index * 0.08}` : "0";
      });

      ticking = false;
    };

    const requestUpdate = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createSnakeScroll, { once: true });
  } else {
    createSnakeScroll();
  }
})();
