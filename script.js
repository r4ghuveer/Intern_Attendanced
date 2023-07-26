// Function to add a person's data to the server
function addPerson() {
    const personName = document.getElementById('personName').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
  
    if (personName && startDate && endDate) {
      const personData = {
        name: personName,
        duration: {
          start: startDate,
          end: endDate
        }
      };
  
      fetch('/addPerson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(personData)
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Clear input fields
          document.getElementById('personName').value = '';
          document.getElementById('startDate').value = '';
          document.getElementById('endDate').value = '';
          alert('Person added successfully!');
        } else {
          alert('Failed to add the person. Please try again.');
        }
      })
      .catch(error => {
        alert('An error occurred while adding the person. Please try again.');
        console.error(error);
      });
    } else {
      alert('Please enter both person name and internship duration.');
    }
  }
  
  // Function to mark attendance (present/absent) for a person on a specific date
  function markAttendance(status) {
    const personName = document.getElementById('personName').value;
  
    if (!personName) {
      alert('Please enter the person\'s name.');
      return;
    }
  
    const date = new Date().toLocaleDateString(); // Get the current date in the format "MM/DD/YYYY"
  
    fetch('/markAttendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ personName, status, date })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert(`Attendance marked as ${status} for ${personName} on ${date}.`);
      } else {
        alert('Failed to mark attendance. Please try again.');
      }
    })
    .catch(error => {
      alert('An error occurred while marking attendance. Please try again.');
      console.error(error);
    });
  }
  
  // Function to show attendance for a person
  function showAttendance() {
    const personName = document.getElementById('attendancePersonName').value;
  
    if (!personName) {
      alert('Please enter the person\'s name.');
      return;
    }
  
    fetch(`/showAttendance?personName=${encodeURIComponent(personName)}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const attendanceViewer = document.getElementById('attendanceViewer');
          let attendanceText = 'Attendance for ' + personName + '\n\n';
  
          for (const date in data.attendanceData) {
            attendanceText += `${date}: ${data.attendanceData[date]}\n`;
          }
  
          attendanceViewer.value = attendanceText;
        } else {
          alert('Person not found. Please add the person first.');
        }
      })
      .catch(error => {
        alert('An error occurred while fetching attendance. Please try again.');
        console.error(error);
      });
  }
  