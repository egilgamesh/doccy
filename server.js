const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Handle requests
  if (req.url === '/fileList') {
    const directoryPath = path.join(process.cwd()); // Replace with your actual path

    // Read the files in the directory
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }

      // Send the list of files as a JSON response
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ files }));
    });
  } else {
    // Handle other routes or static files here
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
