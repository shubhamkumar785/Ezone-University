import React from 'react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Edit2, Trash2 } from 'lucide-react';

const SubjectTable = ({ subjects = [], onEdit, onDelete }) => {
  return (
    <div className="ez-table-responsive">
      <table className="ez-data-table">
        <thead>
          <tr>
            <th>Subject Code</th>
            <th>Subject Name</th>
            <th>Department</th>
            <th>Semester</th>
            <th>Credits</th>
            <th>Assigned Teacher</th>
            <th>Status</th>
            <th className="table-actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.length === 0 ? (
            <tr>
              <td colSpan="8" className="table-empty-row">
                No subject records found.
              </td>
            </tr>
          ) : (
            subjects.map((sub) => (
              <tr key={sub.id}>
                <td className="table-highlight">{sub.subjectCode}</td>
                <td className="table-bold-cell">{sub.subjectName}</td>
                <td>{sub.department}</td>
                <td>{sub.semester} Semester</td>
                <td className="table-credits">{sub.credits}</td>
                <td>{sub.assignedTeacher || 'Unassigned'}</td>
                <td>
                  <Badge variant={sub.status === 'Active' ? 'success' : 'danger'}>
                    {sub.status}
                  </Badge>
                </td>
                <td>
                  <div className="table-actions-container">
                    <Button
                      onClick={() => onEdit(sub)}
                      variant="secondary"
                      className="table-action-btn edit"
                      title="Edit Subject"
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button
                      onClick={() => onDelete(sub.id)}
                      variant="secondary"
                      className="table-action-btn delete"
                      title="Delete Subject"
                    >
                      <Trash2 size={14} />
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

export default SubjectTable;
