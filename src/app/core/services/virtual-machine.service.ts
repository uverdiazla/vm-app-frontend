import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  VirtualMachine, 
  CreateVirtualMachineRequest, 
  UpdateVirtualMachineRequest 
} from '../../models/virtual-machine.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VirtualMachineService {
  private apiUrl = `${environment.apiUrl}/api/vms`;

  constructor(private http: HttpClient) { }

  /**
   * Get all virtual machines
   */
  getAll(): Observable<VirtualMachine[]> {
    return this.http.get<VirtualMachine[]>(this.apiUrl);
  }

  /**
   * Get a single virtual machine by ID
   */
  getById(id: number): Observable<VirtualMachine> {
    return this.http.get<VirtualMachine>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new virtual machine
   */
  create(vm: CreateVirtualMachineRequest): Observable<VirtualMachine> {
    return this.http.post<VirtualMachine>(this.apiUrl, vm);
  }

  /**
   * Update an existing virtual machine
   */
  update(id: number, vm: UpdateVirtualMachineRequest): Observable<VirtualMachine> {
    return this.http.put<VirtualMachine>(`${this.apiUrl}/${id}`, vm);
  }

  /**
   * Delete a virtual machine
   */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
} 