const INITIAL_STUDENTS = [
  {
    id: 'S-1001',
    fullName: 'John Doe',
    email: 'john.doe@ezone.edu',
    department: 'Computer Science',
    course: 'B.Tech CSE',
    semester: '3rd',
    section: 'A',
    rollNumber: 'CS-042',
    phone: '+1 555-0199',
    status: 'Active',
    guardianName: 'Richard Doe'
  },
  {
    id: 'S-1002',
    fullName: 'Jane Smith',
    email: 'jane.smith@ezone.edu',
    department: 'Computer Science',
    course: 'B.Tech CSE',
    semester: '1st',
    section: 'B',
    rollNumber: 'CS-105',
    phone: '+1 555-0188',
    status: 'Active',
    guardianName: 'Mary Smith'
  },
  {
    id: 'S-1003',
    fullName: 'Bob Johnson',
    email: 'bob.johnson@ezone.edu',
    department: 'Mechanical Eng',
    course: 'B.Tech ME',
    semester: '5th',
    section: 'A',
    rollNumber: 'ME-012',
    phone: '+1 555-0177',
    status: 'Active',
    guardianName: 'Alice Johnson'
  },
  {
    id: 'S-1004',
    fullName: 'Charlie Brown',
    email: 'charlie.brown@ezone.edu',
    department: 'Electrical Eng',
    course: 'B.Tech EE',
    semester: '3rd',
    section: 'C',
    rollNumber: 'EE-088',
    phone: '+1 555-0166',
    status: 'Active',
    guardianName: 'Snoopy Brown'
  },
  {
    id: 'S-1005',
    fullName: 'Diana Prince',
    email: 'diana.prince@ezone.edu',
    department: 'Mathematics',
    course: 'B.Sc Math',
    semester: '7th',
    section: 'A',
    rollNumber: 'MA-001',
    phone: '+1 555-0155',
    status: 'Inactive',
    guardianName: 'Hippolyta Prince'
  }
];

const STORAGE_KEY = 'ez_students';

const getStoredStudents = () => {
  const data = sessionStorage.getItem(STORAGE_KEY);
  if (!data) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
    return INITIAL_STUDENTS;
  }
  return JSON.parse(data);
};

const setStoredStudents = (students) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};

export const studentService = {
  getAll: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getStoredStudents();
  },

  add: async (student) => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const students = getStoredStudents();
    const newId = `S-${1000 + students.length + 1}`;
    const newStudent = { ...student, id: newId, status: 'Active' };
    students.push(newStudent);
    setStoredStudents(students);
    return newStudent;
  },

  update: async (id, updatedStudent) => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const students = getStoredStudents();
    const index = students.findIndex((s) => s.id === id);
    if (index !== -1) {
      students[index] = { ...students[index], ...updatedStudent };
      setStoredStudents(students);
      return students[index];
    }
    throw new Error('Student not found');
  },

  deactivate: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const students = getStoredStudents();
    const index = students.findIndex((s) => s.id === id);
    if (index !== -1) {
      students[index].status = students[index].status === 'Active' ? 'Inactive' : 'Active';
      setStoredStudents(students);
      return students[index];
    }
    throw new Error('Student not found');
  },

  importBulk: async (importedList) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const students = getStoredStudents();
    let count = students.length;

    const formattedList = importedList.map(s => {
      count++;
      return {
        ...s,
        id: `S-${1000 + count}`,
        status: 'Active'
      };
    });

    const updated = [...students, ...formattedList];
    setStoredStudents(updated);
    return formattedList;
  }
};
