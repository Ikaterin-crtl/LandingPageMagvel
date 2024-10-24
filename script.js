document.addEventListener("DOMContentLoaded", function () {
    const servicosSection = document.getElementById('servicos');
    const quadrados = document.querySelectorAll('.quadrado');
    const form = document.querySelector('.contact-form');
    const fields = document.querySelectorAll('.form-field');
    const phoneInput = document.getElementById('phone');
    let currentFieldIndex = 0;

    // Cores dos quadrados
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
            setTimeout(startEffect, 5000);
        }
    };

    const startEffect = () => {
        intervalId = setInterval(activateQuadrados, 100);
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

    // Efeito de deslizamento de cor dentro do campo
    const simulateLoading = () => {
        if (currentFieldIndex < fields.length) {
            const currentField = fields[currentFieldIndex];

            currentField.classList.add('animate');

            setTimeout(() => {
                currentField.classList.remove('animate');
                currentField.classList.add('exit');

                if (currentFieldIndex < fields.length) {
                    setTimeout(() => {
                        currentField.classList.add('hide'); // Esconde o campo
                        currentFieldIndex++;
                        if (currentFieldIndex < fields.length) {
                            fields[currentFieldIndex].classList.remove('hide'); // Mostra o próximo campo
                            simulateLoading(); // Passa para o próximo campo
                        } else {
                            setTimeout(() => {
                                fields.forEach(field => {
                                    field.classList.add('hide'); // Esconde todos os campos
                                });
                                currentFieldIndex = 0;
                                window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola para cima
                                alert('Formulário enviado com sucesso!'); // Feedback ao usuário
                                form.reset(); // Limpa o formulário após o envio
                            }, 300); // Tempo para ocultar
                        }
                    }, 300); // Tempo da animação de saída reduzido
                }
            }, 700); // Tempo total que a animação dura
        }
    };

    // Envio do formulário
    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Previne o comportamento padrão de envio

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Inicia a simulação de loading
        simulateLoading();

        try {
            // Envio para o Make
            await fetch('https://hook.us2.make.com/3wnssofbcaqfpxpdy97q8xrb2lj87f65', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            // Envio para o AWS Lambda
            await fetch('https://7vxvwzkgkpehvu4imjo6tri5ge0gyarh.lambda-url.us-east-1.on.aws/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            // Oculta o formulário
            form.style.display = 'none';
            // Rola suavemente para o topo
            window.scrollTo({ top: 0, behavior: 'smooth' });

            alert('Formulário enviado com sucesso!'); // Feedback ao usuário
            form.reset(); // Limpa o formulário após o envio
        } catch (error) {
            console.error('Erro ao enviar o formulário:', error);
            alert('Ocorreu um erro ao enviar o formulário. Tente novamente mais tarde.');
        }
    });

    // Inicializa o efeito de quadrados
    window.addEventListener('scroll', handleScroll);
});
