import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '../../helpers/toast';

@Component({
  selector: 'app-my-regions',
  templateUrl: './MyRegions.component.html',
  styleUrl: './MyRegions.component.scss',
})
export class MyRegionsComponent {

  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  form = this.fb.group({
    descricao: [null, [Validators.required]],
    propriedade: [null, [Validators.required]],
    talhao: [null, [Validators.required]],
    arquivo: [null, [Validators.required]],
  });

  enviarShapefile() {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      this.toastService.error('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    console.log('Enviando shapefile...', this.form.value);
  }

  limparFormulario() {
    this.form.reset();
    this.form.markAsUntouched();
  }
}
