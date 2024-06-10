#!/bin/bash

# Input file containing the HTML content
input_file="samsung_test.html"

# Output file for extracted texts
output_file="extracted_texts.json"

# Remove content inside <script> and <style> tags and extract texts between '>' and '<'
texts=$(sed '/<script/,/<\/script>/d; /<style/,/<\/style>/d' "$input_file" |
        grep -oP '(?<=>)[^<]+' |
        sed 's/"/\\"/g' | # Escape double quotes in text
        awk NF | # Filter out empty lines
        awk '!seen[$0]++' | # Remove duplicate lines
        awk '{printf "\"%s\",", $0}' |
        sed 's/,$//')

# Create JSON format
echo "[$texts]" > "$output_file"

echo "Extracted texts have been saved to $output_file"
