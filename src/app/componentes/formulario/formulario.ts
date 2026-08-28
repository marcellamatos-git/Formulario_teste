/* Importação dos módulos core do Angular */
import { Component, OnInit } from '@angular/core';

/* Importação das ferramentas necessárias para formulários reativos e validações */
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule, 
  AbstractControl, 
  ValidationErrors 
} from '@angular/forms';

@Component({
  selector: 'app-formulario',
  standalone: true,
  /* Importamos o ReactiveFormsModule para habilitar os recursos de formulário no HTML */
  imports: [ReactiveFormsModule],
  templateUrl: './formulario.html',
  styleUrl: './formulario.css'
})
export class FormularioComponent implements OnInit {
  /* Variável que armazenará o objeto do formulário reativo */
  meuFormulario!: FormGroup;

  /* Injeção de dependência do FormBuilder para criar os controles de forma mais simples */
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    /* Definição da estrutura do formulário com seus valores iniciais e regras de validação */
    this.meuFormulario = this.fb.group({
      /* Campo Nome: obrigatório e com no mínimo 10 caracteres */
      nome: ['', [Validators.required, Validators.minLength(10)]],
      
      /* Campo E-mail: obrigatório e com formato de e-mail válido */
      email: ['', [Validators.required, Validators.email]],
      
      /* Campo CPF: obrigatório, formato Regex e validação matemática customizada */
      cpf: [
        '', 
        [
          Validators.required, 
          Validators.pattern(/^\d{11}$|^(\d{3}\.){2}\d{3}-\d{2}$/), 
        
        ]
      ],
      
      /* Campo Telefone: obrigatório e deve ter 10 ou 11 dígitos numéricos */
      telefone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      
      /* Campo Data de Nascimento: obrigatório e não aceita datas futuras */
      dataNascimento: ['', [Validators.required, this.validarDataNascimento]]
    });
  }

  /* Getter facilitador para acessar os controles do formulário direto no HTML via "f['nome']" */
  get f() {
    return this.meuFormulario.controls;
  }

  validarDataNascimento(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const dataDigitada = new Date(control.value);
    const hoje = new Date();
    
    /* Se a data informada for maior que o dia de hoje, retorna erro */
    return dataDigitada > hoje ? { dataFutura: true } : null;
  }

  /* Função executada no evento (ngSubmit) ao enviar o formulário */
  onSubmit(): void {
    if (this.meuFormulario.valid) {
      console.log('Dados enviados:', this.meuFormulario.value);
      alert('Cadastro realizado com sucesso!');
      this.meuFormulario.reset(); /* Limpa os campos após o envio */
    } else {
      /* Se houver erros, marca todos os campos como tocados para exibir os avisos vermelhos */
      this.meuFormulario.markAllAsTouched();
    }
  }
}