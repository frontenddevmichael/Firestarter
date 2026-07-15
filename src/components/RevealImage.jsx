import { useEffect, useRef, useState } from 'react';

export default function RevealImage({ children, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);

    const fallback = setTimeout(() => {
      if (!visible) {
        const rect = node.getBoundingClientRect();
        if (rect.top < window.innerHeight + 200) {
          setVisible(true);
          observer.disconnect();
        }
      }
    }, 4000);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div ref={ref} className={`revealImgWrap ${visible ? 'revealImgVisible' : ''} ${className}`}>
      <div className="revealImgInner">
        {children}
      </div>
    </div>
  );
}
