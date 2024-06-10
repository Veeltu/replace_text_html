const fs = require('fs');

async function replaceTextWithSymbols() {
  try {
    // Read the JSON file containing the extracted texts
    console.log('Reading JSON file...');
    const jsonContent = await fs.promises.readFile('set_texts.json', 'utf8');
    console.log('JSON file read successfully.');

    const textMap = JSON.parse(jsonContent);

    // Read the HTML file
    console.log('Reading HTML file...');
    let htmlContent = await fs.promises.readFile('modified_samsung_test.html', 'utf8');
    console.log('HTML file read successfully.');



// Replace text with symbols in the HTML content
console.log('Replacing text with symbols...');
Object.entries(textMap).forEach(([symbol, text]) => {
  htmlContent = htmlContent.replace(symbol, text);
  });


    // Write the modified HTML to the output file
    console.log('Writing modified HTML file...');
    await fs.promises.writeFile('final_samsung_test.html', htmlContent, 'utf8');
    console.log('Final HTML with symbols replaced has been saved.');
  } catch (err) {
    console.error('Error:', err);
  }
}

replaceTextWithSymbols();
