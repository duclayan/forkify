// Global app controller

var searchItem = document.querySelector('.search__field')
var searchForm = document.querySelector('.search')
var recipeColumn = document.querySelector('.results__list')
var addToCart = document.querySelector('.btn-small.recipe__btn')
console.log(addToCart)

var searchResult =''

const searchRecipe = async function(query){
    let result = await fetch(`https://forkify-api.herokuapp.com/api/search?q=${query}`)
    return result.json()
}

const getRecipe = async function(id) {
    let result = await fetch(`https://forkify-api.herokuapp.com/api/get?rId=${id}`)
    return result.json()
}

// SEARCH CLICK
searchForm.onsubmit = async function (e) {
        recipeColumn.innerHTML = ''
        console.log('Search Submit')

        e.preventDefault()
        var recipeList= await searchRecipe(searchItem.value)

        // var recipe = new recipeList(recipeList)

        recipeList.recipes.forEach((item)=> {
            appendRecipeList(item)
            console.log(item)
        })
}

// RECIPE CLICK
document.querySelector('.results__list').onclick = async function(e) {
    e.preventDefault()

    let n = (e.path[2].className === 'results__link') ? 2:0;

    e.path[n].classList.add('results__link--active')
    let code = e.path[n].href.split("#")
    
    let currentRecipe = await getRecipe(code[1])
    appendRecipeInstructions(currentRecipe)

    // ADD TO CART
    document.querySelector('.btn-small.recipe__btn').onclick = async function(x){

        var recipeItems = document.getElementsByClassName('recipe__item')
        console.log(recipeItems)
    
        for (i = 0; i < recipeItems.length; i++) {
            console.log(recipeItems[i])
           let count = recipeItems[i].querySelector('.recipe__count').innerHTML
           let unit = recipeItems[i].querySelector('.recipe__unit').innerHTML
           let ingredient = recipeItems[i].querySelector('.recipe__ingredient').innertext
    
           console.log(`Count: ${count}, Unit: ${unit}, Ingredient: ${ingredient}`)
        }
    
    }
}
// CLASS
class recipeList {
    constructor(recipeItems){
        this.recipeItems = recipeItems
    }
}
//FUNCTIONS
const appendRecipeList= async function (item) {
    let newHTML = 
    `<li>
        <a class="results__link" href="#${item.recipe_id}">
            <figure class="results__fig">
                <img src="${item.image_url}" alt="Test">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${item.title}</h4>
                <p class="results__author">${item.publisher}</p>
            </div>
        </a>
    </li>`
    recipeColumn.insertAdjacentHTML('beforeend',newHTML)
}
const appendRecipeInstructions = async function(item) {
    let newRecipe = 
    ` <figure class="recipe__fig">
        <img src="${item.recipe.image_url}" class="recipe__img">
        <h1 class="recipe__title">
            <span>Pasta with tomato cream sauce</span>
        </h1>
    </figure>

    <div class="recipe__details">

        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-stopwatch"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">45</span>
            <span class="recipe__info-text"> minutes</span>
        </div>
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-man"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">4</span>
            <span class="recipe__info-text"> servings</span>

            <div class="recipe__info-buttons">
                <button class="btn-tiny">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-minus"></use>
                    </svg>
                </button>
                <button class="btn-tiny">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-plus"></use>
                    </svg>
                </button>
            </div>

        </div>
        <button class="recipe__love">
            <svg class="header__likes">
                <use href="img/icons.svg#icon-heart-outlined"></use>
            </svg>
        </button>
    </div>
    
    <div class="recipe__ingredients">
        <ul class="recipe__ingredient-list">
        </ul>

        <button class="btn-small recipe__btn">
            <svg class="search__icon">
                <use href="img/icons.svg#icon-shopping-cart"></use>
            </svg>
            <span>Add to shopping list</span>
        </button>
    </div>

    <div class="recipe__directions">
        <h2 class="heading-2">How to cook it</h2>
        <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__by">The Pioneer Woman</span>. Please check out directions at their website.
        </p>
        <a class="btn-small recipe__btn" href="http://thepioneerwoman.com/cooking/pasta-with-tomato-cream-sauce/" target="_blank">
            <span>Directions</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-right"></use>
            </svg>

        </a>`
    document.querySelector('.recipe').insertAdjacentHTML('beforeend',newRecipe)


    item.recipe.ingredients.forEach((ingredient) => {
        let ingredients = ingredient.split(" ")
        var ingredientName = ''
        var addIngredient 
        var ingredientCount 
        var ingredientUnit 
        var i 

        if (parseInt(ingredient[0]) != NaN) {
            i = 2
            ingredientCount = ingredients[0] 
            ingredientUnit = ingredients[1]
        } else {
            i = 0
            ingredientCount = ''
            ingredientUnit = ''
        }
    
        for (i ; i < ingredients.length ; i++){
            ingredientName += ` ${ingredients[i]}`
        }
    
        if (parseInt(ingredients[0]) != NaN) {
            addIngredient = 
            `<li class="recipe__item">
                <svg class="recipe__icon">
                    <use href="img/icons.svg#icon-check"></use>
                </svg>
                <div class="recipe__count">${ingredientCount}</div>
                <div class="recipe__ingredient">
                    <span class="recipe__unit">${ingredientUnit}</span>
                    ${ingredientName}
                </div>
            </li>`
            
        } else { 
            addIngredient = 
            `<li class="recipe__item">
                <svg class="recipe__icon">
                    <use href="img/icons.svg#icon-check"></use>
                </svg>
                <div class="recipe__ingredient">
                    ${ingredientName}
                </div>
            </li>`
        }
        console.log(ingredient)
    
    
        if (i = 1)
        document.querySelector('.recipe__ingredient-list').insertAdjacentHTML('beforeend',addIngredient)
    }
    )
}



const appendShoppingList =async function(item){

    console.log('appendShopping')

    let shoppingItem = 
    `
    <li class="shopping__item">
                <div class="shopping__count">
                    <input type="number" value="500" step="100">
                    <p>g</p>
                </div>

                <p class="shopping__description">Pasta</p>

                <button class="shopping__delete btn-tiny">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-cross"></use>
                    </svg>
                </button>
     </li>
    `
}
