import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info'
}

export interface ToastConfig {
  type: ToastType;
  title: string;
  message: string;
  sticky?: boolean;
  life?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private messageService = inject(MessageService);

  /**
   * Exibe um toast com configuração personalizada
   */
  show(config: ToastConfig): void {
    this.messageService.add({
      severity: config.type,
      summary: config.title,
      detail: config.message,
      sticky: config.sticky ?? false,
      life: config.life ?? 3000
    });
  }

  /**
   * Exibe um toast de sucesso
   */
  success(title: string, message: string, sticky: boolean = false): void {
    this.show({
      type: ToastType.SUCCESS,
      title,
      message,
      sticky
    });
  }

  /**
   * Exibe um toast de erro
   */
  error(title: string, message: string, sticky: boolean = true): void {
    this.show({
      type: ToastType.ERROR,
      title,
      message,
      sticky
    });
  }

  /**
   * Exibe um toast de aviso
   */
  warn(title: string, message: string, sticky: boolean = false): void {
    this.show({
      type: ToastType.WARN,
      title,
      message,
      sticky
    });
  }

  /**
   * Exibe um toast de informação
   */
  info(title: string, message: string, sticky: boolean = false): void {
    this.show({
      type: ToastType.INFO,
      title,
      message,
      sticky
    });
  }

  /**
   * Limpa todos os toasts
   */
  clear(): void {
    this.messageService.clear();
  }

  /**
   * Limpa toasts por chave
   */
  clearByKey(key: string): void {
    this.messageService.clear(key);
  }
}
