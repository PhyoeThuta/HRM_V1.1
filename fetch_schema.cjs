const https = require('https');

const url = 'https://kcswzfrwpvioaaizfpnk.supabase.co/rest/v1/?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjc3d6ZnJ3cHZpb2FhaXpmcG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMTI2NTUsImV4cCI6MjA5NTY4ODY1NX0.NdvQ_9odU5SS3SOGeJKLk8EBvFIFv8pbO2PanYOT4Dw';

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      const props = parsed?.components?.schemas?.employee_documents?.properties || parsed?.definitions?.employee_documents?.properties;
      if (props) {
        console.log('--- COLUMNS IN employee_documents ---');
        for (const k of Object.keys(props)) {
          console.log(`${k}: ${props[k].type} (format: ${props[k].format || 'none'})`);
        }
      } else {
        console.log('Could not find employee_documents in OpenAPI spec');
        console.log(Object.keys(parsed?.components?.schemas || parsed?.definitions || {}));
      }
    } catch(e) {
      console.error(e);
    }
  });
});
