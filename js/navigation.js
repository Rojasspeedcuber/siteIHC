/* ============================================
   GERENCIAMENTO DE NAVEGAÇÃO E ABAS
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeMenuToggle();
    initializeTabNavigation();
    initializeAccessibility();
});

/* ============================================
   INICIALIZAÇÃO DA NAVEGAÇÃO
   ============================================ */

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const tabName = this.getAttribute('data-tab');
            openTab(tabName);
            
            // Fechar menu mobile após clicar
            closeMenuMobile();
            
            // Atualizar URL sem recarregar
            window.history.pushState({ tab: tabName }, '', `#${tabName}`);
        });
    });

    // Verificar se há hash na URL ao carregar
    const hash = window.location.hash.substring(1);
    if (hash) {
        openTab(hash);
    }
}

/* ============================================
   FUNÇÃO PARA ABRIR ABAS
   ============================================ */

function openTab(tabName) {
    // Validar se a aba existe
    const validTabs = ['home', 'cv', 'experience', 'projects', 'hobbies'];
    if (!validTabs.includes(tabName)) {
        tabName = 'home';
    }

    // Esconder todas as abas
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });

    // Remover classe active de todos os links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Mostrar aba selecionada
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Adicionar classe active ao link correspondente
    const activeLink = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Scroll para o topo
    window.scrollTo(0, 0);

    // Anunciar mudança para leitores de tela
    announceTabChange(tabName);
}

/* ============================================
   MENU MOBILE - TOGGLE
   ============================================ */

function initializeMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Atualizar aria-expanded
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Fechar menu ao clicar fora
    document.addEventListener('click', function(event) {
        if (navMenu && menuToggle) {
            const isClickInsideMenu = navMenu.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);

            if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
                closeMenuMobile();
            }
        }
    });

    // Fechar menu ao pressionar Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            closeMenuMobile();
        }
    });
}

function closeMenuMobile() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (navMenu && menuToggle) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
}

/* ============================================
   NAVEGAÇÃO POR TECLADO
   ============================================ */

function initializeTabNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach((link, index) => {
        link.addEventListener('keydown', function(e) {
            let nextLink;

            // Arrow Right - próximo tab
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextLink = navLinks[(index + 1) % navLinks.length];
                nextLink.focus();
                nextLink.click();
            }

            // Arrow Left - tab anterior
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                nextLink = navLinks[(index - 1 + navLinks.length) % navLinks.length];
                nextLink.focus();
                nextLink.click();
            }

            // Home - primeiro tab
            if (e.key === 'Home') {
                e.preventDefault();
                navLinks[0].focus();
                navLinks[0].click();
            }

            // End - último tab
            if (e.key === 'End') {
                e.preventDefault();
                navLinks[navLinks.length - 1].focus();
                navLinks[navLinks.length - 1].click();
            }
        });
    });
}

/* ============================================
   ACESSIBILIDADE
   ============================================ */

function initializeAccessibility() {
    // Adicionar skip link
    addSkipLink();

    // Melhorar contraste em modo escuro
    checkDarkMode();

    // Verificar preferência de movimento reduzido
    checkReducedMotion();

    // Adicionar labels ARIA
    addAriaLabels();
}

function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Pular para conteúdo principal';
    document.body.insertBefore(skipLink, document.body.firstChild);
}

function checkDarkMode() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
    }

    // Ouvir mudanças de preferência
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (e.matches) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });
}

function checkReducedMotion() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduce-motion');
    }
}

function addAriaLabels() {
    // Adicionar aria-current para aba ativa
    const activeTab = document.querySelector('.nav-link.active');
    if (activeTab) {
        activeTab.setAttribute('aria-current', 'page');
    }

    // Adicionar role="main" ao container
    const container = document.querySelector('.container');
    if (container) {
        container.setAttribute('role', 'main');
        container.setAttribute('id', 'main-content');
    }
}

/* ============================================
   ANÚNCIO DE MUDANÇAS PARA LEITORES DE TELA
   ============================================ */

function announceTabChange(tabName) {
    const tabTitles = {
        'home': 'Página inicial',
        'cv': 'Currículo profissional',
        'experience': 'Experiência profissional',
        'projects': 'Projetos e portfólio',
        'hobbies': 'Hobbies e futebol'
    };

    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `Navegando para ${tabTitles[tabName] || tabName}`;

    document.body.appendChild(announcement);

    // Remover após anúncio
    setTimeout(() => {
        announcement.remove();
    }, 1000);
}

/* ============================================
   SMOOTH SCROLL PARA LINKS INTERNOS
   ============================================ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Não interferir com navegação de abas
        if (this.classList.contains('nav-link') || this.classList.contains('data-tab')) {
            return;
        }

        if (href !== '#' && href !== '#contact') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

/* ============================================
   DETECÇÃO DE VIEWPORT E OTIMIZAÇÕES
   ============================================ */

function handleViewportChange() {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        // Otimizações para mobile
        document.body.classList.add('mobile-view');
    } else {
        document.body.classList.remove('mobile-view');
    }
}

window.addEventListener('resize', handleViewportChange);
handleViewportChange();

/* ============================================
   PERFORMANCE - LAZY LOADING DE IMAGENS
   ============================================ */

function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Inicializar lazy loading quando disponível
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLazyLoading);
} else {
    initializeLazyLoading();
}

/* ============================================
   ANALYTICS E RASTREAMENTO (OPCIONAL)
   ============================================ */

function trackTabChange(tabName) {
    // Implementar rastreamento de navegação
    // Exemplo: enviar para Google Analytics, Mixpanel, etc.
    if (window.gtag) {
        gtag('event', 'tab_change', {
            'tab_name': tabName
        });
    }
}

/* ============================================
   VALIDAÇÃO DE FORMULÁRIOS (SE NECESSÁRIO)
   ============================================ */

function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input, textarea, select');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });

    return isValid;
}

/* ============================================
   SUPORTE A NAVEGAÇÃO COM HISTÓRICO
   ============================================ */

window.addEventListener('popstate', function(event) {
    if (event.state && event.state.tab) {
        openTab(event.state.tab);
    }
});

/* ============================================
   INICIALIZAÇÃO DE TOOLTIPS (OPCIONAL)
   ============================================ */

function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');

    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);

            const rect = this.getBoundingClientRect();
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
            tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
        });

        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

/* ============================================
   DETECÇÃO DE CONEXÃO
   ============================================ */

function checkConnection() {
    if (!navigator.onLine) {
        console.warn('Sem conexão com a internet');
        // Mostrar mensagem ao usuário se necessário
    }
}

window.addEventListener('online', checkConnection);
window.addEventListener('offline', checkConnection);

/* ============================================
   CONSOLE LOG PARA DEBUG (REMOVER EM PRODUÇÃO)
   ============================================ */

console.log('Portfolio de Luiz Eduardo Crisanto carregado com sucesso!');
console.log('Navegação inicializada');
