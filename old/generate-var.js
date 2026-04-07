const fs = require('fs');
const path = require('path');

const variablesFilePath = path.join(__dirname, 'src/styles', 'variables.json');

const outputDirectory = 'src/styles/theme'; // Directory to output files
const outputCSSFileName = 'variables.css'; // Name of the output CSS file

// Helper function to convert HEX to RGB
function hexToRgb(hex) {
  // Check if the hex format is valid
  if (!/^#?[0-9A-Fa-f]{6}$/.test(hex)) {
    console.warn(`Invalid HEX value: ${hex}`);
    return '0, 0, 0'; // Default to black if invalid
  }

  // Remove the hash symbol if present
  hex = hex.replace(/^#/, '');

  // Parse the hex string
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  return `${r}, ${g}, ${b}`;
}

function generateFiles() {
  try {
    // Check if the output directory exists; if not, create it
    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory, { recursive: true });
      console.log(`Created directory: ${outputDirectory}`);
    }

    // Read the variables.json file
    const variables = JSON.parse(fs.readFileSync(variablesFilePath, 'utf-8'));

    // Create CSS variable definitions for all themes
    let cssContent = '';

    // Create LESS variable definitions for each theme
    for (const [theme, vars] of Object.entries(variables.themes)) {
      let lessVariables = '';

      // Generate CSS variables for each theme
      cssContent += `.${theme} {\n`;

      for (const [key, value] of Object.entries(vars)) {
        // Check if the value is a valid HEX color
        const rgbValue = hexToRgb(value);

        // Generate LESS variable
        lessVariables += `@${key}: ${value};\n`;

        // Generate CSS variable
        cssContent += `  --${key}: ${rgbValue};\n`;
      }

      cssContent += `}\n`; // Close the theme class

      // Write the LESS variables to a new file
      fs.writeFileSync(
        path.join(outputDirectory, `${theme}-variables.less`),
        lessVariables
      );
      console.log(`LESS variables for ${theme} generated!`);
    }

    // Write all theme CSS variables to a single file
    fs.writeFileSync(path.join(outputDirectory, outputCSSFileName), cssContent);
    console.log(`Combined CSS variables generated in ${outputCSSFileName}!`);
  } catch (error) {
    console.error('Error processing themes:', error);
  }
}

// Initial generation
generateFiles();

// Watch for changes in variables.json
fs.watch(variablesFilePath, eventType => {
  if (eventType === 'change') {
    console.log(
      'variables.json changed. Regenerating LESS and CSS variables...'
    );
    generateFiles();
  }
});

console.log(`Watching for changes in ${variablesFilePath}...`);
