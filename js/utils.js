/* ============================================
   FUNÇÕES UTILITÁRIAS
   ============================================ */

/* ============================================
   FORMATAÇÃO DE DADOS
   ============================================ */

/**
 * Formata um número como moeda brasileira
 * @param {number} value - Valor a formatar
 * @returns {string} Valor formatado
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

/**
 * Formata uma data para o padrão brasileiro
 * @param {Date|string} date - Data a formatar
 * @returns {string} Data formatada (DD/MM/YYYY)
 */
function formatDate(date) {
    const d = new Date(date);
    return new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(d);
}

/**
 * Formata um telefone brasileiro
 * @param {string} phone - Telefone sem formatação
 * @returns {string} Telefone formatado (+55 81 99808-0009)
 */
function formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return `+55 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
}

/**
 * Formata um email (máscara parcial para privacidade)
 * @param {string} email - Email completo
 * @returns {string} Email com máscara
 */
function maskEmail(email) {
    const [name, domain] = email.split('@');
    const maskedName = name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
    return `${maskedName}@${domain}`;
}

/* ============================================
   VALIDAÇÃO
   ============================================ */

/**
 * Valida um email
 * @param {string} email - Email a validar
 * @returns {boolean} True se válido
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Valida um telefone brasileiro
 * @param {string} phone - Telefone a validar
 * @returns {boolean} True se válido
 */
function isValidPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 11 || cleaned.length === 10;
}

/**
 * Valida um URL
 * @param {string} url - URL a validar
 * @returns {boolean} True se válido
 */
function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

/* ============================================
   MANIPULAÇÃO DE DOM
   ============================================ */

/**
 * Cria um elemento com classes e atributos
 * @param {string} tag - Tag HTML
 * @param {object} options - Opções (classes, attributes, text, html)
 * @returns {HTMLElement} Elemento criado
 */
function createElement(tag, options = {}) {
    const element = document.createElement(tag);

    if (options.classes) {
        element.classList.add(...(Array.isArray(options.classes) ? options.classes : [options.classes]));
    }

    if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }

    if (options.text) {
        element.textContent = options.text;
    }

    if (options.html) {
        element.innerHTML = options.html;
    }

    return element;
}

/**
 * Remove um elemento do DOM
 * @param {string|HTMLElement} selector - Seletor CSS ou elemento
 */
function removeElement(selector) {
    const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (element) {
        element.remove();
    }
}

/**
 * Adiciona uma classe a um elemento
 * @param {string|HTMLElement} selector - Seletor CSS ou elemento
 * @param {string} className - Nome da classe
 */
function addClass(selector, className) {
    const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (element) {
        element.classList.add(className);
    }
}

/**
 * Remove uma classe de um elemento
 * @param {string|HTMLElement} selector - Seletor CSS ou elemento
 * @param {string} className - Nome da classe
 */
function removeClass(selector, className) {
    const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (element) {
        element.classList.remove(className);
    }
}

/**
 * Alterna uma classe em um elemento
 * @param {string|HTMLElement} selector - Seletor CSS ou elemento
 * @param {string} className - Nome da classe
 */
function toggleClass(selector, className) {
    const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (element) {
        element.classList.toggle(className);
    }
}

/**
 * Verifica se um elemento tem uma classe
 * @param {string|HTMLElement} selector - Seletor CSS ou elemento
 * @param {string} className - Nome da classe
 * @returns {boolean} True se tem a classe
 */
function hasClass(selector, className) {
    const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    return element ? element.classList.contains(className) : false;
}

/* ============================================
   ARMAZENAMENTO LOCAL
   ============================================ */

/**
 * Salva dados no localStorage
 * @param {string} key - Chave
 * @param {*} value - Valor (será convertido para JSON)
 */
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Erro ao salvar no localStorage:', e);
    }
}

/**
 * Recupera dados do localStorage
 * @param {string} key - Chave
 * @param {*} defaultValue - Valor padrão se não encontrado
 * @returns {*} Valor armazenado ou padrão
 */
function getFromLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.error('Erro ao recuperar do localStorage:', e);
        return defaultValue;
    }
}

/**
 * Remove dados do localStorage
 * @param {string} key - Chave
 */
function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        console.error('Erro ao remover do localStorage:', e);
    }
}

/**
 * Limpa todo o localStorage
 */
function clearLocalStorage() {
    try {
        localStorage.clear();
    } catch (e) {
        console.error('Erro ao limpar localStorage:', e);
    }
}

/* ============================================
   COOKIES
   ============================================ */

/**
 * Define um cookie
 * @param {string} name - Nome do cookie
 * @param {string} value - Valor
 * @param {number} days - Dias até expiração
 */
function setCookie(name, value, days = 7) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
}

/**
 * Recupera um cookie
 * @param {string} name - Nome do cookie
 * @returns {string|null} Valor do cookie ou null
 */
function getCookie(name) {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length);
        }
    }
    return null;
}

/**
 * Remove um cookie
 * @param {string} name - Nome do cookie
 */
function removeCookie(name) {
    setCookie(name, '', -1);
}

/* ============================================
   REQUISIÇÕES HTTP
   ============================================ */

/**
 * Faz uma requisição GET
 * @param {string} url - URL
 * @returns {Promise} Promise com a resposta
 */
async function fetchGet(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erro na requisição GET:', error);
        throw error;
    }
}

/**
 * Faz uma requisição POST
 * @param {string} url - URL
 * @param {object} data - Dados a enviar
 * @returns {Promise} Promise com a resposta
 */
async function fetchPost(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erro na requisição POST:', error);
        throw error;
    }
}

/* ============================================
   UTILITÁRIOS DE STRING
   ============================================ */

/**
 * Capitaliza a primeira letra de uma string
 * @param {string} str - String
 * @returns {string} String capitalizada
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converte string para slug
 * @param {string} str - String
 * @returns {string} Slug
 */
function toSlug(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Trunca uma string
 * @param {string} str - String
 * @param {number} length - Comprimento máximo
 * @param {string} suffix - Sufixo (padrão: '...')
 * @returns {string} String truncada
 */
function truncate(str, length, suffix = '...') {
    if (str.length <= length) return str;
    return str.slice(0, length - suffix.length) + suffix;
}

/**
 * Remove espaços em branco extras
 * @param {string} str - String
 * @returns {string} String limpa
 */
function cleanWhitespace(str) {
    return str.replace(/\s+/g, ' ').trim();
}

/* ============================================
   UTILITÁRIOS DE ARRAY
   ============================================ */

/**
 * Remove duplicatas de um array
 * @param {array} arr - Array
 * @returns {array} Array sem duplicatas
 */
function removeDuplicates(arr) {
    return [...new Set(arr)];
}

/**
 * Embaralha um array
 * @param {array} arr - Array
 * @returns {array} Array embaralhado
 */
function shuffle(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Agrupa array por propriedade
 * @param {array} arr - Array
 * @param {string} key - Chave para agrupar
 * @returns {object} Objeto agrupado
 */
function groupBy(arr, key) {
    return arr.reduce((result, item) => {
        const group = item[key];
        if (!result[group]) {
            result[group] = [];
        }
        result[group].push(item);
        return result;
    }, {});
}

/* ============================================
   UTILITÁRIOS DE TEMPO
   ============================================ */

/**
 * Calcula tempo decorrido desde uma data
 * @param {Date|string} date - Data
 * @returns {string} Tempo decorrido em formato legível
 */
function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' anos atrás';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' meses atrás';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' dias atrás';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' horas atrás';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutos atrás';
    
    return Math.floor(seconds) + ' segundos atrás';
}

/**
 * Aguarda um tempo especificado
 * @param {number} ms - Milissegundos
 * @returns {Promise} Promise que resolve após o tempo
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* ============================================
   UTILITÁRIOS DE PERFORMANCE
   ============================================ */

/**
 * Debounce - aguarda antes de executar função
 * @param {function} func - Função
 * @param {number} wait - Tempo de espera em ms
 * @returns {function} Função com debounce
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle - limita execução de função
 * @param {function} func - Função
 * @param {number} limit - Tempo limite em ms
 * @returns {function} Função com throttle
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ============================================
   NOTIFICAÇÕES E ALERTAS
   ============================================ */

/**
 * Mostra uma notificação toast
 * @param {string} message - Mensagem
 * @param {string} type - Tipo (success, error, warning, info)
 * @param {number} duration - Duração em ms
 */
function showToast(message, type = 'info', duration = 3000) {
    const toast = createElement('div', {
        classes: ['toast', `toast-${type}`],
        text: message,
        attributes: {
            role: 'alert',
            'aria-live': 'polite'
        }
    });

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/* ============================================
   DETECÇÃO DE NAVEGADOR
   ============================================ */

/**
 * Detecta o navegador
 * @returns {string} Nome do navegador
 */
function detectBrowser() {
    const ua = navigator.userAgent;
    if (ua.indexOf('Firefox') > -1) return 'Firefox';
    if (ua.indexOf('Chrome') > -1) return 'Chrome';
    if (ua.indexOf('Safari') > -1) return 'Safari';
    if (ua.indexOf('Edge') > -1) return 'Edge';
    if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1) return 'IE';
    return 'Unknown';
}

/**
 * Detecta o sistema operacional
 * @returns {string} Nome do SO
 */
function detectOS() {
    const ua = navigator.userAgent;
    if (ua.indexOf('Win') > -1) return 'Windows';
    if (ua.indexOf('Mac') > -1) return 'MacOS';
    if (ua.indexOf('Linux') > -1) return 'Linux';
    if (ua.indexOf('Android') > -1) return 'Android';
    if (ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) return 'iOS';
    return 'Unknown';
}

/* ============================================
   EXPORTAR FUNÇÕES (se usar módulos)
   ============================================ */

// Para uso em módulos ES6:
// export { formatCurrency, formatDate, isValidEmail, ... }
