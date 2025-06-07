// Generador de Contraseñas Seguras con Base Matemática
document.addEventListener('DOMContentLoaded', function() {
    // Conjuntos de caracteres (Teoría de Conjuntos)
    const characterSets = {
        lowercase: {
            chars: 'abcdefghijklmnopqrstuvwxyz',
            size: 26,
            active: true,
            element: document.getElementById('lowercase')
        },
        uppercase: {
            chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            size: 26,
            active: true,
            element: document.getElementById('uppercase')
        },
        numbers: {
            chars: '0123456789',
            size: 10,
            active: true,
            element: document.getElementById('numbers')
        },
        symbols: {
            chars: '!@#$%^&*()_+-=[]{};:\'",.<>/?\\|',
            size: 30,
            active: false,
            element: document.getElementById('symbols')
        }
    };

    // Elementos del DOM
    const passwordLengthSlider = document.getElementById('passwordLength');
    const lengthLabel = document.getElementById('lengthLabel');
    const generateBtn = document.getElementById('generateBtn');
    const passwordResult = document.getElementById('passwordResult');
    const copyBtn = document.getElementById('copyBtn');
    const combinationsDisplay = document.getElementById('combinations');
    const securityLevelDisplay = document.getElementById('securityLevel');

    // Estado inicial
    let passwordLength = parseInt(passwordLengthSlider.value);
    updateLengthLabel();
    updateToggleButtons();

    // Event Listeners
    passwordLengthSlider.addEventListener('input', function() {
        passwordLength = parseInt(this.value);
        updateLengthLabel();
        updateSecurityAnalysis();
    });

    // Botones de conjuntos de caracteres
    for (const setKey in characterSets) {
        if (characterSets.hasOwnProperty(setKey)) {
            const set = characterSets[setKey];            set.element.addEventListener('click', function() {
                set.active = !set.active;
                this.classList.toggle('active');
                this.setAttribute('aria-pressed', set.active);
                
                // Actualizar el texto para lectores de pantalla
                const srElement = this.querySelector('.sr-only');
                if (srElement) {
                    srElement.textContent = set.active ? '(Activado)' : '(Desactivado)';
                }
                
                updateSecurityAnalysis();
            });
        }
    }

    // Botón para generar contraseña
    generateBtn.addEventListener('click', generatePassword);

    // Botón para copiar contraseña
    copyBtn.addEventListener('click', copyPassword);

    // Funciones
    function updateLengthLabel() {
        lengthLabel.textContent = `Longitud: ${passwordLength} caracteres`;
    }

    function updateToggleButtons() {
        for (const setKey in characterSets) {
            if (characterSets.hasOwnProperty(setKey)) {
                const set = characterSets[setKey];
                set.element.classList.toggle('active', set.active);
                set.element.setAttribute('aria-pressed', set.active);
            }
        }
    }

    function getSelectedCharacters() {
        // Unión de conjuntos seleccionados: C = M ∪ Ma ∪ N ∪ S
        let chars = '';
        let setCount = 0;
        
        for (const setKey in characterSets) {
            if (characterSets.hasOwnProperty(setKey)) {
                const set = characterSets[setKey];
                if (set.active) {
                    chars += set.chars;
                    setCount++;
                }
            }
        }
        
        return {
            chars: chars,
            count: setCount
        };
    }

    function calculateCombinations(charactersLength, passwordLength) {
        // Fórmula combinatoria: |C|^k
        if (charactersLength === 0) return 0;
        
        // Para números muy grandes, utilizamos notación científica
        const exponent = passwordLength;
        const base = charactersLength;
        
        if (exponent > 20) {
            // Para exponentes muy grandes, usamos logaritmos
            const result = exponent * Math.log10(base);
            return `10^${result.toFixed(2)}`;
        } else {
            // Para valores manejables, calculamos directamente
            let result = 1;
            for (let i = 0; i < exponent; i++) {
                result *= base;
                // Si el resultado es demasiado grande, cambiamos a notación científica
                if (result > 1e15) {
                    return `${(result / Math.pow(10, Math.floor(Math.log10(result)))).toFixed(2)}e+${Math.floor(Math.log10(result))}`;
                }
            }
            return result.toLocaleString();
        }
    }

    function evaluateSecurityLevel(combinationsCount) {
        // Si combinationsCount es una cadena (notación científica), la convertimos
        let numCombinations;
        if (typeof combinationsCount === 'string') {
            if (combinationsCount.includes('10^')) {
                numCombinations = parseFloat(combinationsCount.replace('10^', ''));
                numCombinations = Math.pow(10, numCombinations);
            } else if (combinationsCount.includes('e+')) {
                const parts = combinationsCount.split('e+');
                numCombinations = parseFloat(parts[0]) * Math.pow(10, parseFloat(parts[1]));
            } else {
                numCombinations = parseFloat(combinationsCount.replace(/,/g, ''));
            }
        } else {
            numCombinations = combinationsCount;
        }

        // Clasificar seguridad
        const millón = 1e6;
        const billón = 1e12;

        if (numCombinations < millón) {
            return {
                level: 'Débil',
                class: 'level-weak'
            };
        } else if (numCombinations < billón) {
            return {
                level: 'Media',
                class: 'level-medium'
            };
        } else {
            return {
                level: 'Fuerte',
                class: 'level-strong'
            };
        }
    }

    function updateSecurityAnalysis() {
        const selectedChars = getSelectedCharacters();
        const charCount = selectedChars.chars.length;
        
        const combinations = calculateCombinations(charCount, passwordLength);
        combinationsDisplay.textContent = `Combinaciones posibles: |C|^k = ${combinations}`;
        
        const security = evaluateSecurityLevel(combinations);
        securityLevelDisplay.textContent = security.level;
        
        // Eliminar clases previas
        securityLevelDisplay.classList.remove('level-weak', 'level-medium', 'level-strong');
        // Añadir la nueva clase
        securityLevelDisplay.classList.add(security.class);
    }

    function generateRandomChar(chars) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        return chars.charAt(randomIndex);
    }

    function generatePassword() {
        const selectedChars = getSelectedCharacters();
        
        // Verificar si hay conjuntos seleccionados
        if (selectedChars.count === 0) {
            passwordResult.value = 'Error: Selecciona al menos un conjunto de caracteres';
            return;
        }
        
        const chars = selectedChars.chars;
        let password = '';
        
        // Generar contraseña con selección aleatoria de caracteres con reemplazamiento
        for (let i = 0; i < passwordLength; i++) {
            password += generateRandomChar(chars);
        }
        
        passwordResult.value = password;
        updateSecurityAnalysis();
        
        // Cambiar foco al campo de contraseña para que el usuario pueda verlo
        passwordResult.focus();
        passwordResult.select();
    }

    function copyPassword() {
        if (passwordResult.value && passwordResult.value !== 'Tu contraseña aparecerá aquí' && 
            !passwordResult.value.includes('Error')) {
            
            // Copiar al portapapeles
            passwordResult.select();
            document.execCommand('copy');
            
            // Feedback visual
            const originalIcon = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            copyBtn.classList.add('copied');
            
            // Restaurar después de un tiempo
            setTimeout(function() {
                copyBtn.innerHTML = originalIcon;
                copyBtn.classList.remove('copied');
            }, 2000);
        }
    }

    // Inicializar análisis de seguridad
    updateSecurityAnalysis();
});
