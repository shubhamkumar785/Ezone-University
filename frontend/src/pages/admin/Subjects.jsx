import React, { useState, useEffect, useCallback } from 'react';
import { subjectService } from '../../services/subjectService';
import { teacherService } from '../../services/teacherService';
import SubjectTable from '../../components/admin/SubjectTable';
import Filters from '../../components/common/Filters';
import Pagination from '../../components/common/Pagination';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { Plus, X } from 'lucide-react';
import { toast } from 'react-toastify';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');

  // Pagination States
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    subjectCode: '',
    subjectName: '',
    department: '',
    semester: '',
    credits: 3,
    assignedTeacher: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const subData = await subjectService.getAll();
      const teachData = await teacherService.getAll();
      setSubjects(subData);
      setTeachers(teachData.filter(t => t.status === 'Active'));
    } catch {
      toast.error('Failed to load subjects and teachers data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEditClick = (subject) => {
    setEditingSubject(subject);
    setFormData({
      subjectCode: subject.subjectCode || '',
      subjectName: subject.subjectName || '',
      department: subject.department || '',
      semester: subject.semester || '',
      credits: subject.credits || 3,
      assignedTeacher: subject.assignedTeacher || ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingSubject(null);
    setFormData({
      subjectCode: '',
      subjectName: '',
      department: '',
      semester: '',
      credits: 3,
      assignedTeacher: ''
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
    if (!formData.subjectCode.trim()) errors.subjectCode = 'Subject Code is required';
    if (!formData.subjectName.trim()) errors.subjectName = 'Subject Name is required';
    if (!formData.department) errors.department = 'Department is required';
    if (!formData.semester) errors.semester = 'Semester is required';
    if (!formData.credits) errors.credits = 'Credits is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingSubject) {
        await subjectService.update(editingSubject.id, formData);
        toast.success('Subject details updated');
      } else {
        await subjectService.add(formData);
        toast.success('Subject registered successfully');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (e) {
      toast.error(e.message || 'Error saving subject');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await subjectService.delete(id);
        toast.success('Subject deleted successfully');
        fetchData();
      } catch {
        toast.error('Failed to delete subject');
      }
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setDeptFilter('');
    setSemesterFilter('');
    setPage(1);
  };

  // Filters logic
  const filteredSubjects = subjects.filter((sub) => {
    const matchesSearch =
      sub.subjectName.toLowerCase().includes(search.toLowerCase()) ||
      sub.subjectCode.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter ? sub.department === deptFilter : true;
    const matchesSem = semesterFilter ? sub.semester === semesterFilter : true;

    return matchesSearch && matchesDept && matchesSem;
  });

  const paginatedSubjects = filteredSubjects.slice(
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
        <h1 className="master-page-title">Subject Management</h1>
        <Button onClick={handleAddClick} variant="primary" className="master-add-btn">
          <Plus size={16} />
          <span>Add Subject</span>
        </Button>
      </div>

      <Card className="master-table-card">
        <Filters
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          searchPlaceholder="Search by subject code or name..."
          dropdowns={dropdownsConfig}
          onReset={handleResetFilters}
        />

        {loading ? (
          <div className="master-loader-wrapper">
            <Loader />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '10px' }}>Loading subjects...</span>
          </div>
        ) : (
          <>
            <SubjectTable
              subjects={paginatedSubjects}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
            <Pagination
              currentPage={page}
              totalItems={filteredSubjects.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>

      {/* Subject Modal */}
      {isModalOpen && (
        <div className="ez-modal-overlay">
          <div className="ez-modal-card">
            <button className="ez-modal-close" onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>
            <form className="ez-modal-form" onSubmit={handleSave}>
              <h3 className="form-modal-title">{editingSubject ? 'Edit Subject Details' : 'Add New Subject'}</h3>
              <div className="form-fields-grid">
                <div className="form-group">
                  <label className="ez-input-label">Subject Code *</label>
                  <input
                    type="text"
                    disabled={!!editingSubject}
                    className={`ez-input-field ${formErrors.subjectCode ? 'ez-input-error' : ''}`}
                    placeholder="CS-101"
                    value={formData.subjectCode}
                    onChange={(e) => handleInputChange('subjectCode', e.target.value)}
                  />
                  {formErrors.subjectCode && <span className="ez-error-msg">{formErrors.subjectCode}</span>}
                </div>

                <div className="form-group">
                  <label className="ez-input-label">Subject Name *</label>
                  <input
                    type="text"
                    className={`ez-input-field ${formErrors.subjectName ? 'ez-input-error' : ''}`}
                    placeholder="Introduction to Programming"
                    value={formData.subjectName}
                    onChange={(e) => handleInputChange('subjectName', e.target.value)}
                  />
                  {formErrors.subjectName && <span className="ez-error-msg">{formErrors.subjectName}</span>}
                </div>

                <div className="form-group">
                  <label className="ez-input-label">Department *</label>
                  <select
                    className={`ez-input-field ${formErrors.department ? 'ez-input-error' : ''}`}
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                  >
                    <option value="">Select Department</option>
                    {['Computer Science', 'Mechanical Eng', 'Electrical Eng', 'Mathematics', 'Physics', 'Civil Eng'].map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {formErrors.department && <span className="ez-error-msg">{formErrors.department}</span>}
                </div>

                <div className="form-group">
                  <label className="ez-input-label">Semester *</label>
                  <select
                    className={`ez-input-field ${formErrors.semester ? 'ez-input-error' : ''}`}
                    value={formData.semester}
                    onChange={(e) => handleInputChange('semester', e.target.value)}
                  >
                    <option value="">Select Semester</option>
                    {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map(sem => (
                      <option key={sem} value={sem}>{sem} Semester</option>
                    ))}
                  </select>
                  {formErrors.semester && <span className="ez-error-msg">{formErrors.semester}</span>}
                </div>

                <div className="form-group">
                  <label className="ez-input-label">Credits *</label>
                  <select
                    className="ez-input-field"
                    value={formData.credits}
                    onChange={(e) => handleInputChange('credits', Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map(c => (
                      <option key={c} value={c}>{c} Credits</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="ez-input-label">Assigned Teacher</label>
                  <select
                    className="ez-input-field"
                    value={formData.assignedTeacher}
                    onChange={(e) => handleInputChange('assignedTeacher', e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {teachers.map(teach => (
                      <option key={teach.id} value={teach.fullName}>{teach.fullName} ({teach.department})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-actions-row">
                <Button onClick={() => setIsModalOpen(false)} variant="secondary" className="form-cancel-btn">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="form-submit-btn">
                  Save Subject
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;
