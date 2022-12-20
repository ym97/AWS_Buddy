const AWS = require("aws-sdk");


// // Load credentials and set Region from JSON file
// AWS.config.loadFromPath('./config.json');

// Create DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10', region: 'us-east-1' });
var client = new AWS.DynamoDB.DocumentClient();


var myTable = 'Buddy-users-cognito';
exports.handler = async (event) => {
    const userName = event.userName;
    const email = event.request.userAttributes.email;
    const pincode = event.request.clientMetadata.pincode;
    const age = event.request.clientMetadata.age;
    const information = event.request.clientMetadata.information;
    const interests_json = event.request.clientMetadata.interests;
    const interests = JSON.parse(interests_json);
    const interest_array = interests.value
    
    var params = {
      TableName: myTable,
      Item: {'username' : {S: userName}, 'email' : {S: email}, 'pincode': {N: pincode}, 'age': {N: age},
            'description': {S: information}
      }
    };
    
    ddb.putItem(params, function(err, data) {
        if (err) {
          console.log("inside");
          console.log("Error", err);
        } else {
          console.log("inside");
          console.log("Success", data);
        }
      });
    client.put(params, function(err, data) {
        if (err) {
          console.log("inside");
          console.log("Error", err);
        } else {
          console.log("inside");
          console.log("Success", data);
        }
      });
    console.log(userName);
    console.log(email);
    console.log(pincode);
    console.log(information);
    console.log(interests);
    console.log(interests.value);
    return event;
};
