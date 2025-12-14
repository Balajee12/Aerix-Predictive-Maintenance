async function initBooking() {
    loadVehicles();
    setupDatePicker();
    setupBookingButton();
}

async function loadVehicles() {
    const alerts = await apiCall('/alerts');
    const select = document.getElementById('vehicleSelect');
    
    if (alerts && alerts.vehicles) {
        select.innerHTML = '<option value="">Select a vehicle</option>' +
            alerts.vehicles.map(v => 
                `<option value="${v.id}">${v.id} - ${v.risk.toUpperCase()} Risk</option>`
            ).join('');
    }

    const params = new URLSearchParams(window.location.search);
    const preselected = params.get('vehicle');
    if (preselected) {
        select.value = preselected;
    }
}

function setupDatePicker() {
    const dateSelect = document.getElementById('dateSelect');
    const today = new Date();
    today.setDate(today.getDate() + 1);
    dateSelect.min = today.toISOString().split('T')[0];
    
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    dateSelect.max = maxDate.toISOString().split('T')[0];
    
    dateSelect.addEventListener('change', loadTimeSlots);
}

async function loadTimeSlots() {
    const date = document.getElementById('dateSelect').value;
    if (!date) return;

    const slots = await apiCall(`/slots?date=${date}`);
    const container = document.getElementById('timeSlots');
    
    const defaultSlots = slots || [
        { time: '09:00 AM', available: true },
        { time: '11:00 AM', available: true },
        { time: '02:00 PM', available: true },
        { time: '04:00 PM', available: false },
        { time: '05:00 PM', available: true }
    ];

    container.innerHTML = defaultSlots.map(slot => `
        <div class="time-slot ${slot.available ? '' : 'unavailable'}" 
             data-time="${slot.time}"
             onclick="selectSlot('${slot.time}', ${slot.available})">
            ${slot.time}
            ${slot.available ? '' : '<br><small>(Booked)</small>'}
        </div>
    `).join('');
}

let selectedSlot = null;

function selectSlot(time, available) {
    if (!available) return;
    
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    event.target.classList.add('selected');
    selectedSlot = time;
}

function setupBookingButton() {
    const bookBtn = document.getElementById('bookBtn');
    bookBtn.addEventListener('click', bookAppointment);
}

async function bookAppointment() {
    const vehicleId = document.getElementById('vehicleSelect').value;
    const date = document.getElementById('dateSelect').value;
    const serviceType = document.getElementById('serviceType').value;
    
    if (!vehicleId || !date || !selectedSlot) {
        alert('Please select vehicle, date, and time slot');
        return;
    }

    const booking = await apiCall('/book', 'POST', {
        vehicleId,
        date,
        time: selectedSlot,
        serviceType
    });

    if (booking && booking.success) {
        showConfirmation(booking);
    } else {
        alert('Booking failed. Please try again.');
    }
}

function showConfirmation(booking) {
    const modal = document.getElementById('confirmModal');
    const details = document.getElementById('confirmDetails');
    
    details.innerHTML = `
        <p><strong>Vehicle:</strong> ${booking.vehicleId}</p>
        <p><strong>Date:</strong> ${booking.date}</p>
        <p><strong>Time:</strong> ${booking.time}</p>
        <p><strong>Service:</strong> ${booking.serviceType}</p>
        <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
        <p style="margin-top: 1rem;">A confirmation has been sent to your registered contact.</p>
    `;
    
    modal.classList.add('show');
}
