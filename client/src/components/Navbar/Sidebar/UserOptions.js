import React, { Component } from "react";
import { withRouter } from "react-router";

import PropTypes from "prop-types";
import Firebase from "../../../config/Firebase";
import API from "../../../utils/API";
import Swal from "sweetalert2";
import "../style.css";

// material-ui imports
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import Tab from "@material-ui/core/Tab";
import FormLabel from "@material-ui/core/FormLabel";
import UserSettings from "@material-ui/icons/SettingsApplications";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

// sidebar user styling
const styles = theme => ({
  root: {
    display: "flex"
  },

  labelSpacing: {
    "letter-spacing": "2px"
  },

  formControl: {
    margin: theme.spacing.unit * 3
  },

  list: {
    width: 250
  },

  button: {
    margin: theme.spacing.unit
  },

  group: {
    margin: `${theme.spacing.unit}px 0`
  },

  logoutBtn: {
    margin: "15px 8px 8px 0",
    background: "linear-gradient(to right, #2a5298, #1e3c72)"
  },

  input: {
    display: "none"
  },

  drawerFix: {
    outline: "none !important"
  },

  dietRestrictionCustom: {
    marginBottom: "7px"
  }
});

// WHEN USER is signed in
// provides sidebar to allow USER to adjust 
// diet rescriction 
class TemporaryDrawer extends Component {
  state = {
    left: false,
    vegan: false,
    vegetarian: false,
    sugar_conscious: false,
    peanut_free: false,
    tree_nut_free: false,
    alcohol_free: false,
    dietType: "",
    currentUser: ""
  };

  componentDidMount() {
    Firebase.auth().onAuthStateChanged(user => {
      if (user && !Firebase.auth().currentUser.isAnonymous) {
        this.getAll(user.email);
        this.setState({ currentUser: user.email });
      }
    });
  }

