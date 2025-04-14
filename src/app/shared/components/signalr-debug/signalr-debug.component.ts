import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignalrService } from '../../../core/services/signalr.service';
import { VirtualMachineService } from '../../../core/services/virtual-machine.service';
import { interval, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-signalr-debug',
  template: `
    <div class="debug-panel">
      <h4>SignalR Connection Status</h4>
      <div class="status" [ngClass]="{'connected': connected, 'disconnected': !connected}">
        {{ connectionState }}
      </div>
      
      <div class="actions">
        <button (click)="forceRefresh()">Force Refresh VMs</button>
        <button (click)="reconnect()">Reconnect SignalR</button>
        <button (click)="testConnection()">Test Connection</button>
      </div>
      
      <div class="events">
        <h5>Recent Events</h5>
        <div *ngFor="let event of recentEvents" class="event">
          <span class="time">{{ event.time | date:'HH:mm:ss' }}</span>
          <span class="type" [ngClass]="event.type">{{ event.type }}</span>
          <span class="message">{{ event.message }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .debug-panel {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 10px;
      margin: 10px 0;
      background-color: #f8f8f8;
      font-family: monospace;
    }
    .status {
      padding: 5px;
      border-radius: 3px;
      margin-bottom: 10px;
      font-weight: bold;
    }
    .connected {
      background-color: #d4edda;
      color: #155724;
    }
    .disconnected {
      background-color: #f8d7da;
      color: #721c24;
    }
    .actions {
      margin-bottom: 10px;
    }
    button {
      margin-right: 10px;
      padding: 5px 10px;
    }
    .events {
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid #ddd;
      padding: 5px;
    }
    .event {
      padding: 3px 0;
      border-bottom: 1px solid #eee;
    }
    .time {
      color: #666;
      margin-right: 8px;
    }
    .type {
      padding: 2px 5px;
      border-radius: 3px;
      margin-right: 8px;
      display: inline-block;
      width: 80px;
      text-align: center;
    }
    .created {
      background-color: #d1ecf1;
      color: #0c5460;
    }
    .updated {
      background-color: #fff3cd;
      color: #856404;
    }
    .deleted {
      background-color: #f8d7da;
      color: #721c24;
    }
    .connection {
      background-color: #e2e3e5;
      color: #383d41;
    }
  `],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class SignalrDebugComponent implements OnInit, OnDestroy {
  connected = false;
  connectionState = 'Unknown';
  recentEvents: { time: Date, type: string, message: string }[] = [];
  
  private subscriptions: Subscription[] = [];
  private pollingSubscription?: Subscription;
  
  constructor(
    private signalrService: SignalrService,
    private vmService: VirtualMachineService
  ) {}
  
  ngOnInit(): void {
    // Subscribe to connection status changes
    this.subscriptions.push(
      this.signalrService.connected$.subscribe(connected => {
        this.connected = connected;
        this.updateConnectionState();
        this.addEvent('connection', 
          `Connection ${connected ? 'established' : 'lost'}`);
      })
    );
    
    // Subscribe to VM events
    this.subscriptions.push(
      this.signalrService.vmCreated$.subscribe(vm => {
        if (vm) {
          this.addEvent('created', `VM created: ${vm.name} (ID: ${vm.id})`);
        }
      })
    );
    
    this.subscriptions.push(
      this.signalrService.vmUpdated$.subscribe(vm => {
        if (vm) {
          this.addEvent('updated', `VM updated: ${vm.name} (ID: ${vm.id})`);
        }
      })
    );
    
    this.subscriptions.push(
      this.signalrService.vmDeleted$.subscribe(vmId => {
        if (vmId) {
          this.addEvent('deleted', `VM deleted: ID ${vmId}`);
        }
      })
    );
    
    // Start polling for connection state
    this.startPolling();
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
  
  private updateConnectionState(): void {
    this.connectionState = `${this.connected ? 'Connected' : 'Disconnected'} - ${this.vmService.getSignalRState()}`;
  }
  
  private addEvent(type: string, message: string): void {
    this.recentEvents.unshift({
      time: new Date(),
      type,
      message
    });
    
    // Keep only the 20 most recent events
    if (this.recentEvents.length > 20) {
      this.recentEvents.pop();
    }
  }
  
  private startPolling(): void {
    // Poll every 5 seconds to update connection state
    this.pollingSubscription = interval(5000).subscribe(() => {
      this.updateConnectionState();
    });
  }
  
  forceRefresh(): void {
    this.vmService.forceRefresh();
    this.addEvent('connection', 'Force refreshing VM list');
  }
  
  reconnect(): void {
    this.addEvent('connection', 'Attempting to reconnect SignalR');
    this.signalrService.stopConnection()
      .then(() => this.signalrService.startConnection())
      .then(() => {
        this.addEvent('connection', 'Reconnection sequence completed');
      })
      .catch(err => {
        this.addEvent('connection', `Reconnection failed: ${err.message}`);
      });
  }
  
  testConnection(): void {
    this.addEvent('connection', 'Testing SignalR connection...');
    this.signalrService.testConnection()
      .then(response => {
        this.addEvent('connection', `Connection test succeeded: ${response}`);
      })
      .catch(err => {
        this.addEvent('connection', `Connection test failed: ${err.message || err}`);
      });
  }
} 