import { Component } from '@angular/core';

@Component({
  selector: 'app-common-layout',
  templateUrl: './common-layout.component.html',
})
export class CommonLayoutComponent {
  isSidebarExpanded = false;

  onSidebarMouseEnter() {
    this.isSidebarExpanded = true;
  }

  onSidebarMouseLeave() {
    this.isSidebarExpanded = false;
  }
}
