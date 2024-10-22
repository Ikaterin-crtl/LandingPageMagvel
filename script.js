document.addEventListener("DOMContentLoaded", function () {
    const servicosSection = document.getElementById('servicos');
    const quadrados = document.querySelectorAll('.quadrado');
    const form = document.querySelector('.contact-form');
    const fields = document.querySelectorAll('.form-field');
    const phoneInput = document.getElementById('phone');
    let currentFieldIndex = 0;

    const colors = ['green-lime', 'dark-gray', 'dark-gray', 'green-lime', 'green-lime', 'dark-gray'];
    let currentIndex = 0;
    let intervalId;

    // Efeito dos quadrados
    const resetQuadrados = () => {
        quadrados.forEach(quadrado => {
            quadrado.classList.remove('green-lime', 'dark-gray', 'active');
        });
    };

    const activateQuadrados = () => {
        quadrados[currentIndex].classList.add(colors[currentIndex]);
        quadrados[currentIndex].classList.add('active');

        if (currentIndex > 0) {
            quadrados[currentIndex - 1].classList.remove(colors[currentIndex - 1]);
            quadrados[currentIndex - 1].classList.remove('active');
        } else {
            quadrados[quadrados.length - 1].classList.remove(colors[quadrados.length - 1]);
            quadrados[quadrados.length - 1].classList.remove('active');
        }

        currentIndex++;

        if (currentIndex >= quadrados.length) {
            currentIndex = 0;
            clearInterval(intervalId);
            resetQuadrados();
            setTimeout(startEffect, 13000);
        }
    };

    const startEffect = () => {
        intervalId = setInterval(activateQuadrados, 150);
    };

    const handleScroll = () => {
        const rect = servicosSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            startEffect();
            window.removeEventListener('scroll', handleScroll);
        }
    };

    // Máscara de telefone
    phoneInput.addEventListener('input', function () {
        let value = this.value.replace(/\D/g, '');

        if (value.length > 10) {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (value.length > 5) {
            value = value.replace(/(\d{2})(\d{5})/, '($1) $2');
        } else if (value.length > 2) {
            value = value.replace(/(\d{2})/, '($1)');
        }

        this.value = value;
    });

    // Efeito de carregamento do formulário
    function simulateLoading() {
        if (currentFieldIndex < fields.length) {
            fields[currentFieldIndex].classList.add('loading', 'fade'); // Adiciona classes de loading e fade

            setTimeout(() => {
                fields[currentFieldIndex].classList.remove('show', 'loading', 'fade');
                fields[currentFieldIndex].classList.add('hide');
                currentFieldIndex++;

                if (currentFieldIndex < fields.length) {
                    fields[currentFieldIndex].classList.remove('hide');
                    fields[currentFieldIndex].classList.add('show');
                    simulateLoading();
                } else {
                    // Rola para o topo da página após o envio
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    console.log('Formulário enviado!'); // Aqui você pode adicionar algum efeito de feedback após o envio
                }
            }, 1000); // Duração da animação de carregamento
        }
    }

    // Evento de submissão
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        currentFieldIndex = 0; // Reinicia o índice ao enviar o formulário
        fields.forEach(field => {
            field.classList.add('hide'); // Esconde todos os campos ao enviar
        });
        simulateLoading(); // Inicia a animação de carregamento
    });

    window.addEventListener('scroll', handleScroll);

    // Adiciona eventos para os quadrados
    quadrados.forEach(quadrado => {
        quadrado.addEventListener('mouseenter', () => {
            quadrado.classList.add('jump', 'active');
        });

        quadrado.addEventListener('mouseleave', () => {
            quadrado.classList.remove('jump', 'active');
        });
    });

    // Função para mostrar os campos do formulário com atraso
    const showFields = () => {
        let delay = 0;
        fields.forEach((field, index) => {
            setTimeout(() => {
                field.classList.add('loading'); // Adiciona a classe de carregamento
                field.style.opacity = '1'; // Torna o campo visível
                field.classList.remove('hide'); // Remove a classe hide se estava escondido
            }, delay);
            delay += 500; // Aumenta o atraso a cada campo
        });
    };

    showFields(); // Chama a função para mostrar os campos
});
