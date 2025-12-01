

const featuresGrid = document.getElementById('featuresGrid');

const userCarousel = document.getElementById('userCarousel');




function isElementInViewport(el) {

    const rect = el.getBoundingClientRect();

    return (

        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&

        rect.bottom >= 0

    );

}




function handleScroll() {

    if (isElementInViewport(featuresGrid)) {


        featuresGrid.classList.add('scrolled');




        try {

            const maxScroll = featuresGrid.scrollWidth - featuresGrid.clientWidth;

            const target = Math.max(0, Math.round(maxScroll / 2));

            featuresGrid.scrollTo({ left: target, behavior: 'smooth' });




            if (userCarousel) {

                const carouselMax = userCarousel.scrollWidth - userCarousel.clientWidth;

                if (carouselMax > 0 && maxScroll > 0) {

                    const ratio = target / maxScroll;

                    const carouselTarget = Math.round(ratio * carouselMax);

                    userCarousel.scrollTo({ left: carouselTarget, behavior: 'smooth' });

                }

            }

        } catch (e) {


        }

    } else {

        featuresGrid.classList.remove('scrolled');

        try {

            featuresGrid.scrollTo({ left: 0, behavior: 'smooth' });

            if (userCarousel) userCarousel.scrollTo({ left: 0, behavior: 'smooth' });

        } catch (e) { }

    }




    document.querySelectorAll('.stat-item').forEach(stat => {

        if (isElementInViewport(stat)) {

            stat.classList.add('is-visible');

        }

    });

}




window.addEventListener('scroll', handleScroll);

window.addEventListener('load', handleScroll);








document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.getElementById('main-navbar');
    let lastScrollTop = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > lastScrollTop && currentScroll > scrollThreshold) {
            navbar.classList.add('nav-hidden');
        }

        else if (currentScroll < lastScrollTop || currentScroll < 50) {
            navbar.classList.remove('nav-hidden');
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
});