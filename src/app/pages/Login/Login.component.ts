import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { UserService } from '../../services/User.service';
import { UserRequest } from '../../models/User.interface';
import { ToastService } from '../../helpers/toast';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './Login.component.html',
  styleUrl: './Login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnDestroy {
  private $subject = new Subject<void>();

  toastService = inject(ToastService);
  userService = inject(UserService);
  email = '';
  password = '';
  lembrarSenha = false;

  login() {

    const request: UserRequest = {
      nome: this.email,
      email: this.email,
      senha: this.password,
      confirmar_senha: this.password
    }
    this.userService.login(request).pipe(
      takeUntil(this.$subject),
    ).subscribe({
      next: (response) => {
        this.toastService.success('Sucesso', 'Login realizado com sucesso!');
      },
      error: (err) => {
        console.log(err);
        this.toastService.error('Erro', 'Email ou senha inválidos');
      }
    });
  }

  ngOnDestroy(): void {
    this.$subject.next();
    this.$subject.complete();
  }

}
