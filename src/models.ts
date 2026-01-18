
export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN';
export type Department = 'Ingeniería' | 'Telemática' | 'Equipos Médicos' | 'General';

export interface User {
  id: number;
  username: string;
  password?: string; // Should not be sent to client in real app
  name: string;
  department: Department;
  role: Role;
}

export type ReportStatus = 'En espera' | 'Terminado';
export type UserConfirmationStatus = 'Solventado' | 'No solventado';

export interface Report {
  id: number;
  title: string;
  description: string;
  createdByUserId: number;
  createdByName: string;
  createdByDepartment: Department;
  assignedToDept: Department;
  status: ReportStatus;
  userConfirmation: UserConfirmationStatus | null;
  createdAt: Date;
  materialsUsed: string;
  adminNotes: string;
  userNotes: string;
}
