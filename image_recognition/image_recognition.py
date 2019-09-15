import os
import cv2
import numpy as np
import logging

# setup logging
logging.basicConfig(
    level=logging.INFO
)
logger = logging.getLogger(__name__)


def image_rec(image_path):
    # Load in the image to match
    img = cv2.imread(image_path, 0)
    img2 = img.copy()

    template_folders = os.path.join(os.getcwd(), 'test_data', 'template_images')
    templates = os.listdir(template_folders)

    template_scores = {}

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
        template_scores[template_subfolder] = max_img_score

        logger.info(f'Template:{template_subfolder}, Score:{max_img_score}')

    if sum(template_scores.values()) == 7:
        return {'7': 1}

    elif all(item < 0.6 for item in template_scores.values()):
        return {'7': 1}

    else:
        max_key = max(template_scores, key=template_scores.get)
        max_val = template_scores[max_key]

        return {max_key: max_val}


if __name__ == "__main__":
    print(image_rec(image_path='/Users/teddyhaley/Desktop/IMG_20190915_125256.jpg'))
