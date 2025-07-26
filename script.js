document.addEventListener('DOMContentLoaded', function() {
    // Referencias a los elementos del DOM
    const pantalla1 = document.getElementById('pantalla1');
    const pantalla2 = document.getElementById('pantalla2');
    const pantallaJuego = document.getElementById('pantalla-juego');
    const pantalla3 = document.getElementById('pantalla3');
    
    const musicaFondo = document.getElementById('musica-fondo');
    
    const btnContinuar = document.getElementById('btn-continuar');
    const btnSiguiente = document.getElementById('btn-siguiente');
    const btnContinuarJuego = document.getElementById('btn-continuar-juego');
    
    const btnSi = document.getElementById('btn-si');
    const btnNo = document.getElementById('btn-no');

    const modalTerminos = document.getElementById('modal-terminos');
    const gameBoard = document.querySelector('.memory-game');
    const juegoInstrucciones = document.getElementById('juego-instrucciones');

    // --- Lógica de la Lista de Reproducción ---
    const canciones = [
        'audio/cancion1.mp3',
        'audio/cancion2.mp3',
        'audio/cancion3.mp3'
    ];
    let cancionActual = 0;

    musicaFondo.addEventListener('ended', function() {
        // Avanza a la siguiente canción
        cancionActual++;
        // Si llega al final de la lista, vuelve al principio
        if (cancionActual >= canciones.length) {
            cancionActual = 0;
        }
        // Carga y reproduce la nueva canción
        musicaFondo.src = canciones[cancionActual];
        musicaFondo.play();
    });

    // --- Lógica del Juego de Memoria ---
    const cardEmojis = ['🤍', '😏', '🥺', '😉', '🫣', '🥹'];
    let cards = [...cardEmojis, ...cardEmojis];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let pairsFound = 0;

    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }

    function createBoard() {
        shuffle(cards);
        gameBoard.innerHTML = '';
        cards.forEach(emoji => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.emoji = emoji;
            card.innerHTML = `<div class="front-face">?</div><div class="back-face">${emoji}</div>`;
            gameBoard.appendChild(card);
            card.addEventListener('click', flipCard);
        });
    }

    function flipCard() {
        if (lockBoard || this === firstCard || this.classList.contains('matched')) return;
        this.classList.add('flip');
        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        pairsFound++;
        resetBoard();
        if (pairsFound === cardEmojis.length) {
            setTimeout(() => {
                juegoInstrucciones.innerText = "¡Lo lograste! Sabía que lo harías. Ahora, hay algo muy importante que debo preguntarte...";
                btnContinuarJuego.classList.remove('hidden');
            }, 500);
        }
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1500);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }
    
    // --- Lógica de Navegación entre Pantallas ---
    btnContinuar.addEventListener('click', () => {
        // Inicia la lista de reproducción con la primera canción
        musicaFondo.src = canciones[cancionActual];
        musicaFondo.play();
        
        pantalla1.classList.remove('visible');
        pantalla2.classList.add('visible');
    });

    btnSiguiente.addEventListener('click', () => {
        pantalla2.classList.remove('visible');
        pantallaJuego.classList.add('visible');
        btnContinuarJuego.classList.add('hidden');
        juegoInstrucciones.innerText = "Encuentra los pares que representan nuestra historia. ¡Tú puedes!";
        pairsFound = 0;
        createBoard();
    });

    btnContinuarJuego.addEventListener('click', () => {
        pantallaJuego.classList.remove('visible');
        pantalla3.classList.add('visible');
    });

    btnSi.addEventListener('click', () => {
        modalTerminos.style.display = 'flex';
    });
    
    let noClickCount = 0;
    btnNo.addEventListener('mouseover', moverBoton);
    btnNo.addEventListener('click', () => {
        noClickCount++;
        if (noClickCount === 7) {
            alert('¡No me puedes decir que no, mi niña!');
        }
        moverBoton();
    });

    function moverBoton() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const btnWidth = btnNo.offsetWidth;
        const btnHeight = btnNo.offsetHeight;
        let newTop = Math.random() * (viewportHeight - btnHeight);
        let newLeft = Math.random() * (viewportWidth - btnWidth);
        btnNo.style.top = newTop + 'px';
        btnNo.style.left = newLeft + 'px';
    }

    document.querySelectorAll('.btn-aceptar').forEach(button => {
        button.addEventListener('click', () => {
            alert('¡OFICIALMENTE SOMOS NOVIOS! ❤️');
            modalTerminos.style.display = 'none';
        });
    });
});