
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ReportService } from '../../services/report.service';
import { Report, Department } from '../../models';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './user-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDashboardComponent {
  authService = inject(AuthService);
  reportService = inject(ReportService);

  currentUser = this.authService.currentUser;
  userReports = computed(() => {
    const user = this.currentUser();
    if (!user) return [];
    return this.reportService.reports().filter(r => r.createdByUserId === user.id);
  });
  
  showReportForm = signal(false);
  selectedReport = signal<Report | null>(null);

  // New Report Form Signals
  newReportTitle = signal('');
  newReportDescription = signal('');
  newReportAssignedToDept = signal<Department>('Ingeniería');
  newReportUserNotes = signal('');

  departments: Department[] = ['Ingeniería', 'Telemática', 'Equipos Médicos'];

  createReport() {
    const user = this.currentUser();
    if (!user || !this.newReportTitle() || !this.newReportDescription()) return;

    this.reportService.addReport({
      title: this.newReportTitle(),
      description: this.newReportDescription(),
      assignedToDept: this.newReportAssignedToDept(),
      userNotes: this.newReportUserNotes(),
      createdByUserId: user.id,
      createdByName: user.name,
      createdByDepartment: user.department,
    });
    
    // Reset form
    this.newReportTitle.set('');
    this.newReportDescription.set('');
    this.newReportAssignedToDept.set('Ingeniería');
    this.newReportUserNotes.set('');
    this.showReportForm.set(false);
  }

  viewReportDetails(report: Report) {
    this.selectedReport.set(report);
  }

  updateUserConfirmation(report: Report, status: 'Solventado' | 'No solventado') {
    const updatedReport = { ...report, userConfirmation: status };
    this.reportService.updateReport(updatedReport);
    this.selectedReport.set(updatedReport);
  }
}
