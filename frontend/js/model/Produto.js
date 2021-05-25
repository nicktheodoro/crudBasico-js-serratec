class Produto {
    constructor(obj){
        obj = obj || {};
        this.id = obj.id;
        this.nome = obj.nome;
        this.valor = obj.valor;
        this.quantidadeEstoque = obj.quantidadeEstoque;
    }

    modeloValidoParaCadastro(){
        return !!(this.nome && this.quantidadeEstoque && this.valor);
    }
}
