        $(window).scroll(function () {
            if ($(this).scrollTop() > 100) {
                $('.navbar').addClass('scrolled');
            } else {
                $('.navbar').removeClass('scrolled');
            }
        });

        // Smooth scrolling for navigation links
        $('a[href*="#"]').on('click', function (e) {
            e.preventDefault();

            $('html, body').animate(
                {
                    scrollTop: $($(this).attr('href')).offset().top - 70,
                },
                500,
                'linear'
            );
        });

        // Add active class to current section in navigation
        $(window).scroll(function () {
            var scrollDistance = $(window).scrollTop() + 100;

            $('section').each(function (i) {
                if ($(this).position().top <= scrollDistance) {
                    $('.nav-link.active').removeClass('active');
                    $('.nav-link').eq(i).addClass('active');
                }
            });
        }).scroll();

        // Scroll progress bar
        $(window).scroll(function () {
            var scroll = $(window).scrollTop();
            var docHeight = $(document).height();
            var winHeight = $(window).height();
            var scrollPercent = (scroll / (docHeight - winHeight)) * 100;

            $('#progressBar').css('width', scrollPercent + '%');
        });

        // Back to top button
        $(window).scroll(function () {
            if ($(this).scrollTop() > 300) {
                $('.back-to-top').addClass('active');
            } else {
                $('.back-to-top').removeClass('active');
            }
        });

        $('.back-to-top').click(function () {
            $('html, body').animate({ scrollTop: 0 }, 'smooth');
            return false;
        });

        // Contact form submission
        $('#contactForm').submit(function (e) {
            e.preventDefault();

            var name = $('#name').val();
            var email = $('#email').val();
            var message = $('#message').val();

            // Here you would typically send the form data to a server
            // For demonstration, we'll just show an alert
            alert('Thank you, ' + name + '! Your message has been sent. I will get back to you soon.');

            // Reset the form
            $('#contactForm')[0].reset();
        });

        // Initialize particles.js
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#6c63ff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#6c63ff",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });

        // Intersection Observer for fade-in animations
        const fadeElements = document.querySelectorAll('.fade-in');

        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        fadeElements.forEach(element => {
            fadeObserver.observe(element);
        });

        // Typewriter effect
        document.addEventListener('DOMContentLoaded', function () {
            const typewriterText = document.querySelector('.typewriter-text');
            const originalText = typewriterText.textContent;
            typewriterText.textContent = '';

            let i = 0;
            const typing = setInterval(() => {
                if (i < originalText.length) {
                    typewriterText.textContent += originalText.charAt(i);
                    i++;
                } else {
                    clearInterval(typing);
                }
            }, 100);
        });