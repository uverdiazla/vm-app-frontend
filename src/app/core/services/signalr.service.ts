import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { VirtualMachine } from '../../models/virtual-machine.model';
import * as signalR from '@microsoft/signalr';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection: signalR.HubConnection | null = null;
  private vmCreatedSubject = new BehaviorSubject<VirtualMachine | null>(null);
  private vmUpdatedSubject = new BehaviorSubject<VirtualMachine | null>(null);
  private vmDeletedSubject = new BehaviorSubject<number | null>(null);
  private connectionStatus = new BehaviorSubject<boolean>(false);

  // Public observables for components to subscribe to
  public vmCreated$: Observable<VirtualMachine | null> = this.vmCreatedSubject.asObservable();
  public vmUpdated$: Observable<VirtualMachine | null> = this.vmUpdatedSubject.asObservable();
  public vmDeleted$: Observable<number | null> = this.vmDeletedSubject.asObservable();
  public connected$: Observable<boolean> = this.connectionStatus.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService
  ) { }

  public startConnection(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Only create connection in browser, not in SSR
      if (isPlatformBrowser(this.platformId)) {
        // Get the access token from AuthService
        const token = this.authService.getToken();
        
        this.hubConnection = new signalR.HubConnectionBuilder()
          .withUrl(`${environment.apiUrl}/hubs/virtualmachines`, {
            accessTokenFactory: () => token || ''
          })
          .withAutomaticReconnect()
          .configureLogging(signalR.LogLevel.Error) // Only log errors
          .build();

        // Add connection state change listener
        this.hubConnection.onreconnecting(() => {
          this.connectionStatus.next(false);
        });

        this.hubConnection.onreconnected(() => {
          this.connectionStatus.next(true);
        });

        this.hubConnection.onclose(() => {
          this.connectionStatus.next(false);
        });

        this.hubConnection
          .start()
          .then(() => {
            this.connectionStatus.next(true);
            this.registerSignalEvents();
            // Join VM updates group
            this.hubConnection?.invoke('JoinVmUpdates')
              .then(() => {
                resolve();
              })
              .catch(err => {
                reject(err);
              });
          })
          .catch(err => {
            this.connectionStatus.next(false);
            reject(err);
          });
      } else {
        resolve(); // In SSR, just resolve without doing anything
      }
    });
  }

  public stopConnection(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.hubConnection) {
        // Leave updates group before disconnecting
        this.hubConnection.invoke('LeaveVmUpdates')
          .then(() => {
            // Then stop the connection
            this.hubConnection?.stop()
              .then(() => {
                this.hubConnection = null;
                this.connectionStatus.next(false);
                resolve();
              })
              .catch(err => {
                reject(err);
              });
          })
          .catch(err => {
            reject(err);
          });
      } else {
        resolve(); // No connection to stop
      }
    });
  }

  public getConnectionState(): string {
    if (!this.hubConnection) {
      return 'Not connected';
    }
    return signalR.HubConnectionState[this.hubConnection.state];
  }

  public testConnection(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!this.hubConnection) {
        reject('No active connection');
        return;
      }
      
      // First register a handler for the response
      this.hubConnection.on('TestConnectionResponse', (response: string) => {
        resolve(response);
        
        // Remove the handler after receiving the response
        this.hubConnection?.off('TestConnectionResponse');
      });
      
      // Then send the test request
      this.hubConnection.invoke('TestConnection')
        .catch(err => {
          reject(err);
          
          // Remove the handler if the request fails
          this.hubConnection?.off('TestConnectionResponse');
        });
    });
  }

  private registerSignalEvents(): void {
    if (this.hubConnection) {
      // Handle VM created event
      this.hubConnection.on('VmCreated', (vm: VirtualMachine) => {
        this.vmCreatedSubject.next(vm);
      });

      // Handle VM updated event
      this.hubConnection.on('VmUpdated', (vm: VirtualMachine) => {
        this.vmUpdatedSubject.next(vm);
      });

      // Handle VM deleted event
      this.hubConnection.on('VmDeleted', (vmId: number) => {
        this.vmDeletedSubject.next(vmId);
      });
    }
  }
} 