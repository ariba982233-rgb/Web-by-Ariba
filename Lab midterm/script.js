$(document).ready(function() {
    const $slider = $('.slick-slider-wrapper');
    $slider.slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        prevArrow: $('#prevBtn'),
        nextArrow: $('#nextBtn'),
        responsive: [
            {
                breakpoint: 1100, // This handles your 772px screen
                settings: { slidesToShow: 2 }
            },
            {
                breakpoint: 600,
                settings: { slidesToShow: 1 }
            }
        ]
    });

    function updateCounter(currentSlide) {
        const totalSlides = $slider.slick('getSlick').slideCount;
        $('#slider-counter').text(`Showing ${currentSlide + 1} of ${totalSlides}`);
    }
    updateCounter(0);
    $slider.on('afterChange', function(e, s, currentSlide) { updateCounter(currentSlide); });

    $('.ready-card').on('mouseenter', function() { $slider.slick('slickPause'); })
                   .on('mouseleave', function() { $slider.slick('slickPlay'); });
});