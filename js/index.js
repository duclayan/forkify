// Global app controller

var searchItem = document.querySelector('.search__field')
var searchForm = document.querySelector('.search')
var recipeColumn = document.querySelector('.results__list')
var displayColumn = document.querySelector('.recipe')
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
// ====================================================================================================================================
//                                                        SEARCH CLICK
// ====================================================================================================================================

searchForm.onsubmit = async function (e) {
        recipeColumn.innerHTML = ''
        console.log('Search Submit')

        e.preventDefault()
        var recipeList= await searchRecipe(searchItem.value)

        recipeList.recipes.forEach((item)=> {
            appendResultsList(item)
            console.log(item)
        })
}
// ====================================================================================================================================
//                                                        RECIPE CLICK
// ====================================================================================================================================

document.querySelector('.results__list').onclick = async function(e) {

    e.preventDefault()
// ====================================================================================================================================
//                                                 CLASSES TO ORGANIZE THE CONTENTS
// ====================================================================================================================================

    // Access Recipe List
    let n = (e.path[2].className === 'results__link') ? 2:0;

    e.path[n].classList.add('results__link--active')
    let recipeID = e.path[n].href.split("#")
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
    let currentRecipe = await getRecipe(recipeID[1])
    let title = currentRecipe.recipe
    let ingredients = currentRecipe.recipe.ingredients

    // Create SUPER Class/ General Class 
    currentRecipe = new recipeDisplay(title,ingredients)
    
    // Creates ingredientItem Class
    let ingredientItem = []
    currentRecipe.ingredientList.forEach((e,index) => {
        ingredientItem[index] = new ingredient(e)
    })
    console.log(currentRecipe)
    console.log(ingredientItem)
// ====================================================================================================================================
//                                        DISPLAY THE CONTENT IN THE MIDDLE UPON CLICK 
// ====================================================================================================================================

    appendRecipeHeader(currentRecipe.content)
    appendRecipeDetails(currentRecipe)

    // // ADD TO CART
    // document.querySelector('.btn-small.recipe__btn').onclick = async function(x){

    //     var recipeItems = document.getElementsByClassName('recipe__item')
    //     console.log(recipeItems)
    
    //     for (i = 0; i < recipeItems.length; i++) {
    //     //     console.log(recipeItems[i])
    //     //    let count = recipeItems[i].querySelector('.recipe__count').innerHTML
    //     //    let unit = recipeItems[i].querySelector('.recipe__unit').innerHTML
    //     //    let ingredient = recipeItems[i].querySelector('.recipe__ingredient').innertext
    
    //     //    console.log(`Count: ${count}, Unit: ${unit}, Ingredient: ${ingredient}`)

    //     console.log(isMeasured(recipeItems[i]))
    //     }
    
    // }
}

// CLASS

class recipeDisplay {
    
    constructor(currentRecipe,ingredients) {
        // this.content = contains object currentRecipe
        // this.ingredientList = contains array of ingredients
        this.content = currentRecipe
        this.ingredientList = ingredients
    
    }
    isMeasured(text){
        // Checks whether the item is to be measured
        // Split the content 
        // let ingredientContent = e.split(' ')

        let status = (isNaN(parseFloat(text[0].charAt(0)))) ? false: true;
        return status
    }

    getUnit(text) {
        // This function gets the unit by: Splitting the sentence into words then checks for the first string then returns it.

        for (let i = 0 ; i < text.length ; i++) {
            // Once a text is seen, it returns the value
            if(isNaN(parseFloat(text[i]))){
                return text[i]
            }
        }
    }

    isDashed(item){
        // CHECK FOR PRESENCE OF DASH
        // 1. Split the word per character
        var content = item.split('')

        // 2. IF '-' found; returns TRUE
        for( let i = 0; i < content.length ; i++){
            if (content[i] == '-') { return true } 
        }
        return false
    }

    getValue(text) {   
        // Check whether the ingredient has dash or not
        // Only takes in the first word
        if (this.isDashed(text[0]) === true && this.isMeasured === true) {
            // WITH DASH
            // If it contains a dash- it splits the text and stores in an array
            // Return added value of the stored value
            text = text[0].split('-')
            return (eval(text[0]) + eval(text[1])).toFixed(1)
        } else {
            // WITHOUT DASH 
            // Checks whether there is only one value to be added
            if (isNaN(text[1])){
                return eval(text[0]).toFixed(1)
            } else {
                return (eval(text[0]) + eval(text[1])).toFixed(1)
            }
        }

        
    }

    getItemDescription(content){
        // this function removes the parenthesis of the string 
        let start = content.split("(")[0]
        let end = content.split(")")[1]

        return (end != undefined) ? `${start} ${end}`: start
    }

    getItem(content,unit){
        // call get item description to remove all the close parenthesis
        // for items with no unit, no need to split
        // for items with unit, take the second part of the splitted string
        return (unit === undefined)? this.getItemDescription(content):this.getItemDescription(content).split(unit)[1]
    }

    calcTime() {
        // Assuming that we need 15 min for each 3 ingredients
        console.log ('calc time has been called')
        const numIng = this.content.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
        console.log(this.content)

    }
    
  }

  class ingredient extends recipeDisplay {

    constructor(content,currentRecipe,ingredients){
        // =============================================================================================
        // Constructor Description
        // =============================================================================================
        // this.content = contains the whole object
        // this.description = Ingredient Description in full form (includes measurement and item)
        // this.isMeasured = Checks whether the product contains measurements (e.g: cups, tbsp,tsp)
        // this.unit = checks for unit (e.g: cups, tbsp,tsp)
        // this.value = takes in the total value in decimals('1.5, 1.33'); rounded to one decimal place
        // this.item = holds produc description
        // =============================================================================================

        super(currentRecipe,ingredients)

        this.content = currentRecipe
        this.description = content
        this.textContent = this.getItemDescription(content).split(' ')
        this.isMeasured = this.isMeasured(this.textContent)
        // Based on whether it's measured or not, the program will take the ingredient's unit and value 

        if(this.isMeasured == true){ 
            this.unit = this.getUnit(this.textContent)
            this.value = this.getValue(this.textContent)
        } else {
            this.value = 1
        } 

        this.item = this.getItem(this.description,this.unit)

    }
}



//FUNCTIONS
// ==================================================================================================================================================================

// ==================================================================================================================================================================

const appendResultsList= async function (item) {
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
const appendRecipeHeader = async function (item){
    let headerHTML = 
    `
    <figure class="recipe__fig">
                <img src="${item.image_url}" alt="Tomato" class="recipe__img">
                <h1 class="recipe__title">
                    <span>${item.title}</span>
                </h1>
    </figure>
    `
    displayColumn.insertAdjacentHTML('beforeend',headerHTML)
}
const appendRecipeDetails = async function (item) {
    item.calcTime()
    let recipe_infoHTML = 
    `
    <div class="recipe__details">
    <div class="recipe__info">
        <svg class="recipe__info-icon">
            <use href="img/icons.svg#icon-stopwatch"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${item.time}</span>
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
    `
    displayColumn.insertAdjacentHTML('beforeend',recipe_infoHTML)
}
// ==================================================================================================================================================================

// ==================================================================================================================================================================
