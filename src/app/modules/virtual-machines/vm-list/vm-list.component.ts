import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import { VirtualMachine, CreateVirtualMachineRequest, UpdateVirtualMachineRequest } from '../../../models/virtual-machine.model';
import { VirtualMachineService } from '../../../core/services/virtual-machine.service';
import { AuthService } from '../../../core/services/auth.service';
import { VmDialogComponent, VmDialogData } from '../vm-dialog/vm-dialog.component';

@Component({
  selector: 'app-vm-list',
  templateUrl: './vm-list.component.html',
  styleUrls: ['./vm-list.component.scss']
})
export class VmListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'cores', 'ram', 'disk', 'os', 'status', 'actions'];
  dataSource = new MatTableDataSource<VirtualMachine>([]);
  isLoading = false;
  private destroy$ = new Subject<void>();
  
  operatingSystems = [
    { id: 1, name: 'Windows Server 2019' },
    { id: 2, name: 'Windows Server 2022' },
    { id: 3, name: 'Ubuntu 20.04 LTS' },
    { id: 4, name: 'Ubuntu 22.04 LTS' },
    { id: 5, name: 'CentOS 7' },
    { id: 6, name: 'CentOS 8' },
    { id: 7, name: 'Debian 11' }
  ];
  
  statuses = [
    { id: 1, name: 'Running', colorCode: '#4CAF50', displayName: 'En ejecución' },
    { id: 2, name: 'Stopped', colorCode: '#F44336', displayName: 'Detenida' },
    { id: 3, name: 'Provisioning', colorCode: '#2196F3', displayName: 'Aprovisionando' },
    { id: 4, name: 'Failed', colorCode: '#D32F2F', displayName: 'Fallida' },
    { id: 5, name: 'Suspended', colorCode: '#FF9800', displayName: 'Suspendida' },
    { id: 6, name: 'Maintenance', colorCode: '#607D8B', displayName: 'En mantenimiento' }
  ];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private vmService: VirtualMachineService,
    private authService: AuthService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private paginatorIntl: MatPaginatorIntl
  ) {}

  ngOnInit(): void {
    this.loadVirtualMachines();
    this.configurePaginatorTranslation();
    
    // Subscribe to real-time VM updates
    this.vmService.vmList$.subscribe(vms => {
      if (vms && vms.length > 0) {
        console.log(`Real-time update received: ${vms.length} VMs`);
        this.dataSource.data = vms;
        
        // Reset pagination to first page when data is updated via real-time
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Custom filter predicate to search across multiple properties
    this.dataSource.filterPredicate = (data: VirtualMachine, filter: string) => {
      const searchStr = filter.toLowerCase();
      return data.name.toLowerCase().includes(searchStr) ||
             data.operatingSystem.name.toLowerCase().includes(searchStr) ||
             data.status.name.toLowerCase().includes(searchStr) ||
             (data.description ? data.description.toLowerCase().includes(searchStr) : false) ||
             (data.hostname ? data.hostname.toLowerCase().includes(searchStr) : false) ||
             (data.ipAddress ? data.ipAddress.toLowerCase().includes(searchStr) : false);
    };
  }

  loadVirtualMachines(): void {
    this.isLoading = true;
    this.vmService.getAll().subscribe({
      next: () => {
        // Data is now handled through the vmList$ observable
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading virtual machines', error);
        this.isLoading = false;
        this.showMessage(this.translate.instant('VM_LIST.ERROR_LOADING'));
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilter(): void {
    this.dataSource.filter = '';
    const inputElement = document.querySelector('.filter-field input') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
      inputElement.focus();
    }
  }

  openCreateDialog(): void {
    const dialogData: VmDialogData = {
      isEdit: false,
      operatingSystems: this.operatingSystems,
      statuses: this.statuses
    };

    const dialogRef = this.dialog.open(VmDialogComponent, {
      width: '650px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        const request: CreateVirtualMachineRequest = result;
        this.vmService.create(request).subscribe({
          next: () => {
            this.loadVirtualMachines();
            this.showMessage(this.translateKey('virtualMachine.createSuccess'));
          },
          error: (error) => {
            console.error('Error creating virtual machine', error);
            this.isLoading = false;
            this.showMessage(this.translateKey('virtualMachine.createError'));
          }
        });
      }
    });
  }

  openEditDialog(vm: VirtualMachine): void {
    const dialogData: VmDialogData = {
      vm: vm,
      isEdit: true,
      operatingSystems: this.operatingSystems,
      statuses: this.statuses
    };

    const dialogRef = this.dialog.open(VmDialogComponent, {
      width: '650px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        const request: UpdateVirtualMachineRequest = result;
        this.vmService.update(vm.id!, request).subscribe({
          next: () => {
            this.loadVirtualMachines();
            this.showMessage(this.translateKey('virtualMachine.updateSuccess'));
          },
          error: (error) => {
            console.error('Error updating virtual machine', error);
            this.isLoading = false;
            this.showMessage(this.translateKey('virtualMachine.updateError'));
          }
        });
      }
    });
  }

  deleteVirtualMachine(vm: VirtualMachine): void {
    if (confirm(this.translate.instant('VM_LIST.DELETE_CONFIRM_MESSAGE', { name: vm.name }) || `¿Estás seguro de eliminar la máquina virtual ${vm.name}?`)) {
      this.isLoading = true;
      this.vmService.delete(vm.id!).subscribe({
        next: () => {
          this.loadVirtualMachines();
          this.showMessage(this.translate.instant('VM_LIST.DELETE_SUCCESS') || 'Máquina virtual eliminada con éxito');
        },
        error: (error: any) => {
          console.error('Error deleting virtual machine', error);
          this.isLoading = false;
          this.showMessage(this.translate.instant('VM_LIST.DELETE_ERROR') || 'Error al eliminar la máquina virtual');
        }
      });
    }
  }

  isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  getStatusClass(statusObj: any): string {
    if (!statusObj) return '';
    return `status-${statusObj.name.toLowerCase()}`;
  }

  showMessage(message: string): void {
    this.snackBar.open(message, this.translate.instant('COMMON.CLOSE') || 'Cerrar', {
      duration: 5000
    });
  }

  translateKey(key: string): string {
    return this.translate.instant(key);
  }

  configurePaginatorTranslation(): void {
    const translateLabels = () => {
      this.paginatorIntl.itemsPerPageLabel = this.translate.instant('paginator.itemsPerPage');
      this.paginatorIntl.nextPageLabel = this.translate.instant('paginator.nextPage');
      this.paginatorIntl.previousPageLabel = this.translate.instant('paginator.previousPage');
      this.paginatorIntl.firstPageLabel = this.translate.instant('paginator.firstPage');
      this.paginatorIntl.lastPageLabel = this.translate.instant('paginator.lastPage');
      this.paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return this.translate.instant('paginator.emptyRange');
        }
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return this.translate.instant('paginator.range', {
          startIndex: startIndex + 1,
          endIndex,
          length
        });
      };
      this.paginatorIntl.changes.next();
    };
  
    // Esperar a que las traducciones estén listas
    this.translate.get('paginator.itemsperpage').subscribe(() => {
      translateLabels(); // Traducciones iniciales
    });
  
    this.translate.onLangChange.subscribe(() => {
      translateLabels(); // Traducciones cuando cambie idioma
    });
  }
  

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
} 