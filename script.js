// Function to animate the counter
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}



// Update stats from the database
function updateStats() {
    fetch('/api/stats')
        .then(response => response.json())
        .then(data => {
            // Update the stat cards with the new field values
            const statCards = document.querySelectorAll('.stat-card .stat-value');
            const values = [
                data.active || 0,
                data.samples_collected || 0,
                data.testing_progress || 0,
                data.result_pending || 0,
                data.test_complete || 0,
                data.total || 0
            ];

            statCards.forEach((card, index) => {
                const currentValue = parseInt(card.textContent, 10) || 0;
                const newValue = values[index];
                animateCounter(card, currentValue, newValue, 1000); // 1000ms = 1s duration
            });
        })
        .catch(error => {
            console.error('Error fetching stats:', error);
        });
}

// Update stats every 30 seconds
setInterval(updateStats, 3000);

// Initial update when page loads 
document.addEventListener('DOMContentLoaded', updateStats);

// Update current time
function updateTime() {
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString();
    }
}

// Update time every second
setInterval(updateTime, 1000);
updateTime(); // Initial update

// Modal handling
const modal = document.getElementById('uploadModal');
const uploadBtn = document.querySelector('.btn-upload');
const closeBtn = document.querySelector('.close');
const form = document.getElementById('testReportForm');

uploadBtn.onclick = function() {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

closeBtn.onclick = function() {
    if (confirm("Are you sure you want to close the Form?")) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

window.onclick = function(event) {
    if (event.target == modal) {
        if (confirm("Are you sure you want to close the Form?")) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }
}
// ...

form.onsubmit = function(e) {
    e.preventDefault();
    
    // Collect all form data without validation
    const formData = {
        sampleId: document.getElementById('sampleId').value,
        pH: document.getElementById('pH').value || null,
        tds: document.getElementById('tds').value || null,
        turbidity: document.getElementById('turbidity').value || null,
        chlorine: document.getElementById('chlorine').value || null,
        do: document.getElementById('do').value || null,
        tss: document.getElementById('tss').value || null,
        color: document.getElementById('color').value || null,
        odor: document.getElementById('odor').value || null,
        hardness: document.getElementById('hardness').value || null,
        alkalinity: document.getElementById('alkalinity').value || null,
        chloride: document.getElementById('chloride').value || null,
        nitrate: document.getElementById('nitrate').value || null,
        iron: document.getElementById('iron').value || null,
        nitrite: document.getElementById('nitrite').value || null,
        fluoride: document.getElementById('fluoride').value || null,
        ammonia: document.getElementById('ammonia').value || null,
        sulphate: document.getElementById('sulphate').value || null,
        tkn: document.getElementById('tkn').value || null,
        phosphorus: document.getElementById('phosphorus').value || null,
        bod: document.getElementById('bod').value || null,
        cod: document.getElementById('cod').value || null,
        bacteria: document.getElementById('bacteria').value || null
    };

    // Send data to server
    fetch('/api/save_report', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            const customAlert = document.getElementById('customAlert');
            customAlert.style.display = 'block';
            setTimeout(() => {
                customAlert.style.display = 'none';
            }, 3000); // Hide after 3 seconds

            form.reset();
            modal.style.display = "none";
            document.body.style.overflow = "auto";
            updateStats();
        } else {
            throw new Error(data.error || 'Unknown error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error saving report: ' + error.message);
    });
};