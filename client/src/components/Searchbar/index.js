import React, { Component } from "react";
import PropTypes from "prop-types";
import API from "../../utils/API";
import RecipeCard from "../RecipeCard/index";
import Firebase from "../../config/Firebase";
import Swal from "sweetalert2";
import "./style.css";

// material-ui import
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import InputBase from "@material-ui/core/InputBase";
import { withStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormLabel from "@material-ui/core/FormLabel";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

// searchbar styling
const styles = theme => ({
  root: {
    width: "100%"
  },

  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "rgba(55, 55, 55, 0.65)",
    "&:hover": {
      backgroundColor: "rgba(55, 55, 55, 0.8)"
    },
    marginLeft: "0!important",
    width: "100%",
    height: "35px",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing.unit,
      width: "auto"
    }
  },

  searchIcon: {
    width: theme.spacing.unit * 9,
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  inputRoot: {
    color: "inherit",
    width: "100%",
    position: "relative"
  },

  inputInput: {
    paddingTop: "1px",
    paddingRight: theme.spacing.unit,
    paddingBottom: "1px",
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create("width"),
    width: "100%",
    height: "30px",
    [theme.breakpoints.up("sm")]: {
      width: 120,
      "&:focus": {
        width: 200
      }
    }
  },

  recipeModalTitle: {
    fontSize: "12px"
  },

  recipeModalText: {
    fontSize: "10px"
  },

  buttonProgress: {
    color: "white",
    position: "absolute",
    top: "50%",
    right: "10%",
    marginTop: -12,
    marginLeft: -12
  },

  buttonProgressAlt: {
    color: "rgb(100,100,100)",
    position: "absolute",
    top: "50%",
    right: "-25%",
    marginTop: -12,
    marginLeft: -12
  }
});

class SearchAppBar extends Component {
  state = {
    vegan: false,
    vegetarian: false,
    sugar_conscious: false,
    peanut_free: false,
    tree_nut_free: false,
    alcohol_free: false,
    kosher: false,
    dietType: "",
    favorites: [],
    currentUser: "",
    menu: {},
    loading: false,
    success: false,
    fromNumber: 0,
    toNumber: 48
  };

