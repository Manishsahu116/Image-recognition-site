document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.createElement('div');
    menuToggle.classList.add('menu-toggle');
    menuToggle.innerHTML = '<div class="bar"></div><div class="bar"></div><div class="bar"></div>';
    document.querySelector('.navbar').appendChild(menuToggle);

    menuToggle.addEventListener('click', function() {
        document.querySelector('.menu').classList.toggle('active');
    });
});