// Destination search and filter
const searchInput = document.getElementById('destinationSearch');
const typeFilter = document.getElementById('typeFilter');
if (searchInput && typeFilter) {
  const cards = [...document.querySelectorAll('.destination-card')];
  const update = () => {
    const term = searchInput.value.toLowerCase().trim();
    let shown = 0;
    cards.forEach(card => {
      const matches = card.dataset.name.toLowerCase().includes(term) &&
        (typeFilter.value === 'all' || card.dataset.type === typeFilter.value);
      card.hidden = !matches;
      if (matches) shown++;
    });
    document.getElementById('noResults').hidden = shown !== 0;
  };
  searchInput.addEventListener('input', update);
  typeFilter.addEventListener('change', update);
}

// Demo trip planner: saves data in this browser only (localStorage).
const tripForm = document.getElementById('tripForm');
const tripList = document.getElementById('tripList');
const getTrips = () => JSON.parse(localStorage.getItem('wanderwiseTrips') || '[]');
const saveTrips = trips => localStorage.setItem('wanderwiseTrips', JSON.stringify(trips));
function renderTrips() {
  if (!tripList) return;
  const trips = getTrips();
  tripList.innerHTML = '';
  if (!trips.length) {
    tripList.innerHTML = '<p class="empty-state">No trips saved yet. Create your first plan above.</p>';
    return;
  }
  trips.forEach((trip, index) => {
    const item = document.createElement('article');
    item.className = 'trip-item';
    const details = document.createElement('div');
    const heading = document.createElement('strong');
    heading.textContent = trip.destination;
    const dates = document.createElement('p');
    dates.textContent = `${trip.departure} to ${trip.returnDate} · ${trip.travelers} traveler(s)`;
    const notes = document.createElement('p');
    notes.textContent = trip.notes || 'No extra notes';
    details.append(heading, dates, notes);
    const remove = document.createElement('button');
    remove.className = 'delete-trip';
    remove.textContent = 'Remove';
    remove.type = 'button';
    remove.addEventListener('click', () => {
      const updated = getTrips();
      updated.splice(index, 1);
      saveTrips(updated);
      renderTrips();
    });
    item.append(details, remove);
    tripList.append(item);
  });
}
if (tripForm) {
  const departure = tripForm.elements.departure;
  const returnDate = tripForm.elements.returnDate;
  departure.addEventListener('change', () => { returnDate.min = departure.value; });
  tripForm.addEventListener('submit', event => {
    event.preventDefault();
    if (returnDate.value < departure.value) {
      document.getElementById('formMessage').textContent = 'Return date must be on or after departure date.';
      return;
    }
    const data = Object.fromEntries(new FormData(tripForm).entries());
    saveTrips([...getTrips(), data]);
    tripForm.reset();
    document.getElementById('formMessage').textContent = 'Your trip plan was saved in this browser.';
    renderTrips();
  });
  renderTrips();
}

// Demo contact form: validates locally; it does not send email.
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    document.getElementById('contactMessage').textContent =
      'Thanks! This demo form is working locally, but needs a backend or form service to send your message.';
    contactForm.reset();
  });
}
