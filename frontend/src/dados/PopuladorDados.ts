/**
 * POPULADOR DE DADOS DE TESTE
 * ===========================
 * Popula o sistema com dados fictícios para demonstração da Atividade II.
 * Para desabilitar os dados de teste, ajuste a chamada no método componentDidMount do componente Roteador
 */

import { Empresa, Cliente, Produto, Servico, CPF, RG, Telefone } from '../modelo';

export class PopuladorDados {
    
    public static popularDados(empresa: Empresa): void {
        console.log('Populando dados de teste...');
        
        // Popular clientes 
        this.popularClientes(empresa);
        
        // Popular produtos 
        this.popularProdutos(empresa);
        
        // Popular serviços 
        this.popularServicos(empresa);
        
        // Popular consumos aleatórios
        this.popularConsumos(empresa);
        
        console.log(`Dados de teste populados com sucesso!`);
        console.log(`${empresa.getClientes.length} clientes, ${empresa.getProdutos.length} produtos e ${empresa.getServicos.length} serviços cadastrados.`);
    }
    
    private static popularClientes(empresa: Empresa): void {
        // 30 clientes de teste 
        const clientesData = [
            { nome: "Ana Silva", nomeSocial: "Ana", genero: "F" },
            { nome: "João Santos", nomeSocial: "João", genero: "M" },
            { nome: "Maria Oliveira", nomeSocial: "Maria", genero: "F" },
            { nome: "Pedro Costa", nomeSocial: "Pedro", genero: "M" },
            { nome: "Carla Souza", nomeSocial: "Carla", genero: "F" },
            { nome: "Bruno Lima", nomeSocial: "Bruno", genero: "M" },
            { nome: "Fernanda Alves", nomeSocial: "Fernanda", genero: "F" },
            { nome: "Ricardo Pereira", nomeSocial: "Ricardo", genero: "M" },
            { nome: "Juliana Rocha", nomeSocial: "Juliana", genero: "F" },
            { nome: "Carlos Mendes", nomeSocial: "Carlos", genero: "M" },
            { nome: "Beatriz Ferreira", nomeSocial: "Beatriz", genero: "F" },
            { nome: "Lucas Barbosa", nomeSocial: "Lucas", genero: "M" },
            { nome: "Patricia Cardoso", nomeSocial: "Patricia", genero: "F" },
            { nome: "André Martins", nomeSocial: "André", genero: "M" },
            { nome: "Camila Rodrigues", nomeSocial: "Camila", genero: "F" },
            { nome: "Felipe Gomes", nomeSocial: "Felipe", genero: "M" },
            { nome: "Larissa Dias", nomeSocial: "Larissa", genero: "F" },
            { nome: "Rodrigo Nunes", nomeSocial: "Rodrigo", genero: "M" },
            { nome: "Aline Castro", nomeSocial: "Aline", genero: "F" },
            { nome: "Gabriel Ribeiro", nomeSocial: "Gabriel", genero: "M" },
            { nome: "Mariana Teixeira", nomeSocial: "Mariana", genero: "F" },
            { nome: "Thiago Moreira", nomeSocial: "Thiago", genero: "M" },
            { nome: "Renata Cavalcanti", nomeSocial: "Renata", genero: "F" },
            { nome: "Diego Araujo", nomeSocial: "Diego", genero: "M" },
            { nome: "Vanessa Correia", nomeSocial: "Vanessa", genero: "F" },
            { nome: "Marcos Vieira", nomeSocial: "Marcos", genero: "M" },
            { nome: "Simone Monteiro", nomeSocial: "Simone", genero: "F" },
            { nome: "Roberto Freitas", nomeSocial: "Roberto", genero: "M" },
            { nome: "Cristina Lopes", nomeSocial: "Cristina", genero: "F" },
            { nome: "Fabio Ramos", nomeSocial: "Fabio", genero: "M" }
        ];
        
        clientesData.forEach((data, index) => {
            // Criar CPF sequencial
            const cpfValue = `000.000.${index.toString().padStart(3, '0')}-00`;
            const cpf = new CPF(cpfValue);
            
            // Criar cliente
            const cliente = new Cliente(data.nome, data.nomeSocial, cpf, data.genero);
            
            // Adicionar telefone
            const ddd = (11 + (index % 20)).toString();
            const numero = `9${(1000 + index).toString()}${(1000 + index * 2).toString()}`;
            cliente.adicionarTelefone(new Telefone(ddd, numero));
            
            // Adicionar RG
            const rgValue = `${(10000000 + index * 123456).toString()}`;
            cliente.adicionarRG(new RG(rgValue));
            
            empresa.adicionarCliente(cliente);
        });
    }
    
