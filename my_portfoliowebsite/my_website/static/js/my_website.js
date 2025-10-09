// DOM Elements
const navbar = document.querySelector('.navbar');
const navMenu = document.querySelector('.nav-menu');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.querySelector('#themeToggle');
const themeDropdown = document.querySelector('#themeDropdown');
const themeOptions = document.querySelectorAll('.theme-option');
const contactForm = document.getElementById('contactForm');

// Theme Management
let currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateActiveTheme();

// Theme Toggle Click
themeToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    themeDropdown.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!themeToggle.contains(e.target) && !themeDropdown.contains(e.target)) {
        themeDropdown.classList.remove('active');
    }
});

// Theme Option Click
themeOptions.forEach(option => {
    option.addEventListener('click', () => {
        const selectedTheme = option.getAttribute('data-theme');
        currentTheme = selectedTheme;
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        updateActiveTheme();
        updateNavbarBackground();
        themeDropdown.classList.remove('active');
    });
});

function updateActiveTheme() {
    themeOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-theme') === currentTheme) {
            option.classList.add('active');
        }
    });
}

function updateNavbarBackground() {
    const scrollPos = window.scrollY;
    let navBg;
    
    switch(currentTheme) {
        case 'purple':
            navBg = scrollPos > 50 ? 'rgba(139, 92, 246, 0.98)' : 'rgba(139, 92, 246, 0.95)';
            break;
        case 'yellow':
            navBg = scrollPos > 50 ? 'rgba(250, 204, 21, 0.98)' : 'rgba(250, 204, 21, 0.95)';
            break;
        case 'lime-green':
            navBg = scrollPos > 50 ? 'rgba(34, 197, 94, 0.98)' : 'rgba(34, 197, 94, 0.95)';
            break;
        case 'azure-blue':
            navBg = scrollPos > 50 ? 'rgba(37, 99, 235, 0.98)' : 'rgba(37, 99, 235, 0.95)';
            break;
        default: // light
            navBg = scrollPos > 50 ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)';
    }
    
    navbar.style.background = navBg;
}

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active Navigation Link on Scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    updateNavbarBackground();
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .skill-item, .contact-item, .about-card, .stat-item');
    animateElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });
});

// Skill Progress Animation
function animateSkills() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

// Trigger skill animation when skills section is visible
const skillsSection = document.querySelector('#skills');
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkills();
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// Contact Form Handling
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Message sent successfully!', 'success');
        contactForm.reset();
        
        // In a real application, you would send the data to a server here
        console.log('Form Data:', { name, email, subject, message });
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Parallax effect for home section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const homeSection = document.querySelector('.home-section');
    if (homeSection) {
        const rate = scrolled * -0.5;
        homeSection.style.transform = `translateY(${rate}px)`;
    }
});

// Typing effect for home title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    const homeTitle = document.querySelector('.home-title');
    if (homeTitle) {
        const originalText = homeTitle.textContent;
        setTimeout(() => {
            typeWriter(homeTitle, originalText, 50);
        }, 1000);
    }
});

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-item h4');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + (counter.textContent.includes('+') ? '+' : '');
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when about section is visible
const aboutSection = document.querySelector('#about');
const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            aboutObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (aboutSection) {
    aboutObserver.observe(aboutSection);
}

// Smooth reveal animation for sections
const revealElements = document.querySelectorAll('section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(50px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(element);
});

