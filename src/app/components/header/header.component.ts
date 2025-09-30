import { Component, ViewChild, inject, OnInit } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { MenuItem } from 'primeng/api';
import { UserService } from '../../services/User.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @ViewChild('profileMenu') profileMenu!: OverlayPanel;

  userService = inject(UserService);
  rangeDates: Date[] | undefined;
  userName: string = '';
  userRole: string = '';

  menuItems: MenuItem[] = [
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      command: () => {
        this.onProfileMenuClick();
      }
    },
    {
      separator: true
    },
    {
      label: 'Sair',
      icon: 'pi pi-sign-out',
      command: () => {
        this.onLogout();
      }
    }
  ];

  constructor() {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    this.rangeDates = [today, tomorrow];
  }

  ngOnInit(): void {
    this.userService.$user.subscribe((user) => {
      if (user) {
        this.userName = user.nome || '';
        this.userRole = user.role || '';
      } else {
        this.userName = '';
        this.userRole = '';
      }
    });
  }

  onProfileClick(event: Event) {
    this.profileMenu.toggle(event);
  }

  onProfileMenuClick() {
    this.profileMenu.hide();
  }

  onLogout() {
    this.profileMenu.hide();
    this.userService.logout();
  }
}
