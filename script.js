// --- LUXURY HOTEL DATA ---
const hotels = [
    {
        id: 1,
        name: "Okada Manila",
        location: "Entertainment City, Parañaque",
        desc: "Carved into 44 hectares of picturesque oceanfront, Okada Manila is Entertainment City's iconic integrated resort. Stay, play, dine, relax.",
        price: 18500,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?fit=crop&w=800&q=80",
        rating: 5.0,
        tags: ["pool", "spa", "view"]
    },
    {
        id: 2,
        name: "Raffles Makati",
        location: "Makati Avenue, Makati City",
        desc: "An oasis of understated elegance. Every suite is a masterpiece of colonial design and contemporary comfort.",
        price: 22000,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?fit=crop&w=800&q=80",
        rating: 4.9,
        tags: ["spa", "view"]
    },
    {
        id: 3,
        name: "Shangri-La The Fort",
        location: "BGC, Taguig",
        desc: "Soaring 250 meters above the city, offering panoramic views of Manila and bespoke luxury for the discerning traveler.",
        price: 19500,
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?fit=crop&w=800&q=80",
        rating: 4.8,
        tags: ["pool", "view"]
    },
    {
        id: 4,
        name: "The Peninsula Manila",
        location: "Ayala Triangle, Makati",
        desc: "Known as the 'Jewel in the Capital's Crown', offering a blend of traditional Filipino hospitality and world-class service.",
        price: 16000,
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?fit=crop&w=800&q=80",
        rating: 4.9,
        tags: ["pool", "spa"]
    }
];

let selectedHotel = null;
let selectedRoomIndex = 0; // 0 = Deluxe, 1 = Suite

// --- RENDER HOTELS ---
function renderHotels() {
    const container = document.getElementById('hotelList');
    const searchVal = document.getElementById('searchInput').value.toLowerCase();
    const maxPrice = document.querySelector('.range-slider').value;
    
    // Get Checked Checkboxes
    const checkedBoxes = Array.from(document.querySelectorAll('.custom-check input:checked')).map(cb => cb.value);

    // Filter Logic
    const filtered = hotels.filter(h => {
        const matchesSearch = h.name.toLowerCase().includes(searchVal) || h.location.toLowerCase().includes(searchVal);
        const matchesPrice = h.price <= maxPrice;
        const matchesTags = checkedBoxes.every(tag => h.tags.includes(tag)); // Must have ALL checked tags
        return matchesSearch && matchesPrice && matchesTags;
    });

    container.innerHTML = "";
    
    if (filtered.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:50px;"><h3>No sanctuaries found matching your criteria.</h3></div>`;
        return;
    }

    filtered.forEach(h => {
        const div = document.createElement('div');
        div.className = "hotel-card";
        div.innerHTML = `
            <div class="hc-img-wrap">
                <img src="${h.image}" class="hc-img">
                <span class="hc-tag">Recommended</span>
            </div>
            <div class="hc-content">
                <h2 class="hc-title">${h.name}</h2>
                <span class="hc-loc">${h.location}</span>
                <p class="hc-desc">${h.desc}</p>
                <div class="hc-footer">
                    <div class="hc-price">₱${h.price.toLocaleString()}<small> / night</small></div>
                    <button class="btn-book" onclick="openBooking(${h.id})">Reserve Suite</button>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

// Initial Load
window.onload = () => {
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('checkIn').valueAsDate = tomorrow;
    renderHotels();
};

function updatePrice(val) {
    document.getElementById('priceDisplay').innerText = "₱" + parseInt(val).toLocaleString();
}

// --- BOOKING MODAL ---
function openBooking(id) {
    selectedHotel = hotels.find(h => h.id === id);
    selectedRoomIndex = 0; // Reset to Deluxe

    document.getElementById('bookingModal').style.display = 'flex';
    document.getElementById('modalImage').src = selectedHotel.image;
    document.getElementById('modalTitle').innerText = selectedHotel.name;
    document.getElementById('modalLoc').innerText = selectedHotel.location;
    document.getElementById('modalRating').innerText = selectedHotel.rating;

    // Set Room Prices (Suite is +50%)
    document.getElementById('p-deluxe').innerText = "₱" + selectedHotel.price.toLocaleString();
    document.getElementById('p-suite').innerText = "₱" + (selectedHotel.price * 1.5).toLocaleString();

    updateTotal();
    
    // UI Reset
    document.querySelectorAll('.room-card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.room-card')[0].classList.add('selected');
}

function selectRoom(index) {
    selectedRoomIndex = index;
    document.querySelectorAll('.room-card').forEach((c, i) => {
        if(i === index) c.classList.add('selected');
        else c.classList.remove('selected');
    });
    updateTotal();
}

function updateTotal() {
    let base = selectedHotel.price;
    if (selectedRoomIndex === 1) base = base * 1.5;
    
    // Add 12% Tax + 10% Service Charge
    const total = base * 1.22;
    document.getElementById('liveTotal').innerText = "₱" + Math.floor(total).toLocaleString();
}

function closeModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

// --- RECEIPT GENERATION ---
function generateReceipt(e) {
    e.preventDefault(); // Stop reload
    
    // 1. Get Data
    const fname = document.getElementById('fName').value;
    const lname = document.getElementById('lName').value;
    const date = document.getElementById('checkIn').value;
    
    // 2. Hide Booking Modal, Show Receipt
    closeModal();
    const receiptModal = document.getElementById('receiptModal');
    receiptModal.style.display = 'flex';

    // 3. Populate Receipt
    document.getElementById('r-name').innerText = `${fname} ${lname}`;
    document.getElementById('r-id').innerText = "#LX-" + Math.floor(Math.random() * 90000 + 10000);
    document.getElementById('r-in').innerText = date;
    
    // Checkout is +1 day for simplicity in this demo
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    document.getElementById('r-out').innerText = d.toISOString().split('T')[0];

    // Math
    let basePrice = selectedHotel.price;
    let roomName = "Deluxe Room";
    
    if (selectedRoomIndex === 1) {
        basePrice = basePrice * 1.5;
        roomName = "Presidential Suite";
    }

    const service = basePrice * 0.10;
    const tax = basePrice * 0.12;
    const total = basePrice + service + tax;

    document.getElementById('r-room-type').innerText = `${roomName} x 1 Night`;
    document.getElementById('r-room-price').innerText = "₱" + basePrice.toLocaleString();
    document.getElementById('r-service').innerText = "₱" + service.toLocaleString();
    document.getElementById('r-tax').innerText = "₱" + tax.toLocaleString();
    document.getElementById('r-total').innerText = "₱" + total.toLocaleString();
}

function closeReceipt() {
    document.getElementById('receiptModal').style.display = 'none';
    // Clear form
    document.getElementById('bookingForm').reset();
}
