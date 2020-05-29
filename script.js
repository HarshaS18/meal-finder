const search = document.getElementById("search");
const submit = document.getElementById("submit");
const randomSearch = document.getElementById("random");
const resultHeading = document.getElementById("result-heading");
const meals = document.getElementById("meals");
const singleMeal = document.getElementById("single-meal");

submit.addEventListener("submit", searchMeal);
meals.addEventListener("click", showSinglrMeal);
randomSearch.addEventListener("click", showRandomMeal);

function searchMeal(e) {
  e.preventDefault();
  singleMeal.innerHTML = "";
  const term = search.value;
  console.log(term);
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        resultHeading.innerHTML = `<h4>Search results for ${
          term.charAt(0).toUpperCase() + term.slice(1)
        }</h4>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There was no search result. Try Again!</p>`;
        } else {
          meals.innerHTML = data.meals
            .map(
              (meal) => `
              <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
              <div class="meal-info" data-mealID="${meal.idMeal}">
              <h5>${meal.strMeal}</h5>
              </div>
              </div>
              `
            )
            .join("");
        }
      });
    search.value = "";
  } else {
    alert("Please enter a search term");
  }
}

function showSinglrMeal(e) {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    console.log(mealID);
    getMealById(mealID);
  }
}

function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

function addMealToDOM(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  singleMeal.innerHTML = `
  <div class="single-meal">
    <h3>${meal.strMeal}<h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
    <div class="single-meal-info">
      ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
      ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
    </div>
    <div class="main">
      <p>${meal.strInstructions}</p>
      <h6>Ingredients</h6>
      <ul>
        ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
      </ul>
    </div>
  </div>
  `;
}

function showRandomMeal() {
  meals.innerHTML = "";
  resultHeading.innerHTML = "";
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}
