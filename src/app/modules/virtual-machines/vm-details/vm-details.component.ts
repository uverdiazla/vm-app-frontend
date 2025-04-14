import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { VirtualMachine } from '../../../models/virtual-machine.model';
import { VirtualMachineService } from '../../../core/services/virtual-machine.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-vm-details',
  templateUrl: './vm-details.component.html',
  styleUrls: ['./vm-details.component.scss']
})
export class VmDetailsComponent implements OnInit {
  vm: VirtualMachine | null = null;
  isLoading = false;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private vmService: VirtualMachineService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadVirtualMachine();
  }

  loadVirtualMachine(): void {
    this.isLoading = true;
    this.error = false;
    
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.navigateToList();
      return;
    }

    this.vmService.getById(id).subscribe({
      next: (vm) => {
        this.vm = vm;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading virtual machine details', error);
        this.isLoading = false;
        this.error = true;
        this.showMessage(this.translateKey('virtualMachine.detailsError'));
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  navigateToList(): void {
    this.router.navigate(['/virtual-machines']);
  }

  showMessage(message: string): void {
    this.snackBar.open(message, this.translateKey('buttons.close'), {
      duration: 5000
    });
  }

  translateKey(key: string): string {
    return this.translate.instant(key);
  }
} 