// Add hover effects to service cards
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add loading animation to page
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Add ripple effect to buttons
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple effect to all buttons
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.addEventListener('click', createRipple);
    });
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Language Translations
const translations = {
    en: {
        nav: ["Home", "About", "Services", "Skills", "Contact"],
        homeTitle: "Hi, I'm <span class='highlight'>Sandip Patel</span>",
        homeSubtitle: "Python Developer & Designer",
        homeDescription: "Creative web Developer with project based experience. I will develop your website.",
        homeBtn1: "Get In Touch",
        homeBtn2: "Get In Resume",
        homeBtn3: "Get In Resume",
        aboutTitle: "About Me",
        aboutSubtitle: "Get to know me better",
        aboutRole: "Python Developer & Designer",
        aboutP1: "I specialize in developing dynamic and responsive websites and applications using Python and modern design principles.",
        aboutP2: "With a blend of backend logic and frontend design, I create seamless digital experiences that work flawlessly across devices.",
        aboutP3: "Passionate about both coding and creativity, I strive to turn ideas into impactful digital solutions.",
        aboutStats: ["Projects Completed", "Years Experience", "Client Satisfaction"],
        aboutCardTitle: "Python Developer",
        aboutCardDesc: "I am a Python Developer, building digital experiences with clean code and creative design.",
        servicesTitle: "My Services",
        servicesSubtitle: "What I can do for you",
        services: [
            {title: "Web Development", desc: "Custom websites built with modern technologies and best practices for optimal performance and user experience."},
            {title: "Responsive Design", desc: "Mobile-first design approach ensuring your website looks and works perfectly on all devices and screen sizes."},
            {title: "UI/UX Design", desc: "Beautiful and intuitive user interfaces designed with user experience in mind to maximize engagement and conversions."},
            {title: "Web Maintenance", desc: "Ongoing support and maintenance to keep your website secure, updated, and performing at its best."},
            {title: "SEO Optimization", desc: "Search engine optimization to improve your website's visibility and drive more organic traffic to your business."},
            {title: "Performance Optimization", desc: "Speed optimization and performance improvements to ensure fast loading times and better user experience."}
        ],
        skillsTitle: "My Skills",
        skillsSubtitle: "Technologies I work with",
        frontend: "Frontend Development",
        tools: "Tools & Technologies",
        contactTitle: "Get In Touch",
        contactSubtitle: "Let's work together",
        contact: ["Email", "Phone", "Location"],
        contactForm: ["Your Name", "Your Email", "Subject", "Your Message", "Send Message"],
        footer1: "© 2025 Sandip Patel. All rights reserved.",
        footer2: "Designed with ❤️ by Sandip"
    },
    gu: {
        nav: ["હોમ", "વિશે", "સેવાઓ", "કૌશલ્ય", "સંપર્ક"],
        homeTitle: "હું છું <span class='highlight'>સંદિપ પટેલ</span>",
        homeSubtitle: "પાયથન ડેવલપર અને ડિઝાઇનર",
        homeDescription: "સર્જનાત્મક વેબ ડેવલપર પ્રોજેક્ટ આધારિત અનુભવ સાથે. હું તમારી વેબસાઇટ વિકસાવીશ.",
        homeBtn1: "સંપર્ક કરો",
        homeBtn2: "રિઝ્યુમ મેળવો",
        homeBtn3: "રિઝ્યુમ મેળવો",
        aboutTitle: "મારા વિશે",
        aboutSubtitle: "મને વધુ જાણો",
        aboutRole: "પાયથન ડેવલપર અને ડિઝાઇનર",
        aboutP1: "હું પાયથન અને આધુનિક ડિઝાઇન સિદ્ધાંતોનો ઉપયોગ કરીને ડાયનામિક અને પ્રતિસાદી વેબસાઇટ્સ અને એપ્લિકેશન્સ વિકસાવવામાં નિષ્ણાત છું.",
        aboutP2: "બેકએન્ડ લોજિક અને ફ્રન્ટએન્ડ ડિઝાઇનના સંયોજન સાથે, હું તમામ ઉપકરણોમાં નિર્વિઘ્ન ડિજિટલ અનુભવ બનાવું છું.",
        aboutP3: "કોડિંગ અને સર્જનાત્મકતા બંને માટે ઉત્સાહી, હું વિચારોને અસરકારક ડિજિટલ સોલ્યુશન્સમાં ફેરવવા માટે પ્રયત્નશીલ છું.",
        aboutStats: ["પ્રોજેક્ટ્સ પૂર્ણ", "વર્ષોનો અનુભવ", "ક્લાયન્ટ સંતોષ"],
        aboutCardTitle: "પાયથન ડેવલપર",
        aboutCardDesc: "હું પાયથન ડેવલપર છું, સ્વચ્છ કોડ અને સર્જનાત્મક ડિઝાઇન સાથે ડિજિટલ અનુભવ બનાવું છું.",
        servicesTitle: "મારી સેવાઓ",
        servicesSubtitle: "હું તમારા માટે શું કરી શકું",
        services: [
            {title: "વેબ ડેવલપમેન્ટ", desc: "આધુનિક ટેક્નોલોજી અને શ્રેષ્ઠ પ્રથાઓ સાથે કસ્ટમ વેબસાઇટ્સ."},
            {title: "પ્રતિસાદી ડિઝાઇન", desc: "તમારી વેબસાઇટ તમામ ઉપકરણો પર સંપૂર્ણ રીતે દેખાય અને કાર્ય કરે તે માટે મોબાઇલ-પ્રથમ અભિગમ."},
            {title: "UI/UX ડિઝાઇન", desc: "વપરાશકર્તા અનુભવને ધ્યાનમાં રાખીને સુંદર અને સરળ ઇન્ટરફેસ ડિઝાઇન."},
            {title: "વેબ મેન્ટેનન્સ", desc: "તમારી વેબસાઇટને સુરક્ષિત, અપડેટેડ અને શ્રેષ્ઠ સ્થિતિમાં રાખવા માટે સતત સપોર્ટ."},
            {title: "SEO ઓપ્ટિમાઇઝેશન", desc: "તમારી વેબસાઇટની દૃશ્યતા સુધારવા માટે સર્ચ એન્જિન ઓપ્ટિમાઇઝેશન."},
            {title: "પરફોર્મન્સ ઓપ્ટિમાઇઝેશન", desc: "ઝડપી લોડિંગ અને શ્રેષ્ઠ અનુભવ માટે સ્પીડ ઓપ્ટિમાઇઝેશન."}
        ],
        skillsTitle: "મારા કૌશલ્ય",
        skillsSubtitle: "હું જે ટેક્નોલોજી સાથે કામ કરું છું",
        frontend: "ફ્રન્ટએન્ડ ડેવલપમેન્ટ",
        tools: "ટૂલ્સ અને ટેક્નોલોજી",
        contactTitle: "સંપર્ક કરો",
        contactSubtitle: "ચાલો સાથે કામ કરીએ",
        contact: ["ઇમેઇલ", "ફોન", "સ્થાન"],
        contactForm: ["તમારું નામ", "તમારો ઇમેઇલ", "વિષય", "તમારો સંદેશ", "મેસેજ મોકલો"],
        footer1: "© 2025 સંદીપ પટેલ. સર્વાધિકાર સુરક્ષિત.",
        footer2: "પ્રેમથી ડિઝાઇન કર્યું સંદીપ દ્વારા"
    },
    hi: {
        nav: ["होम", "परिचय", "सेवाएँ", "कौशल", "संपर्क"],
        homeTitle: "नमस्ते, मैं हूँ <span class='highlight'>संदीप पटेल</span>",
        homeSubtitle: "पायथन डेवलपर और डिज़ाइनर",
        homeDescription: "क्रिएटिव वेब डेवलपर प्रोजेक्ट आधारित अनुभव के साथ। मैं आपकी वेबसाइट विकसित करूँगा।",
        homeBtn1: "संपर्क करें",
        homeBtn2: "रिज्यूम प्राप्त करें",
        homeBtn3: "रिज्यूम प्राप्त करें",
        aboutTitle: "मेरे बारे में",
        aboutSubtitle: "मुझे बेहतर जानें",
        aboutRole: "पायथन डेवलपर और डिज़ाइनर",
        aboutP1: "मैं पायथन और आधुनिक डिज़ाइन सिद्धांतों का उपयोग करके डायनामिक और रिस्पॉन्सिव वेबसाइट्स और एप्लिकेशन विकसित करता हूँ।",
        aboutP2: "बैकएंड लॉजिक और फ्रंटएंड डिज़ाइन के संयोजन से, मैं सभी डिवाइस पर सहज डिजिटल अनुभव बनाता हूँ।",
        aboutP3: "कोडिंग और रचनात्मकता दोनों के प्रति जुनूनी, मैं विचारों को प्रभावशाली डिजिटल समाधान में बदलने का प्रयास करता हूँ।",
        aboutStats: ["प्रोजेक्ट्स पूरे", "सालों का अनुभव", "क्लाइंट संतुष्टि"],
        aboutCardTitle: "पायथन डेवलपर",
        aboutCardDesc: "मैं एक पायथन डेवलपर हूँ, जो साफ़ कोड और रचनात्मक डिज़ाइन के साथ डिजिटल अनुभव बनाता हूँ।",
        servicesTitle: "मेरी सेवाएँ",
        servicesSubtitle: "मैं आपके लिए क्या कर सकता हूँ",
        services: [
            {title: "वेब डेवलपमेंट", desc: "आधुनिक तकनीकों और सर्वोत्तम प्रथाओं के साथ कस्टम वेबसाइट्स।"},
            {title: "रिस्पॉन्सिव डिज़ाइन", desc: "आपकी वेबसाइट सभी डिवाइस पर सही दिखे और काम करे इसके लिए मोबाइल-फर्स्ट दृष्टिकोण।"},
            {title: "UI/UX डिज़ाइन", desc: "यूजर एक्सपीरियंस को ध्यान में रखते हुए सुंदर અને સરળ ઇન્ટરફેસ ડિઝાઇન।"},
            {title: "वेब मेंटेनेंस", desc: "आपकी वेबसाइट को सुरक्षित, अपडेटेड और बेहतरीन स्थिति में रखने के लिए निरंतर समर्थन।"},
            {title: "SEO ऑप्टिमाइज़ेशन", desc: "आपकी वेबसाइट की दृश्यता बढ़ाने के लिए सर्च इंजन ऑप्टिमाइज़ेशन।"},
            {title: "परफॉरमेंस ऑप्टिमाइज़ेशन", desc: "तेज़ लोडिंग और बेहतर अनुभव के लिए स्पीड ऑप्टिमाइज़ेशन।"}
        ],
        skillsTitle: "मेरे कौशल",
        skillsSubtitle: "मैं जिन तकनीकों के साथ काम करता हूँ",
        frontend: "फ्रंटएंड डेवलपमेंट",
        tools: "टूल्स और टेक्नोलॉजी",
        contactTitle: "संपर्क करें",
        contactSubtitle: "आइए साथ काम करें",
        contact: ["ईमेल", "फोन", "स्थान"],
        contactForm: ["आपका नाम", "आपका ईमेल", "विषय", "आपका संदेश", "संदेश भेजें"],
        footer1: "© 2025 संदीप पटेल. सर्वाधिकार सुरक्षित.",
        footer2: "प्रेम से डिज़ाइन किया संदीप द्वारा"
    }
};

