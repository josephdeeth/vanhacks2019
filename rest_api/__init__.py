import os
from flask import Flask, request, jsonify
from image_recognition.image_recognition import image_rec
import json
import pandas as pd
import numpy as np
import logging

# setup logging
logging.basicConfig(
    level=logging.DEBUG
)
logger = logging.getLogger(__name__)

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'temp_upload_directory')
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = "secret key"
app.config['MAX_CONTENT_LENGTH'] = 25 * 1024 * 1024

recycle_df = pd.read_csv(os.path.join(os.getcwd(), 'test_data', 'recyclable_table.csv'))


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/post_image', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':

        if request.files:

            try:
                # Image info
                img_file = request.files.get('file')
                img_name = img_file.filename

                file_path = os.path.join(app.config['UPLOAD_FOLDER'], img_name)

                img_file.save(file_path)
                img_dict = image_rec(image_path=file_path)
                os.remove(file_path)

                r_number = int(list(img_dict.keys())[0])
                subset_df = recycle_df[recycle_df['recycleable_number'] == r_number]

                acronym = subset_df['acronym'].values[0]

                chemical_name = subset_df['chemical_name'].values[0]

                usage = subset_df['usage'].values[0]

                found_in = list(subset_df['found_in'].values)

                return_dict = {
                    'recycle_number': r_number,
                    'acronym': acronym,
                    'chemical_name': chemical_name,
                    'usage': usage,
                    'found_in': found_in
                }

                return json.dumps(str(return_dict))

            except:
                return 'NONE'

        else:
            return 'NONE'

    else:
        return "NONE"


if __name__ == '__main__':
    app.debug = True
    app.run()
