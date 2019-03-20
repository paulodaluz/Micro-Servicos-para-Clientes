import { Request, Response } from "express";
import { getManager, In } from "typeorm";
import { Clientes } from "../entity/Clientes";
import { } from "express-validator";
import { MensagemPadrao } from "../models/MensagemPadrao";
import { validacao } from "../models/Validacao";


export async function CriaCliente(request: Request, response: Response) {

    //Cria uma conexão com o banco
    const ClientesRepository = getManager().getRepository(Clientes);

    //Pega a função validacao e os erros que ela retorna e guarda na variavel erros
    var erros = new validacao().validaInformacoes(request);

    //Se tiver erros retorna eles para o usuário
    if (erros) {
        console.log("Erros de validação encontrados");
        response.status(400).json(erros);
        return;
    };

    //Criando uma entidade(tabela no banco) com o que foi recebido no boddy
    const dadosCliente = ClientesRepository.create(request.body);

    //Salva o cliente recebido
    await ClientesRepository.save(dadosCliente);

    //Retorna o cliente criado ao usuário
    response.send(dadosCliente);
    console.log("Loja criada com sucesso");

};


export async function EditaCliente(request: Request, response: Response) {

    //Cria uma conexão com o banco
    const ClientesRepository = getManager().getRepository(Clientes);

    //Pega a função validacao e os erros que ela retorna e guarda na variavel erros
    var erros = new validacao().validaInformacoes(request);

    //Se tiver erros retorna eles para o usuário
    if (erros) {
        console.log("Erros de validação encontrados");
        response.status(400).json(erros);
        return;
    };

    //Encontra o cliente e guarda ele na variavel dadosCliente
    const dadosCliente = await ClientesRepository.findOne(request.params.id);
    //Atualiza loja
    await ClientesRepository.update({ id: request.params.id }, request.body);

    //Se o cliente não for encontrado irá retornar o erro padrão ao usuário
    if (!dadosCliente) {
        response.status(404).json(new MensagemPadrao("404", "Não foi possivel editar o cliente, verifique os dados e tente novamente.").erroRetorno());
        response.end();
        return;
    }

    //Retorna o cliente atualizado para o usuário
    response.send(request.body);
    console.log("Cliente atualizado com sucesso");
};


