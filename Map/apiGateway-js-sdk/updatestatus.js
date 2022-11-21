var apigClient = apigClientFactory.newClient({});
function updateStatus() {
            var ele = document.getElementsByName('status');
            for(i = 0; i < ele.length; i++) {
                if(ele[i].checked)
                {
                //Status is here
                // Update the status in RDBMS
                    //ele[i].value

                    //TODO Temporary userid using
                    request = { 'eventID': }
                    apigClient.updateeventstatusPost(queryString, {}, {})
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

            }
        }
