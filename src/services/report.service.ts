
import { Injectable, signal, computed } from '@angular/core';
import { Report, Department } from '../models';

const MOCK_REPORTS: Report[] = [
    {
      id: 1,
      title: 'Falla en el servidor de correos',
      description: 'El servidor de correos no envía ni recibe emails desde esta mañana.',
      createdByUserId: 5,
      createdByName: 'Rodolfo Perez',
      createdByDepartment: 'Telemática',
      assignedToDept: 'Telemática',
      status: 'En espera',
      userConfirmation: null,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      materialsUsed: '',
      adminNotes: '',
      userNotes: 'Es urgente, requerimos comunicación por correo.',
    },
    {
      id: 2,
      title: 'Aire acondicionado no enfría',
      description: 'La unidad de A/C de la oficina principal solo ventila, no enfría.',
      createdByUserId: 6,
      createdByName: 'Ana Gomez',
      createdByDepartment: 'Ingeniería',
      assignedToDept: 'Ingeniería',
      status: 'Terminado',
      userConfirmation: 'Solventado',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      materialsUsed: '1 x Capacitor de arranque\n2 metros de tubería de cobre',
      adminNotes: 'Se reemplazó el capacitor y se corrigió una fuga de gas.',
      userNotes: '',
    },
    {
      id: 3,
      title: 'Monitor de signos vitales con error',
      description: 'El monitor de la cama 5 muestra un error 50.1 en pantalla.',
      createdByUserId: 7,
      createdByName: 'Carlos Diaz',
      createdByDepartment: 'Equipos Médicos',
      assignedToDept: 'Equipos Médicos',
      status: 'En espera',
      userConfirmation: null,
      createdAt: new Date(),
      materialsUsed: '',
      adminNotes: '',
      userNotes: 'Equipo crítico para paciente.',
    }
];

@Injectable({ providedIn: 'root' })
export class ReportService {
  private reportsState = signal<Report[]>(MOCK_REPORTS);
  reports = this.reportsState.asReadonly();

  getReportsForUser(userId: number) {
    return computed(() => this.reports().filter(r => r.createdByUserId === userId));
  }
  
  getReportsForDepartment(department: Department) {
    return computed(() => this.reports().filter(r => r.assignedToDept === department));
  }
  
  addReport(reportData: Omit<Report, 'id' | 'createdAt' | 'status' | 'userConfirmation' | 'materialsUsed' | 'adminNotes' >) {
    const newReport: Report = {
      ...reportData,
      id: Date.now(),
      createdAt: new Date(),
      status: 'En espera',
      userConfirmation: null,
      materialsUsed: '',
      adminNotes: '',
    };
    this.reportsState.update(reports => [newReport, ...reports]);
  }

  updateReport(updatedReport: Report) {
    this.reportsState.update(reports => reports.map(r => r.id === updatedReport.id ? updatedReport : r));
  }

  deleteReport(reportId: number) {
    this.reportsState.update(reports => reports.filter(r => r.id !== reportId));
  }
}
