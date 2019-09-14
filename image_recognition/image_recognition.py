import os
import cv2
import numpy as np


def image_rec(image_path):
    # Load in the image to match
    img = cv2.imread(image_path, 0)
    img2 = img.copy()

    os.chdir("..")
    template_folders = os.path.join(os.getcwd(), 'test_data', 'template_images')
    templates = os.listdir(template_folders)
    for item in templates:
        if item.startswith('.'):
            templates.remove(str(item))

    for template_subfolder in templates:

        template_folder = os.path.join(template_folders, template_subfolder)
        template_images = os.listdir(template_folder)

        for item in template_images:
            if item.startswith('.'):
                template_images.remove(str(item))

        # score by template
        scores = []

        for template_image in template_images:

            template_image_directory = os.path.join(template_folder, template_image)

            template = cv2.imread(template_image_directory, 0)
            w, h = template.shape[::-1]

            # All the 6 methods for comparison in a list
            methods = ['cv2.TM_CCOEFF_NORMED', 'cv2.TM_CCORR_NORMED', 'cv2.TM_SQDIFF_NORMED']

            for meth in methods:
                img = img2.copy()

                method = eval(meth)

                # Apply template Matching
                res = cv2.matchTemplate(img, template, method)
                res_mean = np.mean(res)

                scores.append(res_mean)

        max_img_score = max(scores)
        print(f'Template:{template_subfolder}, Score:{max_img_score}')


if __name__ == "__main__":
    image_rec(image_path='/Users/teddyhaley/PycharmProjects/vanhacks2019/test_data/test_images/3.jpg')
