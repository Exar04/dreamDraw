from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin


# model = tf.keras.models.load_model('handwritten.model')

# imgdata = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAHKADAAQAAAABAAAAHAAAAABkvfSiAAAA5UlEQVRIDe2VTQ6EIAyFZeKOA3AhDsCV4DwcglOxneGRkBCnkoLVlU38CWA/3mtV9S2xPRifB1kV9QKnHQ8hbEqpepAPo2kkIsaI5qvHKJ/CJLmTyUGo4qQSaRrvPX97I/ncOVhZoKzlIpZy7YQNIpby/RQEQiWnliKWNoWA9kF17d4vuHp/BFC1va2GgKWU/jSIWtqyN2uPijEvrlBrXbkUDBOiNRwpq7soJzGFHBigIkDAjDGsj/clS7mqmp3LCnPO9QfrnGOp6oFLCq2106AGveU9bMmpq0jTUInPxl7gmTPL4z8Anx63r4UT9AAAAABJRU5ErkJggg=="

# img_data = base64.b64decode(imgdata.split(",")[1])
# img = Image.open(BytesIO(img_data))
# img = img.convert("RGB")
# img.save("ImagetoUse.jpg", "JPEG")

app = Flask(__name__)
cors = CORS(app)

def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'  # Allow requests from any origin
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'  # Allow specific headers
    response.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'  # Allow specific methods
    return response

# @app.after_request
# def after_request(response):
#     return add_cors_headers(response)


@app.route('/', methods=['POST', 'GET'])
# @cross_origin()
def hello():
    print("hsllllllllll")
    data = {'message': 'Hello, World!'}
    return jsonify(data)
    # return 'Hello, World!'

@app.route('/img', methods=['POST', 'GET'])
# @cross_origin()
def imgolo():
    return "didn't recieve any image"

if __name__ == '__main__':
    app.run(debug=True, port=8008)
