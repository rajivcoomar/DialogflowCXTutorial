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
		
		/*if(jsonObj == null)
		{
			jsonResponse = {
			  //fulfillment text response to be sent to the agent if there are no defined responses for the specified tag

			  sessionInfo:{
				session:JSON.stringify(request.body.sessionInfo.session),
					  parameters:{
						 HTTPResult : "false"
					  }
				}
			};
		}
		else */ if (jsonObj.flights.length > 0) {
			
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
			  },
			   sessionInfo:{
				session:JSON.stringify(request.body.sessionInfo.session),
					  parameters:{
						 HTTPResult : "true"
					  }
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
			  },
			   sessionInfo:{
				session:JSON.stringify(request.body.sessionInfo.session),
					  parameters:{
						 HTTPResult : "true"
					  }
				}
			};
			
        }
		
		response.json(jsonResponse);
	   
	
   
	   
   }
   if (tag == "OrderFlipkart") {
	   
	var itemname = request.body.sessionInfo.parameters.itemname;
	//var fkorder = " red bandana";
	console.log("itemname  :"+ itemname);
	
	
			var config = {
			  method: 'get',
			  url: 'https://affiliate-api.flipkart.net/affiliate/1.0/search.json?query='+itemname+'&resultCount=5',
			  headers: { 
				'cache-control': 'no-cache',
				 'content-type': 'application/json' ,
				 'Fk-Affiliate-Id':'rajivcoomar',
				 'Fk-Affiliate-Token':'9a5d696cc06a41d6a2c3cd479298b9b9',
				 'User-Agent':'PostmanRuntime/7.40.0'
			  }
			};

			axios(config)
			.then(function (responseExt) {
			  //console.log(JSON.stringify(response.data));
			  
			   var data = JSON.parse(JSON.stringify(responseExt.data));
			   console.log(data.products.length);
			   
			   if(data.products.length == 0)
			   {
				   jsonResponse = {
						  fulfillment_response: {
							messages: [
							  {
								text: {
								  //fulfillment text response to be sent to the agent
								  text: ["Sorry no item found for " +itemname]
								}
							  },
							  
							  {
								  
									payload: {
										richContent: [
										[
										  
										  
										  {
											type: "chips",
											options: [
											  {
												text: "Restart bot",
												image: {
												  src: {
													rawUrl: "https://www.hopkinsmedicine.org/coronavirus/_images/personal-preparedness.jpg"
												  }
												}
											   
											  }
											  ,
											
											  {
												text: "End Bot",
												image: {
												  src: {
													rawUrl: "https://www.who.int/images/default-source/infographics/who-emblem.png?sfvrsn=877bb56a_2"
												  }
												}
											   
											  }
											]
										}
										]
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
			   
					    var o = {};
						var fulfillment_response = 'fulfillment_response';
						var messages = 'messages';
						var payload = 'payload';
						var richContent = 'richContent';

						o[fulfillment_response] = {}; 
						o[fulfillment_response][messages] = [];  


						  
						var dataText = {
									text: {
									  text: [
										'Flipkart Online Portal' 
									  ]
									}
								};
						o[fulfillment_response][messages].push(dataText);

						var op = {};
						op[payload] = {};
						op[payload][richContent] = [];

						var arr = [];
						
					   for(var i=0; i< data.products.length ;i++)
					   {
						   
							 var modifedDescription = "";
								if(data.products[i].productBaseInfoV1.productDescription.length > 101)
								{
									modifedDescription = data.products[i].productBaseInfoV1.productDescription.substring(0, 101)   +"...";
								}
								else{
									modifedDescription = data.products[i].productBaseInfoV1.productDescription ;
								}
							   
							   var data_tmp = {
									type: "info",
									title: data.products[i].productBaseInfoV1.title ,
									subtitle: modifedDescription,
									image: {
											  src: {
												rawUrl: data.products[i].productBaseInfoV1.imageUrls['200x200']
											  }
											},
									actionLink: data.products[i].productBaseInfoV1.productUrl
								};
								arr.push(data_tmp);
						   
						   
					   }
					   
					   
					   var chips = {
									type: "chips",
									options: [
										{
												text: "End Bot",
												image: {
												  src: {
													rawUrl: "https://www.hopkinsmedicine.org/coronavirus/_images/personal-preparedness.jpg"
												  }
												}
											   
									  },
									  {
										text: "Restart Bot",
										image: {
										  src: {
											rawUrl: "https://www.who.int/images/default-source/infographics/who-emblem.png?sfvrsn=877bb56a_2"
										  }
										}
									   
									  }
									  
									]
								};
												
					   arr.push(chips);
					   op[payload][richContent].push(arr);
					   o[fulfillment_response][messages].push(op);
					   
					   
					   
			   }
			   
			   	response.json(o);
			  
			})
			.catch(function (error) {
			  console.log(error);
			});
	
	
	
	   
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
