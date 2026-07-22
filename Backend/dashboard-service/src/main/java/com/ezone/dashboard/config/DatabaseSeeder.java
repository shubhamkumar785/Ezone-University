package com.ezone.dashboard.config;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.ezone.dashboard.entity.AcademicCalendar;
import com.ezone.dashboard.entity.AcademicTerm;
import com.ezone.dashboard.entity.AttendanceRecord;
import com.ezone.dashboard.entity.AttendanceSessionStatus;
import com.ezone.dashboard.entity.AttendanceStatus;
import com.ezone.dashboard.entity.AttendanceTrend;
import com.ezone.dashboard.entity.CAMarks;
import com.ezone.dashboard.entity.ClassSchedule;
import com.ezone.dashboard.entity.DashboardOverview;
import com.ezone.dashboard.entity.DepartmentDistribution;
import com.ezone.dashboard.entity.EnrollmentTrend;
import com.ezone.dashboard.entity.Faculty;
import com.ezone.dashboard.entity.FeeReport;
import com.ezone.dashboard.entity.PendingLeave;
import com.ezone.dashboard.entity.PracticalMarks;
import com.ezone.dashboard.entity.RecentActivity;
import com.ezone.dashboard.entity.Student;
import com.ezone.dashboard.entity.StudentEnrollment;
import com.ezone.dashboard.entity.StudentNotification;
import com.ezone.dashboard.entity.Subject;
import com.ezone.dashboard.entity.SubjectFacultyMapping;
import com.ezone.dashboard.entity.SystemAlert;
import com.ezone.dashboard.entity.TimetablePeriod;
import com.ezone.dashboard.repository.AcademicCalendarRepository;
import com.ezone.dashboard.repository.AcademicTermRepository;
import com.ezone.dashboard.repository.AttendanceRecordRepository;
import com.ezone.dashboard.repository.AttendanceTrendRepository;
import com.ezone.dashboard.repository.CAMarksRepository;
import com.ezone.dashboard.repository.ClassScheduleRepository;
import com.ezone.dashboard.repository.DashboardOverviewRepository;
import com.ezone.dashboard.repository.DepartmentDistributionRepository;
import com.ezone.dashboard.repository.EnrollmentTrendRepository;
import com.ezone.dashboard.repository.FacultyRepository;
import com.ezone.dashboard.repository.FeeReportRepository;
import com.ezone.dashboard.repository.PendingLeaveRepository;
import com.ezone.dashboard.repository.PracticalMarksRepository;
import com.ezone.dashboard.repository.RecentActivityRepository;
import com.ezone.dashboard.repository.StudentEnrollmentRepository;
import com.ezone.dashboard.repository.StudentNotificationRepository;
import com.ezone.dashboard.repository.StudentRepository;
import com.ezone.dashboard.repository.SubjectFacultyMappingRepository;
import com.ezone.dashboard.repository.SubjectRepository;
import com.ezone.dashboard.repository.SystemAlertRepository;
import com.ezone.dashboard.repository.TimetablePeriodRepository;

import lombok.RequiredArgsConstructor;

/**
 * Development/testing convenience seeder.
 * NOT required for production operation.
 * All production data is managed through the Admin Dashboard.
 *
 * All seed methods are idempotent — they check if data already exists before inserting.
 */
