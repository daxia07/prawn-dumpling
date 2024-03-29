import React, { useState } from "react"
import SearchIcon from "@material-ui/icons/Search"
import InputBase from "@material-ui/core/InputBase"
import { makeStyles } from "@material-ui/core"
import { fade } from "@material-ui/core/styles"
import { useStaticQuery, graphql } from "gatsby"
import Link from "./Link"
import MenuItem from "@material-ui/core/MenuItem"
import Downshift from "downshift"
import Paper from "@material-ui/core/Paper"


const useStyles = makeStyles(theme => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 10,
    width: "auto",
    [theme.breakpoints.up("sm")]: {
      marginLeft: "auto",
      width: "auto",
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 120,
      "&:focus": {
        width: 200,
      },
    },
  },
  root: {
    flexGrow: 1,
    height: `auto`,
  },
  container: {
    flexGrow: 1,
    position: "relative",
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
  divider: {
    height: theme.spacing(2),
  },
  resultPanel: {
    marginTop: 38,
  },
}))

const SearchBar = () => {
  const classes = useStyles()

  const renderInput = inputProps => {
    const { InputProps, classes, value } = inputProps
    return (
      <InputBase
        placeholder="Search…"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ "aria-label": "search", ...InputProps }}
        value={value}
        margin="dense"
        style={{ float: `right` }}
      />
    )
  }


  return (
    <div className={classes.search} style={{ fontSize: `1rem` }}>
      <div className={classes.searchIcon}>
        <SearchIcon/>
      </div>

      <div className={classes.root}>
        <Downshift id="downshift-simple">
          {({
              getInputProps,
              getItemProps,
              getLabelProps,
              getMenuProps,
              highlightedIndex,
              isOpen,
              selectedItem,
            }) => {
            const { onBlur, onFocus, ...inputProps } = getInputProps({
              placeholder: "Search...",
            })

            return (
              <div className={classes.container}>
                {renderInput({
                  classes,
                  label: "Search",
                  InputLabelProps: getLabelProps({ shrink: true }),
                  InputProps: { onBlur, onFocus },
                  inputProps,
                })}

                <div {...getMenuProps()}>
                  {!isOpen ? (
                    <Paper className={classes.paper} square style={{ marginTop: 38 }}>
                    </Paper>
                  ) : null}
                </div>
              </div>
            )
          }}
        </Downshift>
        <div className={classes.divider}/>
      </div>
    </div>
  )
}

export default SearchBar
