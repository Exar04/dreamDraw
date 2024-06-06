import cv2
import numpy as np

# this is actually interesting because with this
# we can set our frontend canvas with anycolor
# as this will normalise it and make it black and white 
img = cv2.imread("ImagetoUse.jpg")

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

threshold_value = 70  # Adjust this value to capture "near-black" as per your requirements

_, binary = cv2.threshold(gray, threshold_value, 255, cv2.THRESH_BINARY_INV)

inverted_img = 255 - binary 

cv2.imwrite("black_and_white_output.jpg", inverted_img)