    private static popularProdutos(empresa: Empresa): void {
        // 20 produtos de teste 
        const produtosData = [
            { nome: "Shampoo Hidratante", preco: 25.90 },
            { nome: "Condicionador Reparador", preco: 28.50 },
            { nome: "Máscara Capilar Nutritiva", preco: 35.00 },
            { nome: "Creme para Pentear", preco: 22.90 },
            { nome: "Óleo Capilar Argan", preco: 45.00 },
            { nome: "Spray Protetor Térmico", preco: 32.90 },
            { nome: "Mousse Modelador", preco: 24.90 },
            { nome: "Gel Fixador Forte", preco: 18.90 },
            { nome: "Cera Modeladora", preco: 27.90 },
            { nome: "Pomada Capilar", preco: 22.50 },
            { nome: "Esmalte Vermelho", preco: 12.90 },
            { nome: "Base Fortalecedora", preco: 15.90 },
            { nome: "Removedor Suave", preco: 8.90 },
            { nome: "Lixa para Unhas", preco: 5.90 },
            { nome: "Alicate de Cutícula", preco: 35.90 },
            { nome: "Creme Hidratante Facial", preco: 48.90 },
            { nome: "Protetor Solar FPS 60", preco: 52.90 },
            { nome: "Sabonete Facial Antiacne", preco: 19.90 },
            { nome: "Tônico Facial", preco: 29.90 },
            { nome: "Sérum Anti-idade", preco: 89.90 }
        ];
        
        produtosData.forEach(data => {
            empresa.adicionarProduto(new Produto(data.nome, data.preco));
        });
    }
    
    private static popularServicos(empresa: Empresa): void {
        // 20 serviços de teste 
        const servicosData = [
            { nome: "Corte Feminino", preco: 45.00 },
            { nome: "Corte Masculino", preco: 25.00 },
            { nome: "Escova Progressiva", preco: 120.00 },
            { nome: "Coloração Completa", preco: 80.00 },
            { nome: "Mechas", preco: 90.00 },
            { nome: "Hidratação Profunda", preco: 35.00 },
            { nome: "Penteado para Festa", preco: 60.00 },
            { nome: "Manicure", preco: 20.00 },
            { nome: "Pedicure", preco: 25.00 },
            { nome: "Unha Gel", preco: 40.00 },
            { nome: "Design de Sobrancelha", preco: 30.00 },
            { nome: "Depilação Facial", preco: 25.00 },
            { nome: "Limpeza de Pele", preco: 65.00 },
            { nome: "Peeling Facial", preco: 85.00 },
            { nome: "Massagem Relaxante", preco: 70.00 },
            { nome: "Drenagem Linfática", preco: 60.00 },
            { nome: "Tratamento Anti-celulite", preco: 80.00 },
            { nome: "Aplicação de Botox", preco: 350.00 },
            { nome: "Preenchimento Facial", preco: 450.00 },
            { nome: "Barba Completa", preco: 30.00 }
        ];
        
        servicosData.forEach(data => {
            empresa.adicionarServico(new Servico(data.nome, data.preco));
        });
    }
    
    private static popularConsumos(empresa: Empresa): void {
        const clientes = empresa.getClientes;
        const produtos = empresa.getProdutos;
        const servicos = empresa.getServicos;
        
        // Popular consumos aleatórios para simular dados reais
        clientes.forEach((cliente) => {
            const numConsumos = Math.floor(Math.random() * 9);
            
            for (let i = 0; i < numConsumos; i++) {
                if (Math.random() > 0.5 && produtos.length > 0) {
                    // Adicionar produto
                    const produtoIndex = Math.floor(Math.random() * produtos.length);
                    cliente.adicionarProdutoConsumido(produtos[produtoIndex]);
                } else if (servicos.length > 0) {
                    // Adicionar serviço
                    const servicoIndex = Math.floor(Math.random() * servicos.length);
                    cliente.adicionarServicoConsumido(servicos[servicoIndex]);
                }
            }        });
    }
}
