document.fonts.ready.then(function () {
    setTimeout(function () {
        const loader = document.getElementById('loader');
        loader.classList.add('hidden');

        setTimeout(function () {
            loader.remove();
        }, 500);
    }, 300);
});

setTimeout(function () {
    const loader = document.getElementById('loader');
    if (loader && !loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
        setTimeout(function () {
            loader.remove();
        }, 500);
    }
}, 3000);
