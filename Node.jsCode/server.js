const express = require("express");
const app = express();
var fs = require('fs');
const dialogflow = require('@google-cloud/dialogflow').v2beta1;
const bodyParser = require("body-parser");
const axios = require('axios');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));

app.post("/webhook", (request, response) => {
  let tag = request.body.fulfillmentInfo.tag;
  let jsonResponse = {};
 // console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  
   if (tag == "OrderIDVal") {
	   
	var fkorder = request.body.sessionInfo.parameters.fkorder;
	//var fkorder = " red bandana";
	console.log("fkorder id :"+ fkorder);
	
	
			var config = {
			  method: 'get',
			  url: 'https://affiliate-api.flipkart.net/affiliate/1.0/search.json?query='+fkorder+'&resultCount=5',
			  headers: { 
				'cache-control': 'no-cache',
				 'content-type': 'application/json' ,
				 'Fk-Affiliate-Id':'<your id>',
				 'Fk-Affiliate-Token':'<your token>',
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
								  text: ["Sorry no item found"]
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
   
   else if (tag == "Airline") {
	   
	   
	   
	   
	   
   }
  
  });
  
  
var port = process.env.PORT || 8080; 
const listener = app.listen(port, () => {
 console.log("Your app is listening on port " + listener.address().port);
});
//https.createServer(options, app).listen(443);