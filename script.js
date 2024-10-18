document.addEventListener("DOMContentLoaded", function () {
    const servicosSection = document.getElementById('servicos');
    const quadrados = document.querySelectorAll('.quadrado');

    const colors = ['green-lime', 'dark-gray', 'dark-gray', 'green-lime', 'green-lime', 'dark-gray'];
    let currentIndex = 0;
    let intervalId;

    const resetQuadrados = () => {
        // Reseta todos os quadrados para a cor original (off-white)
        quadrados.forEach(quadrado => {
            quadrado.classList.remove('green-lime', 'dark-gray', 'active');
        });
    };

    const activateQuadrados = () => {
        // Ativa a cor escondida do quadrado atual
        quadrados[currentIndex].classList.add(colors[currentIndex]);
        quadrados[currentIndex].classList.add('active'); // Adiciona classe active

        // Desativa o quadrado anterior
        if (currentIndex > 0) {
            quadrados[currentIndex - 1].classList.remove(colors[currentIndex - 1]);
            quadrados[currentIndex - 1].classList.remove('active'); // Remove a classe active
        } else {
            // Se for o primeiro quadrado, apenas remove a classe do último
            quadrados[quadrados.length - 1].classList.remove(colors[quadrados.length - 1]);
            quadrados[quadrados.length - 1].classList.remove('active');
        }

        currentIndex++;

        // Reinicia o índice se todos os quadrados foram ativados
        if (currentIndex >= quadrados.length) {
            currentIndex = 0; // Reinicia o índice
            clearInterval(intervalId); // Limpa o intervalo atual
            resetQuadrados(); // Reseta os quadrados para off-white
            setTimeout(startEffect, 13000); // Aguarda 13 segundos antes de reiniciar
        }
    };

    const startEffect = () => {
        // Altera a velocidade aqui para 150ms
        intervalId = setInterval(activateQuadrados, 150); // Intervalo de 150ms para acender
    };

    const handleScroll = () => {
        const rect = servicosSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            startEffect(); // Inicia o efeito
            window.removeEventListener('scroll', handleScroll); // Remove o listener após ativar
        }
    };

    // Adiciona evento de mouse sobre os quadrados
    quadrados.forEach(quadrado => {
        quadrado.addEventListener('mouseenter', () => {
            quadrado.classList.add('jump'); // Adiciona classe de salto
            quadrado.classList.add('active'); // Adiciona a classe active para acender
        });

        quadrado.addEventListener('mouseleave', () => {
            quadrado.classList.remove('jump'); // Remove classe de salto
            quadrado.classList.remove('active'); // Remove a classe active
        });
    });

    window.addEventListener('scroll', handleScroll);
});
