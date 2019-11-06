## Intro
After creating UI components, we should wrap them with our layout components, so when each new page gets loaded, if the layout stays the same, it won't get rendered again. Layout component should contain a header, footer, main, and a React Helmet component to be search engine friendly. Besides, layout should change to fit different screen size.

## Layouts
1. Let's work on Header and NavBar first.<br/>
For different screen size, we will have different layout. For large screens, nav items can be shown under header, while smaller screens have to fold them in a drawer.<br/>
For bigger screen, header will hold them site name, subscribe button and a searchBar.<br/>
Let's create a search bar component first.
```jsx
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

```

```jsx
const Header = ({ siteTitle }) => {
  const classes = useStyles()
  const title = siteTitle.replace("-", " ")
  const navToAccount = evt => {
    evt.preventDefault()
    navigate("/account/", {
      state: { from: "/" },
    })
  }
  return (
    <Toolbar className={classes.toolbar}>
      <Button size="small">Subscribe</Button>
      <Typography
        component="h2"
        variant="h5"
        color="inherit"
        align="center"
        noWrap
        className={classes.toolbarTitle}
      >
        <Link to={"/"} style={{ color: "black" }}>
          {capitalize(title)}</Link>
      </Typography>
    </Toolbar>
  )
}

```

2. We will need a layout component to begin with. To prevent class names collisions, we need to provide a unique prefix for each page. Besides, we will query site title with staticQuery method from gatsby to set up title for each page. This component will change according to the width of screen be responsive. Additionally, we need to record if the drawer in layout is open, so we can push the main component aside a little. For smaller screen, nav bar items were hidden in a drawer. Once clicked, contents will be pushed away to the right. We pass useState hook to the child component to let Nav component to decide when to open or close the drawer.  Add another dependency named clsx to help add className to component when state changes.


```jsx
const Layout = ({ children, classPrefix, title }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
        site {
            siteMetadata {
                title
            }
        }
    }
  `)

  const [drawerOpen, setDrawerOpen] = useState(false)

  const generateClassName = createGenerateClassName({
    productionPrefix: classPrefix,
  })

  const { site: { siteMetadata: { title: siteTitle } } } = data

  const classes = useStyles()
  return (
    <JssProvider generateClassName={generateClassName}>
      <React.Fragment>
        <SEO title={`${title}`}/>
        <CssBaseline/>
        <Container className={classes.container}>
          <NavBar siteTitle={siteTitle} drawerHandler={setDrawerOpen} drawerOpen={drawerOpen} />
          <main className={clsx(classes.content, { [classes.contentShift]: drawerOpen,})}>
            <div className={classes.drawerHeader}/>
            {children}
          </main>
        </Container>
        <Footer/>
      </React.Fragment>
    </JssProvider>
  )
}
```

3. Footer component is pretty easy, it has a minimal height of 80vh to stay at bottom.
```jsx

const Footer = () => (
    <footer className={useStyles().footer}>
      <Container maxWidth="lg">
        <Typography variant="h6" align="center" gutterBottom>
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
        </Typography>
        <Copyright />
      </Container>
    </footer>
  )

export default Footer
```

4. Let's write our navBar component. First, we should figure out which items will be displayed and respective click handlers for each item. 
Create a custom hook file withDimensions.js in src/util 
```jsx
import {useState, useEffect} from 'react'

const getWindowDimensions = () => {
  const windowGlobal = typeof window !== 'undefined' && window;
  const {innerWidth: width, innerHeight: height} = windowGlobal;
  return {
    width, height
  }
};

const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  useEffect(() => {
    const handleResize = () => setWindowDimensions(getWindowDimensions());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowDimensions;
}

export default useWindowDimensions
```

For a bigger screen, we build a header component and render nav bar items below. 

```jsx
export const ListRenderer = (items, icon = true) => (
  <List>
    {items.map((item, index) =>
      <ListItem button key={index}>
        {icon &&
        <ListItemIcon>
          {item.icon}
        </ListItemIcon>
        }
        {item.comp}
      </ListItem>)
    }
  </List>
)
```

defaultNavItems include category items and page items
```jsx
const defaultItems = { ...CAT_BTNS, ...PAGES_BTNS }

Object.keys(defaultItems).forEach((key, index) => {
  defaultItems[key].name = key
  defaultItems[key].comp = makeLinkItem(key)
})

export const defaultNavItems = Object.values(defaultItems)
```


Header component include subscribe button, site title and a search button

```jsx

const Header = ({ siteTitle }) => {
  const classes = useStyles()
  const title = siteTitle.replace("-", " ")
  const navToAccount = evt => {
    evt.preventDefault()
    navigate("/account/", {
      state: { from: "/" },
    })
  }
  return (
    <Toolbar className={classes.toolbar}>
      <Button size="small">Subscribe</Button>
      <Typography
        component="h2"
        variant="h5"
        color="inherit"
        align="center"
        noWrap
        className={classes.toolbarTitle}
      >
        <Link to={"/"} style={{ color: "black" }}>
          {capitalize(title)}</Link>
      </Typography>
      <IconButton>
        <SearchBar/>
      </IconButton>
    </Toolbar>
  )
}
```
For smaller screen, we just use the example of drawer from material UI.

```jsx
const AppTopBar = ({ siteTitle, items, drawerHandler, drawerOpen }) => {
  const navItems = items ? items : defaultNavItems
  const title = siteTitle.replace("-", " ")
  const classes = useStyles()
  const theme = useTheme()

  const handleDrawerOpen = () => {
    drawerHandler(true)
  }

  const handleDrawerClose = () => {
    drawerHandler(false)
  }

  console.log(drawerOpen)

  return (
    <div className={classes.root}>
      <CssBaseline/>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: drawerOpen,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, drawerOpen && classes.hide)}
          >
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" noWrap>
            {capitalize(title)}
          </Typography>
          <SearchBar/>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
          </IconButton>
        </div>
        {ListRenderer(navItems, true)}
        <Divider/>
        <List>
          <ListItem button key="account">
            <ListItemIcon>
              <AccountBoxRoundedIcon/>
            </ListItemIcon>
          </ListItem>
        </List>
      </Drawer>
    </div>
  )
}
```


Then we have our navBar component.

```jsx
const NavBar = ({ siteTitle, items, drawerHandler, drawerOpen }) => {
  const navItems = items ? items : defaultNavItems
  const classes = useStyles()
  const { width } = useWindowDimensions()
  const theme = useTheme()
  const renderHelper = (windowWidth) => {
    if (windowWidth > theme.breakpoints.values["md"]) {
      return (
        <React.Fragment>
          <Header siteTitle={siteTitle} />
          <Toolbar component="nav" variant="dense" className={classes.toolbarSecondary}>
            {ListRenderer(navItems, true)}
          </Toolbar>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <AppTopBar siteTitle={siteTitle} items={items} drawerHandler={drawerHandler} drawerOpen={drawerOpen}/>
        </React.Fragment>
      )
    }
  }

  return (
    <React.Fragment>
      {renderHelper(width)}
    </React.Fragment>
  )
}
```

## Summary
In this chapter, we built a layout component to wrap children UI components. We wrote a custom hooker to get window dimension and render different navBar for different screen.

Next chapter, we will create pages dynamically with template and markdown source plugin.