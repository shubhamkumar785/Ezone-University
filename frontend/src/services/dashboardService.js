import { dashboardApi } from '../api/dashboardApi';

export const dashboardService = {
  getDashboardOverview: async () => {
    try {
      const [stats, enrollment, attendance, departments, fees, recentActPage, pendingLeavePage] = await Promise.all([
        dashboardApi.getOverview(),
        dashboardApi.getEnrollmentTrend(),
        dashboardApi.getAttendanceTrend(),
        dashboardApi.getDepartmentDistribution(),
        dashboardApi.getFeeReport(),
        dashboardApi.getRecentActivities(0, 10),
        dashboardApi.getPendingLeaves(0, 10)
      ]);
      
      const totalStudentsCount = departments.reduce((acc, curr) => acc + curr.students, 0);

      const colorMap = {
        'Computer Science': '#5B3DF5',
        'Mechanical Eng': '#3B82F6',
        'Electrical Eng': '#10B981',
        'Business Admin': '#F59E0B',
        'Mathematics': '#EF4444',
        'Physics': '#A855F7',
        'Civil Eng': '#06B6D4'
      };

      return {
        stats: {
          totalStudents: { value: stats.totalStudents.toLocaleString(), trend: '+8.2%', trendType: 'up', subtitle: 'vs last year' },
          facultyMembers: { value: stats.totalTeachers.toString(), trend: '+3.1%', trendType: 'up', subtitle: 'vs last year' },
          activeCourses: { value: stats.activeCourses.toString(), trend: '+5.4%', trendType: 'up', subtitle: 'vs last year' },
          departments: { value: stats.totalDepartments.toString(), trend: 'Stable', trendType: 'neutral', subtitle: 'vs last year' },
          avgAttendance: { value: `${stats.averageAttendance}%`, trend: '-1.2%', trendType: 'down', subtitle: 'vs last month', progress: stats.averageAttendance },
          feeCollected: { value: `$${(stats.feeCollected / 1000)}K`, trend: 'of $1000K target', trendType: 'neutral', progress: Math.round((stats.feeCollected / 1000000) * 100) },
          pendingLeavesCount: { value: stats.pendingLeaves.toString(), trend: 'awaiting approval', trendType: 'neutral' },
          activeAlerts: { value: stats.activeAlerts.toString(), trend: 'system alerts', trendType: 'neutral' }
        },
        enrollmentTrend: enrollment.map((e) => ({
          month: e.month,
          value: e.students
        })),
        departmentsDistribution: departments.map((d) => {
          const pct = totalStudentsCount > 0 ? Math.round((d.students / totalStudentsCount) * 100) : 0;
          return {
            name: d.department,
            value: pct,
            color: colorMap[d.department] || '#64748B'
          };
        }),
        monthlyAttendance: attendance,
        feeCollection: fees.map((f) => ({
          month: f.month,
          collected: f.collected,
          target: f.target
        })),
        pendingLeaves: (pendingLeavePage.content || []).map((l) => ({
          id: l.id,
          initials: l.initials || (l.employee ? l.employee.split(' ').map(n => n[0]).join('').toUpperCase() : 'L'),
          name: l.employee,
          type: l.leaveType,
          dept: l.department,
          time: l.time,
          duration: l.duration,
          status: l.status
        })),
        recentActivities: (recentActPage.content || []).map((act) => ({
          id: act.id,
          title: act.message,
          desc: act.message,
          time: act.time,
          module: act.module,
          statusColor: act.statusColor || 'green'
        }))
      };
    } catch (error) {
      console.error('Error fetching dashboard overview details:', error);
      throw error;
    }
  },
  getRecentActivities: async (page = 0, size = 10) => {
    try {
      const data = await dashboardApi.getRecentActivities(page, size);
      return data;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  },
  getPendingLeaves: async (page = 0, size = 10) => {
    try {
      const data = await dashboardApi.getPendingLeaves(page, size);
      return data;
    } catch (error) {
      console.error('Error fetching pending leaves:', error);
      throw error;
    }
  },
  getSystemAlerts: async (page = 0, size = 10) => {
    try {
      const data = await dashboardApi.getSystemAlerts(page, size);
      return data;
    } catch (error) {
      console.error('Error fetching system alerts:', error);
      throw error;
    }
  }
};
