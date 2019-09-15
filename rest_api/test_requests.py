import requests
import os


def post_image(img_file):
    """ post image and return the response """
    response = requests.post(url='http://127.0.0.1:5000/post_image',
                             files={'file': open(img_file, 'rb')})
    print(response.content)


post_image(img_file="/Users/teddyhaley/PycharmProjects/vanhacks2019/test_data/test_images/2˚.jpg")
