import React from "react";
import "./style.css";

// material-ui import
import Paper from "@material-ui/core/Paper";

// WHEN USER selects recipe
// recipecard expands to show nutrition, prep time, img
// provide external link to recipe source website
function Recipe(props) {
  console.log(props);

  return (
    <div className="backgroundImage">
      <Paper elevation={1} className="recipePage">
        {props.meal.label ? (
          <div>
            <div className="header">
              <img
                className="img"
                src={props.meal.image}
                alt={props.meal.label}
              />
              <h1>
                <a href={props.meal.url} target="_blank" className="link">
                  <i className="fas fa-external-link-alt" />
                  Meal: <span>{props.meal.label}</span>
                </a>
              </h1>
            </div>
            <div className="card">
              <div>
                <h5>
                  <i className="fas fa-utensils" />
                  Calories:
                  <p className="circle">
                    {parseFloat(props.meal.calories).toFixed(0)} cal
                  </p>
                </h5>
              </div>
              <div>
                <h5>
                  {" "}
                  <i className="fas fa-info-circle" />
                  Nutrition information:
                </h5>
                <ul>
                  <li>
                    Fat:
                    <span className="circle">
                      {parseFloat(props.meal.digest[0].total).toFixed(0)} g
                    </span>
                  </li>
                  <li>
                    Carbohydrate:
                    <span className="circle">
                      {parseFloat(props.meal.digest[1].total).toFixed(0)} g
                    </span>
                  </li>
                  <li>
                    Protein:
                    <span className="circle">
                      {parseFloat(props.meal.digest[2].total).toFixed(0)} g
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h5>
                  <i className="far fa-clock" />
                  Prep time: <br />
                  <br />
                  <span>{props.meal.totalTime}min</span>
                </h5>
              </div>
              <div className="ingred">
                <h5>
                  <i className="far fa-list-alt" />
                  Ingredients:
                </h5>
                <ul>
                  {props.meal.ingredients.map((item, i) => {
                    return (
                      <li key={i}>
                        <i className="fas fa-chevron-right" />
                        {item.text}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </Paper>
    </div>
  );
}

export default Recipe;