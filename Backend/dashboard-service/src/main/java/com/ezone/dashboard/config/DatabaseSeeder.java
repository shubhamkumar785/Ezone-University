package com.ezone.dashboard.config;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.ezone.dashboard.entity.AcademicTerm;
import com.ezone.dashboard.entity.AttendanceRecord;
import com.ezone.dashboard.entity.AttendanceTrend;
import com.ezone.dashboard.entity.CAMarks;
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
import com.ezone.dashboard.repository.AcademicTermRepository;
import com.ezone.dashboard.repository.AttendanceRecordRepository;
import com.ezone.dashboard.repository.AttendanceTrendRepository;
import com.ezone.dashboard.repository.CAMarksRepository;
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

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
// TODO: DEMO DATA SEEDER DISABLED - Only show valid data from database
// @Component // Comment out to disable auto-seeding
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

    @Override
    public void run(String... args) throws Exception {
        // Re-enable minimal seeding to prevent "Failed to load data" error
        System.out.println("✅ Seeding minimal dashboard data...");
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
        seedAttendanceRecords();
        // Keep activities and leaves empty for now
        System.out.println("✅ Minimal dashboard data seeded successfully");
    }

    private void seedOverview() {
        if (overviewRepository.count() == 0) {
            DashboardOverview overview = DashboardOverview.builder()
                    .totalStudents(5847)
                    .totalTeachers(312)
                    .totalDepartments(18)
                    .activeCourses(124)
                    .averageAttendance(84.5)
                    .pendingLeaves(23)
                    .activeAlerts(5)
                    .feeCollected(892000.0)
                    .build();
            overviewRepository.save(overview);
            System.out.println("Default dashboard overview statistics seeded successfully.");
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
            System.out.println("Default enrollment trend statistics seeded successfully.");
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
            System.out.println("Default attendance trend statistics seeded successfully.");
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
            System.out.println("Default department distribution statistics seeded successfully.");
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
            System.out.println("Default fee report statistics seeded successfully.");
        }
    }

    private void seedRecentActivities() {
        if (recentActivityRepository.count() == 0) {
            recentActivityRepository.saveAll(Arrays.asList(
                    RecentActivity.builder().time("09:15:32").module("Authentication").message("User Login").statusColor("green").build(),
                    RecentActivity.builder().time("08:55:00").module("Attendance").message("CS Dept Attendance sheets submitted").statusColor("green").build(),
                    RecentActivity.builder().time("08:30:45").module("Leaves").message("Alex Johnson requested Medical Leave").statusColor("yellow").build(),
                    RecentActivity.builder().time("09:02:15").module("Grades").message("sarah.mitchell updated Math 101 grades").statusColor("green").build(),
                    RecentActivity.builder().time("07:45:10").module("Courses").message("New course Introduction to Python added").statusColor("green").build(),
                    RecentActivity.builder().time("07:15:00").module("Students").message("Emma Watson registered in Mechanical Eng").statusColor("green").build(),
                    RecentActivity.builder().time("08:40:18").module("Authentication").message("Failed Login Attempt").statusColor("red").build(),
                    RecentActivity.builder().time("10:05:00").module("Finance").message("Fee collection report generated").statusColor("green").build(),
                    RecentActivity.builder().time("10:22:15").module("System").message("Weekly database optimization scheduled").statusColor("green").build(),
                    RecentActivity.builder().time("11:10:45").module("Leaves").message("Dr. James Parker submitted personal leave").statusColor("yellow").build(),
                    RecentActivity.builder().time("11:45:00").module("Subjects").message("Advanced Java course curriculum updated").statusColor("green").build(),
                    RecentActivity.builder().time("12:00:30").module("Authentication").message("Password change request by john.doe").statusColor("yellow").build(),
                    RecentActivity.builder().time("13:15:00").module("Attendance").message("Mechanical Dept Attendance sheets locked").statusColor("green").build(),
                    RecentActivity.builder().time("14:20:10").module("System").message("Staging environment sync completed").statusColor("green").build(),
                    RecentActivity.builder().time("15:05:18").module("Authentication").message("Failed Login Attempt from IP 192.168.2.4").statusColor("red").build()
            ));
            System.out.println("Default recent activities seeded successfully.");
        }
    }

    private void seedPendingLeaves() {
        if (pendingLeaveRepository.count() == 0) {
            pendingLeaveRepository.saveAll(Arrays.asList(
                    PendingLeave.builder().employee("Alex Johnson").department("Computer Science").leaveType("Medical Leave").status("Pending").initials("AJ").time("2d ago").duration("3 days").build(),
                    PendingLeave.builder().employee("Dr. James Parker").department("Computer Science").leaveType("Personal Leave").status("Pending").initials("JP").time("3d ago").duration("1 day").build(),
                    PendingLeave.builder().employee("Noah Anderson").department("Mechanical Eng").leaveType("Medical Leave").status("Pending").initials("NA").time("2d ago").duration("2 days").build(),
                    PendingLeave.builder().employee("Sarah Mitchell").department("Mathematics").leaveType("Casual Leave").status("Pending").initials("SM").time("1d ago").duration("4 days").build(),
                    PendingLeave.builder().employee("Emily Watson").department("Physics").leaveType("Maternity Leave").status("Pending").initials("EW").time("4d ago").duration("30 days").build(),
                    PendingLeave.builder().employee("Robert Vance").department("Civil Eng").leaveType("Sick Leave").status("Pending").initials("RV").time("12h ago").duration("1 day").build(),
                    PendingLeave.builder().employee("Linda Lovelace").department("Computer Science").leaveType("Personal Leave").status("Pending").initials("LL").time("5h ago").duration("2 days").build(),
                    PendingLeave.builder().employee("Arthur Pendragon").department("Business Admin").leaveType("Sabbatical").status("Pending").initials("AP").time("6d ago").duration("90 days").build(),
                    PendingLeave.builder().employee("Gwen Stacy").department("Physics").leaveType("Casual Leave").status("Pending").initials("GS").time("3d ago").duration("3 days").build(),
                    PendingLeave.builder().employee("Bruce Wayne").department("Business Admin").leaveType("Personal Leave").status("Pending").initials("BW").time("1d ago").duration("5 days").build(),
                    PendingLeave.builder().employee("Peter Parker").department("Physics").leaveType("Sick Leave").status("Pending").initials("PP").time("8h ago").duration("2 days").build(),
                    PendingLeave.builder().employee("Clark Kent").department("English").leaveType("Casual Leave").status("Pending").initials("CK").time("2d ago").duration("1 day").build(),
                    PendingLeave.builder().employee("Diana Prince").department("History").leaveType("Academic Leave").status("Pending").initials("DP").time("3d ago").duration("7 days").build(),
                    PendingLeave.builder().employee("Barry Allen").department("Chemistry").leaveType("Sick Leave").status("Pending").initials("BA").time("15m ago").duration("2 days").build(),
                    PendingLeave.builder().employee("Hal Jordan").department("Aviation").leaveType("Training Leave").status("Pending").initials("HJ").time("5d ago").duration("10 days").build()
            ));
            System.out.println("Default pending leaves seeded successfully.");
        }
    }

    private void seedSystemAlerts() {
        if (systemAlertRepository.count() == 0) {
            systemAlertRepository.saveAll(Arrays.asList(
                    SystemAlert.builder().title("Database Load").message("High database connection usage detected (85%)").severity("warning").timestamp("10 mins ago").build(),
                    SystemAlert.builder().title("Server Check").message("Web Server CPU spiked above 90%").severity("danger").timestamp("25 mins ago").build(),
                    SystemAlert.builder().title("Backup Complete").message("Daily system backup completed successfully").severity("info").timestamp("2 hours ago").build(),
                    SystemAlert.builder().title("Disk Space").message("Storage space on main volume is below 15%").severity("warning").timestamp("4 hours ago").build(),
                    SystemAlert.builder().title("Auth Service").message("Multiple failed admin logins detected from IP 192.168.1.105").severity("danger").timestamp("5 hours ago").build(),
                    SystemAlert.builder().title("Memory Leak").message("JVM Memory consumption exceeded threshold (92%)").severity("danger").timestamp("6 hours ago").build(),
                    SystemAlert.builder().title("API Gateway").message("Latency to Auth service is higher than normal (1200ms)").severity("warning").timestamp("12 hours ago").build(),
                    SystemAlert.builder().title("SSL Certificate").message("Staging environment SSL certificate will expire in 5 days").severity("warning").timestamp("1 day ago").build(),
                    SystemAlert.builder().title("Patch Success").message("OS security updates and patches successfully applied").severity("info").timestamp("1 day ago").build(),
                    SystemAlert.builder().title("File Server").message("Large file upload queue size exceeds standard threshold").severity("warning").timestamp("2 days ago").build(),
                    SystemAlert.builder().title("Cron Failure").message("Nightly cleanUpCronJob failed with NullPointerException").severity("danger").timestamp("2 days ago").build(),
                    SystemAlert.builder().title("Mail Server").message("SMTP outbound relay queue is back to normal").severity("info").timestamp("3 days ago").build(),
                    SystemAlert.builder().title("DDOS Block").message("Blocked suspicious request bursts from subnet 185.220.101.0/24").severity("info").timestamp("4 days ago").build(),
                    SystemAlert.builder().title("Cache Flushed").message("Redis session cache flushed during scheduled maintenance").severity("info").timestamp("5 days ago").build(),
                    SystemAlert.builder().title("Network Port").message("Switch port 12 interface report error packet count spiked").severity("warning").timestamp("6 days ago").build()
            ));
            System.out.println("Default system alerts seeded successfully.");
        }
    }

    private void seedStudentData() {
        if (studentRepository.count() == 0) {
            // Create test students with loginIds that match users from auth-service
            Student student1 = Student.builder()
                    .loginId("2024CSE001")
                    .studentId("STU2024001")
                    .fullName("Rahul Kumar")
                    .email("rahul.kumar@ezone.edu")
                    .phone("+91-9876543210")
                    .department("Computer Science")
                    .course("B.Tech CSE")
                    .specialization("AIML")
                    .semester("6th Semester")
                    .section("A")
                    .rollNumber("2024CSE001")
                    .profilePhoto("https://ui-avatars.com/api/?name=Rahul+Kumar&background=4F7CFE&color=fff&size=200")
                    .cgpa(8.5)
                    .attendancePercentage(87.5)
                    .pendingAssignments(3)
                    .completedAssignments(12)
                    .upcomingExams(2)
                    .status("Active")
                    .build();

            Student student2 = Student.builder()
                    .loginId("2024CSE002")
                    .studentId("STU2024002")
                    .fullName("Priya Sharma")
                    .email("priya.sharma@ezone.edu")
                    .phone("+91-9876543211")
                    .department("Computer Science")
                    .course("B.Tech CSE")
                    .specialization("Data Science")
                    .semester("6th Semester")
                    .section("A")
                    .rollNumber("2024CSE002")
                    .profilePhoto("https://ui-avatars.com/api/?name=Priya+Sharma&background=4F7CFE&color=fff&size=200")
                    .cgpa(9.1)
                    .attendancePercentage(92.0)
                    .pendingAssignments(1)
                    .completedAssignments(15)
                    .upcomingExams(2)
                    .status("Active")
                    .build();

            Student student3 = Student.builder()
                    .loginId("2024ME001")
                    .studentId("STU2024003")
                    .fullName("Amit Verma")
                    .email("amit.verma@ezone.edu")
                    .phone("+91-9876543212")
                    .department("Mechanical Engineering")
                    .course("B.Tech ME")
                    .specialization(null)
                    .semester("4th Semester")
                    .section("B")
                    .rollNumber("2024ME001")
                    .profilePhoto("https://ui-avatars.com/api/?name=Amit+Verma&background=4F7CFE&color=fff&size=200")
                    .cgpa(7.8)
                    .attendancePercentage(85.0)
                    .pendingAssignments(5)
                    .completedAssignments(10)
                    .upcomingExams(3)
                    .status("Active")
                    .build();

            studentRepository.saveAll(Arrays.asList(student1, student2, student3));
            System.out.println("Test students seeded successfully.");

            // Create notifications for students
            if (studentNotificationRepository.count() == 0) {
                StudentNotification notif1 = StudentNotification.builder()
                        .loginId("2024CSE001")
                        .title("Assignment Due")
                        .message("Data Structures Assignment 3 due tomorrow")
                        .type("warning")
                        .createdAt(LocalDateTime.now().minusHours(2))
                        .build();

                StudentNotification notif2 = StudentNotification.builder()
                        .loginId("2024CSE001")
                        .title("Exam Schedule")
                        .message("Mid-term exam scheduled for March 25th")
                        .type("info")
                        .createdAt(LocalDateTime.now().minusHours(5))
                        .build();

                StudentNotification notif3 = StudentNotification.builder()
                        .loginId("2024CSE001")
                        .title("Attendance Alert")
                        .message("Your attendance is below 90% in Operating Systems")
                        .type("danger")
                        .createdAt(LocalDateTime.now().minusDays(1))
                        .build();

                StudentNotification notif4 = StudentNotification.builder()
                        .loginId("2024CSE001")
                        .title("Grade Published")
                        .message("Grades for Algorithm Analysis have been published")
                        .type("success")
                        .createdAt(LocalDateTime.now().minusDays(2))
                        .build();

                StudentNotification notif5 = StudentNotification.builder()
                        .loginId("2024CSE001")
                        .title("Fee Reminder")
                        .message("Semester fee payment deadline: March 31st")
                        .type("warning")
                        .createdAt(LocalDateTime.now().minusDays(3))
                        .build();

                StudentNotification notif6 = StudentNotification.builder()
                        .loginId("2024CSE002")
                        .title("Assignment Submitted")
                        .message("Your Machine Learning project has been submitted successfully")
                        .type("success")
                        .createdAt(LocalDateTime.now().minusHours(1))
                        .build();

                StudentNotification notif7 = StudentNotification.builder()
                        .loginId("2024CSE002")
                        .title("Workshop Registration")
                        .message("Register for AI Workshop by March 20th")
                        .type("info")
                        .createdAt(LocalDateTime.now().minusDays(1))
                        .build();

                StudentNotification notif8 = StudentNotification.builder()
                        .loginId("2024ME001")
                        .title("Lab Session")
                        .message("Thermodynamics lab session rescheduled to Thursday")
                        .type("warning")
                        .createdAt(LocalDateTime.now().minusHours(3))
                        .build();

                studentNotificationRepository.saveAll(Arrays.asList(
                        notif1, notif2, notif3, notif4, notif5, notif6, notif7, notif8
                ));
                System.out.println("Student notifications seeded successfully.");
            }
        }
    }

    private void seedAcademicTerms() {
        if (academicTermRepository.count() == 0) {
            AcademicTerm term2601 = AcademicTerm.builder()
                    .termCode("2601")
                    .year(2026)
                    .termName("Term 1")
                    .startDate(LocalDate.of(2026, 1, 1))
                    .endDate(LocalDate.of(2026, 6, 30))
                    .isActive(true)
                    .status("ACTIVE")
                    .build();

            AcademicTerm term2602 = AcademicTerm.builder()
                    .termCode("2602")
                    .year(2026)
                    .termName("Term 2")
                    .startDate(LocalDate.of(2026, 7, 1))
                    .endDate(LocalDate.of(2026, 12, 31))
                    .isActive(false)
                    .status("UPCOMING")
                    .build();

            academicTermRepository.saveAll(Arrays.asList(term2601, term2602));
            System.out.println("Academic terms seeded successfully.");
        }
    }

    private void seedSubjects() {
        if (subjectRepository.count() == 0) {
            // Theory subjects
            List<Subject> theorySubjects = Arrays.asList(
                    Subject.builder().subjectCode("CSE3521").subjectName("Software Testing").type("THEORY").department("Computer Science").credits(3).status("ACTIVE").build(),
                    Subject.builder().subjectCode("CSE4201").subjectName("Cyber Security in Cloud").type("THEORY").department("Computer Science").credits(3).status("ACTIVE").build(),
                    Subject.builder().subjectCode("CSE4204").subjectName("Dev Ops").type("THEORY").department("Computer Science").credits(3).status("ACTIVE").build(),
                    Subject.builder().subjectCode("CSEAL61").subjectName("Compiler Design").type("THEORY").department("Computer Science").credits(4).status("ACTIVE").build(),
                    Subject.builder().subjectCode("CSA474").subjectName("Artificial Intelligence").type("THEORY").department("Computer Science").credits(4).status("ACTIVE").build()
            );

            // Practical subjects
            List<Subject> practicalSubjects = Arrays.asList(
                    Subject.builder().subjectCode("MRP306").subjectName("Campus to Corporate").type("PRACTICAL").department("Computer Science").credits(2).status("ACTIVE").build(),
                    Subject.builder().subjectCode("CSE352D").subjectName("Software Testing Lab").type("PRACTICAL").department("Computer Science").credits(2).status("ACTIVE").build(),
                    Subject.builder().subjectCode("ECMSL63").subjectName("Compiler Design Lab").type("PRACTICAL").department("Computer Science").credits(2).status("ACTIVE").build(),
                    Subject.builder().subjectCode("CSP390").subjectName("Project Based Learning (PBL) - 4").type("PRACTICAL").department("Computer Science").credits(3).status("ACTIVE").build(),
                    Subject.builder().subjectCode("CSP394").subjectName("Technical Skill Enhancement Course-2(Application Development Lab)").type("PRACTICAL").department("Computer Science").credits(2).status("ACTIVE").build(),
                    Subject.builder().subjectCode("CSA472").subjectName("Artificial Intelligence Lab").type("PRACTICAL").department("Computer Science").credits(2).status("ACTIVE").build(),
                    Subject.builder().subjectCode("RA010IB").subjectName("Introduction to Personal Engineering").type("PRACTICAL").department("Computer Science").credits(1).status("ACTIVE").build()
            );

            subjectRepository.saveAll(theorySubjects);
            subjectRepository.saveAll(practicalSubjects);
            System.out.println("Subjects seeded successfully.");
        }
    }

    private void seedStudentEnrollments() {
        if (studentEnrollmentRepository.count() == 0) {
            // Get subjects
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

            // Enroll student 2024CSE001 in all subjects for term 2601
            List<StudentEnrollment> enrollments = Arrays.asList(
                    StudentEnrollment.builder().loginId("2024CSE001").subjectId(softwareTesting.getId()).termCode("2601").semester("6th Semester").enrollmentStatus("ACTIVE").build(),
                    StudentEnrollment.builder().loginId("2024CSE001").subjectId(cyberSecurity.getId()).termCode("2601").semester("6th Semester").enrollmentStatus("ACTIVE").build(),
                    StudentEnrollment.builder().loginId("2024CSE001").subjectId(devOps.getId()).termCode("2601").semester("6th Semester").enrollmentStatus("ACTIVE").build(),
                    StudentEnrollment.builder().loginId("2024CSE001").subjectId(compilerDesign.getId()).termCode("2601").semester("6th Semester").enrollmentStatus("ACTIVE").build(),
                    StudentEnrollment.builder().loginId("2024CSE001").subjectId(ai.getId()).termCode("2601").semester("6th Semester").enrollmentStatus("ACTIVE").build(),
                    StudentEnrollment.builder().loginId("2024CSE001").subjectId(campusToCorporate.getId()).termCode("2601").semester("6th Semester").enrollmentStatus("ACTIVE").build(),
                    StudentEnrollment.builder().loginId("2024CSE001").subjectId(softwareTestingLab.getId()).termCode("2601").semester("6th Semester").enrollmentStatus("ACTIVE").build(),
                    StudentEnrollment.builder().loginId("2024CSE001").subjectId(compilerLab.getId()).termCode("2601").semester("6th Semester").enrollmentStatus("ACTIVE").build(),
                    StudentEnrollment.builder().loginId("2024CSE001").subjectId(pbl.getId()).termCode("2601").semester("6th Semester").enrollmentStatus("ACTIVE").build(),
                    StudentEnrollment.builder().loginId("2024CSE001").subjectId(tsec.getId()).termCode("2601").semester("6th Semester").enrollmentStatus("ACTIVE").build(),
                    StudentEnrollment.builder().loginId("2024CSE001").subjectId(aiLab.getId()).termCode("2601").semester("6th Semester").enrollmentStatus("ACTIVE").build(),
                    StudentEnrollment.builder().loginId("2024CSE001").subjectId(personalEng.getId()).termCode("2601").semester("6th Semester").enrollmentStatus("ACTIVE").build()
            );

            studentEnrollmentRepository.saveAll(enrollments);
            System.out.println("Student enrollments seeded successfully.");
        }
    }

    private void seedCAMarks() {
        if (caMarksRepository.count() == 0 && practicalMarksRepository.count() == 0) {
            // Get enrollments for student 2024CSE001 in term 2601
            List<StudentEnrollment> enrollments = studentEnrollmentRepository.findByLoginIdAndTermCode("2024CSE001", "2601");

            for (StudentEnrollment enrollment : enrollments) {
                Subject subject = subjectRepository.findById(enrollment.getSubjectId()).orElse(null);
                if (subject == null) continue;

                if ("THEORY".equals(subject.getType())) {
                    // Seed realistic theory marks (some complete, some partial, some null)
                    CAMarks marks = null;
                    
                    if ("CSE3521".equals(subject.getSubjectCode())) {
                        // Software Testing - Complete marks
                        marks = CAMarks.builder()
                                .enrollmentId(enrollment.getId())
                                .assignment1(4.5)
                                .assessment1(8.0)
                                .assignment2(4.0)
                                .assessment2(4.5)
                                .lastUpdated(LocalDateTime.now().minusDays(5))
                                .updatedBy("teacher001")
                                .build();
                    } else if ("CSE4201".equals(subject.getSubjectCode())) {
                        // Cyber Security - Partial marks (A1 and AS1 uploaded)
                        marks = CAMarks.builder()
                                .enrollmentId(enrollment.getId())
                                .assignment1(4.0)
                                .assessment1(9.0)
                                .assignment2(null)
                                .assessment2(null)
                                .lastUpdated(LocalDateTime.now().minusDays(3))
                                .updatedBy("teacher002")
                                .build();
                    } else if ("CSE4204".equals(subject.getSubjectCode())) {
                        // DevOps - Only A1 uploaded
                        marks = CAMarks.builder()
                                .enrollmentId(enrollment.getId())
                                .assignment1(5.0)
                                .assessment1(null)
                                .assignment2(null)
                                .assessment2(null)
                                .lastUpdated(LocalDateTime.now().minusDays(1))
                                .updatedBy("teacher003")
                                .build();
                    }
                    // For other theory subjects, no marks uploaded yet (null)

                    if (marks != null) {
                        caMarksRepository.save(marks);
                    }

                } else if ("PRACTICAL".equals(subject.getType())) {
                    // Seed realistic practical marks
                    PracticalMarks marks = null;

                    if ("CSE352D".equals(subject.getSubjectCode())) {
                        // Software Testing Lab - Complete marks
                        marks = PracticalMarks.builder()
                                .enrollmentId(enrollment.getId())
                                .caAi(68.0)
                                .caNaal(85.0)
                                .caJury(null)
                                .continuousAssessment(25.0)
                                .continuousEvaluation(27.0)
                                .lastUpdated(LocalDateTime.now().minusDays(4))
                                .updatedBy("teacher001")
                                .build();
                    } else if ("CSA472".equals(subject.getSubjectCode())) {
                        // AI Lab - Partial marks
                        marks = PracticalMarks.builder()
                                .enrollmentId(enrollment.getId())
                                .caAi(70.0)
                                .caNaal(null)
                                .caJury(null)
                                .continuousAssessment(null)
                                .continuousEvaluation(null)
                                .lastUpdated(LocalDateTime.now().minusDays(2))
                                .updatedBy("teacher004")
                                .build();
                    }
                    // For other practical subjects, no marks uploaded yet (null)

                    if (marks != null) {
                        practicalMarksRepository.save(marks);
                    }
                }
            }

            System.out.println("CA marks seeded successfully.");
        }
    }

    private void seedFaculty() {
        if (facultyRepository.count() == 0) {
            List<Faculty> faculties = Arrays.asList(
                    Faculty.builder().facultyId("FAC001").fullName("Shefali Sharma").email("shefali.sharma@ezone.edu").phone("+91-9876501001").department("Computer Science").designation("Professor").status("ACTIVE").build(),
                    Faculty.builder().facultyId("FAC002").fullName("Ashish Kumar").email("ashish.kumar@ezone.edu").phone("+91-9876501002").department("Computer Science").designation("Associate Professor").status("ACTIVE").build(),
                    Faculty.builder().facultyId("FAC003").fullName("Mr Sudeep Varshney").email("sudeep.varshney@ezone.edu").phone("+91-9876501003").department("Computer Science").designation("Assistant Professor").status("ACTIVE").build(),
                    Faculty.builder().facultyId("FAC004").fullName("Mekhala").email("mekhala@ezone.edu").phone("+91-9876501004").department("Computer Science").designation("Assistant Professor").status("ACTIVE").build(),
                    Faculty.builder().facultyId("FAC005").fullName("Kamaraju Suresh").email("kamaraju.suresh@ezone.edu").phone("+91-9876501005").department("Computer Science").designation("Professor").status("ACTIVE").build()
            );
            facultyRepository.saveAll(faculties);
            System.out.println("Faculty seeded successfully.");
        }
    }

    private void seedSubjectFacultyMappings() {
        if (subjectFacultyMappingRepository.count() == 0) {
            // Get subjects and faculties
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

            // Map subjects to faculty for term 2601
            List<SubjectFacultyMapping> mappings = Arrays.asList(
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
            );

            subjectFacultyMappingRepository.saveAll(mappings);
            System.out.println("Subject-Faculty mappings seeded successfully.");
        }
    }

    private void seedAttendanceRecords() {
        if (attendanceRecordRepository.count() == 0) {
            // Get enrollments for student 2024CSE001 in term 2601
            List<StudentEnrollment> enrollments = studentEnrollmentRepository.findByLoginIdAndTermCode("2024CSE001", "2601");

            for (StudentEnrollment enrollment : enrollments) {
                Subject subject = subjectRepository.findById(enrollment.getSubjectId()).orElse(null);
                if (subject == null) continue;

                List<AttendanceRecord> attendanceRecords = new ArrayList<>();

                // Seed realistic attendance data (some subjects with attendance, some without)
                if ("CSE3521".equals(subject.getSubjectCode())) {
                    // Software Testing - Good attendance (20 classes, 18 present)
                    for (int i = 1; i <= 20; i++) {
                        String status = (i == 5 || i == 12) ? "ABSENT" : "PRESENT";
                        attendanceRecords.add(AttendanceRecord.builder()
                                .enrollmentId(enrollment.getId())
                                .attendanceDate(LocalDate.of(2026, 1, i))
                                .status(status)
                                .markedBy("FAC001")
                                .markedAt(LocalDateTime.of(2026, 1, i, 10, 0))
                                .build());
                    }
                } else if ("CSE4201".equals(subject.getSubjectCode())) {
                    // Cyber Security - Average attendance (18 classes, 15 present, 1 medical)
                    for (int i = 1; i <= 18; i++) {
                        String status = "PRESENT";
                        if (i == 7 || i == 14) status = "ABSENT";
                        if (i == 16) status = "MEDICAL";
                        attendanceRecords.add(AttendanceRecord.builder()
                                .enrollmentId(enrollment.getId())
                                .attendanceDate(LocalDate.of(2026, 1, i))
                                .status(status)
                                .markedBy("FAC002")
                                .markedAt(LocalDateTime.of(2026, 1, i, 11, 0))
                                .build());
                    }
                } else if ("CSE352D".equals(subject.getSubjectCode())) {
                    // Software Testing Lab - Perfect attendance (15 classes, 15 present)
                    for (int i = 1; i <= 15; i++) {
                        attendanceRecords.add(AttendanceRecord.builder()
                                .enrollmentId(enrollment.getId())
                                .attendanceDate(LocalDate.of(2026, 1, i))
                                .status("PRESENT")
                                .markedBy("FAC001")
                                .markedAt(LocalDateTime.of(2026, 1, i, 14, 0))
                                .build());
                    }
                } else if ("CSA472".equals(subject.getSubjectCode())) {
                    // AI Lab - Low attendance (12 classes, 8 present, 1 event)
                    for (int i = 1; i <= 12; i++) {
                        String status = "PRESENT";
                        if (i == 3 || i == 6 || i == 10) status = "ABSENT";
                        if (i == 9) status = "EVENT";
                        attendanceRecords.add(AttendanceRecord.builder()
                                .enrollmentId(enrollment.getId())
                                .attendanceDate(LocalDate.of(2026, 1, i))
                                .status(status)
                                .markedBy("FAC005")
                                .markedAt(LocalDateTime.of(2026, 1, i, 15, 0))
                                .build());
                    }
                }
                // For other subjects, no attendance recorded yet (empty)

                if (!attendanceRecords.isEmpty()) {
                    attendanceRecordRepository.saveAll(attendanceRecords);
                }
            }

            System.out.println("Attendance records seeded successfully.");
        }
    }
}
