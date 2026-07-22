const INITIAL_SUBJECTS = [
  {
    id: 'CS-101',
    subjectCode: 'CS-101',
    subjectName: 'Introduction to CS',
    department: 'Computer Science',
    semester: '1st',
    credits: 4,
    assignedTeacher: 'Dr. Sarah Mitchell',
    status: 'Active'
  },
  {
    id: 'CS-202',
    subjectCode: 'CS-202',
    subjectName: 'Data Structures & Algorithms',
    department: 'Computer Science',
    semester: '3rd',
    credits: 4,
    assignedTeacher: 'Dr. James Parker',
    status: 'Active'
  },
  {
    id: 'ME-301',
    subjectCode: 'ME-301',
    subjectName: 'Thermodynamics',
    department: 'Mechanical Eng',
    semester: '5th',
    credits: 3,
    assignedTeacher: 'Prof. Robert Downey',
    status: 'Active'
  },
  {
    id: 'EE-201',
    subjectCode: 'EE-201',
    subjectName: 'Network Theory',
    department: 'Electrical Eng',
    semester: '3rd',
    credits: 3,
    assignedTeacher: 'Dr. Emily Watson',
    status: 'Active'
  },
  {
    id: 'MA-102',
    subjectCode: 'MA-102',
    subjectName: 'Linear Algebra',
    department: 'Mathematics',
    semester: '2nd',
    credits: 4,
    assignedTeacher: 'Prof. Albert Einstein',
    status: 'Active'
  }
];

const STORAGE_KEY = 'ez_subjects';

const getStoredSubjects = () => {
  const data = sessionStorage.getItem(STORAGE_KEY);
  if (!data) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SUBJECTS));
    return INITIAL_SUBJECTS;
  }
  return JSON.parse(data);
};

const setStoredSubjects = (subjects) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
};

export const subjectService = {
  getAll: async () => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return getStoredSubjects();
  },

  add: async (subject) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const subjects = getStoredSubjects();
    const newSubject = { ...subject, id: subject.subjectCode, status: 'Active' };
    subjects.push(newSubject);
    setStoredSubjects(subjects);
    return newSubject;
  },

  update: async (id, updatedSubject) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const subjects = getStoredSubjects();
    const index = subjects.findIndex((s) => s.id === id);
    if (index !== -1) {
      subjects[index] = { ...subjects[index], ...updatedSubject, id: updatedSubject.subjectCode };
      setStoredSubjects(subjects);
      return subjects[index];
    }
    throw new Error('Subject not found');
  },

  delete: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const subjects = getStoredSubjects();
    const filtered = subjects.filter((s) => s.id !== id);
    setStoredSubjects(filtered);
    return true;
  }
};
