// nav.js - Navigation globale SCCS (sans CSP issues)
(function() {
    'use strict';
    
    console.log('SCCS Nav: Chargement...');

    const BOOKLETS = [
        { id: 'fiche', file: 'Fiche%20de%20personnage.v0.86.html', label: 'Fiche', icon: '📋' },
        { id: 'livret1', file: 'Livret1-Mecanismes.v0.84.html', label: 'Mécanismes', icon: '⚙️' },
        { id: 'livret2', file: 'Livret2-Creation.v0.73.html', label: 'Création', icon: '🌱' },
        { id: 'livret3', file: 'Livret3-Equipement.v0.77.html', label: 'Équipement', icon: '📜' },
        { id: 'livret4', file: 'Livret4-Rencontres.v0.79.html', label: 'Rencontres', icon: '🐉' },
        { id: 'livret5', file: 'Livret5-Bestiaire.v0.79.html', label: 'Bestiaire', icon: '🐾' }
    ];

    // Détection page courante
    const currentFile = window.location.pathname.split('/').pop() || 
                       window.location.href.split('/').pop();
    const currentBooklet = BOOKLETS.find(b => {
        const decoded = decodeURIComponent(b.file);
        return currentFile.includes(decoded) || currentFile.includes(b.id);
    }) || BOOKLETS[0];

    console.log('Current:', currentBooklet.label);

    // Création du conteneur principal
    const nav = document.createElement('nav');
    nav.style.position = 'fixed';
    nav.style.right = '0';
    nav.style.top = '80px';
    nav.style.height = 'calc(100vh - 80px)';
    nav.style.width = '50px';
    nav.style.background = 'linear-gradient(to left, #2c2520, #1c1917)';
    nav.style.borderLeft = '3px solid #7c2d12';
    nav.style.zIndex = '9999';
    nav.style.display = 'flex';
    nav.style.flexDirection = 'column';
    nav.style.boxShadow = '-4px 0 20px rgba(0,0,0,0.5)';

    // Conteneur interne
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.height = '100%';
    container.style.overflowY = 'auto';
    container.style.overflowX = 'hidden';
    container.style.scrollbarWidth = 'none';
    container.style.msOverflowStyle = 'none';
    container.style.padding = '10px 0';
    container.style.gap = '8px';
    container.style.alignItems = 'center';

    // Création des liens
    BOOKLETS.forEach(booklet => {
        const isActive = booklet.id === currentBooklet.id;
        
        const link = document.createElement('a');
        link.href = booklet.file.replace('%20', ' ');
        link.title = booklet.label;
        link.setAttribute('data-booklet', booklet.id);
        
        // Styles de base
        link.style.writingMode = 'vertical-rl';
        link.style.textOrientation = 'mixed';
        link.style.transform = 'rotate(180deg)';
        link.style.fontFamily = 'Cinzel, serif';
        link.style.fontSize = '11px';
        link.style.fontWeight = '600';
        link.style.color = '#d8c3a5';
        link.style.textDecoration = 'none';
        link.style.padding = '12px 4px';
        link.style.margin = '0 4px';
        link.style.borderRadius = '4px 0 0 4px';
        link.style.border = '1px solid rgba(124, 45, 18, 0.5)';
        link.style.borderRight = 'none';
        link.style.background = isActive ? '#7c2d12' : 'rgba(0,0,0,0.3)';
        link.style.minHeight = '80px';
        link.style.display = 'flex';
        link.style.flexDirection = 'column';
        link.style.alignItems = 'center';
        link.style.justifyContent = 'center';
        link.style.textAlign = 'center';
        link.style.letterSpacing = '0.1em';
        link.style.lineHeight = '1.2';
        link.style.cursor = 'pointer';
        link.style.transition = 'all 0.3s ease';
        link.style.position = 'relative';
        link.style.width = '42px';
        
        if (isActive) {
            link.style.color = '#f4ecd8';
            link.style.boxShadow = '-4px 0 15px rgba(124, 45, 18, 0.6)';
            link.style.fontWeight = '700';
            
            // Indicateur actif
            const indicator = document.createElement('span');
            indicator.style.position = 'absolute';
            indicator.style.left = '0';
            indicator.style.top = '20%';
            indicator.style.height = '60%';
            indicator.style.width = '3px';
            indicator.style.background = '#d8c3a5';
            indicator.style.borderRadius = '0 2px 2px 0';
            link.appendChild(indicator);
        }

        // Hover effects via JS pour éviter CSS dynamique
        link.addEventListener('mouseenter', function() {
            this.style.background = '#7c2d12';
            this.style.color = '#fff';
            this.style.width = '55px';
            this.style.marginLeft = '-5px';
            this.style.zIndex = '10000';
        });
        
        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active-custom')) {
                this.style.background = isActive ? '#7c2d12' : 'rgba(0,0,0,0.3)';
                this.style.color = isActive ? '#f4ecd8' : '#d8c3a5';
            }
            this.style.width = '42px';
            this.style.marginLeft = '0';
            this.style.zIndex = 'auto';
        });

        // Icône
        const icon = document.createElement('span');
        icon.textContent = booklet.icon;
        icon.style.fontSize = '16px';
        icon.style.marginBottom = '6px';
        icon.style.writingMode = 'horizontal-tb';
        icon.style.transform = 'rotate(180deg)';
        
        // Texte
        const text = document.createElement('span');
        text.textContent = booklet.label;
        
        link.appendChild(icon);
        link.appendChild(text);
        container.appendChild(link);
    });

    nav.appendChild(container);

    // Injection dès que le body est disponible
    function insert() {
        if (document.body) {
            document.body.appendChild(nav);
            console.log('SCCS Nav: OK');
        } else {
            setTimeout(insert, 50);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insert);
    } else {
        insert();
    }
})();
