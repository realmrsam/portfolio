// ---------- Photo loader: tries photo.jpeg, photo.jpg, photo.png, then shows initials ----------
const photo = document.getElementById('myPhoto');
const initials = document.getElementById('initials');
if (photo) {
  const options = ['photo.jpeg', 'photo.jpg', 'photo.png'];
  let tryIndex = 0;
  photo.onerror = function () {
    tryIndex++;
    if (tryIndex < options.length) {
      photo.src = options[tryIndex];
    } else {
      photo.style.display = 'none';
      initials.style.display = 'flex';
    }
  };
}

// ---------- Fade sections in as you scroll ----------
const items = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
}, { threshold: 0.1 });
items.forEach(el => io.observe(el));

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

// ---------- Typing effect (home page only) ----------
const heroText = document.querySelector('.hero-text');
const heading = heroText ? heroText.querySelector('h1') : null;
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

// ---------- Laptop-only effects: cursor glow + 3D card tilt ----------
if (matchMedia('(hover:hover)').matches) {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  addEventListener('mousemove', e => {
    glow.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
  });

  document.querySelectorAll('.card, .stat').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = 'perspective(700px) rotateY(' + (x * 12) + 'deg) rotateX(' + (-y * 12) + 'deg) translateY(-6px)';
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}
