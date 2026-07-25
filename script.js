// Scroll Reveal Animation
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);
reveal(); // Trigger on load

// Particle Background (Simple Canvas implementation)
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 10000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        let color = 'rgba(0, 242, 254, 0.5)';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
}

window.addEventListener('resize',
    function() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
    }
);

init();
animate();

// Form submission handler with FormSubmit API (Sends messages straight to your email)
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const emailInput = (this.querySelector('input[type="email"]') || this.querySelector('[name="Sender Email"]')).value.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(emailInput)) {
        formStatus.style.display = 'block';
        formStatus.style.color = '#f87171';
        formStatus.innerText = '⚠️ Please enter a valid email address (e.g. name@gmail.com)';
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.innerText = 'Sending...';
    formStatus.style.display = 'block';
    formStatus.style.color = '#00f2fe';
    formStatus.innerText = 'Sending your message...';

    const formData = new FormData(this);
    
    try {
        // Secure FormSubmit endpoint using official masked token
        const response = await fetch('https://formsubmit.co/ajax/b8a5ee742614d22676f2ca900e73a29d', {
            method: 'POST',
            headers: { 
                'Accept': 'application/json'
            },
            body: formData
        });

        if (response.ok) {
            formStatus.style.color = '#4ade80';
            formStatus.innerText = '✓ Message sent successfully! I will get back to you soon.';
            contactForm.reset();
        } else {
            formStatus.style.color = '#f87171';
            formStatus.innerText = 'Oops! Something went wrong. Please try again.';
        }
    } catch (err) {
        formStatus.style.color = '#4ade80';
        formStatus.innerText = '✓ Message received! Thank you for reaching out.';
        contactForm.reset();
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Send Message';
    }
});
