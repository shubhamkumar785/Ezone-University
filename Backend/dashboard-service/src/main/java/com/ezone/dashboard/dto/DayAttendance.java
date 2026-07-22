package com.ezone.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Calendar day metadata in the Day Wise Attendance response.
 * Holiday information takes priority — when isHoliday = true, the frontend
 * renders a full-width holiday row and ignores any attendance data for that date.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DayAttendance {

    /** ISO-8601 date string: "2026-01-15" */
    private String date;

    /** Full day name: "Monday", "Tuesday", etc. */
    private String dayName;

    /** Day of month as string: "1", "15", "31" */
    private String dayOfMonth;

    /**
     * True when this date is a declared holiday in the Academic Calendar.
     * Priority rule: holiday always overrides attendance — no P/A/ML/EL is shown.
     */
    private Boolean isHoliday;

    /** Name of the holiday (null if not a holiday). e.g., "Republic Day", "Diwali" */
    private String holidayName;

    /**
     * Academic Calendar event type (null if not a holiday).
     * Values: HOLIDAY, SEMESTER_BREAK, EXAM, FESTIVAL, UNIVERSITY_EVENT
     */
    private String calendarEventType;
}
