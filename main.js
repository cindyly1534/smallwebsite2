let events = JSON.parse(localStorage.getItem("calendarEvents")) || {};

const monthYearElement = document.getElementById('monthYear');
const datesElement = document.getElementById('dates');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// ⭐ ADDED — event modal controls
const eventModal = document.getElementById("eventModal");
const eventInput = document.getElementById("eventInput");
const eventDateDisplay = document.getElementById("eventDateDisplay");
const saveEventBtn = document.getElementById("saveEventBtn");
const closeEventBtn = document.getElementById("closeEventBtn");

// VIEW EVENTS MODAL
const viewEventsModal = document.getElementById("viewEventsModal");
const viewEventsDateDisplay = document.getElementById("viewEventsDateDisplay");
const eventsList = document.getElementById("eventsList");
const closeViewEventsBtn = document.getElementById("closeViewEventsBtn");

// EDIT EVENT MODAL
const editEventModal = document.getElementById("editEventModal");
const editEventInput = document.getElementById("editEventInput");
const saveEditEventBtn = document.getElementById("saveEditEventBtn");
const closeEditEventBtn = document.getElementById("closeEditEventBtn");


//save events helper function
const saveEvents = () => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
};




let editingIndex = null; // which event inside that day



let selectedDate = null;

// ⭐ ADDED — store events
//let events = {}; 
// Example format: events["2025-02-03"] = ["Buy milk", "Dentist appointment"];

let currentDate = new Date();



const updateCalendar = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();
    const lastDayIndex = lastDay.getDay();

    const monthYearString = currentDate.toLocaleString('default', {
        month: 'long',
        year: 'numeric'
    });
    monthYearElement.textContent = monthYearString;

    let datesHTML = '';

    // Previous month filler days
    for (let i = firstDayIndex; i > 0; i--) {
        const prevDate = new Date(currentYear, currentMonth, 1 - i);
        datesHTML += `<div class="date inactive" data-date="${prevDate.toISOString().split("T")[0]}">
            ${prevDate.getDate()}
            </div>`;
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
    const date = new Date(currentYear, currentMonth, i);
    const iso = date.toISOString().split("T")[0];

    const activeClass = date.toDateString() === new Date().toDateString()
        ? "active"
        : "";

    // check if events exist for this date
    const hasEvents = events[iso] && events[iso].length > 0;

    datesHTML += `
        <div class="date ${activeClass}" data-date="${iso}">
            ${i}
            ${hasEvents ? '<div class="event-dot"></div>' : ''}
        </div>
    `;
    }

    // Next month filler days
    for (let i = 1; i < 7 - lastDayIndex; i++) {
        const nextDate = new Date(currentYear, currentMonth + 1, i);
        datesHTML += `<div class="date inactive" data-date="${nextDate.toISOString().split("T")[0]}">
    ${nextDate.getDate()}
</div>`;
    }

    datesElement.innerHTML = datesHTML;
};

prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
});

nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
});

updateCalendar();

// ⭐ ADDED — open modal when clicking a date
datesElement.addEventListener("click", (e) => {
    const target = e.target.closest(".date");
    if (!target || target.classList.contains("inactive")) return;

    selectedDate = target.dataset.date;

    const eventArray = events[selectedDate];

    if (eventArray && eventArray.length > 0) {
        // SHOW VIEW-EVENTS MODAL
        viewEventsDateDisplay.textContent = "Events for " + selectedDate;
        eventsList.innerHTML = eventArray
            .map((ev, index) => `
                <li>
                    ${ev}
                    <button class="editBtn" data-index="${index}">Edit</button>
                </li>
            `)
        .join("");
        viewEventsModal.classList.remove("hidden");
    } else {
        // SHOW ADD-EVENT MODAL
        eventDateDisplay.textContent = "Add Event for " + selectedDate;
        eventInput.value = "";
        eventModal.classList.remove("hidden");
    }
});


// ⭐ ADDED — save event
saveEventBtn.addEventListener("click", () => {
    if (!selectedDate) return;

    const text = eventInput.value.trim();
    if (text === "") return;

    if (!events[selectedDate]) {
        events[selectedDate] = [];
    }

    events[selectedDate].push(text);
    saveEvents();

    eventModal.classList.add("hidden");
    updateCalendar();
});

// ⭐ ADDED — close modal
closeEventBtn.addEventListener("click", () => {
    eventModal.classList.add("hidden");
});

closeViewEventsBtn.addEventListener("click", () => {
    viewEventsModal.classList.add("hidden");
});

eventsList.addEventListener("click", (e) => {
    if (!e.target.classList.contains("editBtn")) return;

    editingIndex = e.target.dataset.index;

    // Prefill input with current event text
    editEventInput.value = events[selectedDate][editingIndex];

    viewEventsModal.classList.add("hidden");
    editEventModal.classList.remove("hidden");
});

saveEditEventBtn.addEventListener("click", () => {
    const newText = editEventInput.value.trim();
    if (newText === "") return;

    events[selectedDate][editingIndex] = newText;
    saveEvents();

    editEventModal.classList.add("hidden");
    updateCalendar();

    // reopen event list after editing
    viewEventsDateDisplay.textContent = "Events for " + selectedDate;
    eventsList.innerHTML = events[selectedDate]
        .map((ev, index) => `
            <li>
                ${ev}
                <button class="editBtn" data-index="${index}">Edit</button>
            </li>
        `)
        .join("");

    viewEventsModal.classList.remove("hidden");
});

closeEditEventBtn.addEventListener("click", () => {
    editEventModal.classList.add("hidden");
});




