document.addEventListener('click', function(event) {
    let navbarCollapse = document.getElementById('navbarNav');
    let navbarTogglerIcon = document.querySelector('.navbar-toggler-icon');

    if (!event.target.closest('.navbar')) {
        if (navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
            navbarTogglerIcon.classList.add('rotate-icon');
        }
    }
});
