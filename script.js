class Star {
    constructor(canvas) {
        this.canvas = canvas;

        const extendX = canvas.width * 0.2;
        const extendY = canvas.height * 0.2;

        this.baseX = Math.random() * (canvas.width + 2 * extendX) - extendX;
        this.baseY = Math.random() * (canvas.height + 2 * extendY) - extendY;

        this.x = this.baseX;
        this.y = this.baseY;

        this.star_size = Math.random() * 2 + 1;
        this.opacity = 0;
        this.fadeDirection = 1; // 1 fade in, -1 fade out
        this.fadeSpeed = Math.random() * 0.02 + 0.005;
        this.maxOpacity = Math.random() * 0.8;
        this.color = this.getRandomColor();
        this.parallax_depth = Math.random() * 0.15 + 0.02;
    }

    getRandomColor() {
        const colors = [
            '#ffffff',
            '#afafaf',
            '#ffffcc',
            '#ccd8ffff',
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update(mouseX, mouseY, scrollX, scrollY, parallaxEnabled) {
        this.opacity += this.fadeDirection * this.fadeSpeed;

        if (this.opacity >= this.maxOpacity) {
            this.fadeDirection = -1;
        }
        else if (this.opacity <= 0) {
            this.fadeDirection = 1;

            // repositioning
            if (Math.random() < 0.7) {
                const extendX = this.canvas.width * 0.2;
                const extendY = this.canvas.height * 0.2;

                this.baseX = Math.random() * (this.canvas.width + 2 * extendX) - extendX;
                this.baseY = Math.random() * (this.canvas.height + 2 * extendY) - extendY;
                this.maxOpacity = Math.random() * 0.8;
                this.color = this.getRandomColor();
                this.parallax_depth = Math.random() * 0.15 + 0.02;
            }
        }

        this.opacity = Math.max(0, Math.min(this.maxOpacity, this.opacity));

        if (parallaxEnabled) {
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            
            const mouseOffsetX = -(mouseX - centerX) * this.parallax_depth;
            const mouseOffsetY = -(mouseY - centerY) * this.parallax_depth;
            
            const scrollOffsetX = -scrollX * this.parallax_depth * 0.3;
            const scrollOffsetY = -scrollY * this.parallax_depth * 0.3;
            
            this.x = this.baseX + mouseOffsetX + scrollOffsetX;
            this.y = this.baseY + mouseOffsetY + scrollOffsetY;
        } else {
            this.x = this.baseX;
            this.y = this.baseY;
        }
    }

    draw(context) {
        if (this.opacity > 0) {
            context.save();
            context.globalAlpha = this.opacity;
            context.fillStyle = this.color;
            
            context.beginPath();
            context.arc(this.x, this.y, this.star_size, 0, Math.PI * 2);
            context.fill();
            
            // glow effect
            context.shadowColor = this.color;
            context.shadowBlur = this.star_size * 2;
            context.beginPath();
            context.arc(this.x, this.y, this.star_size * 0.5, 0, Math.PI * 2);
            context.fill();
            
            context.restore();
        }
    }
}

class Starfield {
    constructor() {
        this.canvas = document.getElementById('starfield');
        this.context = this.canvas.getContext('2d');
        this.stars = [];
        this.numStars = 200;
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;
        this.scrollX = 0;
        this.scrollY = 0;
        this.parallaxEnabled = false;

        this.init();
        this.animate();
        
        setTimeout(() => {
            this.parallaxEnabled = true;
        }, 2000);
    }

    init() {
        this.restar_sizeCanvas();
        this.createStars();
        
        window.addEventListener('restar_size', () => this.restar_sizeCanvas());
        
        // mouse movement (track across entire document)
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        // touch movement for mobile (track across entire document)
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.mouseX = touch.clientX;
            this.mouseY = touch.clientY;
        });
        
        // scroll movement
        window.addEventListener('scroll', () => {
            this.scrollX = window.scrollX || window.pageXOffset;
            this.scrollY = window.scrollY || window.pageYOffset;
        });
    }

    restar_sizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createStars() {
        this.stars = [];
        for (let i = 0; i < this.numStars; i++) {
            this.stars.push(new Star(this.canvas));
        }
    }

    animate() {
        this.context.fillStyle = '#000000';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.stars.forEach(star => {
            star.update(this.mouseX, this.mouseY, this.scrollX, this.scrollY, this.parallaxEnabled);
            star.draw(this.context);
        });

        requestAnimationFrame(() => this.animate());
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new Starfield();
    
    // Button event listeners
    const navbar = document.getElementById('navbar');
    const yesButton = document.getElementById('yes-button');
    const noButton = document.getElementById('no-button');
    const aboutCard = document.getElementById('about-card');
    const agreement = document.getElementById('agreement');
    
    if (yesButton && noButton && aboutCard) {
        // Yes button - show about card
        yesButton.addEventListener('click', () => {
            aboutCard.style.display = 'block';
            agreement.style.display = 'none';
            aboutCard.removeAttribute('hidden');
            aboutCard.innerHTML = `
                <img src="assets/kanade-banner.png">
                <h1 class="h1-body">自分について - ABOUT ME</h1>
                <p class="text-body mb-2">I'm a 21+ y.o. person who loves to play rhythm games (i'm bad at it), rpg games, and watch various anime.</p>
                <p class="text-body mb-2">I also collect merch, especially for Project Sekai !!</p>
                <div class="box">
                    <p class="text-body mb-0 text-bold">!! HEAVY RT ACCOUNT, NOT NSFW FREE !!</p>
                </div>
                <p class="text-body mb-2">I often randomly join any moots' convo on TL, if you're not comfy pls let me know!!</p>
                <p class="text-body mb-2">Life is busy, I will be either kinda inactive or just active in one period of time.</p>
            `;
            navbar.innerHTML = `
                <a class="text-navbar" style="margin-left: 10%;" href="https://x.com/cfyia">@cfyia</a>
                <a class="text-navbar" style="margin-left: 25%;" href="./"> > home</a>
                <a class="text-navbar" style="margin-left: 38%;" href="./fandom">fandom</a>`
        });
        
        noButton.addEventListener('click', () => {
            aboutCard.style.display = 'block';
            agreement.style.display = 'none';
            aboutCard.innerHTML = '<p class="text-body">feel free to leave</p>';
        });
    }
});