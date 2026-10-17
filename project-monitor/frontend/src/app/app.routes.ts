import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
    { path: 'login', loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent) },
    { path: '', redirectTo: 'referential', pathMatch: 'full' },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard]
    },
    {
        path: 'referential',
        loadComponent: () => import('./features/referential/referential.component').then(m => m.ReferentialComponent),
        canActivate: [authGuard]
    },
    {
        path: 'clients',
        loadComponent: () => import('./features/clients/client-list.component').then(m => m.ClientListComponent),
        canActivate: [authGuard]
    },
    {
        path: 'clients/:id',
        loadComponent: () => import('./features/clients/client-detail.component').then(m => m.ClientDetailComponent),
        canActivate: [authGuard]
    },
    {
        path: 'projects',
        loadComponent: () => import('./features/projects/project-list.component').then(m => m.ProjectListComponent),
        canActivate: [authGuard]
    },
    {
        path: 'projects/:id',
        loadComponent: () => import('./features/projects/project-detail.component').then(m => m.ProjectDetailComponent),
        canActivate: [authGuard]
    },
    {
        path: 'applications',
        loadComponent: () => import('./features/applications/application-list.component').then(m => m.ApplicationListComponent),
        canActivate: [authGuard]
    },
    {
        path: 'applications/:id',
        loadComponent: () => import('./features/applications/application-detail.component').then(m => m.ApplicationDetailComponent),
        canActivate: [authGuard]
    },
    {
        path: 'users',
        loadComponent: () => import('./features/users/user-list.component').then(m => m.UserListComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN'] }
    },
    {
        path: 'decision-rules',
        loadComponent: () => import('./features/decision-rules/decision-rule-list.component').then(m => m.DecisionRuleListComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN'] }
    },
    {
        path: 'kpi-templates',
        loadComponent: () => import('./features/kpi-templates/kpi-template-list.component').then(m => m.KpiTemplateListComponent),
        canActivate: [authGuard]
    }
];
