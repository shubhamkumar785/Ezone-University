package com.ezone.dashboard.entity;

/**
 * Enum representing all possible attendance states for a scheduled class period.
 * Used in AttendanceRecord.status and as the value in the Day Wise Attendance grid.
 */
public enum AttendanceStatus {

    /** Teacher marked the student present for the scheduled class. */
    PRESENT,

    /** Teacher marked the student absent. */
    ABSENT,

    /** Attendance excused via an approved medical leave. */
    MEDICAL,

    /** Attendance excused due to an approved university event. */
    EVENT,

    /** Academic Calendar holiday — no attendance is possible on this day. */
    HOLIDAY,

    /** No class is scheduled for this student in this timetable slot. */
    NO_CLASS,

    /** Class is scheduled but faculty has not yet submitted attendance. */
    NOT_MARKED
}
