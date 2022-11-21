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
    const infoWindow_hover = new google.maps.InfoWindow();
    const infoWindow_event = new google.maps.InfoWindow();
    markers.forEach(([position, title, ID], i) => {
            const marker = new google.maps.Marker({
              position,
              map,
              title: `${ID}:${title}`,
//              label: `${ID}`,
              optimized: false,
            });

            //Show Title when we hover
            marker.addListener('mouseover', function() {
            infoWindow_hover.setContent(marker.getTitle());
            infoWindow_hover.open(marker.getMap(), marker);
            });
            // assuming you also want to hide the infowindow when user mouses-out
            marker.addListener('mouseout', function() {
                infoWindow_hover.close();
            });

            // Add a click listener for each marker, and set up the info window.
            marker.addListener("click", () => {
             //    TODO currently passing a userID.
                var user_ID = 'Manisha'
                var queryString = {'eventID' : ID, 'userID': user_ID };
                console.log(queryString);
                var details = {};
                apigClient.eventdetailsGet(queryString, {}, {})
                    .then(function(result) {
                        details = result['data'];
                        console.log(details);
                        eventContentPage = eventContent(ID,title,details);
//                        console.log(eventContentPage);
                        infoWindow_event.close();
                        infoWindow_event.setContent(eventContentPage);
                        infoWindow_event.open(marker.getMap(), marker);
                    }).catch(function(result) {
                        console.log(result);
                    });
            });
    });
    console.log('Added Markers successfully');
}

function eventContent( ID, name, details ){
    console.log(details);
    console.log(ID);
    console.log(name);
    var content = '<div id="eventPopup">'+
                    '<h3 id="eventID_popup">' + ID + '</h2>'+
                    '<h2>' +  name + '</h2>'+
                    '<h3>' + details['event_summary'] + '</h3>'+
                    '<h3>' + details['address'] + '</h3>'+
                    '<h4>' + details['start_date'] + '</h4>'+
                    '<h4>' + details['end_date'] + '</h4>'+
                    '<a href=\''+details['direction_url']+'\' target=\'_blank\' >Directions</a><br>'+
                    '<a href=\''+details['url']+'\'  target=\'_blank\' >Event Details</a>';
    var goingPpl = "";
    var interestedPpl = "";
    for (let row in details['Going']){
        goingPpl += details['Going'][row] + ',';
    }
    for (let row in details['Interested']){
        interestedPpl += details['Interested'][row] + ',';
    }
    if (goingPpl.length>0){
        content += '<h4> GOING: ' + goingPpl + '</h4>';
    }
    if (interestedPpl.length>0){
        content += '<h4> INTERESTED: ' + interestedPpl + '</h4>';
    }
    content += '</div>';
    content += '<div id="UpdateStatus">'+
                '<form action="/action_page.php">'+
                '<p>I am </p>'+
                    '<input type="radio" id="going" name="status" value="Going">Going'+
                    '<input type="radio" id="interested" name="status" value="Interested">Interested'+
                    '<input type="radio" id="notgoing" name="status" value="Not Going">Not Going'+
                '</form>'+
                '<button type="button" id="updatestatusbutton" onclick="updateStatus()">Update</button>'+
              '</div>';
    return content;
}

function updateStatus() {
//TODO PASS USER ID TOO
    var ele = document.getElementsByName('status');
    var eventID = document.getElementById('eventID_popup').innerHTML.trim();
    console.log('haha');
    console.log(eventID);
    for(i = 0; i < ele.length; i++) {
        if(ele[i].checked)
        {
        //Status is here
        // Update the status in RDBMS
        //ele[i].value
            //TODO Temporary userid now. Update to directly fetch a userID
            console.log(ele[i].value);
            queryString = { 'eventID': eventID, 'userID': 'Manisha', 'status':ele[i].value };

            apigClient.updateeventstatusPost(queryString, {}, {})
                .then(function(result) {
                    console.log(result);
                }).catch(function(result) {
                    console.log(result);
                });
        }
    }
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