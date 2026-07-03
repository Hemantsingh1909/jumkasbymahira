const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'src', 'assets');
const outputDir = path.join(__dirname, '..', 'public', 'images', 'collections');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Map of SVG filenames to their descriptive output names
const stateMap = {
  '1': 'rajasthan',
  '2': 'gujarat',
  '3': 'tamilnadu',
  '4': 'karnataka',
  '5': 'bengal',
  '6': 'kashmir',
  '7': 'kerala',
  '8': 'up',
  '9': 'nine_extra',
  '10': 'ten_extra',
  '11': 'eleven_extra',
  '12': 'twelve_extra'
};

Object.keys(stateMap).forEach((num) => {
  const svgPath = path.join(assetsDir, `${num}.svg`);
  if (!fs.existsSync(svgPath)) {
    console.log(`File not found: ${svgPath}`);
    return;
  }

  const content = fs.readFileSync(svgPath, 'utf8');
  // Match data:image/jpeg;base64,... or data:image/png;base64,... or data:img/jpeg;base64,...
  const match = content.match(/data:image\/(jpeg|png|jpg);base64,([a-zA-Z0-9+/=]+)/);
  
  if (match) {
    const ext = match[1];
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, 'base64');
    const name = stateMap[num];
    const outputPath = path.join(outputDir, `${name}.${ext}`);
    
    fs.writeFileSync(outputPath, buffer);
    console.log(`Successfully extracted ${svgPath} -> ${outputPath} (${buffer.length} bytes)`);
  } else {
    // Try matching without image sub-type
    const altMatch = content.match(/href="data:img\/jpeg;base64,([a-zA-Z0-9+/=]+)"/);
    if (altMatch) {
      const buffer = Buffer.from(altMatch[1], 'base64');
      const name = stateMap[num];
      const outputPath = path.join(outputDir, `${name}.jpeg`);
      fs.writeFileSync(outputPath, buffer);
      console.log(`Successfully extracted (alt) ${svgPath} -> ${outputPath} (${buffer.length} bytes)`);
    } else {
      console.log(`No base64 image found in ${svgPath}`);
    }
  }
});
