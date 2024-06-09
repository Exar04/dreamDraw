# This app will keep track in our file system 
# It will constantly check after every minute if our file system has files more than theshold that we had set
# If the limit excides that means we have enough new images to make new AI prediction model
# This app will basically act as a Alert

import os
import time

def count_files(directory):
    num_files = 0
    # Walk through the directory and its subdirectories
    for root, dirs, files in os.walk(directory):
        # Count files in the current directory
        num_files += len(files)
    return num_files

directory = 'lila'  # Path to your directory
num_files = count_files(directory)
while True:
    time.sleep(5) # sleeps for 5 sec
    number_of_new_falsePrediction_samples = count_files("falsePrediction")
    number_of_new_truePrediction_samples = count_files("truePrediction")
    print("Number of files in falsePrediction directory and its subdirectories: {}".format(number_of_new_falsePrediction_samples))
    print("Number of files in truePrediction directory and its subdirectories: {}".format(number_of_new_truePrediction_samples))
