document.addEventListener('DOMContentLoaded', () => {
  // ---------- DARK MODE ----------
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;

  if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
      } else {
        localStorage.setItem('darkMode', 'disabled');
      }
    });
  }

  // ---------- EVENTS DATA ----------
  const events = [
    { id: 1, title: "Music Festival", date: "28 Oct 2025", location: "City Hall", category: "Music", image: "assets/images/event3.jpg", description: "Enjoy live music performances from local and international artists!" },
    { id: 2, title: "Art Exhibition", date: "30 Oct 2025", location: "Art Center", category: "Culture", image: "assets/images/event4.jpg", description: "Explore stunning artworks by talented artists across the city." },
    { id: 3, title: "Sports Tournament", date: "31 Oct 2025", location: "Stadium", category: "Sports", image: "assets/images/event6.jpg", description: "Watch thrilling matches between top teams!" },
    { id: 4, title: "Family Fun Fair", date: "2 Nov 2025", location: "Central Park", category: "Family", image: "assets/images/event5.jpg", description: "Games, rides, food, and fun activities for all ages!" }
  ];

  // ---------- EVENT DETAILS ----------
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');
  const eventDetailsContainer = document.getElementById('eventDetails');

  if (eventId && eventDetailsContainer) {
    const event = events.find(e => e.id === parseInt(eventId));
    if (event) {
      eventDetailsContainer.innerHTML = `
        <div class="row">
          <div class="col-md-8">
            <img src="${event.image}" class="img-fluid mb-3" alt="${event.title}">
            <h2>${event.title}</h2>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p>${event.description}</p>
            <a href="events.html" class="btn btn-secondary mt-3">Back to Events</a>
          </div>
        </div>
      `;
    }
  }
// ---------- RELATED EVENTS ----------
if (eventId && eventDetailsContainer) {
  const event = events.find(e => e.id === parseInt(eventId));

  if (event) {
    // عرض تفاصيل الحدث
    eventDetailsContainer.innerHTML = `
      <div class="row">
        <div class="col-md-8">
          <img src="${event.image}" class="img-fluid mb-3 rounded" alt="${event.title}">
          <h2>${event.title}</h2>
          <p><strong>Date:</strong> ${event.date}</p>
          <p><strong>Location:</strong> ${event.location}</p>
          <p>${event.description}</p>
          <a href="events.html" class="btn btn-secondary mt-3">Back to Events</a>
        </div>
      </div>
    `;

    // عرض الأحداث المشابهة أو العشوائية
    const relatedGrid = document.getElementById('relatedGrid');
    if (relatedGrid) {
      // الأحداث المشابهة حسب التصنيف
      let related = events.filter(e => e.category === event.category && e.id !== event.id);

      // إذا لا توجد أحداث مشابهة → اختر 3 أحداث عشوائية
      if (related.length === 0) {
        related = [...events]
          .filter(e => e.id !== event.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
      }

      // عرض الأحداث
      relatedGrid.innerHTML = "";
      related.forEach(r => {
        relatedGrid.innerHTML += `
          <div class="col-md-4">
            <div class="card h-100 shadow-sm">
              <img src="${r.image}" class="card-img-top" alt="${r.title}">
              <div class="card-body">
                <h5 class="card-title">${r.title}</h5>
                <p><strong>Date:</strong> ${r.date}</p>
                <p><strong>Location:</strong> ${r.location}</p>
                <a href="event.html?id=${r.id}" class="btn btn-primary">View Details</a>
              </div>
            </div>
          </div>
        `;
      });
    }
  }
}


  // ---------- FILTERING (INDEX & EVENTS) ----------
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const dateFilter = document.getElementById('dateFilter');
  const locationFilter = document.getElementById('locationFilter');
  const filterButtons = document.querySelectorAll('.categories [data-category]');
  const cards = document.querySelectorAll('#eventsGrid [data-category]');

  function filterCards() {
    const searchText = searchInput ? searchInput.value.toLowerCase() : '';
    const categorySelect = categoryFilter ? categoryFilter.value.toLowerCase() : '';
    const dateValue = dateFilter ? dateFilter.value : '';
    const locationText = locationFilter ? locationFilter.value.toLowerCase() : '';

    cards.forEach(card => {
      const title = card.querySelector('.card-title').textContent.toLowerCase();
      const cardCategory = card.getAttribute('data-category').toLowerCase();
      const cardDate = card.getAttribute('data-date');
      const cardLocation = card.getAttribute('data-location') ? card.getAttribute('data-location').toLowerCase() : '';

      let visible = true;
      if (categorySelect && cardCategory !== categorySelect) visible = false;
      if (dateValue && cardDate !== dateValue) visible = false;
      if (locationText && !cardLocation.includes(locationText)) visible = false;
      if (searchText && !title.includes(searchText)) visible = false;

      card.style.display = visible ? '' : 'none';
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterCards);
  if (categoryFilter) categoryFilter.addEventListener('change', filterCards);
  if (dateFilter) dateFilter.addEventListener('change', filterCards);
  if (locationFilter) locationFilter.addEventListener('input', filterCards);

  // ---------- CATEGORY BUTTONS ----------
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-category').toLowerCase();
      filterButtons.forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category').toLowerCase();
        card.style.display = (category === "" || cardCategory === category) ? '' : 'none';
      });
    });
  });

  // ---------- SCROLL TO TOP ----------
  const scrollBtn = document.createElement('button');
  scrollBtn.id = 'scrollToTop';
  scrollBtn.textContent = '↑';
  scrollBtn.className = 'btn btn-primary position-fixed';
  scrollBtn.style.bottom = '20px';
  scrollBtn.style.right = '20px';
  scrollBtn.style.display = 'none';
  scrollBtn.style.zIndex = '9999';
  document.body.appendChild(scrollBtn);

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    scrollBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
  });

  // ---------- CONTACT FORM ALERT ----------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! Your message has been sent.');
      contactForm.reset();
    });
  }
});
