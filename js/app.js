// ======================================== caloriesTracker ========================================
class caloriesTracker{
    constructor() {
        this._caloriesLimit = Storage.getCalorieLimit()
        this._totalCalories = Storage.getTotalCalories();
        this._meals=Storage.getMeals()
        this._workouts=Storage.getWorkouts()
        this._renderStats()
        this._displayCaloriesLimit()

    }
    // --------------------------------------Public Methods -----------------------------------------
    addMeal(meal){
        this._meals.push(meal);
        this._totalCalories+=meal.calories;
        this._renderStats()
        this._displayNewMeal(meal)
        Storage.setMeals(this._meals)
    };
    addWorkOut(workout){
        this._workouts.push(workout);
        this._totalCalories-=workout.calories;
        this._renderStats()
        Storage.setWorkouts(this._workouts)
        this._displayNewWorkout(workout)

    };
    removeMeal(id){
        const  index = this._meals.findIndex(meal=> meal.id ===id)
        if (index!== -1) {
            this._totalCalories -= this._meals[index].calories;
            this._meals.splice(index, 1)
            Storage.setMeals(this._meals)
            this._renderStats()
        }
    }
    removeWorkout(id){
        const  index = this._workouts.findIndex(workout=> workout.id ===id)
        if (index!== -1) {
            this._totalCalories += this._workouts[index].calories;
            this._workouts.splice(index, 1)
            Storage.setWorkouts(this._workouts)
            this._renderStats()
        }
    }
    setLimit(caloriesLimit){
        this._caloriesLimit = caloriesLimit
        Storage.setCaloriesLimit(caloriesLimit)
        this._displayCaloriesLimit()
        this._renderStats()
    }
    loadItem(){
            this._meals.forEach(item => {
                this._displayNewMeal(item)
            })
            this._workouts.forEach(item =>{
                this._displayNewWorkout(item)
            })
        }

    resetTrack(){
        this._totalCalories = 0
        this._meals=[]
        this._workouts=[]
        this._renderStats()
        Storage.clearAll([])


    }
    // --------------------------------------Private Methods -----------------------------------------

    _displayCaloriesTotal(){
        Storage.setTotalCalories(this._totalCalories)
        const caloriesTotalElem = document.getElementById("calories-total")
        caloriesTotalElem.innerHTML = this._totalCalories
    }
    _displayCaloriesLimit(){
        const caloriesLimitElem = document.getElementById("calories-limit")
        caloriesLimitElem.innerHTML = this._caloriesLimit

    }
    _displayCaloriesConsumed(){
        const caloriesConsumedElem = document.getElementById("calories-consumed")
        const consumed = this._meals.reduce((total,currentValue)=>{
            return total+ currentValue.calories
        },0)

        caloriesConsumedElem.innerHTML = consumed;

    }
    _displayCaloriesBurned(){
        const caloriesBurnedElem = document.getElementById("calories-burned")
        const burned = this._workouts.reduce((total,currentValue)=>{
            return total+ currentValue.calories
        },0)

        caloriesBurnedElem.innerHTML = burned;

    }
    _displayCaloriesRmaining(){
        const caloriesRemainingElem = document.getElementById("calories-remaining")
        const remaining = this._caloriesLimit - this._totalCalories
        console.log(this._caloriesLimit , this._totalCalories , remaining)
        caloriesRemainingElem.innerHTML = remaining;
        console.log(caloriesRemainingElem);
        if (remaining <= 0)
            caloriesRemainingElem.parentElement.parentElement.classList.replace("bg-light1" , "bg-danger")

        else
            caloriesRemainingElem.parentElement.parentElement.classList.replace("bg-danger" , "bg-light1")


    }
    _displayCaloriesProgress(){
        const progressElem = document.getElementById("calorie-progress")
        const percentage = (this._totalCalories/this._caloriesLimit)*100
        const width = Math.min(100,percentage)
        progressElem.style.width= `${width}%`
        if (this._totalCalories >= this._caloriesLimit){
            progressElem.classList.remove("bg-primary1")
            progressElem.classList.add("bg-danger")}
        else
        {
            progressElem.classList.remove("bg-danger")
            progressElem.classList.add("bg-primary1")
        }
    }
    _displayNewMeal(meal){
        const mealItemElem = document.getElementById("meal-items")
        const newMealItem = document.createElement("div")
        newMealItem.innerHTML =` <div class="card my-2">
              <div class="card-body" data-id="${meal.id}">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${meal.name}</h4>
                  <div
                    class="fs-1 bg-primary1 text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
            </div>`
    mealItemElem.appendChild(newMealItem)
}
    _displayNewWorkout(workout){
        const workoutItemElem = document.getElementById("workout-items")
        const newWorkoutItem = document.createElement("div")
        newWorkoutItem.innerHTML =`   <div class="card my-2">
              <div class="card-body" data-id="${workout.id}">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${workout.name}</h4>
                  <div
                    class="fs-1 bg-secondary1 text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
            </div>`
        workoutItemElem.appendChild(newWorkoutItem)
    }
    _renderStats(){
        this._displayCaloriesTotal()
        this._displayCaloriesConsumed()
        this._displayCaloriesBurned()
        this._displayCaloriesRmaining()
        this._displayCaloriesProgress()

}

}
// ======================================== Meals Class ========================================
class Meal{
    constructor(name,calories){
        this.id=Math.random().toString(36).slice(2)
        this.name=name;
        this.calories=calories;

    }
}

