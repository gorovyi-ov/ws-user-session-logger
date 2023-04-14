import UserSessionLogger from './UserSessionLogger';

const userId = 1234;
const logger = new UserSessionLogger(userId);

window.addEventListener('popstate', () => {
  const currentPage = window.location.pathname;
  logger.logNavigationEvent(currentPage);
});

const links = document.querySelectorAll('a');
links.forEach(link => {
  link.addEventListener('click', event => {
    const currentPage = window.location.pathname;
    const nextPage = link.getAttribute('href');
    logger.logNavigationEvent(nextPage);
    event.preventDefault();
    window.history.pushState({}, '', nextPage);
  });
});
