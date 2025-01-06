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
    var tableRows = document.querySelectorAll('tbody tr');
    
    // Loop through each row to add the marker
    tableRows.forEach(function (row) {
        // Get latitude and longitude from data attributes in the row
        var lat = parseFloat(row.querySelector('.lat').getAttribute('data-lat'));
        var lng = parseFloat(row.querySelector('.lng').getAttribute('data-lng'));
        
        if (!isNaN(lat) && !isNaN(lng)) {
            // Add marker to the map for this row
            var marker = L.marker([lat, lng]).addTo(map);
            marker.bindPopup("<b>Sample ID:</b> " + row.cells[0].textContent + "<br><b>Source:</b> " + row.cells[2].textContent);
            
            // Add click event listener to row
            row.addEventListener('click', function () {
                // Pan and zoom to the marker when the row is clicked
                map.flyTo([lat, lng], 15, { animate: true, duration: 1.5, easLinearity:0.25 }); // Fly to the marker with smooth animation
                setTimeout(function () {
                    marker.openPopup();
                }, 500); 
            });
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
