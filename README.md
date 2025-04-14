# Virtual Machine Management Frontend

This Angular application provides a comprehensive interface for managing virtual machines. It allows users to view, create, edit, and delete virtual machines based on their assigned roles.

## Architecture

The application is built with Angular and follows a modular architecture with these key components:

### Core Components

- **Authentication**: Handles user login, session management, and role-based permissions
- **Virtual Machine Management**: CRUD operations for virtual machines
- **Internationalization**: Full support for multiple languages (currently English and Spanish)

### Technical Stack

- **Framework**: Angular 16+
- **UI Components**: Angular Material
- **State Management**: Angular services with RxJS
- **Internationalization**: ngx-translate
- **HTTP Communication**: Angular HttpClient with interceptors for authentication

### Project Structure

```
src/
├── app/
│   ├── core/                # Core functionality
│   │   ├── guards/          # Route guards (Auth, Admin)
│   │   ├── interceptors/    # HTTP interceptors
│   │   └── services/        # Core services
│   ├── models/              # Data models/interfaces
│   ├── modules/             # Feature modules
│   │   ├── auth/            # Authentication 
│   │   └── virtual-machines/# VM management
│   └── shared/              # Shared components/modules
├── assets/
│   └── i18n/                # Translation files
└── environments/            # Environment configurations
```

## Features

- **Authentication**
  - Login/logout functionality
  - Role-based access control (Admin vs. Regular user)
  - Secure JWT token storage

- **Virtual Machine Management**
  - List view with filtering and sorting
  - Detailed view of individual VMs
  - Create new VMs (Admin only)
  - Edit existing VMs (Admin only)
  - Delete VMs (Admin only)

- **User Experience**
  - Responsive design for various screen sizes
  - Intuitive navigation
  - Loading indicators for async operations
  - User-friendly error messages
  - Confirmation dialogs for destructive actions

- **Internationalization**
  - Full support for English and Spanish
  - Easy extension to other languages
  - Runtime language switching

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/vm-app-frontend.git
   cd vm-app-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment:
   - Update `src/environments/environment.ts` with your API endpoint:
     ```typescript
     export const environment = {
       production: false,
       apiUrl: 'http://localhost:3000'
     };
     ```

4. Run the development server:
   ```
   npm start
   ```

5. Navigate to `http://localhost:4200`. The app will automatically reload if you change any source files.

## Building for Production

Run `npm run build` to build the project for production. The build artifacts will be stored in the `dist/` directory.

## API Integration

The frontend communicates with a REST API that provides the following endpoints:

- `POST /login` - Authentication
- `GET /vms` - List all virtual machines
- `GET /vms/{id}` - Get details of a specific VM
- `POST /vms` - Create a new VM (Admin only)
- `PUT /vms/{id}` - Update an existing VM (Admin only)
- `DELETE /vms/{id}` - Delete a VM (Admin only)

## Role-Based Access

- **Admin Users**: Full access to all features, including creating, editing, and deleting VMs
- **Regular Users**: View-only access to VMs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
