import React from 'react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Eye, Edit2, UserX, UserCheck } from 'lucide-react';

const StudentTable = ({ students = [], onView, onEdit, onDeactivate }) => {
  return (
    <div className="ez-table-responsive">
      <table className="ez-data-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Course</th>
            <th>Semester</th>
            <th>Section</th>
            <th>Roll Number</th>
            <th>Status</th>
            <th className="table-actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="10" className="table-empty-row">
                No student records found.
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student.id}>
                <td className="table-highlight">{student.id}</td>
                <td>
                  <div className="table-cell-profile">
                    <div className="table-avatar-initials student">
                      {student.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <span className="table-profile-name">{student.fullName}</span>
                      <span className="table-profile-sub">{student.phone}</span>
                    </div>
                  </div>
                </td>
                <td>{student.email}</td>
                <td>{student.department}</td>
                <td>{student.course}</td>
                <td className="table-semester">{student.semester} Sem</td>
                <td className="table-section">Sec {student.section}</td>
                <td className="table-roll">{student.rollNumber}</td>
                <td>
                  <Badge variant={student.status === 'Active' ? 'success' : 'danger'}>
                    {student.status}
                  </Badge>
                </td>
                <td>
                  <div className="table-actions-container">
                    <Button
                      onClick={() => onView(student)}
                      variant="secondary"
                      className="table-action-btn view"
                      title="View Student Profile"
                    >
                      <Eye size={14} />
                    </Button>
                    <Button
                      onClick={() => onEdit(student)}
                      variant="secondary"
                      className="table-action-btn edit"
                      title="Edit Student"
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button
                      onClick={() => onDeactivate(student.id)}
                      variant="secondary"
                      className={`table-action-btn ${student.status === 'Active' ? 'deactivate' : 'activate'}`}
                      title={student.status === 'Active' ? 'Deactivate' : 'Activate'}
                    >
                      {student.status === 'Active' ? <UserX size={14} /> : <UserCheck size={14} />}
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
