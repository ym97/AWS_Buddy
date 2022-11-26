var apigClient = apigClientFactory.newClient({});

function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        console.log(url);
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return 'notfound';
        if (!results[2]) return 'notfound';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
var username = getParameterByName('username');
console.log('Found username:'+username);
//var temp = document.getElementById("displayusernamediv");
//if(  !temp ){
//   var tag = document.createElement("span");
//   tag.id = "displayusernamediv";
//   tag.innerHTML = username;
//   document.getElementById("showusername").appendChild(tag);
//}
//else {
//    temp.innerHTML = username;
//}

let NavigationPromise = () => {
            return new Promise(function (resolve, reject) {
                navigator.geolocation.getCurrentPosition(
                    (position) => resolve(position),
                    (error) => reject(error)
                );
            });
        };

//var curr = updateLocation();
//function updateLocation() {
//    // your function code here
//    console.log('here to get location');
//    if(username !== 'notfound'){
//        NavigationPromise()
//                    .then((res) => {
//                                        console.log('Obtained user location');
//                                        var lat = res.coords.latitude;
//                                        var lng = res.coords.longitude;
//                                        var correctTo = 3;
//                                        if ( Number(lat.toFixed(correctTo))===Number(currlat.toFixed(correctTo)) &&
//                                              Number(lng.toFixed(correctTo))===Number(currlng.toFixed(correctTo)))
//                                              {
//                                             console.log('No location change. So, no update needed');
//                                        }
//                                        else {
//                                                currlat = lat;
//                                                currlng = lng;
//                                                queryString = { 'username': username, 'lat': lat, 'lng':lng };
//                                                console.log(queryString);
//                                                apigClient.updatebuddylocationPost(queryString, {}, {})
//                                                    .then(function(result) {
//                                                        console.log(result);
//                                                        console.log('Updated user location');
//                                                    }).catch(function(result) {
//                                                        console.log(result);
//                                                        console.log('Failed to update user location');
//                                                    });
//                                        }
//                        }) .catch((error) => {
//                                console.log('Unable to update user location');
//                          });
//        setTimeout(updateLocation, 30000); //every 5 minutes
//    };
//    console.log('No user name found');
//};
//updateLocation();
//
//////////////////
var curr;
function updateLocation() {
    console.log('here to get location');
    if(username !== 'notfound'){
        NavigationPromise()
                    .then((res) => {
                                        console.log('Obtained user location');
                                        var lat = res.coords.latitude;
                                        var lng = res.coords.longitude;
                                        var updateOrNot = false;
                                        if( typeof curr === 'undefined'){
                                            updateOrNot = true;
                                        }
                                        else if( curr[0] !== lat || curr[1] !== lng){
                                            updateOrNot = true;
                                        }
                                        if(updateOrNot){
                                            curr = [lat,lng];
                                            console.log('New Location: ');
                                            console.log(curr);

                                            queryString = { 'username': username, 'lat': curr[0], 'lng':curr[1] };
                                            console.log(queryString);
                                                apigClient.updatebuddylocationPost(queryString, {}, {})
                                                    .then(function(result) {
                                                        console.log(result);
                                                        console.log('Updated user location');
                                                        setTimeout(updateLocation, 300000); //every 5 minutes
                                                    }).catch(function(result) {
                                                        console.log(result);
                                                        console.log('Failed to update user location');
                                                    });
                                        }

                        }) .catch((error) => {
                                console.log('Unable to obtain user location');
                                curr = [];
                                setTimeout(updateLocation, 600000); //every 5 minutes
                          });
    }
    else{
        curr =  [];
    };

};
updateLocation();

