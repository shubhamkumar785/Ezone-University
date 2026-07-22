import React, { useState, useEffect, useCallback } from 'react';
import { classroomService } from '../../services/classroomService';
import ClassroomTable from '../../components/admin/ClassroomTable';
import Filters from '../../components/common/Filters';
import Pagination from '../../components/common/Pagination';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { Plus, X } from 'lucide-react';
import { toast } from 'react-toastify';

const Classrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Pagination States
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    building: '',
    floor: '',
    capacity: 40,
    type: 'Classroom'
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchClassrooms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await classroomService.getAll();
      setClassrooms(data);
    } catch {
      toast.error('Failed to load classrooms data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClassrooms();
  }, [fetchClassrooms]);

  const handleEditClick = (room) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber || '',
      building: room.building || '',
      floor: room.floor || '',
      capacity: room.capacity || 40,
      type: room.type || 'Classroom'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingRoom(null);
    setFormData({
      roomNumber: '',
      building: '',
      floor: '',
      capacity: 40,
      type: 'Classroom'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.roomNumber.trim()) errors.roomNumber = 'Room Number is required';
    if (!formData.building.trim()) errors.building = 'Building name is required';
    if (!formData.floor.trim()) errors.floor = 'Floor designation is required';
    if (!formData.capacity || formData.capacity <= 0) errors.capacity = 'Capacity must be greater than 0';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingRoom) {
        await classroomService.update(editingRoom.id, formData);
        toast.success('Classroom details updated');
      } else {
        await classroomService.add(formData);
        toast.success('Classroom added successfully');
      }
      setIsModalOpen(false);
      fetchClassrooms();
    } catch (e) {
      toast.error(e.message || 'Error saving classroom details');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this classroom?')) {
      try {
        await classroomService.delete(id);
        toast.success('Classroom deleted');
        fetchClassrooms();
      } catch {
        toast.error('Failed to delete classroom');
      }
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setBuildingFilter('');
    setTypeFilter('');
    setPage(1);
  };

  // Filter classrooms logic
  const filteredClassrooms = classrooms.filter((room) => {
    const matchesSearch =
      room.roomNumber.includes(search) ||
      room.building.toLowerCase().includes(search.toLowerCase());
    const matchesBuilding = buildingFilter ? room.building === buildingFilter : true;
    const matchesType = typeFilter ? room.type === typeFilter : true;

    return matchesSearch && matchesBuilding && matchesType;
  });

  const paginatedClassrooms = filteredClassrooms.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Get unique buildings for dropdown
  const uniqueBuildings = Array.from(new Set(classrooms.map(c => c.building)));

  const dropdownsConfig = [
    {
      value: buildingFilter,
      onChange: (val) => {
        setBuildingFilter(val);
        setPage(1);
      },
      placeholder: 'All Buildings',
      options: uniqueBuildings
    },
    {
      value: typeFilter,
      onChange: (val) => {
        setTypeFilter(val);
        setPage(1);
      },
      placeholder: 'All Types',
      options: ['Classroom', 'Lab']
    }
  ];

  return (
    <div className="ez-master-page">
      <div className="master-page-header">
        <h1 className="master-page-title">Classroom Management</h1>
        <Button onClick={handleAddClick} variant="primary" className="master-add-btn">
          <Plus size={16} />
          <span>Add Classroom</span>
        </Button>
      </div>

      <Card className="master-table-card">
        <Filters
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          searchPlaceholder="Search by room or building..."
          dropdowns={dropdownsConfig}
          onReset={handleResetFilters}
        />

        {loading ? (
          <div className="master-loader-wrapper">
            <Loader />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '10px' }}>Loading classrooms...</span>
          </div>
        ) : (
          <>
            <ClassroomTable
              classrooms={paginatedClassrooms}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
            <Pagination
              currentPage={page}
              totalItems={filteredClassrooms.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>

      {/* Classroom Modal */}
      {isModalOpen && (
        <div className="ez-modal-overlay">
          <div className="ez-modal-card">
            <button className="ez-modal-close" onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>
            <form className="ez-modal-form" onSubmit={handleSave}>
              <h3 className="form-modal-title">{editingRoom ? 'Edit Classroom Details' : 'Add New Classroom'}</h3>
              <div className="form-fields-grid">
                <div className="form-group">
                  <label className="ez-input-label">Room Number *</label>
                  <input
                    type="text"
                    disabled={!!editingRoom}
                    className={`ez-input-field ${formErrors.roomNumber ? 'ez-input-error' : ''}`}
                    placeholder="301"
                    value={formData.roomNumber}
                    onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                  />
                  {formErrors.roomNumber && <span className="ez-error-msg">{formErrors.roomNumber}</span>}
                </div>

                <div className="form-group">
                  <label className="ez-input-label">Building Name *</label>
                  <input
                    type="text"
                    className={`ez-input-field ${formErrors.building ? 'ez-input-error' : ''}`}
                    placeholder="Building A"
                    value={formData.building}
                    onChange={(e) => handleInputChange('building', e.target.value)}
                  />
                  {formErrors.building && <span className="ez-error-msg">{formErrors.building}</span>}
                </div>

                <div className="form-group">
                  <label className="ez-input-label">Floor Designation *</label>
                  <input
                    type="text"
                    className={`ez-input-field ${formErrors.floor ? 'ez-input-error' : ''}`}
                    placeholder="3rd"
                    value={formData.floor}
                    onChange={(e) => handleInputChange('floor', e.target.value)}
                  />
                  {formErrors.floor && <span className="ez-error-msg">{formErrors.floor}</span>}
                </div>

                <div className="form-group">
                  <label className="ez-input-label">Capacity (Students) *</label>
                  <input
                    type="number"
                    className={`ez-input-field ${formErrors.capacity ? 'ez-input-error' : ''}`}
                    placeholder="50"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', Number(e.target.value))}
                  />
                  {formErrors.capacity && <span className="ez-error-msg">{formErrors.capacity}</span>}
                </div>

                <div className="form-group">
                  <label className="ez-input-label">Room Type *</label>
                  <select
                    className="ez-input-field"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  >
                    <option value="Classroom">Classroom</option>
                    <option value="Lab">Lab</option>
                  </select>
                </div>
              </div>

              <div className="form-actions-row">
                <Button onClick={() => setIsModalOpen(false)} variant="secondary" className="form-cancel-btn">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="form-submit-btn">
                  Save Room
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classrooms;
