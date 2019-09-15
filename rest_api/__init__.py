import os
from flask import Flask, request, jsonify
from image_recognition.image_recognition import image_rec
import json

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'temp_upload_directory')
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = "secret key"
app.config['MAX_CONTENT_LENGTH'] = 25 * 1024 * 1024


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/post_image', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':

        if request.files:

            # Image info
            img_file = request.files.get('file')
            img_name = img_file.filename

            file_path = os.path.join(app.config['UPLOAD_FOLDER'], img_name)

            img_file.save(file_path)
            img_dict = image_rec(image_path=file_path)
            print(img_dict)

            return json.dumps(str(img_dict))

        else:
            return 'NONE'

    else:
        return "NONE"


if __name__ == '__main__':
    app.debug = True
    app.run()