const languageDropdown = document.getElementById('languageDropdown');
let currentLang = localStorage.getItem('lang') || 'en';

function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    const t = translations[lang];
    // Navigation
    document.querySelectorAll('.nav-link').forEach((el, i) => {
        el.innerHTML = t.nav[i];
    });
    // Home
    const homeTitle = document.querySelector('.home-title');
    if (homeTitle) homeTitle.innerHTML = t.homeTitle;
    const homeSubtitle = document.querySelector('.home-subtitle');
    if (homeSubtitle) homeSubtitle.textContent = t.homeSubtitle;
    const homeDesc = document.querySelector('.home-description');
    if (homeDesc) homeDesc.textContent = t.homeDescription;
    const homeBtns = document.querySelectorAll('.home-buttons .btn');
    if (homeBtns[0]) homeBtns[0].textContent = t.homeBtn1;
    if (homeBtns[1]) homeBtns[1].textContent = t.homeBtn2;
    // About
    const aboutTitle = document.querySelector('#about .section-title');
    if (aboutTitle) aboutTitle.textContent = t.aboutTitle;
    const aboutSubtitle = document.querySelector('#about .section-subtitle');
    if (aboutSubtitle) aboutSubtitle.textContent = t.aboutSubtitle;
    const aboutRole = document.querySelector('.about-text h3');
    if (aboutRole) aboutRole.textContent = t.aboutRole;
    const aboutPs = document.querySelectorAll('.about-text p');
    if (aboutPs[0]) aboutPs[0].textContent = t.aboutP1;
    if (aboutPs[1]) aboutPs[1].textContent = t.aboutP2;
    if (aboutPs[2]) aboutPs[2].textContent = t.aboutP3;
    const aboutStats = document.querySelectorAll('.about-stats .stat-item p');
    aboutStats.forEach((el, i) => { el.textContent = t.aboutStats[i]; });
    const aboutCardTitle = document.querySelector('.about-card h4');
    if (aboutCardTitle) aboutCardTitle.textContent = t.aboutCardTitle;
    const aboutCardDesc = document.querySelector('.about-card p');
    if (aboutCardDesc) aboutCardDesc.textContent = t.aboutCardDesc;
    // Services
    const servicesTitle = document.querySelector('#services .section-title');
    if (servicesTitle) servicesTitle.textContent = t.servicesTitle;
    const servicesSubtitle = document.querySelector('#services .section-subtitle');
    if (servicesSubtitle) servicesSubtitle.textContent = t.servicesSubtitle;
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, i) => {
        const h3 = card.querySelector('h3');
        const p = card.querySelector('p');
        if (h3) h3.textContent = t.services[i].title;
        if (p) p.textContent = t.services[i].desc;
    });
    // Skills
    const skillsTitle = document.querySelector('#skills .section-title');
    if (skillsTitle) skillsTitle.textContent = t.skillsTitle;
    const skillsSubtitle = document.querySelector('#skills .section-subtitle');
    if (skillsSubtitle) skillsSubtitle.textContent = t.skillsSubtitle;
    const frontend = document.querySelectorAll('.skills-category h3')[0];
    if (frontend) frontend.textContent = t.frontend;
    const tools = document.querySelectorAll('.skills-category h3')[1];
    if (tools) tools.textContent = t.tools;
    // Contact
    const contactTitle = document.querySelector('#contact .section-title');
    if (contactTitle) contactTitle.textContent = t.contactTitle;
    const contactSubtitle = document.querySelector('#contact .section-subtitle');
    if (contactSubtitle) contactSubtitle.textContent = t.contactSubtitle;
    const contactItems = document.querySelectorAll('.contact-item h4');
    contactItems.forEach((el, i) => { el.textContent = t.contact[i]; });
    // Contact Form
    const formInputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
    if (formInputs[0]) formInputs[0].placeholder = t.contactForm[0];
    if (formInputs[1]) formInputs[1].placeholder = t.contactForm[1];
    if (formInputs[2]) formInputs[2].placeholder = t.contactForm[2];
    if (formInputs[3]) formInputs[3].placeholder = t.contactForm[3];
    const sendBtn = document.querySelector('#contactForm button');
    if (sendBtn) sendBtn.textContent = t.contactForm[4];
    // Footer
    const footerPs = document.querySelectorAll('.footer-content p');
    if (footerPs[0]) footerPs[0].textContent = t.footer1;
    if (footerPs[1]) footerPs[1].textContent = t.footer2;
}

if (languageDropdown) {
    languageDropdown.value = currentLang;
    updateLanguage(currentLang);
    languageDropdown.addEventListener('change', (e) => {
        updateLanguage(e.target.value);
    });
} else {
    document.addEventListener('DOMContentLoaded', () => {
        const languageDropdown = document.getElementById('languageDropdown');
        if (languageDropdown) {
            languageDropdown.value = currentLang;
            updateLanguage(currentLang);
            languageDropdown.addEventListener('change', (e) => {
                updateLanguage(e.target.value);
            });
        }
    });
} 