function searchByText() {
    var query = document.getElementById('query');
    if (query.value) {
        query = query.value.toLowerCase().trim();
        searchAll(query);
    } else {
        alert('No valid input');
    }
}
function logoutmaps(){
//We can change this function to redirect to chat window.
    var win = window.open("about:blank", "_self");
    win.close();

}
function initMap() {
            if ( curr.length === 0){
                    curr= [40.75442,-73.96879];
                    console.log('Centered to Manhattan');
            }
            else{
                console.log('Centered to user location');
            }
            const map = new google.maps.Map(document.getElementById("map"), {
                    zoom: 12,
                    center: { lat: curr[0] , lng: curr[1] },
              });
            apigClient.getalllocationsGet({}, {}, {})
                    .then(function(result) {
                        response = result['data'];
                        var n = 0;
                        var markers = []
                        while (n < response.length) {
                            username1 = response[n]['username'];
                            buddy_lat = Number(response[n]['latitude']);
                            buddy_lon = Number(response[n]['longitude']);
                            markers.push([{lat: buddy_lat, lng: buddy_lon}, username1])
                            n++;
                        }
                        console.log(markers);
                        const infoWindow_hover = new google.maps.InfoWindow();
                        const infoWindow_buddy = new google.maps.InfoWindow();
                        markers.forEach(([position, username1], i) => {
//                                console.log(position);
//                                console.log(username1);

                                const icon = {
                                                url: 'Images/buddy2.png', // url
                                                scaledSize: new google.maps.Size(40, 40), // scaled size
                                            };
                                const marker = new google.maps.Marker({
                                  position,
                                  map,
                                  title: `${username1}`,
                                  optimized: false,
                                  icon:icon
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


                                //TODO ADD BUDDY DETAILS.

                                // Add a click listener for each marker, and set up the info window.
                                marker.addListener("click", () => {
                                    var queryString = {'userID' : username1 };
                                    console.log(queryString);
                                    var details = {};
                                    apigClient.buddydetailsGet(queryString, {}, {})
                                        .then(function(result) {
                                            details = result['data'];
                                            console.log(details);
                                            buddyContentPage = buddyContent(username1,details);
                                            infoWindow_buddy.close();
                                            infoWindow_buddy.setContent(buddyContentPage);
                                            infoWindow_buddy.open(marker.getMap(), marker);
                                        }).catch(function(result) {
                                            console.log(result);
                                        });
                                });
                        });



                    }).catch(function(result) {
                        console.log(result);
                        console.log('Here');
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
//                var user_ID = 'Manisha'
//                var queryString = {'eventID' : ID, 'userID': user_ID };
                var queryString = {'eventID' : ID, 'userID': username };
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

function showAllEvents(){
    document.getElementById('SearchBar').style.display ='block';
    //TODO Fetch n random events and mark them to map.
    //Now that the searchBar is activated, we can fetch the required events and display their markers.
}
function showRecommendations(){
    document.getElementById('SearchBar').style.display ='none';

    //TODO Fetch recommendations
    //Show recommendations for events and buddies. Same functionalities.
}
function showShops(){
    document.getElementById('SearchBar').style.display ='none';
    //TODO shops
}
function showProfile(){
    document.getElementById('SearchBar').style.display ='none';
    //TODO details and update buttons
    // Show our details
    // Update button
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

function buddyContent( username1, details ){
    console.log(details);
    console.log(username1);
    var content = '<div id="buddyPopup">'+
                    '<h2 id="buddyName_popup">' + username1 + '</h2>'+
                    '<h3>Age: ' + details['age'] + '</h3>'+
                    '<h3>Description: ' + details['description'] + '</h3>'+
                    '<h4>Email: ' + details['email'] + '</h4>'+
                    '<h4>Pincode: ' + details['pincode'] + '</h4>'+
                    '<h5>Interests:';
    for (let inter in details['interests']){
        content += details['interests'][inter]+', ';
    }
    content  += '</h5>';

    content += '<h4>Going: ';
    for (let row in details['Going']){
        content += '<a href=\'' + details['Going'][row][1] + '\'>'+ details['Going'][row][0]+'</a>, ';
    }
    content  += '</h4>';


    content += '<h4>Interested: ';
    for (let row in details['Interested']){
        content += '<a href=\'' + details['Interested'][row][1] + '\'>'+ details['Interested'][row][0]+'</a>, ';
    }
    content  += '</h4>';
    content += '</div>';
    return content;
}

function updateStatus() {
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
            console.log(ele[i].value);
//            queryString = { 'eventID': eventID, 'userID': 'Manisha', 'status':ele[i].value };
            queryString = { 'eventID': eventID, 'userID': username, 'status':ele[i].value };

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