export interface VirtualMachine {
  id?: number;
  name: string;
  cores: number;
  ram: number;
  disk: number;
  operatingSystem: {
    id: number;
    name: string;
    version: string;
  };
  status: {
    id: number;
    name: string;
    colorCode: string;
  };
  description?: string;
  hostname?: string;
  ipAddress?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVirtualMachineRequest {
  name: string;
  cores: number;
  ram: number;
  disk: number;
  operatingSystemId: number;
  statusId: number;
  description?: string;
  hostname?: string;
  ipAddress?: string;
}

export interface UpdateVirtualMachineRequest {
  name?: string;
  cores?: number;
  ram?: number;
  disk?: number;
  operatingSystemId?: number;
  statusId?: number;
  description?: string;
  hostname?: string;
  ipAddress?: string;
}

export enum OperatingSystem {
  WINDOWS_SERVER_2019 = 'Windows Server 2019',
  WINDOWS_SERVER_2022 = 'Windows Server 2022',
  UBUNTU_20_04 = 'Ubuntu 20.04 LTS',
  UBUNTU_22_04 = 'Ubuntu 22.04 LTS',
  CENTOS_7 = 'CentOS 7',
  DEBIAN_11 = 'Debian 11'
}

export enum VirtualMachineStatus {
  RUNNING = 'Running',
  STOPPED = 'Stopped',
  SUSPENDED = 'Suspended',
  FAILED = 'Failed',
  PROVISIONING = 'Provisioning',
  MAINTENANCE = 'Maintenance'
} 