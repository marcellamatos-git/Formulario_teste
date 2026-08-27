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
          this.validarCPF
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

  /* 
    Função de validação customizada para CPF
    Retorna "null" se for válido, ou um objeto de erro "{ cpfInvalido: true }" se for inválido
  */
  validarCPF(control: AbstractControl): ValidationErrors | null {
    const cpf = control.value ? control.value.replace(/\D/g, '') : '';
    if (!cpf) return null;

    /* Verifica se tem 11 dígitos ou se são números repetidos (ex: 111.111.111-11) */
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return { cpfInvalido: true };
    }

    /* Cálculo do 1º dígito verificador do CPF */
    let soma = 0;
    let resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return { cpfInvalido: true };

    /* Cálculo do 2º dígito verificador do CPF */
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return { cpfInvalido: true };

    return null; /* CPF Válido */
  }

  /* 
    Função de validação customizada para Data de Nascimento
    Impede que o usuário selecione uma data no futuro
  */
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