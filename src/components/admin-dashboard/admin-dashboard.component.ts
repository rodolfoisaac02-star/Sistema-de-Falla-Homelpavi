
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ReportService } from '../../services/report.service';
import { Report, ReportStatus, User } from '../../models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './admin-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {
  authService = inject(AuthService);
  reportService = inject(ReportService);

  currentUser = this.authService.currentUser;
  
  departmentReports = computed(() => {
    const user = this.currentUser();
    if (!user) return [];
    return this.reportService.reports().filter(r => r.assignedToDept === user.department);
  });
  
  isTelematicaAdmin = computed(() => this.currentUser()?.department === 'Telemática');

  selectedReport = signal<Report | null>(null);
  
  // Edit form signals
  editStatus = signal<ReportStatus>('En espera');
  editMaterials = signal('');
  editAdminNotes = signal('');

  // Stats
  reportsToday = computed(() => this.departmentReports().filter(r => new Date(r.createdAt).toDateString() === new Date().toDateString()).length);
  reportsThisWeek = computed(() => {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      return this.departmentReports().filter(r => new Date(r.createdAt) >= startOfWeek).length;
  });
  reportsThisMonth = computed(() => this.departmentReports().filter(r => new Date(r.createdAt).getMonth() === new Date().getMonth()).length);
  pendingReports = computed(() => this.departmentReports().filter(r => r.status === 'En espera').length);
  completedReports = computed(() => this.departmentReports().filter(r => r.status === 'Terminado').length);


  viewReportDetails(report: Report) {
    this.selectedReport.set(report);
    this.editStatus.set(report.status);
    this.editMaterials.set(report.materialsUsed);
    this.editAdminNotes.set(report.adminNotes);
  }

  saveReportChanges() {
    const report = this.selectedReport();
    if (!report) return;

    const updatedReport: Report = {
      ...report,
      status: this.editStatus(),
      materialsUsed: this.editMaterials(),
      adminNotes: this.editAdminNotes(),
    };

    this.reportService.updateReport(updatedReport);
    this.selectedReport.set(null);
  }
}
