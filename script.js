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
                const extendX = this.canvas.width * 0.5;
                const extendY = this.canvas.height * 0.5;

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
            
            const scrollOffsetX = -scrollX * this.parallax_depth;
            const scrollOffsetY = -scrollY * this.parallax_depth;
            
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
        }, 0);
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

// Source - https://stackoverflow.com/a
// Posted by Rickard Elimää, modified by community. See post 'Timeline' for change history
// Retrieved 2025-11-25, License - CC BY-SA 4.0

class Sparkle {
    constructor() {
        this.trailArr = [1, .9, .8, .5, .25, .6, .4, .3, .2];
        this.sparklesArr = [];
        this.ANIMATION_SPEED = 1100;
        this.init();
    }

    init() {
        this.moveSparkles();
        
        window.addEventListener('mousemove', (e) => {
            this.trailArr.forEach((i) => {this.trailAnimation(e, i)});
            
            let maxYTranslation = 80;
            this.trailArr.forEach((i) => {this.trailAnimation(e, i, maxYTranslation)});
        }, false);
    }

    trailAnimation(e, i, maxYTranslation) {
        let elem = document.createElement('div');
        
        elem = this.styleSparkle(elem, e, i);
        
        elem.classList.add("sparkle");
        
        document.body.appendChild(elem);
        
        elem = this.addAnimationProperties(elem, i, maxYTranslation);
        
        this.sparklesArr.push(elem);
    }

