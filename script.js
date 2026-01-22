// 1. Hotel Data (The "Database")
const hotels = [
    {
        id: 1,
        name: "Grand Hyatt Manila",
        location: "BGC, Taguig",
        price: 15000,
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        amenities: ["pool", "wifi", "gym"]
    },
    {
        id: 2,
        name: "Okada Manila",
        location: "Parañaque, Metro Manila",
        price: 18500,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        amenities: ["pool", "wifi", "gym", "casino"]
    },
    {
        id: 3,
        name: "Raffles Makati",
        location: "Makati CBD",
        price: 12000,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
        rating: 4.7,
        amenities: ["pool", "wifi"]
    },
    {
        id: 4,
        name: "Ascott Bonifacio Global City",
        location: "BGC, Taguig",
        price: 9500,
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        rating: 4.6,
        amenities: ["wifi", "gym"]
    },
    {
        id: 5,
        name: "Conrad Manila",
        location: "Pasay City",
        price: 11000,
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        amenities: ["pool", "gym"]
    },
    {
        id: 6,
        name: "City Garden Grand",
        location: "Makati Avenue",
        price: 4500,
        image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
        rating: 4.3,
        amenities: ["pool", "wifi"]
    }
];

// 2. Initialize the Page
const grid = document.getElementById('hotelGrid');
let currentHotels = [...hotels]; // Create a copy to filter

function renderHotels(data) {
    grid.innerHTML = ""; // Clear existing
    document.getElementById('resultCount').innerText = `Showing ${data.length} properties`;

    data.forEach(hotel => {
        const card = document.createElement('div');
        card.className = 'hotel-card';
        card.innerHTML = `
            <div class="hotel-img">
                <img src="${hotel.image}" alt="${hotel.name}">
            </div>
            <div class="card-details">
                <h3>${hotel.name}</h3>
                <p class="card-location"><i class="fas fa-map-marker-alt"></i> ${hotel.location}</p>
                <div class="card-price">
                    <span class="price-val">₱${hotel.price.toLocaleString()}</span> <span>/ night</span>
                </div>
                <button class="book-btn" onclick="openModal('${hotel.name}', ${hotel.price})">Book Now</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Initial Render
renderHotels(currentHotels);

// 3. Sorting Logic
function sortHotels() {
    const sortValue = document.getElementById('sortSelect').value;
    
    if (sortValue === 'price-low') {
        currentHotels.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-high') {
        currentHotels.sort((a, b) => b.price - a.price);
    } else {
        // Reset to original ID order for "Recommended"
        currentHotels.sort((a, b) => a.id - b.id);
    }
    renderHotels(currentHotels);
}

// 4. Filtering Logic (Search & Checkboxes)
function filterHotels() {
    const searchTerm = document.getElementById('locationInput').value.toLowerCase();
    const minPrice = document.getElementById('minPrice').value || 0;
    const maxPrice = document.getElementById('maxPrice').value || 100000;
    
    // Get checked amenities
    const checkedAmenities = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);

    currentHotels = hotels.filter(hotel => {
        // Location Match
        const matchesLocation = hotel.location.toLowerCase().includes(searchTerm) || hotel.name.toLowerCase().includes(searchTerm);
        // Price Match
        const matchesPrice = hotel.price >= minPrice && hotel.price <= maxPrice;
        // Amenities Match (Must have ALL checked amenities)
        const matchesAmenities = checkedAmenities.every(amenity => hotel.amenities.includes(amenity));

        return matchesLocation && matchesPrice && matchesAmenities;
    });

    renderHotels(currentHotels);
}

// 5. Modal & Booking Logic
const modal = document.getElementById('bookingModal');

function openModal(hotelName, price) {
    modal.style.display = "block";
    document.getElementById('modalHotelName').innerText = hotelName;
    document.getElementById('modalPrice').innerText = "₱" + price.toLocaleString();
}

function closeModal() {
    modal.style.display = "none";
}

// Close if clicking outside the box
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Handle the Form Submit
function handleBooking(event) {
    event.preventDefault(); // Stop page refresh
    
    // Simulate processing
    const btn = document.querySelector('.btn-confirm');
    const originalText = btn.innerText;
    btn.innerText = "Processing...";
    
    setTimeout(() => {
        alert("Booking Confirmed! Check your email for details.");
        closeModal();
        btn.innerText = originalText;
        document.getElementById('bookingForm').reset();
    }, 1500);
}
