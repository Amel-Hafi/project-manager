import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    TranslateModule
  ],
  templateUrl: './app.component.html',
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    .sidenav-container {
      flex: 1;
    }
    .sidenav {
      width: 240px;
    }
    .content {
      padding: 0;
    }
    .active-link {
      background-color: rgba(0, 0, 0, 0.04);
    }
    mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }
  `]
})
export class AppComponent {
  private translate = inject(TranslateService);
  authService = inject(AuthService);
  private router = inject(Router);

  navItems = [
    { path: '/dashboard', labelKey: 'nav.dashboard', icon: 'dashboard', roles: [] as string[] },
    { path: '/referential', labelKey: 'nav.referential', icon: 'category', roles: [] as string[] },
    { path: '/clients', labelKey: 'nav.clients', icon: 'business', roles: [] as string[] },
    { path: '/projects', labelKey: 'nav.projects', icon: 'folder', roles: [] as string[] },
    { path: '/applications', labelKey: 'nav.applications', icon: 'apps', roles: [] as string[] },
    { path: '/users', labelKey: 'nav.users', icon: 'people', roles: ['ADMIN'] },
    { path: '/decision-rules', labelKey: 'nav.decision_rules', icon: 'gavel', roles: ['ADMIN'] },
    { path: '/kpi-templates', labelKey: 'nav.kpi_templates', icon: 'description', roles: [] as string[] }
  ];

  constructor() {
    this.translate.use('es');
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get currentUserName(): string {
    const user = this.authService.getCurrentUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  isNavItemVisible(item: { roles: string[] }): boolean {
    if (!item.roles || item.roles.length === 0) return true;
    return this.authService.hasAnyRole(item.roles);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
