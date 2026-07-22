const INITIAL_USERS = [
  {
    id: 'U-2001',
    username: 'admin',
    email: 'admin@ezone.edu',
    role: 'ADMIN',
    status: 'Active',
    locked: false,
    loginHistory: [
      { ip: '192.168.1.1', time: '2026-07-11 18:30:12', status: 'Success' },
      { ip: '192.168.1.1', time: '2026-07-11 10:20:45', status: 'Success' }
    ],
    otpHistory: ['5241', '9812']
  },
  {
    id: 'U-2002',
    username: 'sarah.mitchell',
    email: 'sarah.mitchell@ezone.edu',
    role: 'TEACHER',
    status: 'Active',
    locked: false,
    loginHistory: [
      { ip: '192.168.1.5', time: '2026-07-11 19:15:32', status: 'Success' },
      { ip: '192.168.1.5', time: '2026-07-10 09:40:11', status: 'Success' }
    ],
    otpHistory: ['1234']
  },
  {
    id: 'U-2003',
    username: 'john.doe',
    email: 'john.doe@ezone.edu',
    role: 'STUDENT',
    status: 'Active',
    locked: false,
    loginHistory: [
      { ip: '192.168.1.10', time: '2026-07-11 09:15:32', status: 'Success' }
    ],
    otpHistory: ['7856']
  },
  {
    id: 'U-2004',
    username: 'james.parker',
    email: 'james.parker@ezone.edu',
    role: 'TEACHER',
    status: 'Active',
    locked: true,
    loginHistory: [
      { ip: '192.168.1.12', time: '2026-07-10 14:02:18', status: 'Failed' },
      { ip: '192.168.1.12', time: '2026-07-10 13:58:04', status: 'Failed' }
    ],
    otpHistory: []
  },
  {
    id: 'U-2005',
    username: 'jane.smith',
    email: 'jane.smith@ezone.edu',
    role: 'STUDENT',
    status: 'Inactive',
    locked: false,
    loginHistory: [],
    otpHistory: []
  }
];

const STORAGE_KEY = 'ez_users';

const getStoredUsers = () => {
  const data = sessionStorage.getItem(STORAGE_KEY);
  if (!data) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  return JSON.parse(data);
};

const setStoredUsers = (users) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const userService = {
  getAll: async () => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return getStoredUsers();
  },

  toggleStatus: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index !== -1) {
      users[index].status = users[index].status === 'Active' ? 'Inactive' : 'Active';
      setStoredUsers(users);
      return users[index];
    }
    throw new Error('User not found');
  },

  toggleLock: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index !== -1) {
      users[index].locked = !users[index].locked;
      setStoredUsers(users);
      return users[index];
    }
    throw new Error('User not found');
  },

  resetLogin: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    // Clear failed logs or reset state
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index !== -1) {
      // Mock clearing failures
      if (users[index].locked) {
        users[index].locked = false;
      }
      setStoredUsers(users);
      return users[index];
    }
    throw new Error('User not found');
  },

  resetOtp: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index !== -1) {
      const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
      users[index].otpHistory = [newOtp, ...(users[index].otpHistory || [])];
      setStoredUsers(users);
      return { user: users[index], newOtp };
    }
    throw new Error('User not found');
  }
};
