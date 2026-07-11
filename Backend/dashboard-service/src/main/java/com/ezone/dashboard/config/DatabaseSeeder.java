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

    @Override
    public void run(String... args) throws Exception {
        seedOverview();
        seedEnrollmentTrend();
        seedAttendanceTrend();
        seedDepartmentDistribution();
        seedFeeReport();
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
}
