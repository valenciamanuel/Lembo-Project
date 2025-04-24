// Simple JavaScript to show/hide production details
document.querySelectorAll('.table__button').forEach(button => {
    button.addEventListener('click', () => {
        document.getElementById('production-detail').classList.remove('detail--hidden');
    });
});
document.querySelector('.detail__close').addEventListener('click', () => {
    document.getElementById('production-detail').classList.add('detail--hidden');
});