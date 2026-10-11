// Formulário de cadastro: validação, tabela e armazenamento no navegador.
const formulario = document.getElementById("formulario-cadastro");
const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoCargo = document.getElementById("cargo");
const campoMensagem = document.getElementById("mensagem");
const caixaErro = document.getElementById("erro");
const caixaSucesso = document.getElementById("sucesso");
const listaCadastros = document.getElementById("lista-cadastros");
const contador = document.getElementById("contador");
const botaoLimparCadastros = document.getElementById("limpar-cadastros");

const CHAVE_ARMAZENAMENTO = "jardimDeIdeiasCadastros";

function lerCadastros() {
    try {
        const dados = JSON.parse(localStorage.getItem(CHAVE_ARMAZENAMENTO) || "[]");
        return Array.isArray(dados) ? dados : [];
    } catch (erro) {
        return [];
    }
}

let cadastros = lerCadastros();

function salvarCadastros() {
    try {
        localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(cadastros));
    } catch (erro) {
        mostrarErro("Não foi possível salvar neste navegador. Verifique as configurações de armazenamento.");
    }
}

function mostrarErro(texto) {
    caixaSucesso.hidden = true;
    caixaErro.textContent = texto;
    caixaErro.hidden = false;
}

function mostrarSucesso(texto) {
    caixaErro.hidden = true;
    caixaSucesso.textContent = texto;
    caixaSucesso.hidden = false;
}

function validarFormulario() {
    const nome = campoNome.value.trim();
    const email = campoEmail.value.trim();
    const mensagem = campoMensagem.value.trim();

    if (nome.length === 0) {
        mostrarErro("O campo nome não pode ficar vazio.");
        campoNome.focus();
        return false;
    }

    if (nome.length < 3) {
        mostrarErro("O nome deve ter pelo menos 3 caracteres.");
        campoNome.focus();
        return false;
    }

    if (email.length === 0) {
        mostrarErro("O campo e-mail não pode ficar vazio.");
        campoEmail.focus();
        return false;
    }

    // A validação nativa do input type=email verifica o formato básico.
    if (!campoEmail.validity.valid) {
        mostrarErro("Informe um e-mail válido, por exemplo: nome@email.com.");
        campoEmail.focus();
        return false;
    }

    if (campoCargo.value === "") {
        mostrarErro("Selecione um cargo.");
        campoCargo.focus();
        return false;
    }

    if (mensagem.length === 0) {
        mostrarErro("O campo mensagem não pode ficar vazio.");
        campoMensagem.focus();
        return false;
    }

    if (mensagem.length < 10) {
        mostrarErro("A mensagem deve ter pelo menos 10 caracteres.");
        campoMensagem.focus();
        return false;
    }

    return true;
}

function criarCelula(texto) {
    const celula = document.createElement("td");
    // textContent evita interpretar os dados digitados como HTML.
    celula.textContent = texto;
    return celula;
}

function renderizarCadastros() {
    listaCadastros.replaceChildren();

    contador.textContent = cadastros.length === 1
        ? "1 cadastro"
        : `${cadastros.length} cadastros`;

    if (cadastros.length === 0) {
        const linha = document.createElement("tr");
        const celula = document.createElement("td");
        celula.colSpan = 5;
        celula.className = "vazio";
        celula.textContent = "Ainda não há cadastros. Preencha o formulário para começar 🌱";
        linha.appendChild(celula);
        listaCadastros.appendChild(linha);
        return;
    }

    cadastros.forEach((cadastro) => {
        const linha = document.createElement("tr");
        linha.appendChild(criarCelula(cadastro.nome));
        linha.appendChild(criarCelula(cadastro.email));
        linha.appendChild(criarCelula(cadastro.cargo));
        linha.appendChild(criarCelula(cadastro.mensagem));

        const celulaAcao = document.createElement("td");
        const botaoRemover = document.createElement("button");
        botaoRemover.type = "button";
        botaoRemover.className = "botao-remover";
        botaoRemover.textContent = "Remover";
        botaoRemover.setAttribute("aria-label", `Remover cadastro de ${cadastro.nome}`);
        botaoRemover.addEventListener("click", () => {
            cadastros = cadastros.filter((item) => item.id !== cadastro.id);
            salvarCadastros();
            renderizarCadastros();
            mostrarSucesso("Cadastro removido.");
        });

        celulaAcao.appendChild(botaoRemover);
        linha.appendChild(celulaAcao);
        listaCadastros.appendChild(linha);
    });
}

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    caixaErro.hidden = true;
    caixaSucesso.hidden = true;

    if (!validarFormulario()) {
        return;
    }

    const novoCadastro = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        nome: campoNome.value.trim(),
        email: campoEmail.value.trim(),
        cargo: campoCargo.value,
        mensagem: campoMensagem.value.trim()
    };

    cadastros.push(novoCadastro);
    salvarCadastros();
    renderizarCadastros();
    formulario.reset();
    mostrarSucesso("Cadastro realizado com sucesso! 🌻");
    campoNome.focus();
});

formulario.addEventListener("reset", () => {
    caixaErro.hidden = true;
    caixaSucesso.hidden = true;
});

botaoLimparCadastros.addEventListener("click", () => {
    if (cadastros.length === 0) {
        mostrarErro("Não há cadastros para apagar.");
        return;
    }

    const confirmar = window.confirm("Tem certeza de que deseja apagar todos os cadastros salvos neste navegador?");
    if (!confirmar) {
        return;
    }

    cadastros = [];
    salvarCadastros();
    renderizarCadastros();
    mostrarSucesso("Todos os cadastros foram apagados.");
});

renderizarCadastros();
