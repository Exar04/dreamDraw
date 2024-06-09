# This is just a image queue server
# This takes in all the images created by client and stores it,
# until client sends the message if that image output prediction was correct or not
# If it is correct then it will get stored in dataToTrainNewModel folder which has sub forders 1,2,3,4 ... for each number
# Images and its corrosponding data in this will be stored in following way
# We will make use of dictonary to store
# Client will send image with an uinque id
# dict = {
#      id1:Img1
#      id2:Img2
#      id3:Img3
#     }

import cv2
import numpy as np
import matplotlib.pyplot as plt

import base64
from PIL import Image
from io import BytesIO

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

ImageDict = {}


app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    data = {'message': 'Hello, World!'}
    return jsonify(data)


@app.route('/img', methods=['POST', 'GET'])
def AddImgToDict():
    if request.is_json:
        data = request.json
        bs64_img_input_from_client = data.get('bs64_img')
        img_id = data.get('img_id')
        img_data = base64.b64decode(bs64_img_input_from_client.split(",")[1])
        img = Image.open(BytesIO(img_data))
        img = img.convert("RGB")
        # img.save("ImagetoUse.jpg", "JPEG")

        img_np = np.array(img)
        # Convert RGB to BGR (OpenCV uses BGR format)
        img = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)

        # This converts the image color range from (0 to 1) to (0 or 1)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        threshold_value = 70  # Adjust this value to capture "near-black" as per your requirements
        _, binary = cv2.threshold(gray, threshold_value, 255, cv2.THRESH_BINARY_INV)
        inverted_img = 255 - binary 
        # cv2.imwrite("black_and_white_output.jpg", inverted_img)
        ##########################

        ImageDict[img_id] = inverted_img

        return jsonify({"message" :"Saved successfully in the queue"})
    else:
        return "didn't recieve any image"

@app.route('/imgPrecitionTruthValue', methods=['POST', 'GET'])
def SaveImgToFs():
    print("part 1 passed tho")
    if request.is_json:
        data = request.json
        img_id = data.get('img_id')
        img_truth = data.get('img_truth')
        img_predicted_number = data.get('predicted_number')
        if img_truth:
            print("Ahhhhhhhhhhhhh")
            print("img_predicted_number :",img_predicted_number)
            print("img_id :",img_id)
            filePathnName = "truePrediction" + "/" + img_predicted_number + "/" + img_id + ".jpg"
            cv2.imwrite(filePathnName, ImageDict[img_id])
            del(ImageDict[img_id])
            print("saved image to TruePrediction fs")
            return jsonify({"message": "successfully saved to fs as truthy"})
        else:
            # save image to wrongPrediction folder in file system
            filePathnName = "falsePrediction" + "/" + img_id + ".jpg"
            cv2.imwrite(filePathnName, ImageDict[img_id])
            del(ImageDict[img_id])
            print("saved image to ",filePathnName)
            return jsonify({"message": "successfully saved to fs as false"})
        
if __name__ == '__main__':
    print("\n\nRunning on port::8000\n\n")
    app.run(debug=True, port=8000)