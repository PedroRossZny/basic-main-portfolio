// 1. CHECAGEM DE TEMA IMEDIATA (Para o Loader nascer certo)
// Certifique-se de que a lógica do seu botão de tema salva no localStorage algo como localStorage.setItem('tema', 'escuro')
const temaSalvo = localStorage.getItem('tema');
if (temaSalvo === 'escuro') {
    document.body.classList.add('escuro');
}

// 2. LÓGICA DO LOADER (Esconde após a página carregar)
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    
    // Um timeout de 1.5s só para dar tempo do usuário apreciar a animação do seu rosto
    setTimeout(() => {
        loader.classList.add('oculto');
    }, 1500); 
});

// 3. LÓGICA DO FUNDO INTERATIVO (Acompanha o Mouse)
const fundoInterativo = document.getElementById('fundo-interativo');

window.addEventListener('mousemove', (e) => {
    // Pega as coordenadas X e Y do mouse na tela
    const x = e.clientX;
    const y = e.clientY;

    // Atualiza as variáveis CSS em tempo real
    fundoInterativo.style.setProperty('--mouse-x', `${x}px`);
    fundoInterativo.style.setProperty('--mouse-y', `${y}px`);
});

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
        if(this.id === 'botao-tema') return; 
        e.preventDefault();

        const targetId = this.getAttribute('href');
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

let ordemExpandido = -1000;
const botoesExpandir = document.querySelectorAll('.btn-expandir');

// Captura a seção correta que tem a barra de rolagem no seu layout
const secaoDetalhes = document.getElementById('detalhes'); 

botoesExpandir.forEach(botao => {
    botao.addEventListener('click', function() {
        const projeto = this.closest('.projeto');
        const icone = this.querySelector('i');
        const vaiExpandir = !projeto.classList.contains('expandido');

        // 1. Animação de "preparação" (o card dá uma leve encolhida e fica transparente antes de se mover)
        projeto.style.opacity = '0.3';
        projeto.style.transform = 'scale(0.95)';

        // Esperamos 150 milissegundos para realizar a troca de lugar "escondida"
        setTimeout(() => {
            if (vaiExpandir) {
                projeto.classList.add('expandido');
                icone.classList.replace('fa-expand', 'fa-compress');
                projeto.style.order = ordemExpandido;
                ordemExpandido++;
            } else {
                projeto.classList.remove('expandido');
                icone.classList.replace('fa-compress', 'fa-expand');
                projeto.style.order = '';
            }

            // 2. Traz o card de volta ao estado normal no novo lugar
            projeto.style.opacity = '1';
            projeto.style.transform = 'scale(1)';

            // 3. Scroll preciso para o TOPO do projeto
            if (vaiExpandir) {
                // Outro pequeno timeout de 50ms para garantir que o navegador já renderizou o novo tamanho do CSS
                setTimeout(() => {
                    
                    if (window.innerWidth <= 1050) {
                        // Comportamento Mobile: O scroll pertence à janela inteira (window)
                        const headerHeight = document.querySelector('header').offsetHeight; // Pega a altura do seu cabeçalho fixo
                        const posicaoProjeto = projeto.getBoundingClientRect().top + window.scrollY;
                        
                        window.scrollTo({
                            top: posicaoProjeto - headerHeight - 15, // Desconta o header para não cobrir o título
                            behavior: 'smooth'
                        });
                    } else {
                        // Comportamento Desktop: O scroll pertence à section#detalhes
                        secaoDetalhes.scrollTo({
                            top: projeto.offsetTop - 20, 
                            behavior: 'smooth' 
                        });
                    }
                }, 50); 
            }
        }, 150); // Esse é o tempo da transição de opacidade/escala
    });
});

// --- Lógica de Filtro de Tecnologias ---
const techBtns = document.querySelectorAll('.tech-btn');
const projetos = document.querySelectorAll('.projeto');
const filtroAtivo = document.getElementById('filtro-ativo');
const secaoProjetos = document.getElementById('projetos');
const btnLimpar = document.getElementById('limpar-filtro');


// Função centralizada para limpar filtros
function limparFiltros() {
    techBtns.forEach(b => b.classList.remove('ativo'));
    projetos.forEach(p => p.classList.remove('oculto'));
    if (filtroAtivo) {
        filtroAtivo.textContent = "";
    }
    if (btnLimpar) {
        btnLimpar.style.display = "none";
    }
}


// Evento do botão limpar
if (btnLimpar) {
    btnLimpar.addEventListener('click', limparFiltros);
}

// Evento dos botões de tecnologia
techBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();

        const filtro = this.getAttribute('data-filter');
        const jaEstaAtivo = this.classList.contains('ativo');

        // Se clicou novamente no mesmo botão → limpar filtro
        if (jaEstaAtivo) {
            limparFiltros();
        } 
        // Aplicar filtro
        else {
            techBtns.forEach(b => b.classList.remove('ativo'));
            this.classList.add('ativo');
            projetos.forEach(p => {

                const techsDoProjeto = p.getAttribute('data-tech') || "";

                if (techsDoProjeto.includes(filtro)) {
                    p.classList.remove('oculto');
                } else {
                    p.classList.add('oculto');
                }
            });
            if (filtroAtivo) {
                filtroAtivo.textContent = "— " + this.textContent.trim();
            }
            if (btnLimpar) {
                btnLimpar.style.display = "inline-block";
            }
            // Scroll automático até projetos
            if (secaoProjetos) {
                secaoProjetos.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        }
    });
});