// js/home.js
// Renders the home page highlight cards from local data.
// No Supabase call here on purpose - this data barely changes and
// fetching it was the cause of the "loading services..." bug.

const homeCards = [
    {
        title: 'Montessori Learning',
        image: 'Card_1.png',
        teaser: 'See how our Montessori approach helps children learn at their own pace.',
        description: 'Our classrooms follow the Montessori approach: child-centred, hands-on activities in a carefully prepared environment that build curiosity, confidence and a genuine love for learning. Children are free to explore at their own pace, guided (not instructed) by experienced educators who tailor activities to each child\'s stage of development, covering early literacy, numeracy, practical life skills and sensory play.',
        color: 'card-red',
        button: 'btn-red'
    },
    {
        title: 'Safe & Secure',
        image: 'Card_2.png',
        teaser: 'Find out how we keep every child safe throughout the day.',
        description: 'CCTV cameras, controlled classroom access and secure, fenced play areas mean parents can relax knowing their little ones are cared for in a safe environment every single day. Our staff supervise all indoor and outdoor activities closely, visitors are managed carefully so only authorised adults can collect your child, and attendance is tracked so we always know who is on site.',
        color: 'card-green',
        button: 'btn-green'
    },
    {
        title: 'Nutritional Meals',
        image: 'Card_3.png',
        teaser: 'Take a look at what\'s on the menu for your little one.',
        description: 'Two balanced, home-style meals a day plus morning and afternoon snacks keep every child healthy, energised and ready to learn. Our menus are planned with growing bodies in mind, covering fruit, vegetables, protein and whole grains, with special dietary needs happily accommodated wherever we can.',
        color: 'card-pink',
        button: 'btn-pink'
    }
];

function renderHomeCards() {
    const container = document.getElementById('servicesContainer');
    if (!container) return;

    container.innerHTML = homeCards.map(card => `
        <div class="card ${card.color}">
            <div class="card-inner">
                <div class="card-face card-front">
                    <h2>${card.title}</h2>
                    <img src="${card.image}" alt="${card.title}" loading="lazy">
                    <button class="${card.button} flip-btn" type="button">Learn More</button>
                    <p class="card-teaser">${card.teaser}</p>
                </div>
                <div class="card-face card-back">
                    <h2>${card.title}</h2>
                    <p>${card.description}</p>
                    <button class="${card.button} flip-btn" type="button">Back</button>
                </div>
            </div>
        </div>
    `).join('');

    container.addEventListener('click', (e) => {
        const btn = e.target.closest('.flip-btn');
        if (!btn) return;
        btn.closest('.card').classList.toggle('is-flipped');
    });
}

document.addEventListener('DOMContentLoaded', renderHomeCards);
