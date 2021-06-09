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

// Alert
import { Alert } from '@material-ui/lab'

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

    // MENSAJES DEL FORMULARIO
    const [error, setError] = useState(false); //Variable flag de existencia de error
    const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
    const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
    const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso
    const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
    const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

    // UseEffect para cambiar la pestaña actual a la pestaña que se cree nueva
    useEffect(() => {
      console.log(course)
      if(course.units.length > 0 && addingUnit){
        setValue(course.units.length-1);
        setAddingUnit(false);
      }
    }, [course])

     // Funcion para mostrar una alerta de error dado un mensaje
     const showError = (message) => {
      setError(true);   //Se cambia el estado de mensaje de error a verdadero
      setErrorMessage(message); //Se setea el mensaje de error
      setTimeout(() => { //Dura 2sg en pantalla el mensaje
          setError(false);
          setErrorMessage("");
      }, 2000)
    };

    // Funcion para mostrar una alerta satisfactoria dado un mensaje
    const showSuccess = (message) => {
      setSuccess(true);   //Se cambia el estado de mensaje de proceso satisfactorio a verdadero
      setSuccessMessage(message); //Se setea el mensaje de proceso satisfactorio
      setTimeout(() => { //Dura 2sg en pantalla el mensaje
          setSuccess(false);
          setSuccessMessage("");
      }, 2000)
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

    // Metodo para crear una nueva unidad con unos datos basicos en el curso actual que se renderiza en el componente
    const addUnit = async () => {
      try {
        setProcess(true);
        setProcessMessage('Creando una nueva unidad...');

        const response = await api.post(`/api/course/unit/${course._id}`, {
          name: "Nueva unidad",
          description: "Añade una descripción"
        }, {headers: {'x-access-token':localStorage.getItem('token')}});

        const { updatedCourse, message } = response.data;

        if(updatedCourse){
          showSuccess(message);
          setAddingUnit(true);
          setCourse(updatedCourse);
        }else{
          console.log(message)
          showError(message);
        }
      } catch (error) {
        console.error(error)
        showError(error);
      } finally {
        setProcess(false);
        setProcessMessage('')
      }
    }

    // Metodo para borrar una unidad del curso actual dada la id de la unidad
    const deleteUnit = async (unitId) => {
      try {
        setProcess(true);
        setProcessMessage('Borrando una nueva unidad...');

        const response = await api.delete(`/api/course/unit/${course._id}/${unitId}`, {headers: {'x-access-token':localStorage.getItem('token')}});

        const { updatedCourse, message } = response.data;

        if(updatedCourse){
          showSuccess(message);
          setAddingUnit(true);
          setCourse(updatedCourse);
        }else{
          console.log(message);
          showError(message);
        }
      } catch (error) {
        console.error(error)
        showError(error);
      } finally {
        setProcess(false);
        setProcessMessage('')
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
                    {/* TABS FOR EACH UNIT IN THE COURSE */}
                    {
                      course.units.map(unit => (
                        <Tab label={unit.name +" "+ (course.units.indexOf(unit)+1)} {...a11yProps(course.units.indexOf(unit))} />
                      ))
                    }
                    {course.units[0]?<div className="divider bg-white"></div>:""}
                  </Tabs>
                  {course.units[0]?<div className="divider"></div>:""}.
                  {/* BUTTON TO ADD NEW UNITS */}
                  <Button onClick={() => addUnit()} color="secondary" className="px-3 ml-2"><ControlPoint/> Añadir unidad</Button>
                </div>
              </Container>
              {success?
                  <Alert className="alert-message logic-sequence-alert" severity="success">{successMessage}</Alert>
                  : ""
              }
              {error?
                  <Alert className="alert-message logic-sequence-alert" severity="error">{errorMessage}</Alert>
                  : ""
              }
              {process?
                  <Alert className="alert-message logic-sequence-alert" severity="info">{processMessage}</Alert>
                  : ""
              }
            </AppBar>
            {/* COMPONENTS OF EACH UNIT IN THE COURSE */}
            {
              course.units.map(unit => (
                <TabPanel value={value} index={course.units.indexOf(unit)}>
                  {unit.description} {course.units.indexOf(unit)}
                  {/* BUTTON TO DELETE A SPECIFIC UNIT */}
                  <Button color="secondary" variant="contained" onClick={() => deleteUnit(unit._id)}>Borra unidad</Button>
                </TabPanel>
              ))
            }
        </div>
    )
}
