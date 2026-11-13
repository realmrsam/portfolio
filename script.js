// Photo loader: tries photo.jpeg, then photo.jpg, then photo.png, then shows initials
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

// Fade sections in as you scroll
const items = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
}, { threshold: 0.1 });
items.forEach(el => io.observe(el));