// ======================================== Workout Class ========================================
class WorkOut {
    constructor(name, calories) {
        this.id = Math.random().toString(36).slice(2)
        this.name = name;
        this.calories = calories;

    }
}
// ======================================== Storage Class ========================================
class Storage{
    static getCalorieLimit(defaultLimit=3000) {
        let caloriesLimit;
        if (localStorage.getItem("calorieLimit") === null) {
            caloriesLimit = defaultLimit
        }
        else{

            caloriesLimit = localStorage.getItem("calorieLimit")*1}
        return caloriesLimit
    }
    static setCaloriesLimit (calorieLimit){
        localStorage.setItem("calorieLimit",calorieLimit)
    }
    static getTotalCalories(defaultTotal= 0 ) {
        let totalCalories;
        if (localStorage.getItem("totalCalories") === null) {
            totalCalories = defaultTotal
        }
        else{

            totalCalories = localStorage.getItem("totalCalories")*1}
        return totalCalories
    }
    static setTotalCalories  (totalCalories){
        localStorage.setItem("totalCalories",totalCalories)
    }
    static getMeals() {
        let meals;
        if (localStorage.getItem("meals") === null) {
            meals = []
        }
        else{

            meals = JSON.parse(localStorage.getItem("meals"))
        }
        // console.log(meals);
        return meals
    }
    static setMeals  (meals){
        localStorage.setItem("meals",JSON.stringify(meals))
    }
    static getWorkouts() {
        let workouts;
        if (localStorage.getItem("workouts") === null) {
            workouts = []
        }
        else{

            workouts = JSON.parse(localStorage.getItem("workouts"))
        }
        // console.log(workouts);
        return workouts
    }
    static setWorkouts  (workouts){
        localStorage.setItem("workouts",JSON.stringify(workouts))
    }
    static clearAll(){
        const removeItems=["meals","workouts","totalCalories"]
        for (const item of removeItems) {
            localStorage.removeItem(item)

        }
    }
}

// ======================================== App Class ========================================
class App{
    constructor() {
        this._tracker = new caloriesTracker()
        this._initialEventListener()

        this._tracker.loadItem()
    }
    _initialEventListener(){
        const mealForm = document.getElementById("meal-form")
        mealForm.addEventListener("submit",this._newItem.bind(this,"meal"))
        const workoutForm = document.getElementById("workout-form")
        workoutForm.addEventListener("submit",this._newItem.bind(this,"workout"))
        document.getElementById("meal-items").addEventListener("click",this._removeItem.bind(this,"meal"))
        document.getElementById("workout-items").addEventListener("click",this._removeItem.bind(this,"workout"))
        document.getElementById("filter-meals").addEventListener("keyup",this._filterItems.bind(this,"meal"))
        document.getElementById("filter-workouts").addEventListener("keyup",this._filterItems.bind(this,"workout"))
        document.getElementById("reset").addEventListener("click",this._reset.bind(this))
        document.getElementById("limit-form").addEventListener("submit",this._setLimit.bind(this))
    }
    _newItem(item,evt){
        evt.preventDefault()
        // console.log(item);
        const  itemName = document.getElementById(`${item}-name`)
        const itemCalories = document.getElementById(`${item}-calories`)
        if (itemName.value === "" || itemCalories.value === "") {
            alert("Please fill all of the fields")
            return
        }
        if (item === "meal") {
            const meal = new Meal(itemName.value, itemCalories.value * 1)
            this._tracker.addMeal(meal)
        }
        else
        {
            const workout =new WorkOut(itemName.value,itemCalories.value*1)
            this._tracker.addWorkOut(workout)
        }
        itemName.value = ""
        itemCalories.value = ""
    }



    _removeItem(item ,evt){
        if (evt.target.classList.contains("delete") || evt.target.classList.contains("fa-xmark")) {
            const itemId = evt.target.closest(".card-body").getAttribute("data-id")
            if (confirm("Are you sure to delete?")) {
                // console.log(itemId)
                if (item === "meal") this._tracker.removeMeal(itemId)
                else this._tracker.removeWorkout(itemId)
                evt.target.closest(".card").remove()
            }
        }

    }
    _filterItems(type,evt){
        // console.log(type);
        const searchText = evt.target.value.toLowerCase()
        const cardItems = document.querySelectorAll(`#${type}-items .card`)
        // console.log(cardItems);
        cardItems.forEach(item=> {
            const currentName = item.firstElementChild.firstElementChild.textContent.toLowerCase()
            // console.log(currentName);
            if (currentName.indexOf(searchText)!==-1) item.style.display = "block"
            else item.style.display = "none"
        })

            }

    _reset(evt){
        if (confirm("Are you sure to reset?")) {
            document.getElementById("meal-items").innerHTML = ""
            document.getElementById("workout-items").innerHTML = ""
            document.getElementById("filter-meals").value = " "
            document.getElementById("filter-workouts").value = ""
            this._tracker.resetTrack()
        }
    }

    _setLimit(evt){
        evt.preventDefault()
        const limitEle = document.getElementById("limit")
        if (limitEle.value === "") {
            alert( "please Enter limit")
            return
        }
        this._tracker.setLimit(limitEle.value*1)
        limitEle.value = ""
        const limitModal = bootstrap.Modal.getInstance(document.getElementById("limit-modal"))
        limitModal.hide()
    }

}

const app = new  App()