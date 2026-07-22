package com.ezone.dashboard.entity;

/**
 * Lifecycle lock states for an attendance session (a teacher's attendance submission
 * for a specific class period on a specific date).
 *
 * Visibility rules:
 *  - DRAFT    → Only visible to the teacher who created it. Students never see DRAFT.
 *  - SUBMITTED → Visible to students. Teacher may still edit.
 *  - VERIFIED  → Reviewed by admin. Teacher needs admin re-open to edit.
 *  - LOCKED    → Permanently frozen. No edits allowed by anyone.
 */
public enum AttendanceSessionStatus {

    /** Teacher has started entering but not yet submitted. Hidden from students. */
    DRAFT,

    /** Teacher has submitted. Visible to students. */
    SUBMITTED,

    /** Admin has verified the attendance. */
    VERIFIED,

    /** Admin has permanently locked the attendance. No further modifications. */
    LOCKED
}