@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final DashboardOverviewRepository overviewRepository;
    private final EnrollmentTrendRepository enrollmentRepository;
    private final AttendanceTrendRepository attendanceRepository;
    private final DepartmentDistributionRepository departmentRepository;
    private final FeeReportRepository feeRepository;
    private final RecentActivityRepository recentActivityRepository;
    private final PendingLeaveRepository pendingLeaveRepository;
    private final SystemAlertRepository systemAlertRepository;
    private final StudentRepository studentRepository;
    private final StudentNotificationRepository studentNotificationRepository;
    private final AcademicTermRepository academicTermRepository;
    private final SubjectRepository subjectRepository;
    private final StudentEnrollmentRepository studentEnrollmentRepository;
    private final CAMarksRepository caMarksRepository;
    private final PracticalMarksRepository practicalMarksRepository;
    private final FacultyRepository facultyRepository;
    private final SubjectFacultyMappingRepository subjectFacultyMappingRepository;
    private final AttendanceRecordRepository attendanceRecordRepository;
    private final TimetablePeriodRepository timetablePeriodRepository;
    private final ClassScheduleRepository classScheduleRepository;
    private final AcademicCalendarRepository academicCalendarRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("✅ Seeding development data...");
        seedOverview();
        seedEnrollmentTrend();
        seedAttendanceTrend();
        seedDepartmentDistribution();
        seedFeeReport();
        seedStudentData();
        seedAcademicTerms();
        seedSubjects();
        seedFaculty();
        seedStudentEnrollments();
        seedSubjectFacultyMappings();
        seedCAMarks();
        seedTimetablePeriods();
        seedClassSchedules();
        seedAttendanceRecords();
        seedAcademicCalendar();
        System.out.println("✅ Development data seeded successfully");
    }

    private void seedOverview() {
        if (overviewRepository.count() == 0) {
            DashboardOverview overview = DashboardOverview.builder()
                    .totalStudents(5847).totalTeachers(312).totalDepartments(18)
                    .activeCourses(124).averageAttendance(84.5).pendingLeaves(23)
                    .activeAlerts(5).feeCollected(892000.0).build();
            overviewRepository.save(overview);
        }
    }

    private void seedEnrollmentTrend() {
        if (enrollmentRepository.count() == 0) {
            enrollmentRepository.saveAll(Arrays.asList(
                    EnrollmentTrend.builder().month("Aug").students(5050).build(),
                    EnrollmentTrend.builder().month("Sep").students(5120).build(),
                    EnrollmentTrend.builder().month("Oct").students(5200).build(),
                    EnrollmentTrend.builder().month("Nov").students(5250).build(),
                    EnrollmentTrend.builder().month("Dec").students(5230).build(),
                    EnrollmentTrend.builder().month("Jan").students(5310).build(),
                    EnrollmentTrend.builder().month("Feb").students(5380).build(),
                    EnrollmentTrend.builder().month("Mar").students(5410).build(),
                    EnrollmentTrend.builder().month("Apr").students(5480).build(),
                    EnrollmentTrend.builder().month("May").students(5520).build(),
                    EnrollmentTrend.builder().month("Jun").students(5590).build(),
                    EnrollmentTrend.builder().month("Jul").students(5847).build()
            ));
        }
    }

    private void seedAttendanceTrend() {
        if (attendanceRepository.count() == 0) {
            attendanceRepository.saveAll(Arrays.asList(
                    AttendanceTrend.builder().month("Jan").present(88).absent(12).build(),
                    AttendanceTrend.builder().month("Feb").present(86).absent(14).build(),
                    AttendanceTrend.builder().month("Mar").present(91).absent(9).build(),
                    AttendanceTrend.builder().month("Apr").present(84).absent(16).build(),
                    AttendanceTrend.builder().month("May").present(89).absent(11).build(),
                    AttendanceTrend.builder().month("Jun").present(90).absent(10).build(),
                    AttendanceTrend.builder().month("Jul").present(87).absent(13).build()
            ));
        }
    }

    private void seedDepartmentDistribution() {
        if (departmentRepository.count() == 0) {
            departmentRepository.saveAll(Arrays.asList(
                    DepartmentDistribution.builder().department("Computer Science").students(1754).build(),
                    DepartmentDistribution.builder().department("Mechanical Eng").students(1170).build(),
                    DepartmentDistribution.builder().department("Electrical Eng").students(877).build(),
                    DepartmentDistribution.builder().department("Business Admin").students(701).build(),
                    DepartmentDistribution.builder().department("Mathematics").students(468).build(),
                    DepartmentDistribution.builder().department("Physics").students(468).build(),
                    DepartmentDistribution.builder().department("Civil Eng").students(409).build()
            ));
        }
    }

    private void seedFeeReport() {
        if (feeRepository.count() == 0) {
            feeRepository.saveAll(Arrays.asList(
                    FeeReport.builder().month("Jan").collected(115000.0).target(130000.0).build(),
                    FeeReport.builder().month("Feb").collected(108000.0).target(125000.0).build(),
                    FeeReport.builder().month("Mar").collected(124000.0).target(130000.0).build(),
                    FeeReport.builder().month("Apr").collected(119000.0).target(135000.0).build(),
                    FeeReport.builder().month("May").collected(138000.0).target(155000.0).build(),
                    FeeReport.builder().month("Jun").collected(95000.0).target(140000.0).build(),
                    FeeReport.builder().month("Jul").collected(82000.0).target(120000.0).build()
            ));
        }
    }

    private void seedStudentData() {
        if (studentRepository.count() == 0) {
            Student student1 = Student.builder()
                    .loginId("2024CSE001").studentId("STU2024001").fullName("Rahul Kumar")
                    .email("rahul.kumar@ezone.edu").phone("+91-9876543210")
                    .department("Computer Science").course("B.Tech CSE").specialization("AIML")
                    .semester("6th Semester").section("A").rollNumber("2024CSE001")
                    .profilePhoto("https://ui-avatars.com/api/?name=Rahul+Kumar&background=4F7CFE&color=fff&size=200")
                    .cgpa(8.5).attendancePercentage(87.5).pendingAssignments(3)
                    .completedAssignments(12).upcomingExams(2).status("Active")
                    .tenantId("EZONE_UNIV").campusId("MAIN").programId("BTECH_CSE").batchId("2024")
                    .build();

            Student student2 = Student.builder()
                    .loginId("2024CSE002").studentId("STU2024002").fullName("Priya Sharma")
                    .email("priya.sharma@ezone.edu").phone("+91-9876543211")
                    .department("Computer Science").course("B.Tech CSE").specialization("Data Science")
                    .semester("6th Semester").section("A").rollNumber("2024CSE002")
                    .profilePhoto("https://ui-avatars.com/api/?name=Priya+Sharma&background=4F7CFE&color=fff&size=200")
                    .cgpa(9.1).attendancePercentage(92.0).pendingAssignments(1)
                    .completedAssignments(15).upcomingExams(2).status("Active")
                    .tenantId("EZONE_UNIV").campusId("MAIN").programId("BTECH_CSE").batchId("2024")
                    .build();

            Student student3 = Student.builder()
                    .loginId("2024ME001").studentId("STU2024003").fullName("Amit Verma")
                    .email("amit.verma@ezone.edu").phone("+91-9876543212")
                    .department("Mechanical Engineering").course("B.Tech ME").specialization(null)
                    .semester("4th Semester").section("B").rollNumber("2024ME001")
                    .profilePhoto("https://ui-avatars.com/api/?name=Amit+Verma&background=4F7CFE&color=fff&size=200")
                    .cgpa(7.8).attendancePercentage(85.0).pendingAssignments(5)
                    .completedAssignments(10).upcomingExams(3).status("Active")
                    .tenantId("EZONE_UNIV").campusId("MAIN").programId("BTECH_ME").batchId("2024")
                    .build();

            studentRepository.saveAll(Arrays.asList(student1, student2, student3));
            System.out.println("Test students seeded.");

            if (studentNotificationRepository.count() == 0) {
                studentNotificationRepository.saveAll(Arrays.asList(
                        StudentNotification.builder().loginId("2024CSE001").title("Assignment Due")
                                .message("Data Structures Assignment 3 due tomorrow").type("warning")
                                .createdAt(LocalDateTime.now().minusHours(2)).build(),
                        StudentNotification.builder().loginId("2024CSE001").title("Exam Schedule")
                                .message("Mid-term exam scheduled for March 25th").type("info")
                                .createdAt(LocalDateTime.now().minusHours(5)).build(),
                        StudentNotification.builder().loginId("2024CSE001").title("Attendance Alert")
                                .message("Your attendance is below 90% in Operating Systems").type("danger")
                                .createdAt(LocalDateTime.now().minusDays(1)).build(),
                        StudentNotification.builder().loginId("2024CSE001").title("Grade Published")
                                .message("Grades for Algorithm Analysis have been published").type("success")
                                .createdAt(LocalDateTime.now().minusDays(2)).build(),
                        StudentNotification.builder().loginId("2024CSE001").title("Fee Reminder")
                                .message("Semester fee payment deadline: March 31st").type("warning")
                                .createdAt(LocalDateTime.now().minusDays(3)).build()
                ));
            }
        }
    }

    private void seedAcademicTerms() {
        if (academicTermRepository.count() == 0) {
            AcademicTerm term2601 = AcademicTerm.builder()
                    .termCode("2601").year(2026).termName("Term 1")
                    .startDate(LocalDate.of(2026, 1, 1)).endDate(LocalDate.of(2026, 6, 30))
                    .isActive(true).status("ACTIVE").build();

            AcademicTerm term2602 = AcademicTerm.builder()
                    .termCode("2602").year(2026).termName("Term 2")
                    .startDate(LocalDate.of(2026, 7, 1)).endDate(LocalDate.of(2026, 12, 31))
                    .isActive(false).status("UPCOMING").build();

            academicTermRepository.saveAll(Arrays.asList(term2601, term2602));
            System.out.println("Academic terms seeded.");
        }
    }

    private void seedSubjects() {
        if (subjectRepository.count() == 0) {
            subjectRepository.saveAll(Arrays.asList(
                    Subject.builder().subjectCode("CSE3521").subjectName("Software Testing").type("THEORY").department("Computer Science").credits(3).status("ACTIVE").build(),
                    Subject.builder().subjectCode("CSE4201").subjectName("Cyber Security in Cloud").type("THEORY").department("Computer Science").credits(3).status("ACTIVE").build(),
                    Subject.builder().subjectCode("CSE4204").subjectName("Dev Ops").type("THEORY").department("Computer Science").credits(3).status("ACTIVE").build(),
                    Subject.builder().subjectCode("CSEAL61").subjectName("Compiler Design").type("THEORY").department("Computer Science").credits(4).status("ACTIVE").build(),
                    Subject.builder().subjectCode("CSA474").subjectName("Artificial Intelligence").type("THEORY").department("Computer Science").credits(4).status("ACTIVE").build(),
                    Subject.builder().subjectCode("MRP306").subjectName("Campus to Corporate").type("PRACTICAL").department("Computer Science").credits(2).status("ACTIVE").build(),
                    Subject.builder().subjectCode("CSE352D").subjectName("Software Testing Lab").type("PRACTICAL").department("Computer Science").credits(2).status("ACTIVE").build(),
                    Subject.builder().subjectCode("ECMSL63").subjectName("Compiler Design Lab").type("PRACTICAL").department("Computer Science").credits(2).status("ACTIVE").build(),
                    Subject.builder().subjectCode("CSP390").subjectName("Project Based Learning (PBL) - 4").type("PRACTICAL").department("Computer Science").credits(3).status("ACTIVE").build(),
                    Subject.builder().subjectCode("CSP394").subjectName("Technical Skill Enhancement Course-2").type("PRACTICAL").department("Computer Science").credits(2).status("ACTIVE").build(),
                    Subject.builder().subjectCode("CSA472").subjectName("Artificial Intelligence Lab").type("PRACTICAL").department("Computer Science").credits(2).status("ACTIVE").build(),
                    Subject.builder().subjectCode("RA010IB").subjectName("Introduction to Personal Engineering").type("PRACTICAL").department("Computer Science").credits(1).status("ACTIVE").build()
            ));
            System.out.println("Subjects seeded.");
        }
    }

    private void seedFaculty() {
        if (facultyRepository.count() == 0) {
            facultyRepository.saveAll(Arrays.asList(
                    Faculty.builder().facultyId("FAC001").fullName("Shefali Sharma").email("shefali.sharma@ezone.edu").phone("+91-9876501001").department("Computer Science").designation("Professor").status("ACTIVE").build(),
                    Faculty.builder().facultyId("FAC002").fullName("Ashish Kumar").email("ashish.kumar@ezone.edu").phone("+91-9876501002").department("Computer Science").designation("Associate Professor").status("ACTIVE").build(),
                    Faculty.builder().facultyId("FAC003").fullName("Mr Sudeep Varshney").email("sudeep.varshney@ezone.edu").phone("+91-9876501003").department("Computer Science").designation("Assistant Professor").status("ACTIVE").build(),
                    Faculty.builder().facultyId("FAC004").fullName("Mekhala").email("mekhala@ezone.edu").phone("+91-9876501004").department("Computer Science").designation("Assistant Professor").status("ACTIVE").build(),
                    Faculty.builder().facultyId("FAC005").fullName("Kamaraju Suresh").email("kamaraju.suresh@ezone.edu").phone("+91-9876501005").department("Computer Science").designation("Professor").status("ACTIVE").build()
            ));
            System.out.println("Faculty seeded.");
        }
    }

    private void seedStudentEnrollments() {
        if (studentEnrollmentRepository.count() == 0) {
            Subject softwareTesting = subjectRepository.findBySubjectCode("CSE3521").orElseThrow();
            Subject cyberSecurity = subjectRepository.findBySubjectCode("CSE4201").orElseThrow();
            Subject devOps = subjectRepository.findBySubjectCode("CSE4204").orElseThrow();
            Subject compilerDesign = subjectRepository.findBySubjectCode("CSEAL61").orElseThrow();
            Subject ai = subjectRepository.findBySubjectCode("CSA474").orElseThrow();
            Subject campusToCorporate = subjectRepository.findBySubjectCode("MRP306").orElseThrow();
            Subject softwareTestingLab = subjectRepository.findBySubjectCode("CSE352D").orElseThrow();
            Subject compilerLab = subjectRepository.findBySubjectCode("ECMSL63").orElseThrow();
            Subject pbl = subjectRepository.findBySubjectCode("CSP390").orElseThrow();
            Subject tsec = subjectRepository.findBySubjectCode("CSP394").orElseThrow();
            Subject aiLab = subjectRepository.findBySubjectCode("CSA472").orElseThrow();
            Subject personalEng = subjectRepository.findBySubjectCode("RA010IB").orElseThrow();

            studentEnrollmentRepository.saveAll(Arrays.asList(
                    StudentEnrollment.builder().loginId("2024CSE001").subjectId(softwareTesting.getId()).termCode("2601").semester("6th Semester").enrollmentStatus("ACTIVE").tenantId("EZONE_UNIV").sectionId("A").build(),
                    StudentEnrollment.builder().loginId("2024CSE001").subjectId(cyberSecurity.getId()).termCode("2601").semester("6th Semester").enrollmentStatus("ACTIVE").tenantId("EZONE_UNIV").sectionId("A").build(),
                    StudentEnrollment.builder().loginId("2024CSE001").subjectId(devOps.getId()).termCode("2601").semester("6th Semester").enrollmentStatus("ACTIVE").tenantId("EZONE_UNIV").sectionId("A").build(),
                    StudentEnrollment.builder().loginId("2024CSE001").subjectId(compilerDesign.getId()).termCode("2601").semester("6th Semester").enrollmentStatus("ACTIVE").tenantId("EZONE_UNIV").sectionId("A").build(),
                    StudentEnrollment.builder().loginId("2024CSE001").subjectId(ai.getId()).termCode("2601").semester("6th Semester").enrollmentStatus("ACTIVE").tenantId("EZONE_UNIV").sectionId("A").build(),
                    StudentEnrollment.builder().loginId("2024CSE001").subjectId(campusToCorporate.getId()).termCode("2601").semester("6th Semester").enrollmentStatus("ACTIVE").tenantId("EZONE_UNIV").sectionId("A").build(),
                    StudentEnrollment.builder().loginId("2024CSE001").subjectId(softwareTestingLab.getId()).termCode("2601").semester("6th Semester").enrollmentStatus("ACTIVE").tenantId("EZONE_UNIV").sectionId("A").build(),
                    StudentEnrollment.builder().loginId("2024CSE001").subjectId(compilerLab.getId()).termCode("2601").semester("6th Semester").enrollmentStatus("ACTIVE").tenantId("EZONE_UNIV").sectionId("A").build(),
                    StudentEnrollment.builder().loginId("2024CSE001").subjectId(pbl.getId()).termCode("2601").semester("6th Semester").enrollmentStatus("ACTIVE").tenantId("EZONE_UNIV").sectionId("A").build(),
                    StudentEnrollment.builder().loginId("2024CSE001").subjectId(tsec.getId()).termCode("2601").semester("6th Semester").enrollmentStatus("ACTIVE").tenantId("EZONE_UNIV").sectionId("A").build(),
                    StudentEnrollment.builder().loginId("2024CSE001").subjectId(aiLab.getId()).termCode("2601").semester("6th Semester").enrollmentStatus("ACTIVE").tenantId("EZONE_UNIV").sectionId("A").build(),
                    StudentEnrollment.builder().loginId("2024CSE001").subjectId(personalEng.getId()).termCode("2601").semester("6th Semester").enrollmentStatus("ACTIVE").tenantId("EZONE_UNIV").sectionId("A").build()
            ));
            System.out.println("Student enrollments seeded.");
        }
    }

    private void seedSubjectFacultyMappings() {
        if (subjectFacultyMappingRepository.count() == 0) {
            Subject softwareTesting = subjectRepository.findBySubjectCode("CSE3521").orElseThrow();
            Subject cyberSecurity = subjectRepository.findBySubjectCode("CSE4201").orElseThrow();
            Subject devOps = subjectRepository.findBySubjectCode("CSE4204").orElseThrow();
            Subject compilerDesign = subjectRepository.findBySubjectCode("CSEAL61").orElseThrow();
            Subject ai = subjectRepository.findBySubjectCode("CSA474").orElseThrow();
            Subject campusToCorporate = subjectRepository.findBySubjectCode("MRP306").orElseThrow();
            Subject softwareTestingLab = subjectRepository.findBySubjectCode("CSE352D").orElseThrow();
            Subject compilerLab = subjectRepository.findBySubjectCode("ECMSL63").orElseThrow();
            Subject pbl = subjectRepository.findBySubjectCode("CSP390").orElseThrow();
            Subject tsec = subjectRepository.findBySubjectCode("CSP394").orElseThrow();
            Subject aiLab = subjectRepository.findBySubjectCode("CSA472").orElseThrow();
            Subject personalEng = subjectRepository.findBySubjectCode("RA010IB").orElseThrow();

            Faculty shefali = facultyRepository.findByFacultyId("FAC001").orElseThrow();
            Faculty ashish = facultyRepository.findByFacultyId("FAC002").orElseThrow();
            Faculty sudeep = facultyRepository.findByFacultyId("FAC003").orElseThrow();
            Faculty mekhala = facultyRepository.findByFacultyId("FAC004").orElseThrow();
            Faculty kamaraju = facultyRepository.findByFacultyId("FAC005").orElseThrow();

            subjectFacultyMappingRepository.saveAll(Arrays.asList(
                    SubjectFacultyMapping.builder().subjectId(softwareTesting.getId()).facultyId(shefali.getId()).termCode("2601").semester("6th Semester").status("ACTIVE").build(),
                    SubjectFacultyMapping.builder().subjectId(cyberSecurity.getId()).facultyId(ashish.getId()).termCode("2601").semester("6th Semester").status("ACTIVE").build(),
                    SubjectFacultyMapping.builder().subjectId(devOps.getId()).facultyId(shefali.getId()).termCode("2601").semester("6th Semester").status("ACTIVE").build(),
                    SubjectFacultyMapping.builder().subjectId(compilerDesign.getId()).facultyId(sudeep.getId()).termCode("2601").semester("6th Semester").status("ACTIVE").build(),
                    SubjectFacultyMapping.builder().subjectId(ai.getId()).facultyId(kamaraju.getId()).termCode("2601").semester("6th Semester").status("ACTIVE").build(),
                    SubjectFacultyMapping.builder().subjectId(campusToCorporate.getId()).facultyId(mekhala.getId()).termCode("2601").semester("6th Semester").status("ACTIVE").build(),
                    SubjectFacultyMapping.builder().subjectId(softwareTestingLab.getId()).facultyId(shefali.getId()).termCode("2601").semester("6th Semester").status("ACTIVE").build(),
                    SubjectFacultyMapping.builder().subjectId(compilerLab.getId()).facultyId(sudeep.getId()).termCode("2601").semester("6th Semester").status("ACTIVE").build(),
                    SubjectFacultyMapping.builder().subjectId(pbl.getId()).facultyId(ashish.getId()).termCode("2601").semester("6th Semester").status("ACTIVE").build(),
                    SubjectFacultyMapping.builder().subjectId(tsec.getId()).facultyId(ashish.getId()).termCode("2601").semester("6th Semester").status("ACTIVE").build(),
                    SubjectFacultyMapping.builder().subjectId(aiLab.getId()).facultyId(kamaraju.getId()).termCode("2601").semester("6th Semester").status("ACTIVE").build(),
                    SubjectFacultyMapping.builder().subjectId(personalEng.getId()).facultyId(mekhala.getId()).termCode("2601").semester("6th Semester").status("ACTIVE").build()
            ));
            System.out.println("Subject-Faculty mappings seeded.");
        }
    }

    private void seedCAMarks() {
        if (caMarksRepository.count() == 0 && practicalMarksRepository.count() == 0) {
            List<StudentEnrollment> enrollments = studentEnrollmentRepository.findByLoginIdAndTermCode("2024CSE001", "2601");
            for (StudentEnrollment enrollment : enrollments) {
                Subject subject = subjectRepository.findById(enrollment.getSubjectId()).orElse(null);
                if (subject == null) continue;

                if ("THEORY".equals(subject.getType())) {
                    CAMarks marks = null;
                    if ("CSE3521".equals(subject.getSubjectCode())) {
                        marks = CAMarks.builder().enrollmentId(enrollment.getId()).assignment1(4.5).assessment1(8.0).assignment2(4.0).assessment2(4.5).lastUpdated(LocalDateTime.now().minusDays(5)).updatedBy("teacher001").build();
                    } else if ("CSE4201".equals(subject.getSubjectCode())) {
                        marks = CAMarks.builder().enrollmentId(enrollment.getId()).assignment1(4.0).assessment1(9.0).lastUpdated(LocalDateTime.now().minusDays(3)).updatedBy("teacher002").build();
                    } else if ("CSE4204".equals(subject.getSubjectCode())) {
                        marks = CAMarks.builder().enrollmentId(enrollment.getId()).assignment1(5.0).lastUpdated(LocalDateTime.now().minusDays(1)).updatedBy("teacher003").build();
                    }
                    if (marks != null) caMarksRepository.save(marks);
                } else {
                    PracticalMarks marks = null;
                    if ("CSE352D".equals(subject.getSubjectCode())) {
                        marks = PracticalMarks.builder().enrollmentId(enrollment.getId()).caAi(68.0).caNaal(85.0).continuousAssessment(25.0).continuousEvaluation(27.0).lastUpdated(LocalDateTime.now().minusDays(4)).updatedBy("teacher001").build();
                    } else if ("CSA472".equals(subject.getSubjectCode())) {
                        marks = PracticalMarks.builder().enrollmentId(enrollment.getId()).caAi(70.0).lastUpdated(LocalDateTime.now().minusDays(2)).updatedBy("teacher004").build();
                    }
                    if (marks != null) practicalMarksRepository.save(marks);
                }
            }
            System.out.println("CA marks seeded.");
        }
    }

    // ── Day Wise Attendance supporting data ───────────────────────────────────

    /**
     * Seeds timetable periods for development testing.
     * In production, periods are created through the Admin Dashboard.
     */
    private void seedTimetablePeriods() {
        if (timetablePeriodRepository.count() == 0) {
            timetablePeriodRepository.saveAll(Arrays.asList(
                    TimetablePeriod.builder().periodNumber(1).periodName("Period 1").startTime(LocalTime.of(9, 0)).endTime(LocalTime.of(9, 50)).status("ACTIVE").tenantId("EZONE_UNIV").programId("BTECH_CSE").build(),
                    TimetablePeriod.builder().periodNumber(2).periodName("Period 2").startTime(LocalTime.of(10, 0)).endTime(LocalTime.of(10, 50)).status("ACTIVE").tenantId("EZONE_UNIV").programId("BTECH_CSE").build(),
                    TimetablePeriod.builder().periodNumber(3).periodName("Period 3").startTime(LocalTime.of(11, 0)).endTime(LocalTime.of(11, 50)).status("ACTIVE").tenantId("EZONE_UNIV").programId("BTECH_CSE").build(),
                    TimetablePeriod.builder().periodNumber(4).periodName("Period 4").startTime(LocalTime.of(12, 0)).endTime(LocalTime.of(12, 50)).status("ACTIVE").tenantId("EZONE_UNIV").programId("BTECH_CSE").build(),
                    TimetablePeriod.builder().periodNumber(5).periodName("Period 5").startTime(LocalTime.of(14, 0)).endTime(LocalTime.of(14, 50)).status("ACTIVE").tenantId("EZONE_UNIV").programId("BTECH_CSE").build(),
                    TimetablePeriod.builder().periodNumber(6).periodName("Period 6").startTime(LocalTime.of(15, 0)).endTime(LocalTime.of(15, 50)).status("ACTIVE").tenantId("EZONE_UNIV").programId("BTECH_CSE").build()
            ));
            System.out.println("Timetable periods seeded.");
        }
    }

    /**
     * Seeds class schedules for development testing.
     * Assigns each enrolled subject to a specific day + period combination.
     * In production, schedules are set through the Admin/Faculty Dashboard.
     */
    private void seedClassSchedules() {
        if (classScheduleRepository.count() == 0) {
            List<StudentEnrollment> enrollments = studentEnrollmentRepository.findByLoginIdAndTermCode("2024CSE001", "2601");
            List<TimetablePeriod> periods = timetablePeriodRepository.findAllByStatusOrderByPeriodNumberAsc("ACTIVE");

            if (enrollments.isEmpty() || periods.isEmpty()) {
                System.out.println("Skipping class schedule seeding — enrollments or periods not found.");
                return;
            }

            // Map periods by number for easy lookup
            java.util.Map<Integer, Long> periodIdByNumber = new java.util.HashMap<>();
            for (TimetablePeriod p : periods) {
                periodIdByNumber.put(p.getPeriodNumber(), p.getId());
            }

            // Map enrollments by subject code
            java.util.Map<String, Long> enrollmentIdBySubjectCode = new java.util.HashMap<>();
            for (StudentEnrollment e : enrollments) {
                Subject s = subjectRepository.findById(e.getSubjectId()).orElse(null);
                if (s != null) enrollmentIdBySubjectCode.put(s.getSubjectCode(), e.getId());
            }

            List<ClassSchedule> schedules = new ArrayList<>();
            String tenantId = "EZONE_UNIV";
            String termCode = "2601";

            // Software Testing: Mon/Wed/Fri Period 1
            Long stEnrollId = enrollmentIdBySubjectCode.get("CSE3521");
            if (stEnrollId != null && periodIdByNumber.containsKey(1)) {
                schedules.add(ClassSchedule.builder().enrollmentId(stEnrollId).dayOfWeek("MONDAY").periodId(periodIdByNumber.get(1)).termCode(termCode).status("ACTIVE").tenantId(tenantId).build());
                schedules.add(ClassSchedule.builder().enrollmentId(stEnrollId).dayOfWeek("WEDNESDAY").periodId(periodIdByNumber.get(1)).termCode(termCode).status("ACTIVE").tenantId(tenantId).build());
                schedules.add(ClassSchedule.builder().enrollmentId(stEnrollId).dayOfWeek("FRIDAY").periodId(periodIdByNumber.get(1)).termCode(termCode).status("ACTIVE").tenantId(tenantId).build());
            }

            // Cyber Security: Tue/Thu Period 2
            Long csEnrollId = enrollmentIdBySubjectCode.get("CSE4201");
            if (csEnrollId != null && periodIdByNumber.containsKey(2)) {
                schedules.add(ClassSchedule.builder().enrollmentId(csEnrollId).dayOfWeek("TUESDAY").periodId(periodIdByNumber.get(2)).termCode(termCode).status("ACTIVE").tenantId(tenantId).build());
                schedules.add(ClassSchedule.builder().enrollmentId(csEnrollId).dayOfWeek("THURSDAY").periodId(periodIdByNumber.get(2)).termCode(termCode).status("ACTIVE").tenantId(tenantId).build());
            }

            // DevOps: Mon/Wed Period 3
            Long devOpsEnrollId = enrollmentIdBySubjectCode.get("CSE4204");
            if (devOpsEnrollId != null && periodIdByNumber.containsKey(3)) {
                schedules.add(ClassSchedule.builder().enrollmentId(devOpsEnrollId).dayOfWeek("MONDAY").periodId(periodIdByNumber.get(3)).termCode(termCode).status("ACTIVE").tenantId(tenantId).build());
                schedules.add(ClassSchedule.builder().enrollmentId(devOpsEnrollId).dayOfWeek("WEDNESDAY").periodId(periodIdByNumber.get(3)).termCode(termCode).status("ACTIVE").tenantId(tenantId).build());
            }

            // Compiler Design: Tue/Thu/Sat Period 1
            Long cdEnrollId = enrollmentIdBySubjectCode.get("CSEAL61");
            if (cdEnrollId != null && periodIdByNumber.containsKey(1)) {
                schedules.add(ClassSchedule.builder().enrollmentId(cdEnrollId).dayOfWeek("TUESDAY").periodId(periodIdByNumber.get(1)).termCode(termCode).status("ACTIVE").tenantId(tenantId).build());
                schedules.add(ClassSchedule.builder().enrollmentId(cdEnrollId).dayOfWeek("THURSDAY").periodId(periodIdByNumber.get(1)).termCode(termCode).status("ACTIVE").tenantId(tenantId).build());
                schedules.add(ClassSchedule.builder().enrollmentId(cdEnrollId).dayOfWeek("SATURDAY").periodId(periodIdByNumber.get(1)).termCode(termCode).status("ACTIVE").tenantId(tenantId).build());
            }

            // AI: Fri/Sat Period 2
            Long aiEnrollId = enrollmentIdBySubjectCode.get("CSA474");
            if (aiEnrollId != null && periodIdByNumber.containsKey(2)) {
                schedules.add(ClassSchedule.builder().enrollmentId(aiEnrollId).dayOfWeek("FRIDAY").periodId(periodIdByNumber.get(2)).termCode(termCode).status("ACTIVE").tenantId(tenantId).build());
                schedules.add(ClassSchedule.builder().enrollmentId(aiEnrollId).dayOfWeek("SATURDAY").periodId(periodIdByNumber.get(2)).termCode(termCode).status("ACTIVE").tenantId(tenantId).build());
            }

            // Software Testing Lab: Wed Period 5+6
            Long stLabEnrollId = enrollmentIdBySubjectCode.get("CSE352D");
            if (stLabEnrollId != null && periodIdByNumber.containsKey(5)) {
                schedules.add(ClassSchedule.builder().enrollmentId(stLabEnrollId).dayOfWeek("WEDNESDAY").periodId(periodIdByNumber.get(5)).termCode(termCode).status("ACTIVE").tenantId(tenantId).build());
                if (periodIdByNumber.containsKey(6))
                    schedules.add(ClassSchedule.builder().enrollmentId(stLabEnrollId).dayOfWeek("WEDNESDAY").periodId(periodIdByNumber.get(6)).termCode(termCode).status("ACTIVE").tenantId(tenantId).build());
            }

            // AI Lab: Thursday Period 5+6
            Long aiLabEnrollId = enrollmentIdBySubjectCode.get("CSA472");
            if (aiLabEnrollId != null && periodIdByNumber.containsKey(5)) {
                schedules.add(ClassSchedule.builder().enrollmentId(aiLabEnrollId).dayOfWeek("THURSDAY").periodId(periodIdByNumber.get(5)).termCode(termCode).status("ACTIVE").tenantId(tenantId).build());
                if (periodIdByNumber.containsKey(6))
                    schedules.add(ClassSchedule.builder().enrollmentId(aiLabEnrollId).dayOfWeek("THURSDAY").periodId(periodIdByNumber.get(6)).termCode(termCode).status("ACTIVE").tenantId(tenantId).build());
            }

            classScheduleRepository.saveAll(schedules);
            System.out.println("Class schedules seeded: " + schedules.size() + " slots.");
        }
    }

    /**
     * Seeds academic calendar holidays for development testing.
     * In production, holidays are declared through the Admin Dashboard.
     */
    private void seedAcademicCalendar() {
        if (academicCalendarRepository.count() == 0) {
            academicCalendarRepository.saveAll(Arrays.asList(
                    // Term 2601 (Jan–Jun 2026) holidays
                    AcademicCalendar.builder().eventDate(LocalDate.of(2026, 1, 14)).eventType("FESTIVAL").eventName("Makar Sankranti").isHoliday(true).termCode("2601").tenantId("EZONE_UNIV").build(),
                    AcademicCalendar.builder().eventDate(LocalDate.of(2026, 1, 26)).eventType("HOLIDAY").eventName("Republic Day").isHoliday(true).termCode("2601").tenantId("EZONE_UNIV").build(),
                    AcademicCalendar.builder().eventDate(LocalDate.of(2026, 2, 18)).eventType("FESTIVAL").eventName("Maha Shivratri").isHoliday(true).termCode("2601").tenantId("EZONE_UNIV").build(),
                    AcademicCalendar.builder().eventDate(LocalDate.of(2026, 3, 2)).eventType("FESTIVAL").eventName("Holi").isHoliday(true).termCode("2601").tenantId("EZONE_UNIV").build(),
                    AcademicCalendar.builder().eventDate(LocalDate.of(2026, 3, 16)).eventType("EXAM").eventName("Mid-Term Examination Week Start").isHoliday(false).termCode("2601").tenantId("EZONE_UNIV").build(),
                    AcademicCalendar.builder().eventDate(LocalDate.of(2026, 4, 6)).eventType("FESTIVAL").eventName("Ram Navami").isHoliday(true).termCode("2601").tenantId("EZONE_UNIV").build(),
                    AcademicCalendar.builder().eventDate(LocalDate.of(2026, 4, 10)).eventType("FESTIVAL").eventName("Good Friday").isHoliday(true).termCode("2601").tenantId("EZONE_UNIV").build(),
                    AcademicCalendar.builder().eventDate(LocalDate.of(2026, 4, 14)).eventType("FESTIVAL").eventName("Dr. Ambedkar Jayanti").isHoliday(true).termCode("2601").tenantId("EZONE_UNIV").build(),
                    AcademicCalendar.builder().eventDate(LocalDate.of(2026, 5, 1)).eventType("HOLIDAY").eventName("Labour Day").isHoliday(true).termCode("2601").tenantId("EZONE_UNIV").build(),
                    AcademicCalendar.builder().eventDate(LocalDate.of(2026, 6, 1)).eventType("SEMESTER_BREAK").eventName("Summer Break Begins").isHoliday(false).termCode("2601").tenantId("EZONE_UNIV").build()
            ));
            System.out.println("Academic calendar seeded.");
        }
    }

    /**
     * Seeds attendance records for development testing using AttendanceStatus enum.
     * Records are seeded with lockStatus = SUBMITTED so they are visible to students.
     */
    private void seedAttendanceRecords() {
        if (attendanceRecordRepository.count() == 0) {
            List<StudentEnrollment> enrollments = studentEnrollmentRepository.findByLoginIdAndTermCode("2024CSE001", "2601");
            List<TimetablePeriod> periods = timetablePeriodRepository.findAllByStatusOrderByPeriodNumberAsc("ACTIVE");

            if (periods.isEmpty()) {
                System.out.println("Skipping attendance record seeding — no timetable periods found.");
                return;
            }

            Long period1Id = periods.get(0).getId();
            Long period2Id = periods.size() > 1 ? periods.get(1).getId() : period1Id;
            Long period5Id = periods.size() > 4 ? periods.get(4).getId() : period1Id;

            for (StudentEnrollment enrollment : enrollments) {
                Subject subject = subjectRepository.findById(enrollment.getSubjectId()).orElse(null);
                if (subject == null) continue;

                List<AttendanceRecord> records = new ArrayList<>();

                if ("CSE3521".equals(subject.getSubjectCode())) {
                    // Software Testing — 20 records, 18 present, 2 absent
                    for (int i = 1; i <= 20; i++) {
                        AttendanceStatus status = (i == 5 || i == 12) ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT;
                        records.add(AttendanceRecord.builder()
                                .enrollmentId(enrollment.getId()).attendanceDate(LocalDate.of(2026, 1, i))
                                .periodId(period1Id).status(status)
                                .lockStatus(AttendanceSessionStatus.SUBMITTED)
                                .markedBy("FAC001").markedAt(LocalDateTime.of(2026, 1, i, 10, 0))
                                .tenantId("EZONE_UNIV").build());
                    }
                } else if ("CSE4201".equals(subject.getSubjectCode())) {
                    // Cyber Security — 18 records (15 present, 2 absent, 1 medical)
                    for (int i = 1; i <= 18; i++) {
                        AttendanceStatus status = AttendanceStatus.PRESENT;
                        if (i == 7 || i == 14) status = AttendanceStatus.ABSENT;
                        if (i == 16) status = AttendanceStatus.MEDICAL;
                        records.add(AttendanceRecord.builder()
                                .enrollmentId(enrollment.getId()).attendanceDate(LocalDate.of(2026, 1, i))
                                .periodId(period2Id).status(status)
                                .lockStatus(AttendanceSessionStatus.SUBMITTED)
                                .markedBy("FAC002").markedAt(LocalDateTime.of(2026, 1, i, 11, 0))
                                .tenantId("EZONE_UNIV").build());
                    }
                } else if ("CSE352D".equals(subject.getSubjectCode())) {
                    // Software Testing Lab — 15 records, all present
                    for (int i = 1; i <= 15; i++) {
                        records.add(AttendanceRecord.builder()
                                .enrollmentId(enrollment.getId()).attendanceDate(LocalDate.of(2026, 1, i))
                                .periodId(period5Id).status(AttendanceStatus.PRESENT)
                                .lockStatus(AttendanceSessionStatus.VERIFIED)
                                .markedBy("FAC001").markedAt(LocalDateTime.of(2026, 1, i, 14, 0))
                                .tenantId("EZONE_UNIV").build());
                    }
                } else if ("CSA472".equals(subject.getSubjectCode())) {
                    // AI Lab — 12 records (8 present, 3 absent, 1 event)
                    for (int i = 1; i <= 12; i++) {
                        AttendanceStatus status = AttendanceStatus.PRESENT;
                        if (i == 3 || i == 6 || i == 10) status = AttendanceStatus.ABSENT;
                        if (i == 9) status = AttendanceStatus.EVENT;
                        records.add(AttendanceRecord.builder()
                                .enrollmentId(enrollment.getId()).attendanceDate(LocalDate.of(2026, 1, i))
                                .periodId(period5Id).status(status)
                                .lockStatus(AttendanceSessionStatus.SUBMITTED)
                                .markedBy("FAC005").markedAt(LocalDateTime.of(2026, 1, i, 15, 0))
                                .tenantId("EZONE_UNIV").build());
                    }
                }

                if (!records.isEmpty()) {
                    attendanceRecordRepository.saveAll(records);
                }
            }
            System.out.println("Attendance records seeded with enum status values.");
        }
    }
}
