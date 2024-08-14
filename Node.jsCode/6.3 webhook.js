const express = require("express");
const app = express();

const dialogflow = require('@google-cloud/dialogflow').v2beta1;
const bodyParser = require("body-parser");

const moment = require('moment-timezone');
const axios = require('axios');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Function to call the flight status API
async function getFlightStatus(requestData) {
    try {
        const response = await axios.post('http://localhost:3000/flightstatus', requestData);
        console.log('Response from API:', response.data);

        return response.data;
    } catch (error) {
        console.error('Error calling API:', error);
		return null;
    }
}

app.post("/webhook", async (request, response) => {
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
			  },
			  sessionInfo:{
				session:JSON.stringify(request.body.sessionInfo.session),
					  parameters:{
						 IsCCOpen : "true"
					  }
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
   else if (tag == "APICallTag") {
	   
	   var Dep_City = request.body.sessionInfo.parameters.dep_city;
	   var Arr_City = request.body.sessionInfo.parameters.arr_city;
	   var Time = request.body.sessionInfo.parameters.time.originalValue;
	   var Card = request.body.sessionInfo.parameters.card;
	   
	   console.log(Dep_City);
	   console.log(Arr_City);
	    console.log(Time);
		 console.log(Card);
	   
	   // Data to send in the POST request
		const requestData = {
			dep_city: Dep_City,
			arr_city: Arr_City,
			card: Card,
			time: Time
		};
		
		var jsonObj = await getFlightStatus(requestData);
		
		if (jsonObj.flights.length > 0) {
			
			 jsonResponse = {
			  //fulfillment text response to be sent to the agent if there are no defined responses for the specified tag
			  fulfillment_response: {
				messages: [
				  {
					text: {
					  ////fulfillment text response to be sent to the agent
					  text: [
						"I have found below flight details: \n\n Flight Number : "+ jsonObj.flights[0].flightNumber +"\n Airline : "+ jsonObj.flights[0].airline +"\n departureCity : "+ jsonObj.flights[0].departureCity +"\n arrivalCity : "+ jsonObj.flights[0].arrivalCity +"\n price : "+ jsonObj.flights[0].price +"\n departureTime : "+ jsonObj.flights[0].departureTime +"\n\n Flight Number : "+ jsonObj.flights[1].flightNumber +"\n Airline : "+ jsonObj.flights[1].airline +"\n departureCity : "+ jsonObj.flights[1].departureCity +"\n arrivalCity : "+ jsonObj.flights[1].arrivalCity +"\n price : "+ jsonObj.flights[1].price +"\n departureTime : "+ jsonObj.flights[1].departureTime 
					  ]
					}
				  }
				]
			  }
			};
            
        } else {
            jsonResponse = {
			  //fulfillment text response to be sent to the agent if there are no defined responses for the specified tag
			  fulfillment_response: {
				messages: [
				  {
					text: {
					  ////fulfillment text response to be sent to the agent
					  text: [
						`Sorry no flights are available for given dates`
					  ]
					}
				  }
				]
			  }
			};
			
        }
		
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
