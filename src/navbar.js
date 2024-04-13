const menuItems = document.getElementsByClassName('menu-button');
const drawers = document.getElementsByClassName('drawer');

for (const item of menuItems) {
    item.onclick = () => toggleMenuDrawer(item.getAttribute('name'));
}

function toggleMenuDrawer(name) {
  for (const drawer of drawers) {
    if (drawer.getAttribute('name') === name) {
      drawer.classList.toggle('active');
    } else {
      drawer.classList.remove('active');
    }
  }
}