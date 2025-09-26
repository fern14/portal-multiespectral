import { Component, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @ViewChild('profileMenu') profileMenu!: OverlayPanel;

  rangeDates: Date[] | undefined;
  userName: string = 'Jorge Luiz Maia';
  userRole: string = 'Admin';

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

  onProfileClick(event: Event) {
    this.profileMenu.toggle(event);
  }

  onProfileMenuClick() {
    console.log('Perfil clicked');
    this.profileMenu.hide();
    // Aqui você pode implementar a navegação para o perfil
  }

  onLogout() {
    console.log('Logout clicked');
    this.profileMenu.hide();
    // Aqui você pode implementar a lógica de logout
  }
}
