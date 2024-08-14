const express = require("express");
const app = express();

const dialogflow = require('@google-cloud/dialogflow').v2beta1;
const bodyParser = require("body-parser");

const moment = require('moment-timezone');


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
   else if (tag == "CheckOpen") {
	   
	   var MonStart = request.body.sessionInfo.parameters.MonStart;
	   var MonEnd = request.body.sessionInfo.parameters.MonEnd;
	   var WedStart = request.body.sessionInfo.parameters.WedStart;
	   var WedEnd = request.body.sessionInfo.parameters.WedEnd;
	   
	   console.log(WedStart);
	   console.log(WedEnd);
	   
	   // Get the current time in IST
		const now = moment().tz('Asia/Kolkata');
		const currentHour = now.format('HHmm');  // Format as HHmm (e.g., 0930 for 09:30 AM)

		// Convert currentHour to a number
		const currentHourNum = parseInt(currentHour, 10);

		// Check if the current time is within the working hours
		const isInWorkingHours = currentHourNum >= WedStart && currentHourNum <= WedEnd;
		
		console.log(isInWorkingHours);
		
		if(isInWorkingHours)
		{
			jsonResponse = {
			  //fulfillment text response to be sent to the agent if there are no defined responses for the specified tag
			  fulfillment_response: {
				messages: [
				  {
					text: {
					  ////fulfillment text response to be sent to the agent
					  text: [
						`Call center is open`
					  ]
					}
				  }
				]
			  }
			};
			response.json(jsonResponse);
		}
		else
		{
			
			jsonResponse = {
			  //fulfillment text response to be sent to the agent if there are no defined responses for the specified tag
			  fulfillment_response: {
				messages: [
				  {
					text: {
					  ////fulfillment text response to be sent to the agent
					  text: [
						`Call center is close`
					  ]
					}
				  }
				]
				
			  },
			  sessionInfo:{
				session:JSON.stringify(request.body.sessionInfo.session),
					  parameters:{
						 IsCCOpen : "false"
					  }
				}
			};
			response.json(jsonResponse);
			
		}
	   
	
   
	   
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
