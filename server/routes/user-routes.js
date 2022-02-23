//use express and router() to create routes
const express = require('express');
const router = express.Router();

//Configure the service interface
const AWS = require("aws-sdk");
const awsConfig = {
  region: "us-east-1"
 };
AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();
const table = "Thoughts";

//create the get route to access all thoughts
router.get('/users', (req, res) => {
  const params = {
    TableName: table
  };
  // Scan return all items in the table
  dynamodb.scan(params, (err, data) => {
    if (err) {
      res.status(500).json(err); // an error occurred
    }else {
      res.json(data.Items)
    }
  });
})

//Create the GET Route to Access All Thoughts from a User
router.get('/users/:username', (req, res) => {
  console.log(`Querying for thought(s) from ${req.params.username}.`);
  //declare params to define the query call to DynamoDB. We'll use the username retrieved from req.params to provide a condition for the query
  const params = {
    TableName: table,
    KeyConditionExpression: "#un = :user",
    ExpressionAttributeNames: {
      "#un": "username",
      "#ca": "createdAt",
      "#th": "thought",
      "#img": "image"    // add the image attribute alias
    },
    ExpressionAttributeValues: {
      ":user": req.params.username
    },
    ProjectionExpression: "#un, #th, #ca, #img", // add the image to the database response
    ScanIndexForward: false
  };
  //use the service interface object, dynamodb, and the query method to retrieve the user's thoughts from the database
  dynamodb.query(params, (err, data) => {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      res.status(500).json(err); // an error occurred
    } else {
      console.log("Query succeeded.");
      res.json(data.Items)
    }
  });
});

//Create the POST Route to Create a New Thought
router.post('/users', (req, res) => {
  const params = {
    TableName: table,
    Item: {
      "username": req.body.username,
      "createdAt": Date.now(),
      "thought": req.body.thought,
      "image": req.body.image //add new image attribute
    }
  };
  dynamodb.put(params, (err, data) => {
    if (err) {
      console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
      res.status(500).json(err); // an error occurred
    } else {
      console.log("Added item:", JSON.stringify(data, null, 2));
      res.json({"Added": JSON.stringify(data, null, 2)});
    }
  });
});  // ends the route for router.post('/users')

module.exports = router;