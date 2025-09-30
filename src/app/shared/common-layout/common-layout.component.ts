import { Component, inject } from '@angular/core';
import { UserService } from '../../services/User.service';

@Component({
  selector: 'app-common-layout',
  templateUrl: './common-layout.component.html',
})
export class CommonLayoutComponent {
  isSidebarExpanded = false;
  userService = inject(UserService);
  onSidebarMouseEnter() {
    this.isSidebarExpanded = true;
  }

  onSidebarMouseLeave() {
    this.isSidebarExpanded = false;
  }

  logout() {
    this.userService.logout();
  }
}
