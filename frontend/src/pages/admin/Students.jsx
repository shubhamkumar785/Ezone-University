import React, { useState, useEffect, useCallback } from 'react';
import { studentService } from '../../services/studentService';
import StudentTable from '../../components/admin/StudentTable';
import StudentForm from '../../components/admin/StudentForm';
import ProfileCard from '../../components/admin/ProfileCard';
import ImportDialog from '../../components/admin/ImportDialog';
import ExportDialog from '../../components/admin/ExportDialog';
import Filters from '../../components/common/Filters';
import Pagination from '../../components/common/Pagination';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { Plus, Upload, Download, X } from 'lucide-react';
import { toast } from 'react-toastify';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');

  // Pagination States
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  // Drawer & Modal States
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch {
      toast.error('Failed to load student profiles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // CRUD Actions
  const handleSaveStudent = async (formData) => {
    try {
      if (editingStudent) {
        await studentService.update(editingStudent.id, formData);
        toast.success('Student record updated successfully');
      } else {
        await studentService.add(formData);
        toast.success('Student registered successfully');
      }
      setIsFormOpen(false);
      setEditingStudent(null);
      fetchStudents();
    } catch (e) {
      toast.error(e.message || 'Error saving student');
    }
  };

  const handleDeactivate = async (id) => {
    const student = students.find((s) => s.id === id);
    const action = student.status === 'Active' ? 'deactivate' : 'activate';
    
    if (window.confirm(`Are you sure you want to ${action} student ${student.fullName}?`)) {
      try {
        await studentService.deactivate(id);
        toast.success(`Student profile ${action}d successfully`);
        fetchStudents();
      } catch {
        toast.error('Failed to toggle student activation status');
      }
    }
  };

  const handleImportDatabase = async (importedList) => {
    try {
      const added = await studentService.importBulk(importedList);
      toast.success(`Imported ${added.length} student records successfully!`);
      setIsImportOpen(false);
      fetchStudents();
    } catch {
      toast.error('Failed to import data');
    }
  };

  const handleEditClick = (student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleAddClick = () => {
    setEditingStudent(null);
    setIsFormOpen(true);
  };

  const handleResetFilters = () => {
    setSearch('');
    setDeptFilter('');
    setSemesterFilter('');
    setPage(1);
  };

  // Searching & Filter logic
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(search.toLowerCase()) ||
      student.id.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(search.toLowerCase());
    
    const matchesDept = deptFilter ? student.department === deptFilter : true;
    const matchesSem = semesterFilter ? student.semester === semesterFilter : true;

    return matchesSearch && matchesDept && matchesSem;
  });

  const paginatedStudents = filteredStudents.slice(
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
      value: semesterFilter,
      onChange: (val) => {
        setSemesterFilter(val);
        setPage(1);
      },
      placeholder: 'All Semesters',
      options: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']
    }
  ];

  return (
    <div className="ez-master-page">
      <div className="master-page-header">
        <h1 className="master-page-title">Student Management</h1>
        <div className="master-actions-group">
          <Button onClick={() => setIsImportOpen(true)} variant="secondary" className="master-action-btn-group">
            <Upload size={16} />
            <span>Import CSV</span>
          </Button>
          <Button onClick={() => setIsExportOpen(true)} variant="secondary" className="master-action-btn-group">
            <Download size={16} />
            <span>Export List</span>
          </Button>
          <Button onClick={handleAddClick} variant="primary" className="master-add-btn">
            <Plus size={16} />
            <span>Add Student</span>
          </Button>
        </div>
      </div>

      <div className={`master-drawer-layout-wrapper ${selectedStudent ? 'drawer-active' : ''}`}>
        <Card className="master-table-card flex-grow-card">
          <Filters
            searchValue={search}
            onSearchChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            searchPlaceholder="Search by name, ID, roll or email..."
            dropdowns={dropdownsConfig}
            onReset={handleResetFilters}
          />

          {loading ? (
            <div className="master-loader-wrapper">
              <Loader />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '10px' }}>Loading student directory...</span>
            </div>
          ) : (
            <>
              <StudentTable
                students={paginatedStudents}
                onView={setSelectedStudent}
                onEdit={handleEditClick}
                onDeactivate={handleDeactivate}
              />
              <Pagination
                currentPage={page}
                totalItems={filteredStudents.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setPage}
              />
            </>
          )}
        </Card>

        {/* Profile drawer slides in alongside table card on large screens */}
        {selectedStudent && (
          <div className="profile-drawer-card-wrapper">
            <ProfileCard student={selectedStudent} onClose={() => setSelectedStudent(null)} />
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="ez-modal-overlay">
          <div className="ez-modal-card">
            <button className="ez-modal-close" onClick={() => setIsFormOpen(false)}>
              <X size={20} />
            </button>
            <StudentForm
              initialData={editingStudent}
              onSubmit={handleSaveStudent}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Import Modal */}
      {isImportOpen && (
        <div className="ez-modal-overlay">
          <div className="ez-modal-card">
            <button className="ez-modal-close" onClick={() => setIsImportOpen(false)}>
              <X size={20} />
            </button>
            <ImportDialog onImport={handleImportDatabase} onCancel={() => setIsImportOpen(false)} />
          </div>
        </div>
      )}

      {/* Export Modal */}
      {isExportOpen && (
        <div className="ez-modal-overlay">
          <div className="ez-modal-card">
            <button className="ez-modal-close" onClick={() => setIsExportOpen(false)}>
              <X size={20} />
            </button>
            <ExportDialog category="Students" data={filteredStudents} onCancel={() => setIsExportOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
