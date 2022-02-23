const AWS = require("aws-sdk");
const fs = require('fs');

//modify the AWS config object that DynamoDB will use to connect to the local instance
AWS.config.update({
    region: "us-east-1",
  });

  // create the DynamoDB service object
const dynamodb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

//use fs package to read users.json and assign the the object to const allusers
console.log("Importing thoughts into DynamoDB. Please wait.");
const allUsers = JSON.parse(fs.readFileSync('./server/seed/users.json', 'utf8'));

//loop over all users array and create the params objects
allUsers.forEach(user => {
    const params = {
      TableName: "Thoughts",
      Item: {
        "username": user.username,
        "createdAt": user.createdAt,
        "thought": user.thought
      }
    };
    //make a call to db with pub method.
    dynamodb.put(params, (err, data) => {
        if (err) {
          console.error("Unable to add thought", user.username, ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
          console.log("PutItem succeeded:", user.username);
        }
    });
});