    getRandomColor() {
        const colors = [
            '#ffffff',
            '#ffccd7ff',
            '#ffffcc',
            '#ccffdaff',
            '#cce3ffff',
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    styleSparkle(elem, e, i) {
        let j = (1 - i) * 50;
        let size = Math.random() * 4 + 1 + 'px';
        
        elem.style.top = e.pageY - window.scrollY + Math.round(Math.random() * j - j / 2) + 'px';
        elem.style.left = e.pageX + Math.round(Math.random() * j - j / 2) + 'px';
        
        elem.style.width = size;
        elem.style.height = size;
        elem.style.borderRadius = size;
        
        elem.style.background = this.getRandomColor();
        
        return elem;
    }

    addAnimationProperties(elem, i, maxYTranslation) {
        let lifeExpectancy = Math.round(Math.random() * i * this.ANIMATION_SPEED);
        
        elem.maxYTranslation = maxYTranslation;
        elem.animationSpeed = this.ANIMATION_SPEED;
        elem.created = Date.now();
        elem.diesAt = elem.created + lifeExpectancy;
        
        return elem;
    }

    moveSparkles() {
        let remove = false;
        let moveIndex = 0;
        let sparkle;
        
        for (let i = 0; i < this.sparklesArr.length; i++) {
            sparkle = this.sparklesArr[i];
            remove = sparkle.diesAt <= Date.now();
            
            if (remove) {
                document.body.removeChild(sparkle);
            } else {
                if (sparkle.maxYTranslation) {
                    let interpolation = this.calculateInterpolation(sparkle);
                    sparkle.style.transform = `translateY(${interpolation}px)`; 
                }
                
                this.sparklesArr[moveIndex++] = sparkle;   
            }
        }
        
        this.sparklesArr.length = moveIndex;
        requestAnimationFrame(() => this.moveSparkles());
    }

    calculateInterpolation(sparkle) {
        let currentMillis = Date.now();
        let lifeProgress = (currentMillis - sparkle.created) / sparkle.animationSpeed;
        let interpolation = sparkle.maxYTranslation * lifeProgress;
        
        return interpolation;
    }
}


window.addEventListener('DOMContentLoaded', () => {
    new Starfield();
    new Sparkle();
    
    const navbar = document.getElementById('navbar');
    const yesButton = document.getElementById('yes-button');
    const noButton = document.getElementById('no-button');
    const aboutCard = document.getElementById('about-card');
    const agreement = document.getElementById('agreement');
    
    if (yesButton && noButton && aboutCard) {
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
    
    // Fandom page tag functionality
    const tagPrsk = document.querySelector('.tag-prsk');
    const tagGenshin = document.querySelector('.tag-genshin');
    const tagHsr = document.querySelector('.tag-hsr');
    const boxPrsk = document.querySelector('.box-prsk');
    const boxGenshin = document.querySelector('.box-genshin');
    const boxHsr = document.querySelector('.box-hsr');
    
    if (tagPrsk && tagGenshin && tagHsr && boxPrsk && boxGenshin && boxHsr) {
        function hideAllBoxes() {
            boxPrsk.setAttribute('hidden', '');
            boxGenshin.setAttribute('hidden', '');
            boxHsr.setAttribute('hidden', '');

            tagPrsk.style.removeProperty('width');
            tagGenshin.style.removeProperty('width');
            tagHsr.style.removeProperty('width');

            tagPrsk.style.removeProperty('font-size');
            tagGenshin.style.removeProperty('font-size');
            tagHsr.style.removeProperty('font-size');
        }
        
        tagPrsk.addEventListener('click', () => {
            hideAllBoxes();
            boxPrsk.removeAttribute('hidden');
            tagPrsk.style.width = '33%';
            tagPrsk.style.fontSize = '16px';
        });
        
        tagGenshin.addEventListener('click', () => {
            hideAllBoxes();
            boxGenshin.removeAttribute('hidden');
            tagGenshin.style.width = '33%';
            tagGenshin.style.fontSize = '16px';
        });
        
        tagHsr.addEventListener('click', () => {
            hideAllBoxes();
            boxHsr.removeAttribute('hidden');
            tagHsr.style.width = '33%';
            tagHsr.style.fontSize = '16px';
        });
        
        tagPrsk.style.cursor = 'pointer';
        tagGenshin.style.cursor = 'pointer';
        tagHsr.style.cursor = 'pointer';
    }

    const tieringHistoryButton = document.getElementById('tiering-history');
    const tieringModal = document.getElementById('tiering-modal');
    const closeTieringModal = document.getElementById('close-tiering-modal');

    tieringHistoryButton.style.cursor = 'pointer';
    
    // Tiering History Data - Load from JSON file
    let tieringData = [];
    
    // Function to load tiering data from JSON file
    async function loadTieringData() {
        try {
            const response = await fetch('../assets/fandom/tiering-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            tieringData = await response.json();
            return tieringData;
        } catch (error) {
            console.error('Error loading tiering data:', error);
            // Fallback to empty array if loading fails
            tieringData = [];
            return tieringData;
        }
    }
    
    function formatPoints(points) {
        if (points === null) return "-p";
        return points.toLocaleString() + "p";
    }
    
    function formatRank(rank) {
        return "#" + rank.toLocaleString();
    }
    
    function renderTieringEntries(data) {
        const container = document.getElementById('tiering-entries-container');
        if (!container) return;
        
        container.innerHTML = data.map(entry => `
            <div class="tiering-entry">
                <table>
                    <tr>
                        <td style="width: 70%;">
                            <h2 class="h2-body">${entry.name}</h2>
                            <p class="text-body">Date: ${entry.date}</p>
                            <p class="text-body">Rank: ${formatRank(entry.rank)}</p>
                            <p class="text-body">Point: ${formatPoints(entry.points)}</p>
                        </td>
                        <td style="width: 30%; text-align: right; vertical-align: center;">
                            <img src="${entry.image}" alt="${entry.alt}" style="max-width: 100%; height: auto;">
                        </td>
                    </tr>
                </table>
            </div>
        `).join('');
    }
    
    function sortTieringData(sortBy, order) {
        const sortedData = [...tieringData].sort((a, b) => {
            let valueA, valueB;
            
            switch (sortBy) {
                case 'date':
                    valueA = new Date(b.date);
                    valueB = new Date(a.date);
                    break;
                case 'rank':
                    valueA = a.rank;
                    valueB = b.rank;
                    console.log(valueA, valueB);
                    break;
                case 'points':
                    valueA = b.points || 0;
                    valueB = a.points || 0;
                    break;
                default:
                    return 0;
            }
            
            if (order === 'asc') {
                return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
            } else {
                return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
            }
        });
        
        renderTieringEntries(sortedData);
    }
    
    // Add sort button event listeners
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const sortBy = btn.getAttribute('data-sort');
            let currentOrder = btn.getAttribute('data-order');

            const sortLabels = {
                'date': 'Date',
                'rank': 'Rank', 
                'points': 'Points'
            };

            let newOrder;
            if(btn.classList.contains('active')) {
                newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
                btn.setAttribute('data-order', newOrder);

                const arrow = newOrder === 'asc' ? '↓' : '↑';
                btn.textContent = `${sortLabels[sortBy]} ${arrow}`;
            } else {
                newOrder = 'asc';
                btn.setAttribute('data-order', newOrder);
                
                btn.textContent = `${sortLabels[sortBy]} ↓`;

                document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }

            sortTieringData(sortBy, newOrder);
        });
    });
    
    if (tieringHistoryButton && tieringModal && closeTieringModal) {
        tieringHistoryButton.addEventListener('click', async () => {
            tieringModal.removeAttribute('hidden');
            tieringModal.style.display = 'flex';
            
            // Show loading message
            const container = document.getElementById('tiering-entries-container');
            if (container) {
                container.innerHTML = '<div style="text-align: center; padding: 20px; color: #ccc;">Loading tiering data...</div>';
            }
            
            // Load data and render
            await loadTieringData();
            sortTieringData('date', 'asc');
        });
        
        // Close modal when X is clicked
        closeTieringModal.addEventListener('click', () => {
            tieringModal.setAttribute('hidden', '');
            tieringModal.style.display = 'none';
        });
        
        // Close modal when clicking outside of modal content
        tieringModal.addEventListener('click', (e) => {
            if (e.target === tieringModal) {
                tieringModal.setAttribute('hidden', '');
                tieringModal.style.display = 'none';
            }
        });
    }
});