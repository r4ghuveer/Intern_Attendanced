const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.static(__dirname));

// Handle POST request to add a person
app.post('/addPerson', (req, res) => {
  const personData = req.body;

  // Read existing data from the file
  let existingData = JSON.parse(fs.readFileSync('data.json', 'utf8'));

  // Check if personName already exists
  if (existingData[personData.name]) {
    res.json({ success: false });
    return;
  }

  // Add the new person data to existing data
  existingData[personData.name] = personData;

  // Write updated data to the file
  fs.writeFileSync('data.json', JSON.stringify(existingData, null, 2));

  res.json({ success: true });
});

// Handle POST request to mark attendance
app.post('/markAttendance', (req, res) => {
  const { personName, status, date } = req.body;

  // Read existing data from the file
  let existingData = JSON.parse(fs.readFileSync('data.json', 'utf8'));

  // Check if personName exists in the data
  if (!existingData[personName]) {
    res.json({ success: false });
    return;
  }

  // Check if the current date is within the internship duration
  const startDate = new Date(existingData[personName].duration.start);
  const endDate = new Date(existingData[personName].duration.end);
  const currentDate = new Date(date);

  if (currentDate < startDate || currentDate > endDate) {
    res.json({ success: false });
    return;
  }

  // Mark attendance for the person on the given date
  existingData[personName].attendance = existingData[personName].attendance || {};
  existingData[personName].attendance[date] = status;

  // Write updated data to the file
  fs.writeFileSync('data.json', JSON.stringify(existingData, null, 2));

  res.json({ success: true });
});

// Handle GET request to show attendance
app.get('/showAttendance', (req, res) => {
  const personName = req.query.personName;

  // Read existing data from the file
  let existingData = JSON.parse(fs.readFileSync('data.json', 'utf8'));

  // Check if personName exists in the data
  if (!existingData[personName]) {
    res.json({ success: false });
    return;
  }

  // Get the attendance data for the person
  const attendanceData = existingData[personName].attendance || {};

  res.json({ success: true, attendanceData });
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
