// ---------- Photo loader ----------
const photo = document.getElementById('myPhoto');
const initials = document.getElementById('initials');
if (photo) {
  const options = ['photo.jpeg', 'photo.jpg', 'photo.png'];
  let tryIndex = 0;
  photo.onerror = function () {
    tryIndex++;
    if (tryIndex < options.length) { photo.src = options[tryIndex]; }
    else { photo.style.display = 'none'; initials.style.display = 'flex'; }
  };
}

// ---------- Fade sections in on scroll ----------
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- Scroll progress bar ----------
const bar = document.createElement('div');
bar.className = 'progress';
document.body.appendChild(bar);
function updateBar() {
  const h = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
}
addEventListener('scroll', updateBar, { passive: true });
updateBar();

// ---------- Typing effect (home page) ----------
const heading = document.querySelector('.hero-text h1');
if (heading) {
  const line = document.createElement('div');
  line.className = 'typed-line';
  line.innerHTML = 'I’m a <b id="typed"></b><span class="caret"></span>';
  heading.after(line);
  const roles = ['Student', 'Aspiring Developer', 'Entrepreneur', 'Web Builder'];
  const target = document.getElementById('typed');
  let r = 0, c = 0, deleting = false;
  function type() {
    const word = roles[r];
    c += deleting ? -1 : 1;
    target.textContent = word.slice(0, c);
    let delay = deleting ? 50 : 100;
    if (!deleting && c === word.length) { deleting = true; delay = 1400; }
    else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 400; }
    setTimeout(type, delay);
  }
  setTimeout(type, 1200);
}

// ---------- Floating particle network background ----------
if (!matchMedia('(prefers-reduced-motion:reduce)').matches) {
  const cv = document.createElement('canvas');
  cv.id = 'bg-canvas';
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d');
  let W, H, dots = [];
  const color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#6366f1';
  function setup() {
    W = cv.width = innerWidth;
    H = cv.height = innerHeight;
    const n = Math.min(60, Math.floor(innerWidth / 18));
    dots = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    dots.forEach((d, i) => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1;
      if (d.y < 0 || d.y > H) d.vy *= -1;
      ctx.globalAlpha = .5;
      ctx.beginPath(); ctx.arc(d.x, d.y, 2, 0, 6.283); ctx.fill();
      for (let j = i + 1; j < dots.length; j++) {
        const dx = d.x - dots[j].x, dy = d.y - dots[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          ctx.globalAlpha = (1 - dist / 120) * .25;
          ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(dots[j].x, dots[j].y); ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  }
  setup();
  addEventListener('resize', setup);
  draw();
}

// ---------- Laptop effects: cursor glow, 3D tilt, magnetic buttons ----------
if (matchMedia('(hover:hover)').matches) {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  addEventListener('mousemove', e => {
    glow.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
  });

  document.querySelectorAll('.card, .stat, .c-card').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = 'perspective(700px) rotateY(' + (x * 12) + 'deg) rotateX(' + (-y * 12) + 'deg) translateY(-6px)';
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });

  document.querySelectorAll('.btn').forEach(b => {
    b.addEventListener('mousemove', e => {
      const r = b.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.25;
      const y = (e.clientY - r.top - r.height / 2) * 0.35;
      b.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    });
    b.addEventListener('mouseleave', () => { b.style.transform = ''; });
  });
}

// ---------- Netlify forms (contact + reviews) ----------
document.querySelectorAll('form[data-netlify]').forEach(form => {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const status = form.querySelector('.form-status');
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    status.textContent = 'Sending…';
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      });
      if (!res.ok) throw new Error('failed');
      form.reset();
      status.textContent = form.dataset.success || 'Sent! Thank you.';
    } catch (err) {
      status.textContent = 'Something went wrong. Please try again, or use the WhatsApp button above.';
    }
    btn.disabled = false;
  });
});
