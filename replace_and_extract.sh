#!/bin/bash

# Input file containing the HTML content
input_file="samsung_test.html"

# Output file for the modified HTML
output_html_file="modified_samsung_test.html"

# Output file for the extracted texts
output_json_file="extracted_texts.json"

# Temporary file for intermediate processing
temp_file=$(mktemp)

# Counter for generating unique symbols
counter=1

# Associative array to store symbol to text mapping
declare -A text_map

# Function to generate a unique symbol
generate_symbol() {
  printf "##%04d##" "$counter"
  counter=$((counter + 1))
}

# Remove content inside <script> and <style> tags
sed '/<script/,/<\/script>/d; /<style/,/<\/style>/d' "$input_file" > "$temp_file"

# Process the file line by line
while IFS= read -r line; do
  processed_line=""
  while [[ $line =~ (.*?)(>[^<]+<)(.*) ]]; do
    before="${BASH_REMATCH[1]}"
    tag_and_text="${BASH_REMATCH[2]}"
    after="${BASH_REMATCH[3]}"

    # Extract all text occurrences between '>' and '<'
    while [[ $tag_and_text =~ \>([^<]+)\< ]]; do
      text="${BASH_REMATCH[1]}"
      if [[ -n "$text" ]]; then
        symbol=$(generate_symbol)
        text_map["$symbol"]="$text"
        tag_and_text="${tag_and_text//>$text</>$symbol<}"
      fi
    done

    processed_line+="$before$tag_and_text"
    line="$after"
  done
  processed_line+="$line"
  echo "$processed_line" >> "$output_html_file"
done < "$temp_file"

# Create JSON format for the extracted texts
json_content="{"
for symbol in "${!text_map[@]}"; do
  json_content+="\"$symbol\": \"${text_map[$symbol]//\"/\\\"}\","
done
json_content="${json_content%,}}"
json_content="${json_content//\\\"/\\\\\"}"

# Save the JSON to the output file
echo "$json_content" > "$output_json_file"

# Clean up temporary file
rm "$temp_file"

echo "Modified HTML has been saved to $output_html_file"
echo "Extracted texts have been saved to $output_json_file"
