
lucide.createIcons();


document.getElementById('year').textContent = new Date().getFullYear();


const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const moonIcon = document.querySelector('.moon-icon');
const sunIcon = document.querySelector('.sun-icon');


const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    moonIcon.style.display = 'none';
    sunIcon.style.display = 'block';
}


themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
        localStorage.setItem('theme', 'dark');
        
        if (window.backgroundManager && window.backgroundManager.switchMode) {
            window.backgroundManager.switchMode('star');
        }
    } else {
        moonIcon.style.display = 'block';
        sunIcon.style.display = 'none';
        localStorage.setItem('theme', 'light');
       
        if (window.backgroundManager && window.backgroundManager.switchMode) {
            window.backgroundManager.switchMode('snow');
        }
    }
    
    
    lucide.createIcons();
});


if (window.backgroundManager && window.backgroundManager.switchMode) {
    if (body.classList.contains('dark-mode')) window.backgroundManager.switchMode('star');
    else window.backgroundManager.switchMode('snow');
}


const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};


lucide.createIcons();


document.getElementById('year').textContent = new Date().getFullYear();



const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillItem = entry.target;
            const progress = skillItem.querySelector('.skill-progress');
            const level = skillItem.dataset.level;

            
            setTimeout(() => {
                progress.style.width = level + '%';
            }, 100);

            
            skillObserver.unobserve(skillItem);
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-item').forEach(item => {
    skillObserver.observe(item);
});



document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
       
        if (href !== '#' && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});


const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});


document.querySelectorAll('.wave-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(section);
});


let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.float-animation');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
            
            ticking = false;
        });
        ticking = true;
    }
});

console.log('Portfolio website loaded successfully!');


