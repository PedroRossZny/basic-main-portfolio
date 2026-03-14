const botao = document.getElementById('botao-tema');
const body = document.body;

// Persistência do tema
const temasalvo = localStorage.getItem('tema');
temaEscuro(temasalvo === 'escuro');

// Função para alternar entre tema claro e escuro
function temaEscuro(tipo) {
    if (tipo == true) {
        body.classList.add('escuro');
        botao.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        body.classList.remove('escuro');
        botao.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
}

botao.addEventListener('click', (e) => {
    e.preventDefault();
    const isescuro = body.classList.toggle('escuro');
    temaEscuro(isescuro);
    localStorage.setItem('tema', isescuro ? 'escuro' : 'claro');
});

// Scroll suave para links de navegação
const navLinks = document.querySelectorAll('#menu ul a.link');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Ignora o botão de tema para o scroll
        if(this.id === 'botao-tema') return; 

        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        // Como o scroll agora acontece DENTRO da section#detalhes, precisamos focar lá
        const detalhesSection = document.getElementById('detalhes');
        const targetElement = document.querySelector(targetId);

        if (targetElement && detalhesSection) {
            detalhesSection.scrollTo({
                top: targetElement.offsetTop - 20,
                behavior: 'smooth'
            });
        }
    });
});

// Substitua a Lógica de Expansão dos Projetos por esta:

const botoesExpandir = document.querySelectorAll('.btn-expandir');

botoesExpandir.forEach(botao => {
    botao.addEventListener('click', function() {
        const projeto = this.closest('.projeto');
        const icone = this.querySelector('i');
        
        // Alterna a classe 'expandido' no card do projeto
        const isExpandido = projeto.classList.toggle('expandido');

        // Alterna o ícone entre expandir e diminuir
        if (isExpandido) {
            icone.classList.remove('fa-expand');
            icone.classList.add('fa-compress'); // Ícone de encolher/diminuir
            
            // Opcional: faz o card rolar suavemente para a visualização caso a tela seja pequena
            setTimeout(() => {
                projeto.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        } else {
            icone.classList.remove('fa-compress');
            icone.classList.add('fa-expand'); // Ícone de expandir
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SORTEADOR
    const btnSortear = document.getElementById('btn-sortear');
    if (btnSortear) {
        btnSortear.addEventListener('click', () => {
            let numeros = Array.from({length: 5}, () => Math.floor(Math.random() * 10) + 1);
            let somaPares = numeros.filter(n => n % 2 === 0).reduce((a, b) => a + b, 0);
            document.getElementById('res-sorteio').innerHTML = 
                `Sorteados: [${numeros.join(', ')}]<br>Soma Pares: <span class="destaque-resultado">${somaPares}</span>`;
        });
    }

    // 2. GESTÃO DE JOGADORES
    const btnJog = document.getElementById('btn-jogadores');
    if (btnJog) {
        btnJog.addEventListener('click', () => {
            const nome = document.getElementById('jog-nome').value || 'Atleta';
            const golsRaw = document.getElementById('jog-gols').value;
            const gols = golsRaw ? golsRaw.split(',').map(n => parseInt(n.trim()) || 0) : [];
            const total = gols.reduce((a, b) => a + b, 0);
            document.getElementById('res-jogadores').innerHTML = 
                `Jogador <strong>${nome}</strong> fez <span class="destaque-resultado">${total} gols</span> em ${gols.length} jogos.`;
        });
    }

    // 3. PAR OU ÍMPPAR
    const btnPoi = document.getElementById('btn-poi');
    if (btnPoi) {
        btnPoi.addEventListener('click', () => {
            const escolha = document.getElementById('poi-escolha').value;
            const numUser = parseInt(document.getElementById('poi-num').value) || 0;
            const numComp = Math.floor(Math.random() * 11);
            const soma = numUser + numComp;
            const isPar = soma % 2 === 0;
            const venceu = (escolha === 'P' && isPar) || (escolha === 'I' && !isPar);
            document.getElementById('res-poi').innerHTML = 
                `PC: ${numComp} | Total: ${soma} (${isPar ? 'Par' : 'Ímpar'})<br>
                <strong style="color: ${venceu ? '#10b981' : '#ef4444'}">${venceu ? 'VENCEU!' : 'PERDEU!'}</strong>`;
        });
    }

    // 4. ATM
    const btnAtm = document.getElementById('btn-atm');
    if (btnAtm) {
        btnAtm.addEventListener('click', () => {
            let valor = parseInt(document.getElementById('atm-valor').value) || 0;
            let output = "";
            [50, 20, 10, 1].forEach(nota => {
                let qtd = Math.floor(valor / nota);
                if (qtd > 0) output += `${qtd}x R$${nota}<br>`;
                valor %= nota;
            });
            document.getElementById('res-atm').innerHTML = output || "Insira um valor.";
        });
    }

    // 5. MULTAS
    const btnMulta = document.getElementById('btn-multa');
    if (btnMulta) {
        btnMulta.addEventListener('click', () => {
            const v = parseFloat(document.getElementById('multa-vel').value) || 0;
            const res = document.getElementById('res-multa');
            if (v > 80) {
                res.innerHTML = `<span style="color: #ef4444">MULTADO!</span> Valor: R$${((v - 80) * 7).toFixed(2)}`;
            } else {
                res.innerHTML = `<span style="color: #10b981">VELOCIDADE OK</span>`;
            }
        });
    }

    // 6. ADIVINHAÇÃO
    const btnAdv = document.getElementById('btn-adv');
    if (btnAdv) {
        btnAdv.addEventListener('click', () => {
            const palpite = parseInt(document.getElementById('adv-num').value);
            const segredo = Math.floor(Math.random() * 6);
            const res = document.getElementById('res-adv');
            res.innerHTML = (palpite === segredo) 
                ? `<span style="color: #10b981">ACERTOU! Era ${segredo}.</span>`
                : `<span style="color: #ef4444">ERROU! Era ${segredo}.</span>`;
        });
    }
});