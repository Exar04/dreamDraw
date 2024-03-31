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



model = tf.keras.models.load_model('handwritten.model')

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

        img = cv2.imread(f"ImagetoUse.jpg")

        resized_img = cv2.resize(img, (28, 28))
        gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        img = np.invert(np.array([gray_img]))
        prediction = model.predict(img)

        userSaidThisArg = np.argmax(prediction)
        data = {'message': str(userSaidThisArg)}
        return jsonify(data)
    else:
        return "didn't recieve any image"

if __name__ == '__main__':
    app.run(debug=True, port=8090)
