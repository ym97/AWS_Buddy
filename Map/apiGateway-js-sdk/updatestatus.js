var apigClient = apigClientFactory.newClient({});
function updateStatus() {
            var ele = document.getElementsByName('status');
            for(i = 0; i < ele.length; i++) {
                if(ele[i].checked)
                {
                //Status is here
                // Update the status in RDBMS
                    //ele[i].value
                }

            }
        }