  // firebase checking (auth) if user in db
  componentDidMount() {
    Firebase.auth().onAuthStateChanged(user => {
      if (user && !Firebase.auth().currentUser.isAnonymous) {
        this.setState({
          currentUser: user.email
        });
        this.getAll(user.email);
      }
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }


  componentWillReceiveProps() {
    if (this.state.currentUser) {
      this.refreshPreferences(this.state.currentUser);
    }
  }

  
  handleSearchQuery = event => {
    this.setState({ searchQuery: event.target.value });
  };

  handleDietTypes = event => {
    this.setState({ dietType: event.target.value });
  };

  handleDietRestrictions = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleSearchValues = event => {
    event.preventDefault();

    if (!this.state.loading) {
      this.setState(
        {
          success: false,
          loading: true
        },
        () => {
          this.timer = setTimeout(() => {
            this.setState({
              loading: false,
              success: true
            });
          }, 2000);
        }
      );
    }

    this.setState(
      () => {
        return {
          fromNumber: 0,
          toNumber: 48
        };
      },
      () => {
        const values = {
          vegan: this.state.vegan,
          vegetarian: this.state.vegetarian,
          sugar_conscious: this.state.sugar_conscious,
          peanut_free: this.state.peanut_free,
          tree_nut_free: this.state.tree_nut_free,
          alcohol_free: this.state.alcohol_free,
          kosher: this.state.kosher,
          dietType: this.state.dietType,
          searchQuery: this.state.searchQuery,
          fromNumber: this.state.fromNumber,
          toNumber: this.state.toNumber
        };

        API.postHealthyHelperValues(values)
          .then(response => {
            if (response.data !== "Error") {
              this.setState({ recipes: response.data.hits });
            } else {
              Swal.fire({
                position: "center",
                type: "error",
                text: "No recipes were found!",
                showConfirmButton: false,
                timer: 2000,
                customClass: {
                  header: this.props.classes.recipeModalTitle,
                  content: this.props.classes.recipeModalText
                }
              });
            }
          })
          .catch(err => console.log(err));
      }
    );
  };

  handleMoreResults = event => {
    event.preventDefault();

    if (!this.state.loading) {
      this.setState(
        {
          success: false,
          loading: true
        },
        () => {
          this.timer = setTimeout(() => {
            this.setState({
              loading: false,
              success: true
            });
          }, 2000);
        }
      );
    }

    this.setState(
      () => {
        return {
          fromNumber: this.state.toNumber + 1,
          toNumber: this.state.toNumber + 48
        };
      },
      () => {
        const values = {
          vegan: this.state.vegan,
          vegetarian: this.state.vegetarian,
          sugar_conscious: this.state.sugar_conscious,
          peanut_free: this.state.peanut_free,
          tree_nut_free: this.state.tree_nut_free,
          alcohol_free: this.state.alcohol_free,
          kosher: this.state.kosher,
          dietType: this.state.dietType,
          searchQuery: this.state.searchQuery,
          fromNumber: this.state.fromNumber,
          toNumber: this.state.toNumber
        };

        API.postHealthyHelperValues(values)
          .then(response => {
            if (response.data !== "Error") {
              let recipes = this.state.recipes;
              response.data.hits.forEach(recipe => {
                recipes.push(recipe);
              });
              this.setState({ recipes });
            } else {
              Swal.fire({
                position: "center",
                type: "error",
                text: "No recipes were found.",
                showConfirmButton: false,
                timer: 2000,
                customClass: {
                  header: this.props.classes.recipeModalTitle,
                  content: this.props.classes.recipeModalText
                }
              });
            }
          })
          .catch(err => console.log(err));
      }
    );
  };

  // user defined query GET route for EDAMAM recipes
  getAll(user) {
    API.getDBRecipes(user)
      .then(res => {
        this.setState({
          favorites: res.data.favorites,
          favURIs: [],
          userPreferences: res.data.preferences,
          vegan: res.data.preferences.vegan || false,
          vegetarian: res.data.preferences.vegetarian || false,
          sugar_conscious: res.data.preferences.sugar_conscious || false,
          peanut_free: res.data.preferences.peanut_free || false,
          tree_nut_free: res.data.preferences.tree_nut_free || false,
          alcohol_free: res.data.preferences.alcohol_free || false,
          kosher: res.data.preferences.kosher || false,
          dietType: res.data.preferences.dietType,
          menu: res.data.weeklymenu
        });
        this.formatFavURIs();
      })
      .catch(err => console.log(err));
  }

  refreshPreferences(user) {
    API.getDBRecipes(user)
      .then(res => {
        this.setState({
          vegan: res.data.preferences.vegan || false,
          vegetarian: res.data.preferences.vegetarian || false,
          sugar_conscious: res.data.preferences.sugar_conscious || false,
          peanut_free: res.data.preferences.peanut_free || false,
          tree_nut_free: res.data.preferences.tree_nut_free || false,
          alcohol_free: res.data.preferences.alcohol_free || false,
          kosher: res.data.preferences.kosher || false,
          dietType: res.data.preferences.dietType
        });
      })
      .catch(err => console.log(err));
  }

  formatRecipe = favObj => {
    let formRec = {
      uri: favObj.recipe.uri,
      calories: favObj.recipe.calories,
      protein: favObj.recipe.digest[2].total,
      fat: favObj.recipe.digest[0].total,
      carb: favObj.recipe.digest[1].total,
      label: favObj.recipe.label,
      url: favObj.recipe.url,
      time: favObj.recipe.totalTime,
      ingredients: favObj.recipe.ingredientLines,
      image: favObj.recipe.image
    };

    return formRec;
  };

  formatFavURIs = () => {
    const curFavs = this.state.favorites;
    const favURIs = [];
    curFavs.map(item => favURIs.push(item.uri));
    this.setState({ favURIs });
  };

  checkFav = uri => {
    if (!this.state.favURIs) {
      return false;
    } else {
      return this.state.favURIs.includes(uri) ? true : false;
    }
  };

  handleFavorite = (fav, recipeName) => {
    let newFav = this.formatRecipe(fav);

    API.updateFavs(this.state.currentUser, newFav)
      .then(() => {
        this.getAll(this.state.currentUser);
      })
      .then(() => {
        if (this.state.favURIs.includes(newFav.uri)) {
          Swal.fire({
            position: "center",
            type: "success",
            title: recipeName.toUpperCase(),
            text: "This recipe has been removed from your favorites.",
            showConfirmButton: false,
            timer: 4000,
            customClass: {
              header: this.props.classes.recipeModalTitle,
              content: this.props.classes.recipeModalText
            }
          });
        } else {
          Swal.fire({
            position: "center",
            type: "success",
            title: recipeName.toUpperCase(),
            text: "This recipe has been added to your favorites.",
            showConfirmButton: false,
            timer: 4000,
            customClass: {
              header: this.props.classes.recipeModalTitle,
              content: this.props.classes.recipeModalText
            }
          });
        }
      })
      .catch(err => console.log(err));
  };

  handleMealSave = (day, meal, recipe) => {
    console.log(day, meal);
    console.log(recipe);
    this.getAll(this.state.currentUser);
    let newMeal = this.formatRecipe(recipe);
    let curMenu = { ...this.state.menu };

    if (!curMenu[day]) {
      curMenu[day] = { [meal]: newMeal };
    } else {
      curMenu[day][meal] = newMeal;
    }

    API.updateMenu(this.state.currentUser, curMenu)
      .then(res => this.getAll(this.state.currentUser))
      .catch(err => console.log(err));
  };

  render() {
    const { classes } = this.props;
    const {
      vegan,
      vegetarian,
      sugar_conscious,
      peanut_free,
      tree_nut_free,
      alcohol_free,
      kosher,
      dietType
    } = this.state;
    const { loading } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar className="searchMenuBackground">
            <Grid container spacing={24}>
              <Grid className="searchbarGrid" item xs={12} md={5}>
                <FormLabel
                  component="legend"
                  className="labels sbMarginFix"
                >
                  Find Recipes
                </FormLabel>
                <div className="sbFlexFix">
                  <Button
                    variant="contained"
                    color="secondary"
                    className="searchBtn"
                    onClick={this.handleSearchValues}
                    disabled={loading}
                  >
                    Search
                  </Button>
                  <div className={classes.search}>
                    <div className={classes.searchIcon}>
                      <SearchIcon />
                    </div>
                    <div>
                      <InputBase
                        name="searchTerm"
                        onChange={this.handleSearchQuery}
                        classes={{
                          root: classes.inputRoot,
                          input: classes.inputInput
                        }}
                      />
                      {loading && (
                        <CircularProgress
                          size={24}
                          className={classes.buttonProgress}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={7}>
                <FormLabel
                  component="legend"
                  className="labels dietOptionsMarginFix sbMarginFix"
                >
                  Diet Types
                </FormLabel>
                <RadioGroup
                  aria-label="Diet Types"
                  name="dietType"
                  className="dietOptions"
                  value={dietType}
                  onChange={this.handleDietTypes}
                >
                  <FormControlLabel
                    value="balanced"
                    control={<Radio />}
                    label="Balanced"
                    className="formatDietOptions"
                  />
                  <FormControlLabel
                    value="high-protein"
                    control={<Radio />}
                    label="High Protein"
                    className="formatDietOptions"
                  />
                  <FormControlLabel
                    value="low-carb"
                    control={<Radio />}
                    label="Low Carb"
                    className="formatDietOptions"
                  />
                  <FormControlLabel
                    value="low-fat"
                    control={<Radio />}
                    label="Low Fat"
                    className="formatDietOptions"
                  />
                </RadioGroup>
              </Grid>
              <Grid item xs={12} className="dietRestrictionMarginFix">
                <FormLabel component="legend" className="labels">
                  Diet Restrictions
                </FormLabel>
                <FormGroup className="dietRestrictionOptions">
                  <FormControlLabel
                    className="formatdietRestrictionOptions"
                    control={
                      <Checkbox
                        checked={vegan}
                        onChange={this.handleDietRestrictions("vegan")}
                      />
                    }
                    label="Vegan"
                  />
                  <FormControlLabel
                    className="formatdietRestrictionOptions"
                    control={
                      <Checkbox
                        checked={vegetarian}
                        onChange={this.handleDietRestrictions("vegetarian")}
                      />
                    }
                    label="Vegetarian"
                  />
                  <FormControlLabel
                    className="formatdietRestrictionOptions"
                    control={
                      <Checkbox
                        checked={sugar_conscious}
                        onChange={this.handleDietRestrictions("sugar_conscious")}
                      />
                    }
                    label="Sugar-conscious"
                  />
                  <FormControlLabel
                    className="formatdietRestrictionOptions"
                    control={
                      <Checkbox
                        checked={peanut_free}
                        onChange={this.handleDietRestrictions("peanut_free")}
                      />
                    }
                    label="Peanut-free"
                  />
                  <FormControlLabel
                    className="formatdietRestrictionOptions"
                    control={
                      <Checkbox
                        checked={tree_nut_free}
                        onChange={this.handleDietRestrictions("tree_nut_free")}
                      />
                    }
                    label="Tree Nut-free"
                  />
                  <FormControlLabel
                    className="formatdietRestrictionOptions"
                    control={
                      <Checkbox
                        checked={alcohol_free}
                        onChange={this.handleDietRestrictions("alcohol_free")}
                      />
                    }
                    label="Alcohol-free"
                  />
                  <FormControlLabel
                    className="formatdietRestrictionOptions"
                    control={
                      <Checkbox
                        checked={kosher}
                        onChange={this.handleDietRestrictions("kosher")}
                      />
                    }
                    label="Kosher"
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Grid container spacing={24} className="gridFormatting">
          {this.state.recipes && this.state.recipes.length !== 0 ? (
            this.state.recipes.map(recipe => {
              return (
                <Grid item lg={3} className="gridCard">
                  <RecipeCard
                    favorite={this.checkFav(recipe.recipe.uri)}
                    recipeInfo={recipe}
                    handleFavorite={this.handleFavorite}
                    saveMeal={this.handleMealSave}
                    user={this.state.currentUser}
                  />
                </Grid>
              );
            })
          ) : (
            <h1 className="noResultsFound">No Recipes To Display</h1>
          )}
        </Grid>
        {this.state.recipes && this.state.recipes.length !== 0 ? (
          <Button
            variant="outlined"
            color="default"
            onClick={this.handleMoreResults}
            className="moreResultsBtn"
            disabled={loading}
          >
            Find More Results
            {loading && (
              <CircularProgress
                size={24}
                className={classes.buttonProgressAlt}
              />
            )}
          </Button>
        ) : (
          false
        )}
      </div>
    );
  }
}

SearchAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SearchAppBar);

