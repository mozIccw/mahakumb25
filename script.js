// Initialize the Leaflet map
var map = L.map('map', {
    center: [25.4683, 81.8546],
    zoom: 11
});

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 25,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to add markers 
document.addEventListener('DOMContentLoaded', function () {
    var tableRows = document.querySelectorAll('tbody tr');
    
    tableRows.forEach(function (row) {
        var lat = parseFloat(row.querySelector('.lat').getAttribute('data-lat'));
        var lng = parseFloat(row.querySelector('.lng').getAttribute('data-lng'));
        
        if (!isNaN(lat) && !isNaN(lng)) {
            var marker = L.marker([lat, lng]).addTo(map);
            marker.bindPopup("<b>Sample ID:</b> " + row.cells[0].textContent + "<br><b>Source:</b> " + row.cells[2].textContent);
        }
    });
});


document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById('imageModal');
    var modalImage = document.getElementById('enlargedImage');
    var closeModal = document.querySelector('.close');
    var images = document.querySelectorAll('.clickable-image');

    images.forEach(function (image) {
        image.addEventListener('click', function () {
            modal.style.display = 'block';
            modalImage.src = image.src;
        });
    });

    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});
