var markerList = [];
var allMarkers = [];
var markers = L.markerClusterGroup({ chunkedLoading: true, chunkProgress: updateProgressBar });

$('#addressInput').on("keyup", function(e) {
  var val = $('#addressInput').val();
  var refreshNeeded = false;
  var newMarkers = [];
  if (val.length > 3 && val.substring(0,3) === 'R72') {
    for (var i = 0; i < allMarkers.length; i++) {
      if (allMarkers[i].parcelid && allMarkers[i].parcelid.indexOf(val) >= 0) {
        newMarkers.push(allMarkers[i]);
      }
    }
    refreshNeeded = true;
    markerList = newMarkers;
  }
  else if (val.length > 0 && val !== 'R' && val !== 'R7') {
    for (var j = 0; j < allMarkers.length; j++) {
      if (allMarkers[j].address && allMarkers[j].address.indexOf(val) >= 0) {
        newMarkers.push(allMarkers[j]);
      }
    }
    refreshNeeded = true;
    markerList = newMarkers;
  }
  if (newMarkers.length === 0) {
    markerList = allMarkers;
  }

  if (refreshNeeded) {
    markers.clearLayers();
    markers.addLayers(markerList);
  }
});

var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
}),
latlng = L.latLng(39.758948, -84.191607);
var map = L.map('map', { center: latlng, zoom: 10, layers: [tiles] });
var progress = document.getElementById('progress');
var progressBar = document.getElementById('progress-bar');
function updateProgressBar(processed, total, elapsed, layersArray) {
  if (elapsed > 1000) {
    // if it takes more than a second to load, display the progress bar:
    progress.style.display = 'block';
    progressBar.style.width = Math.round(processed/total*100) + '%';
  }
  if (processed === total) {
    // all markers processed - hide the progress bar:
    progress.style.display = 'none';
  }
}
markerList = [];
for (var i = 0; i < points.length; i++) {
  var a = points[i];
  var title = a.parcelid;
  var marker = L.marker(L.latLng(parseFloat(a.locationdata.latitude), parseFloat(a.locationdata.longitude)), { title: title});
  marker.address = a.street;
  marker.parcelid = a.parcelid;

  marker.on('click', function(e) {
    console.log(e);
    $('#selectedAddress').text(e.target.address);
    $('#selectedParcelId').text(e.target.parcelid);
  });
  marker.bindPopup(title);
  markerList.push(marker);
}
allMarkers = markerList;
markers.addLayers(markerList);
map.addLayer(markers);

