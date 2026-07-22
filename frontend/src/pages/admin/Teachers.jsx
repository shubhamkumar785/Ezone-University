import React, { useState, useEffect, useCallback } from 'react';
import { teacherService } from '../../services/teacherService';
import TeacherTable from '../../components/admin/TeacherTable';
import TeacherForm from '../../components/admin/TeacherForm';
import Filters from '../../components/common/Filters';
import Pagination from '../../components/common/Pagination';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { Plus, X } from 'lucide-react';
import { toast } from 'react-toastify';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Pagination States
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await teacherService.getAll();
      setTeachers(data);
    } catch {
      toast.error('Failed to load teachers data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  // Handle CRUD
  const handleSaveTeacher = async (formData) => {
    try {
      if (editingTeacher) {
        await teacherService.update(editingTeacher.id, formData);
        toast.success('Teacher profile updated successfully');
      } else {
        await teacherService.add(formData);
        toast.success('New teacher registered successfully');
      }
      setIsModalOpen(false);
      setEditingTeacher(null);
      fetchTeachers();
    } catch (e) {
      toast.error(e.message || 'Failed to save teacher details');
    }
  };

  const handleDeactivate = async (id) => {
    const teacher = teachers.find((t) => t.id === id);
    const action = teacher.status === 'Active' ? 'deactivate' : 'activate';
    
    if (window.confirm(`Are you sure you want to ${action} ${teacher.fullName}?`)) {
      try {
        await teacherService.deactivate(id);
        toast.success(`Teacher profile ${action}d successfully`);
        fetchTeachers();
      } catch {
        toast.error('Failed to update teacher status');
      }
    }
  };

  const handleEditClick = (teacher) => {
    setEditingTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingTeacher(null);
    setIsModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearch('');
    setDeptFilter('');
    setStatusFilter('');
    setPage(1);
  };

  // Filter & Search Logic
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.fullName.toLowerCase().includes(search.toLowerCase()) ||
      teacher.id.toLowerCase().includes(search.toLowerCase()) ||
      teacher.email.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter ? teacher.department === deptFilter : true;
    const matchesStatus = statusFilter ? teacher.status === statusFilter : true;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Paginated Slices
  const paginatedTeachers = filteredTeachers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const dropdownsConfig = [
    {
      value: deptFilter,
      onChange: (val) => {
        setDeptFilter(val);
        setPage(1);
      },
      placeholder: 'All Departments',
      options: ['Computer Science', 'Mechanical Eng', 'Electrical Eng', 'Mathematics', 'Physics', 'Civil Eng']
    },
    {
      value: statusFilter,
      onChange: (val) => {
        setStatusFilter(val);
        setPage(1);
      },
      placeholder: 'All Statuses',
      options: ['Active', 'Inactive']
    }
  ];

  return (
    <div className="ez-master-page">
      <div className="master-page-header">
        <h1 className="master-page-title">Teacher Management</h1>
        <Button onClick={handleAddClick} variant="primary" className="master-add-btn">
          <Plus size={16} />
          <span>Add Teacher</span>
        </Button>
      </div>

      <Card className="master-table-card">
        {/* Generic Filter Bar */}
        <Filters
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          searchPlaceholder="Search by name, ID or email..."
          dropdowns={dropdownsConfig}
          onReset={handleResetFilters}
        />

        {loading ? (
          <div className="master-loader-wrapper">
            <Loader />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '10px' }}>Loading teacher records...</span>
          </div>
        ) : (
          <>
            <TeacherTable
              teachers={paginatedTeachers}
              onEdit={handleEditClick}
              onDeactivate={handleDeactivate}
            />
            <Pagination
              currentPage={page}
              totalItems={filteredTeachers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>

      {/* Form Modal Overlay */}
      {isModalOpen && (
        <div className="ez-modal-overlay">
          <div className="ez-modal-card">
            <button className="ez-modal-close" onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>
            <TeacherForm
              initialData={editingTeacher}
              onSubmit={handleSaveTeacher}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;
