// js/services.js
// Renders the services page cards from local data.
// Same fix as home.js - static content, no Supabase fetch.

const serviceCards = [
    {
        title: 'Extramural Activities',
        image: 'service1.png',
        teaser: 'See everything included in your child\'s weekly programme.',
        description: 'On-site swimming, martial arts, speech & drama and Actionball are all included in your child\'s week at no extra cost. These sessions are run by qualified instructors during the school day, giving children a well-rounded mix of physical activity, coordination, confidence-building and creative expression alongside their regular classroom learning.',
        color: 'card-red',
        button: 'btn-red'
    },
    {
        title: 'Aftercare',
        image: 'service2.png',
        teaser: 'Find out how our aftercare programme works.',
        description: 'Supervised aftercare is available Monday to Friday for parents who need a little extra time at the end of the day, at an additional cost. Children are kept safe, engaged and well cared for with structured activities, homework support and a relaxed environment until pick-up, so working parents can have peace of mind.',
        color: 'card-green',
        button: 'btn-green'
    },
    {
        title: 'Transport',
        image: 'service3.png',
        teaser: 'Learn more about our scholar transport options.',
        description: 'Scholar transport can be arranged to and from the centre for an additional monthly fee, covering selected surrounding routes and pickup points. Seats are limited and allocated on a route-dependent basis, so parents who need transport are encouraged to apply as early as possible during enrolment.',
        color: 'card-pink',
        button: 'btn-pink'
    }
];

function renderServiceCards() {
    const container = document.getElementById('servicesContainer');
    if (!container) return;

    container.innerHTML = serviceCards.map(card => `
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

document.addEventListener('DOMContentLoaded', renderServiceCards);
