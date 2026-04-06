const fs = require('fs');

const content = `export const environment = {
  apiKey: '${process.env.API_KEY}'
};
`;

fs.writeFileSync('./src/environments/environment.ts', content);
console.log('environment.ts generated');
