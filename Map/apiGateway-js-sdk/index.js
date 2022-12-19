var apigClient = apigClientFactory.newClient({});
var mapstyle = [
    {
        "featureType": "all",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 20
            },
            {
                "visibility": "on"
            },
            {
                "color": "#191919"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 21
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "weight": "1.08"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ff0000"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "weight": "2.12"
            },
            {
                "hue": "#00ff95"
            },
            {
                "saturation": "52"
            },
            {
                "lightness": "34"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 18
            },
            {
                "visibility": "on"
            },
            {
                "weight": "0.68"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#373737"
            },
            {
                "lightness": 16
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#252525"
            },
            {
                "lightness": 19
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#0f0f0f"
            },
            {
                "lightness": 17
            },
            {
                "visibility": "on"
            }
        ]
    }
]
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
document.getElementById("displayusernamediv").innerHTML = username;
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
            document.getElementById('SearchBar').style.display ='none';
            if ( typeof curr === 'undefined' ){
                    curr= [40.75442,-73.96879];
                    console.log('Centered to Manhattan');
            }
            //TODO Have some better way to handle this. Perhaps have an initial page? and only show this fucntion with buddies
            else if (curr.length === 0 ){
                    curr= [40.75442,-73.96879];
                    console.log('Centered to Manhattan');

            }
            else{
                console.log('Centered to user location');
            }
            const map = new google.maps.Map(document.getElementById("map"), {
                    zoom: 12,
                    center: { lat: curr[0] , lng: curr[1] },
                    styles: mapstyle
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
                                                url: 'Images/bud.png', // url
                                                scaledSize: new google.maps.Size(60, 60), // scaled size
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

//This function has conditions from both buddy and event display. There is some overlap of functions!
function createRecommendationMarkers(res_events, res_buddies){
    const map = new google.maps.Map(document.getElementById("map"), {
                    zoom: 12,
                    center: { lat: curr[0] , lng: curr[1] },
                    styles: mapstyle
                });

    // Get details for the events and buddies from the recommendations
    var n = 0;
    var markers = []
    while (n < res_events.length) {
        event_ID = res_events[n]['id'];
        event_name = res_events[n]['name'];
        event_lat = res_events[n]['latitude'];
        event_lon = res_events[n]['longitude'];
        markers.push([{lat: event_lat, lng: event_lon}, [event_name, event_ID]])
        n++;
    }

    n = 0;
    while (n < res_buddies.length) {
        username2 = res_buddies[n]['username'];
        buddy_lat = Number(res_buddies[n]['latitude']);
        buddy_lon = Number(res_buddies[n]['longitude']);
        markers.push([{lat: buddy_lat, lng: buddy_lon}, [username2]])
        n++;
    }



    // BUDDY Markers
    console.log(markers);
    const infoWindow_hover_rec = new google.maps.InfoWindow();
    const infoWindow_rec = new google.maps.InfoWindow();
    markers.forEach(([position, detailsList], i) => {

            var isBuddy = false; //Event marker
            var iconURL = 'Images/star.png';
            var iconSize = 60;
            if( detailsList.length == 1){
                //BUDDY Marker
                isBuddy = true;
                iconURL = 'Images/bud.png';
                iconSize = 65;
            }

            const icon = {
                            url: iconURL, // url
                            scaledSize: new google.maps.Size(iconSize, iconSize), // scaled size
                         };
            const marker = new google.maps.Marker({
                  position,
                  map,
                  title: `${detailsList[0]}`,
                  optimized: false,
                  icon:icon,
                });//Show Title when we hover
            marker.addListener('mouseover', function() {
            infoWindow_hover_rec.setContent(marker.getTitle());
            infoWindow_hover_rec.open(marker.getMap(), marker);
            });
            // assuming you also want to hide the infowindow when user mouses-out
            marker.addListener('mouseout', function() {
                infoWindow_hover_rec.close();
            });

            //TODO ADD BUDDY DETAILS.

            // Add a click listener for each marker, and set up the info window.
            marker.addListener("click", () => {

                if( isBuddy ){
                    var queryString = {'userID' : detailsList[0] };
                    console.log(queryString);
                    var details = {};
                    apigClient.buddydetailsGet(queryString, {}, {})
                        .then(function(result) {
                            details = result['data'];
                            console.log(details);
                            buddyContentPage = buddyContent(detailsList[0],details);
                            infoWindow_rec.close();
                            infoWindow_rec.setContent(buddyContentPage);
                            infoWindow_rec.open(marker.getMap(), marker);
                        }).catch(function(result) {
                            console.log(result);
                        });
                }
                else{
                    var queryString = {'eventID' : detailsList[1], 'userID': username };
                    console.log(queryString);
                    var details = {};
                    apigClient.eventdetailsGet(queryString, {}, {})
                        .then(function(result) {
                            details = result['data'];
                            console.log(details);
                            eventContentPage = eventContent(detailsList[1],detailsList[0],details);
                            infoWindow_rec.close();
                            infoWindow_rec.setContent(eventContentPage);
                            infoWindow_rec.open(marker.getMap(), marker);
                        }).catch(function(result) {
                            console.log(result);
                        });
                }

            });
   });
}
function createMapMarkers(response) {
    const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: 40.75442 , lng: -73.96879 },
    styles: mapstyle
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
            const icon = {
                            url: 'Images/star.png', // url
                            scaledSize: new google.maps.Size(65, 65), // scaled size
                         };
            const marker = new google.maps.Marker({
              position,
              map,
              title: `${ID}:${title}`,
//              label: `${ID}`,
              optimized: false,
              icon:icon,
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
    //Show recommendations for events and buddies. Same functionalities.
    apigClient.randomeventsGet({}, {}, {})
        .then(function(result) {
            rand_events = result['data']['events'];
            console.log(rand_events)
            if (!response){
               alert('No events found nearby!')
            }
          else{
            createMapMarkers(rand_events);
          }
        }).catch(function(result) {
            console.log(result);
        });

}
function showRecommendations(){
    document.getElementById('SearchBar').style.display ='none';
    //Show recommendations for events and buddies. Same functionalities.
    var queryString = { 'username': username };
    console.log(queryString)
    apigClient.recommendationsGet(queryString, {}, {})
        .then(function(result) {
            console.log(result);
            rec_events = result['data']['event_list'];
            rec_buddies = result['data']['buddy_list'];
            console.log(rec_events)
            console.log(rec_buddies)
            if (rec_buddies.length === 0 && rec_events.length===0){
               alert('No enough data to suggest recommendations. Pls fill your interests or start searching for events!')
            }
          else{
            createRecommendationMarkers(rec_events, rec_buddies);
          }
        }).catch(function(result) {
            console.log(result);
        });

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
    var content = '<div class ="popup" id="eventID_popup_total"><div id="eventPopup">'+
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
              '</div></div>';
    return content;
}

function buddyContent( username1, details ){
    console.log(details);
    console.log(username1);
    var content = '<div id="buddyPopup" class = "popup" >'+
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
    document.getElementById('eventID_popup_total').style.display = "none"
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
                    alert('Updated status!');
                }).catch(function(result) {
                    console.log(result);
                });
        }
    }
}

function searchAll(query) {
    console.log(query)
    var queryString = {'q' : query, 'username': username };
    console.log(queryString)
    apigClient.searchallGet(queryString, {}, {})
        .then(function(result) {
            tags = result['data']['tags'];
            response = result['data']['events'];
            console.log(tags)
            console.log(response)
            document.getElementById('query').value = "";
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

function setDate() {
  var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
  var dayNames= [ "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday" ];
  var newDate = new Date(datestring);
  var hours = newDate.getHours();
	$(".hour").html(( hours < 10 ? "0" : "" ) + hours);
    var seconds = newDate.getSeconds();
	$(".second").html(( seconds < 10 ? "0" : "" ) + seconds);
    var minutes = newDate.getMinutes();
	$(".minute").html(( minutes < 10 ? "0" : "" ) + minutes);

    $(".month span,.month2 span").text(monthNames[newDate.getMonth()]);
    $(".date span,.date2 span").text(newDate.getDate());
    $(".day span,.day2 span").text(dayNames[newDate.getDay()]);
    $(".year span").html(newDate.getFullYear());
};

window.initMap = initMap;