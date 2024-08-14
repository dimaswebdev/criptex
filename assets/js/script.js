document.addEventListener('DOMContentLoaded', () => {
    const botoes = document.querySelectorAll('.botao-concentrico');
    const areaDeTexto = document.querySelector('textarea');
    const contadorCaracteres = document.getElementById('contador-caracteres');
    const alturaMaxima = 300;
    const maximoCaracteres = 1000; // Número máximo de caracteres
    const margemDeSeguranca = 20; // Margem de segurança em pixels
    const alturaDaLinha = 1.0; // Espaçamento entre as linhas (ajuste conforme necessário)
    let areaDeTextoVazia = true;
    const tamanhoFonteOriginal = 32; // Tamanho de fonte original do textarea
    const tamanhoFonteMinima = 26; // Tamanho mínimo de fonte para leitura confortável
    const placeholderOriginal = "Digite seu texto aqui..."; // Placeholder original do textarea

    function definirEstadoDoBotao(botao, ativo) {
        if (botao.id === 'btn-02') {
            const circuloInterno = botao.querySelector('.circulo-interno');
            if (circuloInterno) {
                circuloInterno.style.animation = ativo ? `pulse-btn-02-clicado 3s infinite` : `pulse-btn-02 3s infinite`;
            }
        } else {
            const circuloInterno = botao.querySelector('.circulo-interno');
            if (circuloInterno) {
                circuloInterno.style.animation = ativo ? `pulse-${botao.id} 3s infinite` : 'none';
            }
        }
        botao.classList.toggle('active', ativo);
    }

    function redefinirBotoes(botaoClicado = null) {
        botoes.forEach(botao => {
            if (botao !== botaoClicado && botao.id !== 'btn-01') {
                definirEstadoDoBotao(botao, false);
            }
        });
        if (areaDeTexto && !areaDeTexto.contains(botaoClicado)) {
            areaDeTexto.classList.remove('active');
        }
    }

    function desativarBotoesNaoPrimarios() {
        botoes.forEach(botao => {
            if (botao.id !== 'btn-01' && botao.id !== 'btn-02') {
                definirEstadoDoBotao(botao, false);
            }
        });
    }

    function mostrarMensagemPlaceholder(mensagem) {
        areaDeTexto.placeholder = mensagem;
        setTimeout(() => {
            if (areaDeTextoVazia) {
                areaDeTexto.placeholder = placeholderOriginal;
            }
        }, 2000);
    }

    function removerAcentosECaracteresEspeciais(texto) {
        return texto
            .normalize("NFD") // Normaliza o texto em forma de decomposição Unicode (NFD)
            .replace(/[\u0300-\u036f]/g, "") // Remove os diacríticos (acentos)
            .replace(/[^a-z\s.,;:?!""()\[\]—…]/g, ""); // Remove caracteres não permitidos, exceto letras minúsculas, espaços e sinais de pontuação
    }

    function validarTexto(texto) {
        return texto.replace(/[^a-z\s.,;:?!""()\[\]—…]/g, ""); // Permite letras minúsculas, espaços e sinais de pontuação
    }

    function criptografarSimples(texto) {
        const regras = {
            'e': 'enter',
            'i': 'imes',
            'a': 'ai',
            'o': 'ober',
            'u': 'ufat'
        };
        return texto.replace(/[eioua]/g, match => regras[match]);
    }

    function descriptografarSimples(texto) {
        const regras = {
            'enter': 'e',
            'imes': 'i',
            'ai': 'a',
            'ober': 'o',
            'ufat': 'u'
        };
        return texto.replace(/enter|imes|ai|ober|ufat/g, match => regras[match]);
    }

    function ajustarTamanhoAreaDeTexto() {
        let tamanhoFonteAtual = parseFloat(window.getComputedStyle(areaDeTexto).fontSize);
        if (isNaN(tamanhoFonteAtual)) tamanhoFonteAtual = tamanhoFonteOriginal;
        areaDeTexto.maxLength = maximoCaracteres;
        areaDeTexto.style.transition = 'font-size 0.1s ease, height 0.1s ease'; // Transição suave
        areaDeTexto.style.lineHeight = alturaDaLinha; // Adiciona o espaçamento entre as linhas

        const ajustarTamanho = () => {
            if (areaDeTexto.value.length > maximoCaracteres) {
                areaDeTexto.value = areaDeTexto.value.slice(0, maximoCaracteres);
            }

            areaDeTexto.style.height = 'auto';
            areaDeTexto.style.height = `${Math.min(areaDeTexto.scrollHeight, alturaMaxima)}px`;

            while (areaDeTexto.scrollHeight > alturaMaxima - margemDeSeguranca && tamanhoFonteAtual > tamanhoFonteMinima) {
                tamanhoFonteAtual -= 0.2;
                areaDeTexto.style.fontSize = `${tamanhoFonteAtual}px`;
                areaDeTexto.style.height = 'auto';
                areaDeTexto.style.height = `${Math.min(areaDeTexto.scrollHeight, alturaMaxima)}px`;
            }

            atualizarContadorCaracteres();
        };

        areaDeTexto.addEventListener('input', () => {
            areaDeTextoVazia = areaDeTexto.value.length === 0;
            requestAnimationFrame(ajustarTamanho);
        });

        areaDeTexto.addEventListener('paste', () => {
            setTimeout(() => {
                areaDeTextoVazia = areaDeTexto.value.length === 0;
                ajustarTamanho();
            }, 0);
        });

        ajustarTamanho();
    }

    function dividirTexto(texto, maximoCaracteres) {
        const partes = [];
        let parteAtual = "";

        texto.split(' ').forEach(palavra => {
            if (parteAtual.length + palavra.length + 1 <= maximoCaracteres) {
                parteAtual += (parteAtual.length ? ' ' : '') + palavra;
            } else {
                partes.push(parteAtual);
                parteAtual = palavra;
            }
        });

        if (parteAtual.length) {
            partes.push(parteAtual);
        }

        return partes;
    }

    function criptografarTexto(texto) {
        const partes = dividirTexto(texto, maximoCaracteres / 2); // Dividir o texto em partes menores
        let textoCriptografado = "";

        partes.forEach(parte => {
            textoCriptografado += criptografarSimples(removerAcentosECaracteresEspeciais(validarTexto(parte.toLowerCase()))) + " ";
        });

        return textoCriptografado.trim();
    }

    function ativarBotao1() {
        const btn1 = document.getElementById('btn-01');
        definirEstadoDoBotao(btn1, true);
        areaDeTexto.focus();

        if (areaDeTexto.value.trim() === '') {
            areaDeTexto.placeholder = "";
        } else {
            areaDeTexto.placeholder = "";
        }
    }

    function desativarBotao1() {
        const btn1 = document.getElementById('btn-01');
        definirEstadoDoBotao(btn1, false);
    }

    function atualizarContadorCaracteres() {
        const caracteres = areaDeTexto.value.length;
        contadorCaracteres.textContent = `${caracteres} / ${maximoCaracteres}`;
        contadorCaracteres.style.display = caracteres > 0 ? 'block' : 'none';
    }

    botoes.forEach((botao) => {
        botao.addEventListener('click', (event) => {
            if (botao.id !== 'btn-02' && botao.id !== 'btn-05') {
                event.preventDefault();
            }
            if (botao.id !== 'btn-07') {
                redefinirBotoes(botao);
            }
            definirEstadoDoBotao(botao, true);

            if (botao.id === 'btn-01') {
                ativarBotao1();
            }

            botoes.forEach(btn => {
                if (btn !== botao && btn.id !== 'btn-02') {
                    definirEstadoDoBotao(btn, false);
                }
            });

            switch (botao.id) {
                case 'btn-01':
                    console.log('Botão 01 clicado - Ação personalizada aqui');
                    break;
                case 'btn-03': // Botão Criptografar
                    console.log('Criptografar clicado');
                    if (areaDeTexto.value.length === 0) {
                        mostrarMensagemPlaceholder("Nenhum texto localizado...");
                    } else {
                        areaDeTexto.value = criptografarTexto(areaDeTexto.value);
                        areaDeTextoVazia = false;
                        ativarBotao1();
                        ajustarTamanhoAreaDeTexto();
                    }
                    break;
                case 'btn-04': // Botão Descriptografar
                    console.log('Descriptografar clicado');
                    if (areaDeTexto.value.length === 0) {
                        mostrarMensagemPlaceholder("Nenhum texto localizado...");
                    } else {
                        areaDeTexto.value = descriptografarSimples(areaDeTexto.value);
                        areaDeTextoVazia = false;
                        ativarBotao1();
                        ajustarTamanhoAreaDeTexto();
                    }
                    break;
                case 'btn-05':
                    console.log('Copiar clicado');
                    if (areaDeTexto.value.length === 0) {
                        mostrarMensagemPlaceholder("Nenhum texto localizado...");
                    } else {
                        areaDeTexto.select();
                        document.execCommand('copy');
                    }
                    break;
                case 'btn-06':
                    console.log('Colar clicado');
                    navigator.clipboard.readText().then(text => {
                        areaDeTexto.value = removerAcentosECaracteresEspeciais(validarTexto(text.toLowerCase()));
                        areaDeTextoVazia = areaDeTexto.value.length === 0;
                        ativarBotao1();
                        ajustarTamanhoAreaDeTexto(); // Chama a função de ajuste aqui
                    });
                    break;
                case 'btn-07':
                    console.log('Limpar clicado');
                    areaDeTexto.value = '';
                    areaDeTextoVazia = true;
                    areaDeTexto.style.fontSize = `${tamanhoFonteOriginal}px`;
                    areaDeTexto.style.height = 'auto';
                    areaDeTexto.placeholder = placeholderOriginal;
                    redefinirBotoes();
                    desativarBotao1();
                    atualizarContadorCaracteres(); // Atualiza o contador
                    break;
            }
        });

        botao.addEventListener('mouseover', () => {
            if (!botao.classList.contains('active')) {
                const circuloInterno = botao.querySelector('.circulo-interno');
                if (circuloInterno) {
                    circuloInterno.style.animation = `pulse-${botao.id} 3s infinite`;
                }
            }
        });

        botao.addEventListener('mouseout', () => {
            if (!botao.classList.contains('active')) {
                const circuloInterno = botao.querySelector('.circulo-interno');
                if (circuloInterno) {
                    circuloInterno.style.animation = 'none';
                }
            }
        });
    });

    if (areaDeTexto) {
        areaDeTexto.addEventListener('focus', () => {
            ativarBotao1();
            areaDeTexto.placeholder = "";
        });

        areaDeTexto.addEventListener('blur', () => {
            if (areaDeTextoVazia) {
                desativarBotao1();
                areaDeTexto.placeholder = placeholderOriginal;
            }
            areaDeTexto.classList.remove('active');
        });

        // Adiciona rolagem oculta
        areaDeTexto.addEventListener('wheel', (event) => {
            event.preventDefault();
            areaDeTexto.scrollTop += event.deltaY;
        });

        // Atualiza o contador de caracteres ao carregar a página
        atualizarContadorCaracteres();

        // Atualiza o contador de caracteres ao digitar
        areaDeTexto.addEventListener('input', atualizarContadorCaracteres);
    }

    document.addEventListener('click', (event) => {
        const botaoClicado = event.target.closest('.botao-concentrico');
        const areaDeTextoClicada = event.target.closest('textarea');

        if (!botaoClicado && !areaDeTextoClicada) {
            desativarBotoesNaoPrimarios();
            if (areaDeTextoVazia) {
                desativarBotao1();
            }
            // Adicionado para voltar o botão 02 à animação branca
            const btn02 = document.getElementById('btn-02');
            const circuloInternoBtn02 = btn02.querySelector('.circulo-interno');
            if (circuloInternoBtn02) {
                btn02.classList.remove('active');
                circuloInternoBtn02.style.animation = `pulse-btn-02 3s infinite`;
            }
        }
    });

    const botoesGooey = document.querySelectorAll('.button');

    function obterPosicaoAleatoria(max) {
        return Math.floor(Math.random() * max);
    }

    function moverCirculos() {
        botoesGooey.forEach(botao => {
            const x = obterPosicaoAleatoria(window.innerWidth - botao.clientWidth);
            const y = obterPosicaoAleatoria(window.innerHeight - botao.clientHeight);
            botao.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    function animarCirculos() {
        moverCirculos();
        setInterval(moverCirculos, 40000); // Move as bolinhas a cada 40 segundos
    }

    function inicializarCirculos() {
        const centroX = window.innerWidth / 2;
        const centroY = window.innerHeight / 2;
        botoesGooey.forEach(botao => {
            botao.style.transform = `translate(${centroX - botao.clientWidth / 2}px, ${centroY - botao.clientHeight / 2}px)`;
        });
        animarCirculos();
    }

    inicializarCirculos();
    ajustarTamanhoAreaDeTexto();
    
    // Inicialização da animação constante do botão 02 ao carregar a página
    const btn02 = document.getElementById('btn-02');
    const circuloInternoBtn02 = btn02.querySelector('.circulo-interno');
    if (circuloInternoBtn02) {
        circuloInternoBtn02.style.animation = `pulse-btn-02 3s infinite`;
    }

    btn02.addEventListener('mouseover', () => {
        if (!btn02.classList.contains('active')) {
            circuloInternoBtn02.style.animation = `pulse-btn-02-hover 3s infinite`;
        }
    });

    btn02.addEventListener('mouseout', () => {
        if (!btn02.classList.contains('active')) {
            circuloInternoBtn02.style.animation = `pulse-btn-02 3s infinite`;
        }
    });

    btn02.addEventListener('click', (event) => {
        event.stopPropagation(); // Impede que o clique no botão propague para o documento
        const isActive = btn02.classList.contains('active');
        definirEstadoDoBotao(btn02, !isActive);
    });

    // Adiciona evento paste para área de texto para tratar Ctrl+V ou Cmd+V
    areaDeTexto.addEventListener('paste', (event) => {
        setTimeout(() => {
            areaDeTexto.value = removerAcentosECaracteresEspeciais(validarTexto(areaDeTexto.value.toLowerCase()));
            areaDeTextoVazia = areaDeTexto.value.length === 0;
            ativarBotao1();
            ajustarTamanhoAreaDeTexto(); // Chama a função de ajuste aqui
        }, 0);
    });
});








//Abaixo script referente a animação do conjunto  todo

document.addEventListener("DOMContentLoaded", function() {
    const logo = document.getElementById('logo-criptex');
    const containerBotoes = document.querySelector('.container-botoes');
    const botaoCentral = document.getElementById('botao-central-01');
    let isCentered = true;

    // Animação inicial: logo vindo do fundo infinito
    window.onload = function() {
        logo.style.transform = 'translate(-50%, -50%) scale(1)';
        logo.style.opacity = 1;

        // Mostrar o botão G após a animação de entrada do Criptex
        setTimeout(() => {
            botaoCentral.classList.add('show');
        }, 2000);
    }

    logo.addEventListener('click', function() {
        if (isCentered) {
            // Move o logo diagonalmente para a esquerda, equivalente ao raio do botão G
            logo.style.top = '0%';
            logo.style.left = '0%';
            logo.style.transform = 'translate(0%, 0%) scale(0.7)';
            logo.style.transition = 'transform 1s ease, top 1s ease, left 1s ease';

            // Sincroniza o botão G com o movimento do logo
            botaoCentral.style.transform = 'translate(-50%, -50%) scale(1)';
            botaoCentral.style.transition = 'transform 1s ease';

            containerBotoes.classList.add('menu-open');
            containerBotoes.classList.add('animate');

        } else {
            containerBotoes.classList.remove('animate');
            botaoCentral.style.transform = 'translate(-50%, -50%) scale(0)';
            botaoCentral.style.transition = 'transform 1s ease';

            // Volta o logo ao centro
            logo.style.top = '50%';
            logo.style.left = '50%';
            logo.style.transform = 'translate(-50%, -50%) scale(1)';
            logo.style.transition = 'transform 1s ease, top 1s ease, left 1s ease';

            containerBotoes.classList.remove('menu-open');
        }
        isCentered = !isCentered;
    });
});


document.getElementById('btn-01').addEventListener('focus', function() {
    document.querySelector('.textarea-container textarea').style.setProperty('--placeholder-color', 'white');
});

document.getElementById('btn-01').addEventListener('blur', function() {
    document.querySelector('.textarea-container textarea').style.setProperty('--placeholder-color', '#4e4d85');
});

document.getElementById('btn-01').addEventListener('mouseover', function() {
    document.querySelector('.textarea-container textarea').style.setProperty('--placeholder-color', 'white');
});

document.getElementById('btn-01').addEventListener('mouseout', function() {
    document.querySelector('.textarea-container textarea').style.setProperty('--placeholder-color', '#4e4d85');
});
