// Entidades do domínio do sistema WB (World Beauty)

export class CPF {
    private valor: string;
    
    constructor(valor: string) {
        this.valor = valor;
    }
    
    public get getValor(): string {
        return this.valor;
    }
}

export class RG {
    private valor: string;
    
    constructor(valor: string) {
        this.valor = valor;
    }
    
    public get getValor(): string {
        return this.valor;
    }
}

export class Telefone {
    private ddd: string;
    private numero: string;
    
    constructor(ddd: string, numero: string) {
        this.ddd = ddd;
        this.numero = numero;
    }

    public get getDdd(): string {
        return this.ddd;
    }

    public get getNumero(): string {
        return this.numero;
    }

    public get getCompleto(): string {
        return `(${this.ddd}) ${this.numero}`;
    }
}

export class Produto {
    public nome: string;
    public preco: number;
    
    constructor(nome: string, preco: number) {
        this.nome = nome;
        this.preco = preco;
    }
}

export class Servico {
    public nome: string;
    public preco: number;
    
    constructor(nome: string, preco: number) {
        this.nome = nome;
        this.preco = preco;
    }
}

export class Cliente {
    public nome: string;
    public nomeSocial: string;
    public genero: string;
    private cpf: CPF;
    private rgs: Array<RG>;
    private dataCadastro: Date;
    private telefones: Array<Telefone>;
    private produtosConsumidos: Array<Produto>;
    private servicosConsumidos: Array<Servico>;
    
    constructor(nome: string, nomeSocial: string, cpf: CPF, genero: string = "Não informado") {
        this.nome = nome;
        this.nomeSocial = nomeSocial;
        this.cpf = cpf;
        this.genero = genero;
        this.rgs = [];
        this.dataCadastro = new Date();
        this.telefones = [];
        this.produtosConsumidos = [];
        this.servicosConsumidos = [];
    }
    
    public get getCpf(): CPF {
        return this.cpf;
    }
    
    public get getRgs(): Array<RG> {
        return this.rgs;
    }
    
    public get getDataCadastro(): Date {
        return this.dataCadastro;
    }
    
    public get getTelefones(): Array<Telefone> {
        return this.telefones;
    }
    
    public get getProdutosConsumidos(): Array<Produto> {
        return this.produtosConsumidos;
    }
    
    public get getServicosConsumidos(): Array<Servico> {
        return this.servicosConsumidos;
    }
    
    public adicionarTelefone(telefone: Telefone): void {
        this.telefones.push(telefone);
    }
    
    public adicionarRG(rg: RG): void {
        this.rgs.push(rg);
    }
    
    public adicionarProdutoConsumido(produto: Produto): void {
        this.produtosConsumidos.push(produto);
    }
    
    public adicionarServicoConsumido(servico: Servico): void {
        this.servicosConsumidos.push(servico);
    }
    
    public getTotalConsumido(): number {
        return this.produtosConsumidos.length + this.servicosConsumidos.length;
    }
    
    public getValorTotalConsumido(): number {
        let total = 0;
        this.produtosConsumidos.forEach(produto => total += produto.preco);
        this.servicosConsumidos.forEach(servico => total += servico.preco);
        return total;
    }
}

export class Empresa {
    private clientes: Array<Cliente>;
    private produtos: Array<Produto>;
    private servicos: Array<Servico>;
    
    constructor() {
        this.clientes = [];
        this.produtos = [];
        this.servicos = [];
    }
    
    public get getClientes(): Array<Cliente> {
        return this.clientes;
    }
    
    public get getProdutos(): Array<Produto> {
        return this.produtos;
    }
    
    public get getServicos(): Array<Servico> {
        return this.servicos;
    }
    
    public adicionarCliente(cliente: Cliente): void {
        this.clientes.push(cliente);
    }
    
    public adicionarProduto(produto: Produto): void {
        this.produtos.push(produto);
    }
    
    public adicionarServico(servico: Servico): void {
        this.servicos.push(servico);
    }
    
    public removerCliente(index: number): void {
        if (index >= 0 && index < this.clientes.length) {
            this.clientes.splice(index, 1);
        }
    }
    
    public removerProduto(index: number): void {
        if (index >= 0 && index < this.produtos.length) {
            this.produtos.splice(index, 1);
        }
    }
    
    public removerServico(index: number): void {
        if (index >= 0 && index < this.servicos.length) {
            this.servicos.splice(index, 1);
        }
    }
}
