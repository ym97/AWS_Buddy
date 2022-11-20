var apigClient = apigClientFactory.newClient({});


function searchByText() {
    var query = document.getElementById('query');
    if (query.value) {
        query = query.value.toLowerCase().trim();
        searchAll(query);
    } else {
        alert('No valid input');
    }
}

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    //TODO
    //Change it to the GPS coordinates of the user and only add those events k-radius
    center: { lat: 40.75442 , lng: -73.96879 },
    });
}

function createMapMarkers(response) {
    const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: 40.75442 , lng: -73.96879 },
    });
    var n = 0;
    var markers = []
    while (n < response.length) {
        event_ID = response[n]['id'];
        event_name = response[n]['name'];
        event_lat = response[n]['latitude'];
        event_lon = response[n]['longitude'];
        markers.push([{lat: event_lat, lng: event_lon}, event_name, event_ID])
        n++;
    }
    console.log(markers);
    const infoWindow = new google.maps.InfoWindow();
    markers.forEach(([position, title, ID], i) => {
            const marker = new google.maps.Marker({
              position,
              map,
              title: `${title}`,
              label: `${ID}`,
              optimized: false,
            });
            // Add a click listener for each marker, and set up the info window.
            marker.addListener("click", () => {
              infoWindow.close();
              infoWindow.setContent(marker.getTitle());
              infoWindow.open(marker.getMap(), marker);
            });
    });
    console.log('Added Markers successfully');
}

function searchAll(query) {
    console.log(query)
    var queryString = {'q' : query };
    console.log(queryString)
    apigClient.searchallGet(queryString, {}, {})
        .then(function(result) {
            tags = result['data']['tags'];
            response = result['data']['events'];
            console.log(tags)
            console.log(response)
            if (!response){
               alert('No events found!')
            }
          else{
            createMapMarkers(response);
          }
        }).catch(function(result) {
            console.log(result);
        });
}
window.initMap = initMap;