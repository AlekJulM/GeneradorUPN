// Generador de Contraseñas Seguras con Base Matemática
document.addEventListener('DOMContentLoaded', function() {
    // Conjuntos de caracteres (Teoría de Conjuntos)
    const characterSets = {
        lowercase: {
            chars: 'abcdefghijklmnopqrstuvwxyz',
            active: true,
            element: document.getElementById('lowercase')
        },
        uppercase: {
            chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            active: true,
            element: document.getElementById('uppercase')
        },
        numbers: {
            chars: '0123456789',
            active: true,
            element: document.getElementById('numbers')
        },
        symbols: {
            chars: '!@#$%^&*()_+-=[]{};:\'",.<>/?\\|',
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

    // Event Listeners
    passwordLengthSlider.addEventListener('input', function() {
        passwordLength = parseInt(this.value);
        updateLengthLabel();
        updateSecurityAnalysis();
    });

    // Botones de conjuntos de caracteres
    for (const setKey in characterSets) {
        if (characterSets.hasOwnProperty(setKey)) {
            const set = characterSets[setKey];
            set.element.addEventListener('click', function() {
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

    function calculateCombinations(charCount, length) {
        // Para tamaños pequeños podemos usar Math.pow directamente
        if (charCount <= 0 || length <= 0) return '0';
        
        // Para números moderados (que no requieren BigInt)
        if (length < 15 && charCount < 10) { // Estos límites son conservadores
            return Math.pow(charCount, length).toLocaleString();
        }
        
        // Para números grandes, usamos BigInt para precisión exacta
        const combinationsBigInt = BigInt(charCount) ** BigInt(length);
        const numStr = combinationsBigInt.toString();
        
        // Formateamos el número con comas cada tres dígitos para mejor legibilidad
        let formattedStr = '';
        for (let i = 0; i < numStr.length; i++) {
            // Agregamos coma cada tres dígitos desde el final
            if (i > 0 && (numStr.length - i) % 3 === 0) {
                formattedStr += ',';
            }
            formattedStr += numStr[i];
        }
        
        return formattedStr;
    }

    function evaluateSecurityLevel(combinationsCount) {
        // Límites de seguridad
        const MILLION = 1000000;        // 10^6
        const TRILLION = 1000000000000; // 10^12
        
        // Caso 1: Formato "A.B × 10^C" (notación científica)
        if (typeof combinationsCount === 'string' && combinationsCount.includes('×') && combinationsCount.includes('10^')) {
            const parts = combinationsCount.split('×');
            const exponent = parseInt(parts[1].trim().replace('10^', ''));
            
            // Determinar directamente por el exponente
            if (exponent < 6) return { level: 'Débil', class: 'level-weak' };
            if (exponent < 12) return { level: 'Media', class: 'level-medium' };
            return { level: 'Fuerte', class: 'level-strong' };
        }
        
        // Caso 2: Formato con comas (1,234,567)
        if (typeof combinationsCount === 'string' && combinationsCount.includes(',')) {
            // Eliminar comas para obtener el número puro
            const numStr = combinationsCount.replace(/,/g, '');
            const digitCount = numStr.length;
            
            // Para números muy grandes, evaluamos por cantidad de dígitos
            // porque pueden exceder la capacidad de Number
            if (digitCount < 7) {
                return { level: 'Débil', class: 'level-weak' };
            } else if (digitCount < 13) {
                return { level: 'Media', class: 'level-medium' };
            } else {
                return { level: 'Fuerte', class: 'level-strong' };
            }
        }
        
        // Caso 3: Es un número directo
        if (typeof combinationsCount === 'number') {
            if (combinationsCount < MILLION) return { level: 'Débil', class: 'level-weak' };
            if (combinationsCount < TRILLION) return { level: 'Media', class: 'level-medium' };
            return { level: 'Fuerte', class: 'level-strong' };
        }
        
        // Caso fallback: No se pudo determinar
        return { level: 'No determinado', class: 'level-weak' };
    }

    function updateSecurityAnalysis() {
        const selectedChars = getSelectedCharacters();
        const charCount = selectedChars.chars.length;
        
        const combinations = calculateCombinations(charCount, passwordLength);
        
        // Formateo más legible de las combinaciones
        let displayCombinations = combinations;
        if (typeof combinations === 'string' && combinations.includes('×') && combinations.includes('10^')) {
            // Formato científico: convertir a HTML con superíndice
            displayCombinations = combinations.replace(' × 10^', ' × 10<sup>').concat('</sup>');
        }
        
        // Actualizar la visualización
        combinationsDisplay.innerHTML = `Combinaciones posibles: |C|<sup>k</sup> = ${displayCombinations}`;
        
        // Evaluar y mostrar nivel de seguridad
        const security = evaluateSecurityLevel(combinations);
        securityLevelDisplay.textContent = security.level;
        securityLevelDisplay.className = 'level-indicator ' + security.class;
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
        
        // Generar contraseña con selección aleatoria de caracteres con reemplazo
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
