// CHECAGEM DE TEMA IMEDIATA (Para o Loader nascer certo)
const temaSalvo = localStorage.getItem('tema');
if (temaSalvo === 'escuro') {
    document.body.classList.add('escuro');
}

// LÓGICA DO LOADER (BLINDADA)
function esconderLoader() {
    const loader = document.getElementById('loader');
    if (loader && !loader.classList.contains('oculto')) {
        setTimeout(() => {
            loader.classList.add('oculto');
        }, 1500);
    }
}

// Tenta esconder quando o HTML básico carregar (mais rápido)
document.addEventListener('DOMContentLoaded', esconderLoader);
// Tenta esconder quando TUDO (imagens/iframes) carregar
window.addEventListener('load', esconderLoader);
// Fallback de Segurança: Se algo travar, força a retirada do loader em 4 segundos
setTimeout(esconderLoader, 4000);

// LÓGICA DO FUNDO INTERATIVO (Acompanha o Mouse)
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
        // Ignora cliques nos botões de tema e idioma para eles não tentarem fazer scroll
        if(this.id === 'botao-tema' || this.id === 'botao-lingua') return;

        const targetId = this.getAttribute('href');
        
        // Só tenta fazer scroll se o href começar com # e não for vazio
        if (targetId && targetId.startsWith('#') && targetId !== '#') {
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            const detalhesSection = document.getElementById('detalhes');

            if (targetElement) {
                // RESPONSIVIDADE:
                if (window.innerWidth <= 1050) {
                    // MOBILE: A página inteira (window) faz o scroll
                    const header = document.querySelector('header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    
                    // Calcula a posição real do elemento na página inteira
                    const posicaoElemento = targetElement.getBoundingClientRect().top + window.scrollY;
                    
                    window.scrollTo({
                        top: posicaoElemento - headerHeight - 15, // Desconta o cabeçalho
                        behavior: 'smooth'
                    });
                } else {
                    // DESKTOP: Apenas a área de detalhes faz o scroll
                    if (detalhesSection) {
                        detalhesSection.scrollTo({
                            top: targetElement.offsetTop - 20,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        }
    });
});

let ordemExpandido = -1000;
const botoesExpandir = document.querySelectorAll('.btn-expandir');

// Captura a seção correta
const secaoDetalhes = document.getElementById('detalhes'); 

botoesExpandir.forEach(botao => {
    botao.addEventListener('click', function() {
        const projeto = this.closest('.projeto');
        const icone = this.querySelector('i');
        const vaiExpandir = !projeto.classList.contains('expandido');

        // Animação de preparação
        projeto.style.opacity = '0.3';
        projeto.style.transform = 'scale(0.95)';

        // Troca de lugar
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

            // Traz o card de volta ao estado normal no novo lugar
            projeto.style.opacity = '1';
            projeto.style.transform = 'scale(1)';

            // Scroll preciso para o TOPO do projeto
            if (vaiExpandir) {
                // Pequeno timeout de 50ms para garantir que o navegador já renderizou o novo tamanho
                setTimeout(() => {
                    
                    if (window.innerWidth <= 1050) {
                        // MOBILE: O scroll pertence à janela inteira (window)
                        const headerHeight = document.querySelector('header').offsetHeight;
                        const posicaoProjeto = projeto.getBoundingClientRect().top + window.scrollY;
                        
                        window.scrollTo({
                            top: posicaoProjeto - headerHeight - 15,
                            behavior: 'smooth'
                        });
                    } else {
                        // DESKTOP: O scroll pertence à section#detalhes
                        secaoDetalhes.scrollTo({
                            top: projeto.offsetTop - 20, 
                            behavior: 'smooth' 
                        });
                    }
                }, 50); 
            }
        }, 150);
    });
});

// Lógica de Filtro de Tecnologias
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
                // Compara por token exato para evitar colisões como "react" x "reactnative"
                const techsDoProjeto = (p.getAttribute('data-tech') || "")
                    .split(/\s+/)
                    .filter(Boolean);

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

const botaoLingua = document.getElementById('botao-lingua');

// Define português como padrão se não houver nada salvo
let idiomaAtual = localStorage.getItem('idioma') || 'pt';

// Função que atualiza os textos na tela
function aplicarTraducao(idioma) {
    document.documentElement.lang = (idioma === 'pt') ? 'pt-br' : 'en';
    if (typeof translations === 'undefined') return;
    // Traduz o texto interno (data-i18n)
    const elementosTexto = document.querySelectorAll('[data-i18n]');
    elementosTexto.forEach(elemento => {
        const chave = elemento.getAttribute('data-i18n');
        if (translations[idioma][chave]) {
            elemento.innerHTML = translations[idioma][chave];
        }
    });

    // Traduz o atributo title (data-i18n-title)
    const elementosTitle = document.querySelectorAll('[data-i18n-title]');
    elementosTitle.forEach(elemento => {
        const chave = elemento.getAttribute('data-i18n-title');
        if (translations[idioma][chave]) {
            elemento.setAttribute('title', translations[idioma][chave]);
        }
    });
}

// Aplica a tradução logo que a página carrega
aplicarTraducao(idiomaAtual);

// Evento de clique no botão
botaoLingua.addEventListener('click', (e) => {
    e.preventDefault();
    // Alterna o idioma
    idiomaAtual = idiomaAtual === 'pt' ? 'en' : 'pt';
    // Salva a preferência do usuário
    localStorage.setItem('idioma', idiomaAtual);
    // Aplica a nova tradução
    aplicarTraducao(idiomaAtual);
});
