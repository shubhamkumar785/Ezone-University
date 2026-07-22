const INITIAL_CLASSROOMS = [
  {
    id: 'R-301',
    roomNumber: '301',
    building: 'Building A',
    floor: '3rd',
    capacity: 60,
    type: 'Classroom',
    status: 'Active'
  },
  {
    id: 'R-302',
    roomNumber: '302',
    building: 'Building A',
    floor: '3rd',
    capacity: 40,
    type: 'Lab',
    status: 'Active'
  },
  {
    id: 'R-102',
    roomNumber: '102',
    building: 'Science Block',
    floor: '1st',
    capacity: 80,
    type: 'Classroom',
    status: 'Active'
  },
  {
    id: 'R-204',
    roomNumber: '204',
    building: 'Tech Wing',
    floor: '2nd',
    capacity: 35,
    type: 'Lab',
    status: 'Active'
  },
  {
    id: 'R-405',
    roomNumber: '405',
    building: 'Building B',
    floor: '4th',
    capacity: 50,
    type: 'Classroom',
    status: 'Inactive'
  }
];

const STORAGE_KEY = 'ez_classrooms';

const getStoredClassrooms = () => {
  const data = sessionStorage.getItem(STORAGE_KEY);
  if (!data) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CLASSROOMS));
    return INITIAL_CLASSROOMS;
  }
  return JSON.parse(data);
};

const setStoredClassrooms = (rooms) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
};

export const classroomService = {
  getAll: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return getStoredClassrooms();
  },

  add: async (room) => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const rooms = getStoredClassrooms();
    const newRoom = { ...room, id: `R-${room.roomNumber}`, status: 'Active' };
    rooms.push(newRoom);
    setStoredClassrooms(rooms);
    return newRoom;
  },

  update: async (id, updatedRoom) => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const rooms = getStoredClassrooms();
    const index = rooms.findIndex((r) => r.id === id);
    if (index !== -1) {
      rooms[index] = { ...rooms[index], ...updatedRoom, id: `R-${updatedRoom.roomNumber}` };
      setStoredClassrooms(rooms);
      return rooms[index];
    }
    throw new Error('Classroom not found');
  },

  delete: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const rooms = getStoredClassrooms();
    const filtered = rooms.filter((r) => r.id !== id);
    setStoredClassrooms(filtered);
    return true;
  }
};
