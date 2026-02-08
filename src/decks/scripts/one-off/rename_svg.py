import os

# Define the input and output folders
input_folder = '../../../public/world-countries'

# Loop through all files in the input folder
for filename in os.listdir(input_folder):
    if filename.endswith('.svg'):
        old_name = input_folder + '/' + filename
        new_name = input_folder + '/' + filename.replace('+', '%2B').replace(' ', '_')
        os.rename(old_name, new_name)
        print(new_name)