  getAll(user) {
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

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open
    });
  };

  userLogout = () => {
    Firebase.auth()
      .signOut()
      .then(user => {
        this.props.history.push("/");
      })
      .catch(error => {
        console.log(error);
      });
  };

  saveChanges = () => {
    const values = {
      preferences: {
        vegan: this.state.vegan,
        vegetarian: this.state.vegetarian,
        sugar_conscious: this.state.sugar_conscious,
        peanut_free: this.state.peanut_free,
        tree_nut_free: this.state.tree_nut_free,
        alcohol_free: this.state.alcohol_free,
        dietType: this.state.dietType
      }
    };

    // update user preferences in db
    API.updatePref(this.state.currentUser, values).then(() => {
      Swal.fire({
        position: "top-end",
        type: "success",
        title: "Your settings been saved",
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        if (this.state.left) {
          this.props.triggerPrefUpdate();
        }
      });
    });
  };

  handleDietRestrictions = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleDietType = event => {
    this.setState({ dietType: event.target.value });
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
      kosher
    } = this.state;

    const sideList = (
      <div className={classes.list}>
        <List>
          <div className={classes.root}>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel className={classes.labelSpacing} component="legend">
                Diet Types
              </FormLabel>
              <RadioGroup
                aria-label="Diet Types"
                name="dietType"
                className={classes.group}
                value={this.state.dietType}
                onChange={this.handleDietType}
              >
                <FormControlLabel
                  className={[classes.labelSpacing, "formatDietOptions"].join(
                    " "
                  )}
                  value="balanced"
                  control={<Radio />}
                  label="Balanced"
                />
                <FormControlLabel
                  className={[classes.labelSpacing, "formatDietOptions"].join(
                    " "
                  )}
                  value="high-protein"
                  control={<Radio />}
                  label="High Protein"
                />
                <FormControlLabel
                  className={[classes.labelSpacing, "formatDietOptions"].join(
                    " "
                  )}
                  value="low-carb"
                  control={<Radio />}
                  label="Low Carb"
                />
                <FormControlLabel
                  className={[classes.labelSpacing, "formatDietOptions"].join(
                    " "
                  )}
                  value="low-fat"
                  control={<Radio />}
                  label="Low Fat"
                />
              </RadioGroup>
            </FormControl>
          </div>
        </List>
        <Divider />
        <List>
          <div className={classes.root}>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel
                component="legend"
                className={[classes.labelSpacing, classes.dietRestrictionCustom].join(
                  " "
                )}
              >
                Diet Restrictions
              </FormLabel>
              <FormGroup>
                <FormControlLabel
                  className={[
                    classes.labelSpacing,
                    "formatDietRestrictions"
                  ].join(" ")}
                  control={
                    <Checkbox
                      checked={vegan}
                      onChange={this.handleDietRestrictions("vegan")}
                    />
                  }
                  label="Vegan"
                />
                <FormControlLabel
                  className={[
                    classes.labelSpacing,
                    "formatDietRestrictions"
                  ].join(" ")}
                  control={
                    <Checkbox
                      checked={vegetarian}
                      onChange={this.handleDietRestrictions("vegetarian")}
                    />
                  }
                  label="Vegetarian"
                />
                <FormControlLabel
                  className={[
                    classes.labelSpacing,
                    "formatDietRestrictions"
                  ].join(" ")}
                  control={
                    <Checkbox
                      checked={sugar_conscious}
                      onChange={this.handleDietRestrictions("sugar_conscious")}
                    />
                  }
                  label="Sugar-conscious"
                />
                <FormControlLabel
                  className={[
                    classes.labelSpacing,
                    "formatDietRestrictions"
                  ].join(" ")}
                  control={
                    <Checkbox
                      checked={peanut_free}
                      onChange={this.handleDietRestrictions("peanut_free")}
                    />
                  }
                  label="Peanut-free"
                />
                <FormControlLabel
                  className={[
                    classes.labelSpacing,
                    "formatDietRestrictions"
                  ].join(" ")}
                  control={
                    <Checkbox
                      checked={tree_nut_free}
                      onChange={this.handleDietRestrictions("tree_nut_free")}
                    />
                  }
                  label="Tree Nut-free"
                />
                <FormControlLabel
                  className={[
                    classes.labelSpacing,
                    "formatDietRestrictions"
                  ].join(" ")}
                  control={
                    <Checkbox
                      checked={alcohol_free}
                      onChange={this.handleDietRestrictions("alcohol_free")}
                    />
                  }
                  label="Alcohol-free"
                />
                <FormControlLabel
                  className={[
                    classes.labelSpacing,
                    "formatDietRestrictions"
                  ].join(" ")}
                  control={
                    <Checkbox
                      checked={kosher}
                      onChange={this.handleDietRestrictions("kosher")}
                    />
                  }
                  label="Kosher"
                />
              </FormGroup>
            </FormControl>
          </div>
        </List>
        <div className={this.props.sidebarSavePlacement}>
          <Button
            onClick={this.saveChanges}
            variant="contained"
            className={[classes.button, this.props.sidebarSaveButton].join(" ")}
          >
            Save Changes
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={[classes.button, classes.logoutBtn].join(" ")}
            onClick={this.userLogout}
          >
            Log Out
          </Button>
        </div>
      </div>
    );

    return (
      <div>
        <Button
          className={this.props.navButton}
          onClick={this.toggleDrawer("left", true)}
        >
          <Tab
            className={this.props.navbarText}
            label="Settings"
            icon={<UserSettings className={this.props.navcon} />}
          />
        </Button>
        <Drawer
          open={this.state.left}
          onClose={this.toggleDrawer("left", false)}
        >
          <div
            tabIndex={0}
            className={classes.drawerFix}
            role="button"
            onKeyDown={this.toggleDrawer("left", false)}
          >
            {sideList}
          </div>
        </Drawer>
      </div>
    );
  }
}

TemporaryDrawer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(TemporaryDrawer));