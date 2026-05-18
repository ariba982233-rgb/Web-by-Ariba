/**
 * SP24 BCS B Final Exam - Web Technologies Course
 * Client-Side jQuery Pagination Script for On-Sale Products
 * 
 * Handles visibility of on-sale product cards in chunks of 10
 * completely client-side without any additional network requests.
 */

$(document).ready(function() {
    // 1. Selector variables and initial setups
    const $productCards = $('.onsale-product-card');
    const totalProducts = $productCards.length;
    const itemsPerPage = 10;
    
    // Calculate total pages based on count divided by 10
    const totalPages = Math.ceil(totalProducts / itemsPerPage) || 1;
    
    // Page state variable initialized to 1
    let currentPage = 1;

    /**
     * Function to handle rendering page state, slicing elements,
     * and managing button enabling/disabling states.
     */
    function renderPage(direction = 'none') {
        // Find indices of items to show
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        // Hide all cards first
        $productCards.hide();

        // Reveal the active slice of 10 products (index startIndex to endIndex - 1)
        // A premium fade-in animation gives it a high-end feel!
        $productCards.slice(startIndex, endIndex).fadeIn(400);

        // Dynamically update the page indicator text
        $('#page-indicator').text(`Page ${currentPage} of ${totalPages}`);

        // Handle Previous Button Boundary State
        if (currentPage === 1) {
            // Disable or hide button when on the first page
            $('#prev-btn')
                .prop('disabled', true)
                .css({
                    'opacity': '0.5',
                    'cursor': 'not-allowed',
                    'pointer-events': 'none'
                });
        } else {
            // Enable button otherwise
            $('#prev-btn')
                .prop('disabled', false)
                .css({
                    'opacity': '1',
                    'cursor': 'pointer',
                    'pointer-events': 'auto'
                });
        }

        // Handle Next Button Boundary State
        if (currentPage === totalPages) {
            // Disable or hide button when on the final page
            $('#next-btn')
                .prop('disabled', true)
                .css({
                    'opacity': '0.5',
                    'cursor': 'not-allowed',
                    'pointer-events': 'none'
                });
        } else {
            // Enable button otherwise
            $('#next-btn')
                .prop('disabled', false)
                .css({
                    'opacity': '1',
                    'cursor': 'pointer',
                    'pointer-events': 'auto'
                });
        }

        // Smooth scroll to top of product list on page change for good user experience
        if (direction !== 'none') {
            $('html, body').animate({
                scrollTop: $('#product-list').offset().top - 120
            }, 300);
        }
    }

    // 2. Attach Event Listener for the "Next" Button
    $('#next-btn').on('click', function(e) {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            renderPage('next');
        }
    });

    // 3. Attach Event Listener for the "Previous" Button
    $('#prev-btn').on('click', function(e) {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            renderPage('prev');
        }
    });

    // 4. Run the initial state render immediately
    renderPage('none');
});
