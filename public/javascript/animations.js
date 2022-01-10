
const loadAnimations = () => {

    let menuIcon = document.getElementById("menu_icon")
    let closeMenu = document.getElementById("close_menu")
    let navMenu = document.querySelector("nav.menu")
    let flash = document.querySelector("flash")
    let imagesAnimal = document.querySelectorAll('img.pic-animal-small')
    let favHearts = document.querySelectorAll('svg.heart-icon')
    let showFilter = document.querySelector('.show-filter')

    const isVisible = (element) => {
        
        let rect = element.getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right + 100 <= (window.innerWidth || document.documentElement.clientWidth)
        );
      }

    if (menuIcon && navMenu) {
        menuIcon.addEventListener('click', () => {
            navMenu.classList.add("open")
        })
    }

    if (closeMenu && navMenu) {
        closeMenu.addEventListener('click', () => {
            navMenu.classList.remove("open")
        })
    }

    if (imagesAnimal && imagesAnimal.length > 0) {

        imagesAnimal.forEach( (pic) => {
            pic.addEventListener('click', () => {

                let imgContainer = document.getElementById('show-picture')
                let element = document.createElement('img')
                element.setAttribute("class", "pic-animal-big")
                element.setAttribute("src", pic.src)
                imgContainer.innerHTML = ""
                imgContainer.append(element)

                // disable the one 
                let smallImages = document.querySelectorAll('.pic-animal-small')
                smallImages.forEach( (smallPic) => {
                    if (pic.src === smallPic.src) smallPic.classList.add('disabled')
                    else smallPic.classList.remove('disabled')
                })

            })
        })
    }

    if (favHearts) {
        favHearts.forEach( (heart) => {
            heart.addEventListener('click', () => {

                let isFav = false
                let animalId = heart.id

                if (heart.classList.contains("notfav")) isFav = true

                let currentPage = heart.dataset.currentPage

                route = isFav ? `/animals/${animalId}/addFav/${currentPage}` : `/animals/${animalId}/removeFav/${currentPage}`
                window.location.href = route
    
            })
        })
    }

    if (showFilter) {
        showFilter.addEventListener('click', () => {
            let arrow = showFilter.querySelector('.openCloseFilter')
            let filtersDiv = document.querySelector('.filters')

            if (arrow.classList.contains('arrow-down')) {
                //we want to show the filter 
                filtersDiv.classList.add('show')  
                arrow.classList.remove('arrow-down')
                arrow.classList.add('arrow-up')
            } else {
                //we want to open the filter 
                filtersDiv.classList.remove('show')
                arrow.classList.add('arrow-down')
                arrow.classList.remove('arrow-up')
            }
        })
    }

    if (flash && isVisible(flash)) {
        //console.log("hey, un flash!")
    }
}

window.addEventListener("load", loadAnimations)