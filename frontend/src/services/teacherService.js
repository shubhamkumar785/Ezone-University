const INITIAL_TEACHERS = [
  {
    id: 'T-1001',
    fullName: 'Dr. Sarah Mitchell',
    email: 'sarah.mitchell@ezone.edu',
    department: 'Computer Science',
    qualification: 'PhD in CS',
    designation: 'Professor',
    experience: '12 years',
    joiningDate: '2018-08-15',
    status: 'Active'
  },
  {
    id: 'T-1002',
    fullName: 'Dr. James Parker',
    email: 'james.parker@ezone.edu',
    department: 'Computer Science',
    qualification: 'PhD in CS',
    designation: 'Associate Professor',
    experience: '8 years',
    joiningDate: '2020-01-10',
    status: 'Active'
  },
  {
    id: 'T-1003',
    fullName: 'Prof. Robert Downey',
    email: 'robert.downey@ezone.edu',
    department: 'Mechanical Eng',
    qualification: 'M.Tech',
    designation: 'Professor',
    experience: '15 years',
    joiningDate: '2015-07-20',
    status: 'Active'
  },
  {
    id: 'T-1004',
    fullName: 'Dr. Emily Watson',
    email: 'emily.watson@ezone.edu',
    department: 'Electrical Eng',
    qualification: 'PhD',
    designation: 'Assistant Professor',
    experience: '5 years',
    joiningDate: '2022-03-01',
    status: 'Active'
  },
  {
    id: 'T-1005',
    fullName: 'Prof. Albert Einstein',
    email: 'albert.einstein@ezone.edu',
    department: 'Mathematics',
    qualification: 'PhD in Math',
    designation: 'Professor',
    experience: '25 years',
    joiningDate: '2010-09-01',
    status: 'Active'
  }
];

const STORAGE_KEY = 'ez_teachers';

const getStoredTeachers = () => {
  const data = sessionStorage.getItem(STORAGE_KEY);
  if (!data) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TEACHERS));
    return INITIAL_TEACHERS;
  }
  return JSON.parse(data);
};

const setStoredTeachers = (teachers) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));
};

export const teacherService = {
  getAll: async () => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getStoredTeachers();
  },

  getById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const teachers = getStoredTeachers();
    return teachers.find((t) => t.id === id) || null;
  },

  add: async (teacher) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const teachers = getStoredTeachers();
    const newId = `T-${1000 + teachers.length + 1}`;
    const newTeacher = { ...teacher, id: newId, status: 'Active' };
    teachers.push(newTeacher);
    setStoredTeachers(teachers);
    return newTeacher;
  },

  update: async (id, updatedTeacher) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const teachers = getStoredTeachers();
    const index = teachers.findIndex((t) => t.id === id);
    if (index !== -1) {
      teachers[index] = { ...teachers[index], ...updatedTeacher };
      setStoredTeachers(teachers);
      return teachers[index];
    }
    throw new Error('Teacher record not found');
  },

  deactivate: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const teachers = getStoredTeachers();
    const index = teachers.findIndex((t) => t.id === id);
    if (index !== -1) {
      teachers[index].status = teachers[index].status === 'Active' ? 'Inactive' : 'Active';
      setStoredTeachers(teachers);
      return teachers[index];
    }
    throw new Error('Teacher record not found');
  }
};
