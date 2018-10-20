// Connect to the websocket server

var socket = io()

socket.on('update', (seats) => {
	console.log(seats)

	data = seats.map(seat => ({
		location: new google.maps.LatLng(seat.loc[0], seat.loc[1]),
		weight: seat.active ? 1.0 : 0.1
	}))

	addHeatMap(data)
})

// Create the heat map

var map, pointarray, heatmap;

function initializeMap() {
	// the map's options
	var mapOptions = {
		zoom: 20,
		center: new google.maps.LatLng(43.659603, -79.397372), // Bahen!
		gestureHandling: 'none',
		zoomControl: false,
	};

	// the map and where to place it
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

function addHeatMap(data) {
	var pointArray = new google.maps.MVCArray(data);

	if (heatmap) {
		for (let i = 0; i < data.length; i++) {
			pointarray.setAt(i, data[i])
		}
	} else {
		pointarray = pointArray
		heatmap = new google.maps.visualization.HeatmapLayer({
			data: pointarray,
			radius: 50,
			maxIntensity: 1.5
		});
	
		heatmap.setMap(map)
	}
}

// as soon as the document is ready the map is initialized
google.maps.event.addDomListener(window, 'load', initializeMap);
