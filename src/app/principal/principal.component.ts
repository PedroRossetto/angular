import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cliente } from '../modelo/Cliente';
import { ClienteService } from '../servico/cliente.service';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {

    // Objeto do tipo Cliente
    cliente = new Cliente();

    // Variavél para visibilidade dos botões
    btnCadastro:boolean = true;

    // Variavél para visibilidade da tabela
    tabela:boolean = true;

    //JSON DE clientes
    clientes:Cliente[] = [];

    // Construtor

    constructor(private servico:ClienteService) {

    }

    // Método de seleção
    selecionar():void {
        this.servico.selecionar()
        .subscribe(retorno => this.clientes = retorno);
    }

    // Método de cadastro
    cadastrar():void {
        this.servico.cadastrar(this.cliente)
        .subscribe(retorno => {

            // Cadastrar o cliente no vetor
            this.clientes.push(retorno);

            // Limpar formulário
            this.cliente = new Cliente();

            alert('Cliente cadastrado com sucesso!')
        });

    }

    // Método para selecionar um cliente especifico
    selecionarCliente(posicao:number):void{
        // Selecionar cliente no vetor
        this.cliente = this.clientes[posicao];

        // Visibilidade dos botoes
        this.btnCadastro = false;

        // Visibilidade da tabela
        this.tabela = false;
    }

    cancelar():void{
        // Cancelar tudo
        this.btnCadastro = true;
        this.tabela = true;
        this.cliente = new Cliente;
    }

    editar():void {
        this.servico.editar(this.cliente);
        alert('Cliente alterado')

        this.cancelar()
    }

    deletar():void {
        this.servico.remover(this.cliente.codigo)
        .subscribe(
            (obj) => {
                let posicao = this.clientes.findIndex(obj => {
                    return obj.codigo == this.cliente.codigo;
                });

                // Remover cliente do vetor
                alert(posicao)
                this.clientes.splice(posicao, 1);

                this.cancelar()

                alert('Cliente removido com sucesso!')
            },
            (error: HttpErrorResponse) => { // Definindo o tipo do parâmetro error como HttpErrorResponse
              console.error('Erro ao deletar cliente', error);
              // Trate o erro aqui, se necessário
            }
          );
    }

    // Método de inicialização
    ngOnInit(){
        this.selecionar();
    }
}
