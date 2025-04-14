import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { VirtualMachine } from '../../../models/virtual-machine.model';

export interface VmDialogData {
  vm?: VirtualMachine;
  isEdit: boolean;
  operatingSystems: { id: number, name: string }[];
  statuses: { id: number, name: string, colorCode: string, displayName?: string }[];
}

@Component({
  selector: 'app-vm-dialog',
  templateUrl: './vm-dialog.component.html',
  styleUrls: ['./vm-dialog.component.scss']
})
export class VmDialogComponent implements OnInit {
  vmForm!: FormGroup;
  isEdit: boolean;
  title: string;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<VmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VmDialogData
  ) {
    // Ensure Spanish is set
    if (this.translate.currentLang !== 'es') {
      this.translate.use('es');
    }
    
    this.isEdit = data.isEdit;
    this.title = this.isEdit 
      ? this.translate.instant('virtualMachine.edit') 
      : this.translate.instant('virtualMachine.create');
  }

  ngOnInit(): void {
    this.initForm();
    if (this.isEdit && this.data.vm) {
      this.vmForm.patchValue({
        name: this.data.vm.name,
        cores: this.data.vm.cores,
        ram: this.data.vm.ram,
        disk: this.data.vm.disk,
        operatingSystemId: this.data.vm.operatingSystem.id,
        statusId: this.data.vm.status.id,
        description: this.data.vm.description || '',
        hostname: this.data.vm.hostname || '',
        ipAddress: this.data.vm.ipAddress || ''
      });
    }
  }

  initForm(): void {
    this.vmForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      cores: [2, [Validators.required, Validators.min(1), Validators.max(32)]],
      ram: [4, [Validators.required, Validators.min(1), Validators.max(128)]],
      disk: [100, [Validators.required, Validators.min(10), Validators.max(2000)]],
      operatingSystemId: ['', Validators.required],
      statusId: ['', Validators.required],
      description: [''],
      hostname: [''],
      ipAddress: ['']
    });
  }

  translateKey(key: string): string {
    return this.translate.instant(key);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.vmForm.valid) {
      this.dialogRef.close(this.vmForm.value);
    }
  }
} 