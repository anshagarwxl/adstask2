// Simple JavaScript Program for University System JSON CRUD Operations

const fs = require('fs');

const backupFilePath = 'university_backup.json';
const filePath = 'university.json';

// Complex Data Structure: University System
let universityData = {
  departments: [
    {
      name: 'Computer Science',
      professors: [
        { name: 'Dr. Smith', id: 1, students: [{ name: 'Alice', id: 1001 }] }
      ],
    },
    {
      name: 'Biotechnology',
      professors: [
        { name: 'Dr. Lee', id: 2, students: [{ name: 'Bob', id: 2001 }] }
      ],
    },
  ],
};

// Function to read data from a file
function readJSONFile() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    universityData = JSON.parse(data); // Parse the data
  } catch (error) {
    console.error('Error reading the JSON file:', error);
  }
}

// Function to write data to a file
function writeJSONFile() {
  try {
    const data = JSON.stringify(universityData, null, 2); // Convert to string
    fs.writeFileSync(filePath, data); // Write to file
  } catch (error) {
    console.error('Error writing to the JSON file:', error);
  }
}

// Function to create a backup before modifying the file
function backupJSONFile() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    fs.writeFileSync(backupFilePath, data); // Create backup
  } catch (error) {
    console.error('Error creating backup:', error);
  }
}

// Function to add a new entry (department, professor, student)
function addEntry(departmentName, professorName, studentName) {
  backupJSONFile(); // Always backup first
  let department = universityData.departments.find(dep => dep.name === departmentName);
  if (!department) {
    department = { name: departmentName, professors: [] }; // Add new department
    universityData.departments.push(department);
  }

  let professor = department.professors.find(prof => prof.name === professorName);
  if (!professor) {
    professor = { name: professorName, id: Date.now(), students: [] }; // Add new professor
    department.professors.push(professor);
  }

  professor.students.push({ name: studentName, id: Date.now() }); // Add new student
  writeJSONFile();
}

// Function to update a student's name
function updateEntry(departmentName, professorName, studentId, newStudentName) {
  backupJSONFile(); // Backup before update
  let department = universityData.departments.find(dep => dep.name === departmentName);
  if (department) {
    let professor = department.professors.find(prof => prof.name === professorName);
    if (professor) {
      let student = professor.students.find(stu => stu.id === studentId);
      if (student) {
        student.name = newStudentName; // Update student name
        writeJSONFile();
        console.log('Student updated successfully');
      } else {
        console.log('Student not found');
      }
    } else {
      console.log('Professor not found');
    }
  } else {
    console.log('Department not found');
  }
}

// Function to delete a student
function deleteEntry(departmentName, professorName, studentId) {
  backupJSONFile(); // Backup before delete
  let department = universityData.departments.find(dep => dep.name === departmentName);
  if (department) {
    let professor = department.professors.find(prof => prof.name === professorName);
    if (professor) {
      let studentIndex = professor.students.findIndex(stu => stu.id === studentId);
      if (studentIndex !== -1) {
        professor.students.splice(studentIndex, 1); // Remove student
        writeJSONFile();
        console.log('Student deleted successfully');
      } else {
        console.log('Student not found');
      }
    } else {
      console.log('Professor not found');
    }
  } else {
    console.log('Department not found');
  }
}

// Function to search for students
function searchEntry(departmentName, professorName) {
  let department = universityData.departments.find(dep => dep.name === departmentName);
  if (department) {
    let professor = department.professors.find(prof => prof.name === professorName);
    if (professor) {
      return professor.students; // Return list of students
    }
  }
  return null; // No data found
}

// Simple function to check if name is valid
function isValidName(name) {
  return typeof name === 'string' && name.trim() !== ''; // Basic validation
}

// Export the functions for use
module.exports = { readJSONFile, addEntry, updateEntry, deleteEntry, searchEntry, isValidName };