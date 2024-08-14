const express = require("express");
const app = express();

const dialogflow = require('@google-cloud/dialogflow').v2beta1;
const bodyParser = require("body-parser");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.post("/webhook", (request, response) => {
  let tag = request.body.fulfillmentInfo.tag;
  let jsonResponse = {};
 
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  
   if (tag == "SalesTag") {
	jsonResponse = {
      //fulfillment text response to be sent to the agent if there are no defined responses for the specified tag
      fulfillment_response: {
        messages: [
          {
            text: {
              ////fulfillment text response to be sent to the agent
              text: [
                `This is response coming from webhook for sales tag`
              ]
            }
          }
        ]
      }
    };
	response.json(jsonResponse);
   
	   
   }
   else {
    jsonResponse = {
      //fulfillment text response to be sent to the agent if there are no defined responses for the specified tag
      fulfillment_response: {
        messages: [
          {
            text: {
              ////fulfillment text response to be sent to the agent
              text: [
                `There are no fulfillment responses defined for "${tag}"" tag`
              ]
            }
          }
        ]
      }
    };
	response.json(jsonResponse);
  }
  
  });
  
  
var port = process.env.PORT || 8080; 
const listener = app.listen(port, () => {
 console.log("Your app is listening on port " + listener.address().port);
});
