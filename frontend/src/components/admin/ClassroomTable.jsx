import React from 'react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Edit2, Trash2 } from 'lucide-react';

const ClassroomTable = ({ classrooms = [], onEdit, onDelete }) => {
  return (
    <div className="ez-table-responsive">
      <table className="ez-data-table">
        <thead>
          <tr>
            <th>Room Number</th>
            <th>Building</th>
            <th>Floor</th>
            <th>Capacity</th>
            <th>Room Type</th>
            <th>Status</th>
            <th className="table-actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {classrooms.length === 0 ? (
            <tr>
              <td colSpan="7" className="table-empty-row">
                No classroom records found.
              </td>
            </tr>
          ) : (
            classrooms.map((room) => (
              <tr key={room.id}>
                <td className="table-highlight">Room {room.roomNumber}</td>
                <td>{room.building}</td>
                <td>{room.floor}</td>
                <td className="table-capacity">{room.capacity} students</td>
                <td>
                  <Badge variant={room.type === 'Lab' ? 'info' : 'success'}>
                    {room.type}
                  </Badge>
                </td>
                <td>
                  <Badge variant={room.status === 'Active' ? 'success' : 'danger'}>
                    {room.status}
                  </Badge>
                </td>
                <td>
                  <div className="table-actions-container">
                    <Button
                      onClick={() => onEdit(room)}
                      variant="secondary"
                      className="table-action-btn edit"
                      title="Edit Room"
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button
                      onClick={() => onDelete(room.id)}
                      variant="secondary"
                      className="table-action-btn delete"
                      title="Delete Room"
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

export default ClassroomTable;
