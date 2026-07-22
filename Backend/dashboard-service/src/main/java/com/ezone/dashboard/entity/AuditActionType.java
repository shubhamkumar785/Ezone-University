package com.ezone.dashboard.entity;

/**
 * Audit action types for the attendance audit log.
 * Every meaningful interaction with the attendance system is recorded.
 */
public enum AuditActionType {

    /** A student viewed their day-wise attendance. */
    STUDENT_VIEWED,

    /** A teacher marked attendance for a class period. */
    TEACHER_MARKED,

    /** A teacher updated previously submitted attendance. */
    TEACHER_UPDATED,

    /** An admin overrode or modified an attendance record. */
    ADMIN_MODIFIED,

    /** An admin locked attendance for a date/term, preventing further edits. */
    ADMIN_LOCKED,

    /** A student or admin generated an attendance export report. */
    EXPORT_GENERATED
}
