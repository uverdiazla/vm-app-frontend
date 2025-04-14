import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { 
  VirtualMachine, 
  CreateVirtualMachineRequest, 
  UpdateVirtualMachineRequest 
} from '../../models/virtual-machine.model';
import { environment } from '../../../environments/environment';
import { SignalrService } from './signalr.service';

@Injectable({
  providedIn: 'root'
})
export class VirtualMachineService implements OnDestroy {
  private apiUrl = `${environment.apiUrl}/api/vms`;
  private vmListSubject = new BehaviorSubject<VirtualMachine[]>([]);
  public vmList$ = this.vmListSubject.asObservable();
  
  private subscriptions: Subscription[] = [];
  private initialized = false;

  constructor(
    private http: HttpClient,
    private signalrService: SignalrService
  ) {
    // Start SignalR connection
    this.signalrService.startConnection()
      .then(() => {
        // Subscribe to SignalR events
        this.subscribeToRealTimeEvents();
        
        // Load initial data
        this.loadInitialData();
      })
      .catch(() => {
        // Even if signalR fails, load initial data anyway
        this.loadInitialData();
      });
      
    // Also subscribe to connection status changes
    const connectionSub = this.signalrService.connected$.subscribe(connected => {
      // If we reconnect and we're already initialized, reload data
      if (connected && this.initialized) {
        this.loadInitialData();
      }
    });
    
    this.subscriptions.push(connectionSub);
  }
  
  private loadInitialData(): void {
    this.getAll().subscribe({
      next: () => {
        this.initialized = true;
      },
      error: () => { /* Handled by global error handler */ }
    });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // Stop SignalR connection
    this.signalrService.stopConnection().catch(() => {
      // Ignore errors when stopping connection during cleanup
    });
  }

  private subscribeToRealTimeEvents(): void {
    // Subscribe to VM created events
    const createdSub = this.signalrService.vmCreated$.subscribe(vm => {
      if (vm) {
        const currentVms = this.vmListSubject.value;
        
        // Add the new VM if it doesn't exist
        if (!currentVms.some(x => x.id === vm.id)) {
          this.vmListSubject.next([...currentVms, vm]);
        }
      }
    });
    
    // Subscribe to VM updated events
    const updatedSub = this.signalrService.vmUpdated$.subscribe(vm => {
      if (vm) {
        const currentVms = this.vmListSubject.value;
        
        // Update the existing VM
        const existingVmIndex = currentVms.findIndex(x => x.id === vm.id);
        if (existingVmIndex >= 0) {
          const updatedVms = [...currentVms];
          updatedVms[existingVmIndex] = vm;
          this.vmListSubject.next(updatedVms);
        } else {
          this.vmListSubject.next([...currentVms, vm]);
        }
      }
    });
    
    // Subscribe to VM deleted events
    const deletedSub = this.signalrService.vmDeleted$.subscribe(vmId => {
      if (vmId) {
        const currentVms = this.vmListSubject.value;
        
        // Check if VM exists before removing
        const existingVm = currentVms.find(x => x.id === vmId);
        if (existingVm) {
          const updatedVms = currentVms.filter(x => x.id !== vmId);
          this.vmListSubject.next(updatedVms);
        }
      }
    });
    
    // Save subscriptions for cleanup later
    this.subscriptions.push(createdSub, updatedSub, deletedSub);
  }

  /**
   * Get all virtual machines
   */
  getAll(): Observable<VirtualMachine[]> {
    return this.http.get<VirtualMachine[]>(this.apiUrl).pipe(
      tap(vms => {
        // Update the BehaviorSubject with the latest list
        this.vmListSubject.next(vms);
      })
    );
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
    // No need to manually update the BehaviorSubject,
    // as the server will send notification through SignalR
  }

  /**
   * Update an existing virtual machine
   */
  update(id: number, vm: UpdateVirtualMachineRequest): Observable<VirtualMachine> {
    return this.http.put<VirtualMachine>(`${this.apiUrl}/${id}`, vm);
    // No need to manually update the BehaviorSubject,
    // as the server will send notification through SignalR
  }

  /**
   * Delete a virtual machine
   */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
    // No need to manually update the BehaviorSubject,
    // as the server will send notification through SignalR
  }
  
  /**
   * For debugging purposes - force refresh the VM list
   */
  forceRefresh(): void {
    this.getAll().subscribe();
  }
  
  /**
   * Get the current connection state of SignalR
   */
  getSignalRState(): string {
    return this.signalrService.getConnectionState();
  }
} 