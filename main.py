import os
import cv2
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf

import base64
from PIL import Image
from io import BytesIO

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin



model = tf.keras.models.load_model('handwritten.h5')
# model = tf.keras.layers.TFSMLayer(handwritten.h5)


app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    data = {'message': 'Hello, World!'}
    return jsonify(data)


@app.route('/img', methods=['POST', 'GET'])
def imgolo():
    if request.is_json:
        data = request.json
        bs64_img_input_from_client = data.get('bs64_img')
        img_data = base64.b64decode(bs64_img_input_from_client.split(",")[1])
        img = Image.open(BytesIO(img_data))
        img = img.convert("RGB")
        img.save("ImagetoUse.jpg", "JPEG")

        # img = cv2.imread(f"ImagetoUse.jpg")

        img_np = np.array(img)
        # Convert RGB to BGR (OpenCV uses BGR format)
        img = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)

        # This converts the image color range from (0 to 1) to (0 or 1)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        threshold_value = 70  # Adjust this value to capture "near-black" as per your requirements
        _, binary = cv2.threshold(gray, threshold_value, 255, cv2.THRESH_BINARY_INV)
        img = 255 - binary 
        cv2.imwrite("black_and_white_output.jpg", img)
        ##########################

        resized_img = cv2.resize(img, (28, 28))
        # gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        img = np.invert(np.array([img]))
        prediction = model.predict(img)

        userSaidThisArg = np.argmax(prediction)
        data = {'message': str(userSaidThisArg)}
        return jsonify(data)
    else:
        return "didn't recieve any image"

if __name__ == '__main__':
    print("\n\nRunning on port::8090\n\n")
    app.run(debug=True, port=8090)
