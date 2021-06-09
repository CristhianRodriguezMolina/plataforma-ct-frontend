import React, { useState, useEffect } from 'react'

// API
import api from '../../../services/api';

// SCSS
import './teacherview.scss';

// Props types
import PropTypes from 'prop-types';

// COMPONENTS

// MAterial UI Make Styles
import { makeStyles } from '@material-ui/core/styles';

// Components for the tab bar
import { AppBar, Box, Button, Container, Tab, Tabs, Typography } from '@material-ui/core'

// Icons
import { ControlPoint } from '@material-ui/icons';

// Colors
import { red, lightGreen } from '@material-ui/core/colors';

/* TEACHER */
function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-force-tabpanel-${index}`}
        aria-labelledby={`scrollable-force-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
    
  function a11yProps(index) {
    return {
      id: `scrollable-force-tab-${index}`,
      'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      width: '100%',
      backgroundColor: red[100],
      margin: 0,
      padding: 0,
    },
    bar: {
        backgroundColor: 'white',
        color: 'white'
    }
  }));

export default function UnitsInformation({ course, setCourse }) {

    const classes = useStyles();

    // Valor actual referente a la pestaña actuala abierta
    const [value, setValue] = useState(0);

    // Auxiliar para llevar al cuenta de los datos
    const [addingUnit, setAddingUnit] = useState(false);

    // UseEffect para cambiar la pestaña actual a la pestaña que se cree nueva
    useEffect(() => {
      console.log(course)
      if(course.units.length > 0 && addingUnit){
        setValue(course.units.length-1);
        setAddingUnit(false);
      }
    }, [course])

    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

    const addUnit = async () => {
      try {
        const response = await api.post(`/api/course/unit/${course._id}`, {
          name: "Nueva unidad",
          description: "Añade una descripción"
        }, {headers: {'x-access-token':localStorage.getItem('token')}});

        const { updatedCourse, message } = response.data;

        if(updatedCourse){
          setAddingUnit(true);
          setCourse(updatedCourse);
        }else{
          console.log(message)
        }
      } catch (error) {
        console.log(error)
      }
    }

    const deleteUnit = async (unitId) => {
      try {
        const response = await api.delete(`/api/course/unit/${course._id}/${unitId}`, {headers: {'x-access-token':localStorage.getItem('token')}});

        const { updatedCourse, message } = response.data;

        if(updatedCourse){
          setAddingUnit(true);
          setCourse(updatedCourse);
        }else{
          console.log(message)
        }
      } catch (error) {
        
      }
    }

    return (
        <div className={classes.root}>
            <AppBar className={classes.bar} position="static">
              <Container>
                <div className="d-flex units-bar">
                  <Tabs
                  value={value}
                  onChange={handleChange}
                  variant="scrollable"
                  scrollButtons="on"
                  indicatorColor="secondary"
                  textColor="secondary"
                  aria-label="scrollable force tabs example"                                 
                  >
                    {
                      course.units.map(unit => (
                        <Tab label={unit.name} {...a11yProps(course.units.indexOf(unit))} />
                      ))
                    }
                    {course.units[0]?<div className="divider bg-white"></div>:""}
                  </Tabs>
                  {course.units[0]?<div className="divider"></div>:""}
                  <Button onClick={() => addUnit()} color="secondary" className="px-3 ml-2"><ControlPoint/> Añadir unidad</Button>
                </div>
              </Container>
            </AppBar>
            {
              course.units.map(unit => (
                <TabPanel value={value} index={course.units.indexOf(unit)}>
                  {unit.description} {course.units.indexOf(unit)}
                  <Button color="secondary" variant="contained" onClick={() => deleteUnit(unit._id)}>Borra unidad</Button>
                </TabPanel>
              ))                
            }
        </div>
    )
}
