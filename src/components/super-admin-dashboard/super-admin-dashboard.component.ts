
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ReportService } from '../../services/report.service';
import { Report, Department, ReportStatus } from '../../models';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './super-admin-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperAdminDashboardComponent {
  authService = inject(AuthService);
  reportService = inject(ReportService);

  allReports = this.reportService.reports;
  departments: Department[] = ['Ingeniería', 'Telemática', 'Equipos Médicos'];
  selectedDepartment = signal<Department | 'TODOS'>('TODOS');
  
  filteredReports = computed(() => {
    const reports = this.allReports();
    const dept = this.selectedDepartment();
    if (dept === 'TODOS') {
      return reports;
    }
    return reports.filter(r => r.assignedToDept === dept);
  });

  selectedReport = signal<Report | null>(null);
  
  // Edit form signals
  editStatus = signal<ReportStatus>('En espera');
  editMaterials = signal('');
  editAdminNotes = signal('');

  // Stats
  reportsToday = computed(() => this.allReports().filter(r => new Date(r.createdAt).toDateString() === new Date().toDateString()).length);
  reportsThisWeek = computed(() => {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      return this.allReports().filter(r => new Date(r.createdAt) >= startOfWeek).length;
  });
  reportsThisMonth = computed(() => this.allReports().filter(r => new Date(r.createdAt).getMonth() === new Date().getMonth()).length);
  pendingReports = computed(() => this.allReports().filter(r => r.status === 'En espera').length);
  completedReports = computed(() => this.allReports().filter(r => r.status === 'Terminado').length);
  
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

  deleteReport(reportId: number) {
    if (confirm('¿Está seguro de que desea eliminar este reporte de forma permanente?')) {
      this.reportService.deleteReport(reportId);
      this.selectedReport.set(null);
    }
  }
}
