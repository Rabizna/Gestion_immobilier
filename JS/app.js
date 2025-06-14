const navItems = document.getElementsByClassName('nav-items')
const items = document.getElementsByClassName('body')


function showSection(index){
    for(let i=0; i<navItems.length; i++){
        navItems[i].classList.remove('active')
        items[i].classList.add('hide')
    }
    navItems[index].classList.add('active')
    items[index].classList.remove('hide')

}
for(let i=0; i<navItems.length; i++){
    navItems[i].classList.remove('active')
    items[i].classList.add('hide')
}