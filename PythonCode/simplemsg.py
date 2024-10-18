from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/webhook", methods=['POST'])
def webhook():
    req_data = request.get_json()  # Get JSON data from request
    tag = req_data.get('fulfillmentInfo', {}).get('tag', '')
    json_response = {}

    print('Dialogflow Request body: ', req_data)

    if tag == "SalesTag":
        cityname = req_data['sessionInfo']['parameters'].get('cityname')
        json_response = {
            "fulfillment_response": {
                "messages": [
                    {
                        "text": {
                            "text": [
                                "This is response coming from webhook and city name is "+cityname
                            ]
                        }
                    }
                ]
            }
        }
    else:
        json_response = {
            "fulfillment_response": {
                "messages": [
                    {
                        "text": {
                            "text": [
                                f'There are no fulfillment responses defined for "{tag}" tag'
                            ]
                        }
                    }
                ]
            }
        }

    return jsonify(json_response)


if __name__ == "__main__":
    port = 8080  # Specify the port
    app.run(host='0.0.0.0', port=port)
