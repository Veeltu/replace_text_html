const fs = require('fs');

// Input file containing the HTML content
const inputFilePath = 'samsung_test.html';

// Output file for the modified HTML
const outputHtmlFilePath = 'modified_samsung_test.html';

// Output file for the extracted texts
const outputJsonFilePath = 'extracted_texts.json';

// Counter for generating unique symbols
let counter = 1;

// Object to store symbol to text mapping
const textMap = {};

// Function to generate a unique symbol
function generateSymbol() {
  const symbol = `##${counter.toString().padStart(4, '0')}##`;
  counter++;
  return symbol;
}

// Read the input HTML file
fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading input file:', err);
    return;
  }

  // Remove content inside <script> and <style> tags
  const tempFileContent = data.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, '');

  let processedContent = '';

  // Process the content line by line
  const lines = tempFileContent.split('\n');
  lines.forEach(line => {
    let processedLine = '';
    let remainingLine = line;

    // Extract text from between '>' and '<' on each line
    while (remainingLine.match(/>([^<]+)</)) {
      const match = remainingLine.match(/>([^<]+)</);
      const text = match[1];
      const symbol = generateSymbol();
      textMap[symbol] = text;
      processedLine += remainingLine.slice(0, match.index + 1) + symbol + '<';
      remainingLine = remainingLine.slice(match.index + match[0].length);
    }

    processedLine += remainingLine;
    processedContent += processedLine + '\n';
  });

  // Write the modified HTML to the output file
  fs.writeFile(outputHtmlFilePath, processedContent, 'utf8', err => {
    if (err) {
      console.error('Error writing modified HTML file:', err);
      return;
    }
    console.log(`Modified HTML has been saved to ${outputHtmlFilePath}`);

    // Create JSON format for the extracted texts
    const jsonContent = JSON.stringify(textMap, null, 2);

    // Write the JSON to the output file
    fs.writeFile(outputJsonFilePath, jsonContent, 'utf8', err => {
      if (err) {
        console.error('Error writing extracted texts JSON file:', err);
        return;
      }
      console.log(`Extracted texts have been saved to ${outputJsonFilePath}`);
    });
  });
});
