document.addEventListener('DOMContentLoaded', () => {
    const botoes = document.querySelectorAll('.botao-concentrico');
    const areaDeTexto = document.querySelector('textarea');
    const contadorCaracteres = document.getElementById('contador-caracteres');
    const alturaMaxima = 300;
    const maximoCaracteres = 1000;
    const margemDeSeguranca = 20;
    const alturaDaLinha = 1.0;
    let areaDeTextoVazia = true;
    const tamanhoFonteOriginal = 32;
    const tamanhoFonteMinima = 26;
    const placeholderOriginal = "Digite seu texto aqui...";

    const definirEstadoDoBotao = (botao, ativo) => {
        const circuloInterno = botao.querySelector('.circulo-interno');
        if (circuloInterno) {
            circuloInterno.style.animation = ativo ? `pulse-${botao.id} 3s infinite` : 'none';
        }
        botao.classList.toggle('active', ativo);
    }

    const redefinirBotoes = (botaoClicado = null) => {
        botoes.forEach(botao => {
            if (botao !== botaoClicado && botao.id !== 'btn-01') {
                definirEstadoDoBotao(botao, false);
            }
        });
        if (areaDeTexto && !areaDeTexto.contains(botaoClicado)) {
            areaDeTexto.classList.remove('active');
        }
    }

    const mostrarMensagemPlaceholder = mensagem => {
        areaDeTexto.placeholder = mensagem;
        setTimeout(() => {
            if (areaDeTextoVazia) {
                areaDeTexto.placeholder = placeholderOriginal;
            }
        }, 2000);
    }

    const removerAcentosECaracteresEspeciais = texto => 
        texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z\s.,;:?!""()\[\]—…]/g, "");

    const validarTexto = texto => 
        texto.replace(/[^a-z\s.,;:?!""()\[\]—…]/g, "");

    const criptografarSimples = texto => {
        const regras = {'e': 'enter', 'i': 'imes', 'a': 'ai', 'o': 'ober', 'u': 'ufat'};
        return texto.replace(/[eioua]/g, match => regras[match]);
    }

    const descriptografarSimples = texto => {
        const regras = {'enter': 'e', 'imes': 'i', 'ai': 'a', 'ober': 'o', 'ufat': 'u'};
        return texto.replace(/enter|imes|ai|ober|ufat/g, match => regras[match]);
    }

    const ajustarTamanhoAreaDeTexto = () => {
        let tamanhoFonteAtual = parseFloat(window.getComputedStyle(areaDeTexto).fontSize);
        if (isNaN(tamanhoFonteAtual)) tamanhoFonteAtual = tamanhoFonteOriginal;
        areaDeTexto.maxLength = maximoCaracteres;
        areaDeTexto.style.transition = 'font-size 0.1s ease, height 0.1s ease';
        areaDeTexto.style.lineHeight = alturaDaLinha;

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

    const dividirTexto = (texto, maximoCaracteres) => {
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

    const criptografarTexto = texto => 
        dividirTexto(texto, maximoCaracteres / 2)
            .map(parte => criptografarSimples(removerAcentosECaracteresEspeciais(validarTexto(parte.toLowerCase()))))
            .join(" ");

    const ativarBotao1 = () => {
        const btn1 = document.getElementById('btn-01');
        definirEstadoDoBotao(btn1, true);
        areaDeTexto.focus();
        areaDeTexto.placeholder = "";
    }

    const desativarBotao1 = () => {
        const btn1 = document.getElementById('btn-01');
        definirEstadoDoBotao(btn1, false);
    }

    const atualizarContadorCaracteres = () => {
        const caracteres = areaDeTexto.value.length;
        contadorCaracteres.textContent = `${caracteres} / ${maximoCaracteres}`;
        contadorCaracteres.style.display = caracteres > 0 ? 'block' : 'none';
    }

    botoes.forEach((botao) => {
        botao.addEventListener('click', (event) => {
            if (botao.id !== 'btn-02' && botao.id !== 'btn-05') event.preventDefault();
            if (botao.id !== 'btn-07') redefinirBotoes(botao);
            definirEstadoDoBotao(botao, true);

            if (botao.id === 'btn-01') ativarBotao1();

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
                        ajustarTamanhoAreaDeTexto();
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
                    atualizarContadorCaracteres();
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
        areaDeTexto.addEventListener('focus', ativarBotao1);

        areaDeTexto.addEventListener('blur', () => {
            if (areaDeTextoVazia) {
                desativarBotao1();
                areaDeTexto.placeholder = placeholderOriginal;
            }
            areaDeTexto.classList.remove('active');
        });

        areaDeTexto.addEventListener('wheel', event => {
            event.preventDefault();
            areaDeTexto.scrollTop += event.deltaY;
        });

        atualizarContadorCaracteres();

        areaDeTexto.addEventListener('input', atualizarContadorCaracteres);
    }

    document.addEventListener('click', event => {
        const botaoClicado = event.target.closest('.botao-concentrico');
        const areaDeTextoClicada = event.target.closest('textarea');

        if (!botaoClicado && !areaDeTextoClicada) {
            botoes.forEach(botao => {
                if (botao.id !== 'btn-01' && botao.id !== 'btn-02') {
                    definirEstadoDoBotao(botao, false);
                }
            });
            if (areaDeTextoVazia) desativarBotao1();
            const btn02 = document.getElementById('btn-02');
            const circuloInternoBtn02 = btn02.querySelector('.circulo-interno');
            if (circuloInternoBtn02) {
                btn02.classList.remove('active');
                circuloInternoBtn02.style.animation = `pulse-btn-02 3s infinite`;
            }
        }
    });

    const botoesGooey = document.querySelectorAll('.button');

    const obterPosicaoAleatoria = max => Math.floor(Math.random() * max);

    const moverCirculos = () => {
        botoesGooey.forEach(botao => {
            const x = obterPosicaoAleatoria(window.innerWidth - botao.clientWidth);
            const y = obterPosicaoAleatoria(window.innerHeight - botao.clientHeight);
            botao.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    const animarCirculos = () => {
        moverCirculos();
        setInterval(moverCirculos, 40000);
    }

    const inicializarCirculos = () => {
        const centroX = window.innerWidth / 2;
        const centroY = window.innerHeight / 2;
        botoesGooey.forEach(botao => {
            botao.style.transform = `translate(${centroX - botao.clientWidth / 2}px, ${centroY - botao.clientHeight / 2}px)`;
        });
        animarCirculos();
    }

    inicializarCirculos();
    ajustarTamanhoAreaDeTexto();

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

    btn02.addEventListener('click', event => {
        event.stopPropagation();
        definirEstadoDoBotao(btn02, !btn02.classList.contains('active'));
    });

    areaDeTexto.addEventListener('paste', event => {
        setTimeout(() => {
            areaDeTexto.value = removerAcentosECaracteresEspeciais(validarTexto(areaDeTexto.value.toLowerCase()));
            areaDeTextoVazia = areaDeTexto.value.length === 0;
            ativarBotao1();
            ajustarTamanhoAreaDeTexto();
        }, 0);
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const logo = document.getElementById('logo-criptex');
    const botaoCentral = document.getElementById('botao-central-01');

    window.onload = function() {
        logo.style.transform = 'translate(-50%, -50%) scale(1)';
        logo.style.opacity = 1;

        setTimeout(() => {
            botaoCentral.classList.add('show');
        }, 2000);
    }
});


document.querySelector('.scroll-container').addEventListener('scroll', function() {
    const container = this;
    const footer = document.querySelector('footer');

    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
        footer.classList.add('visible'); // Mostrar o rodapé
    } else {
        footer.classList.remove('visible'); // Esconder o rodapé
    }
});

