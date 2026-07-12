package com.ezone.dashboard.config;

import com.ezone.dashboard.entity.*;
import com.ezone.dashboard.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

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

    @Override
    public void run(String... args) throws Exception {
        seedOverview();
        seedEnrollmentTrend();
        seedAttendanceTrend();
        seedDepartmentDistribution();
        seedFeeReport();
        seedRecentActivities();
        seedPendingLeaves();
        seedSystemAlerts();
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
}
