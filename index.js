let nonNavbarElements = document.querySelectorAll('body > :not(.navbar)');
nonNavbarElements.forEach(function (element) {
    element.addEventListener('click', function () {
        let navbarCollapse = document.getElementById('navbarNav');
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
                }
        });
});