
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router';

// SCSS
import './SearchActivity.scss'

// COMPONENTS

// Material UI Core
import { IconButton } from '@material-ui/core';

// Icons
import { Clear } from '@material-ui/icons';

export default function SearchUser(props) {

	let location = useLocation();

	// The activities to filter and the setFiltered activities to manage the search of activities
	const { activities, filteredActivities, setFilteredActivities, setPage } = props;

	// Text of the filed that is used to filter the students list
	const [searchInput, setSearchInput] = useState('');

	//To filter by activity type
	const [filterType, setFilterType] = useState('NA');

	//To filter by activity difficulty
	const [filterDifficulty, setFilterDifficulty] = useState('NA');

	// If the location change then the search input is cleaned
	useEffect(() => {
		setSearchInput('');
		setFilterType('NA');
		setFilterDifficulty('NA');
	}, [location]);

	// UseEffect to set the filter text to empty if the input is changed to empty or the genre is changed to N/A
	useEffect(() => {
		if (searchInput === '' && filterType === 'NA' && filterDifficulty === 'NA') {
			setFilteredActivities(activities);
		}
	}, [searchInput, filterType, filterDifficulty])

	// When the students list change only if the students list is different to the filtered list then change the filtered list to the filtered
	useEffect(() => {
		if (activities !== filteredActivities) {
			filterActivities();
		}
	}, [activities])

	// Method to change the variable that filter the users in the list of users    
	const changeFilterText = (e) => {
		e.preventDefault();

		filterActivities();
	}

	const filterActivities = () => {
		let auxActivities = activities;
		auxActivities = filterByText(auxActivities);
		auxActivities = filterByType(auxActivities);
		auxActivities = filterByDifficulty(auxActivities);

		setFilteredActivities(auxActivities);
	}

	const filterByText = (activities) => {
		if (searchInput.trim() !== '') {
			const auxActivities = activities.filter(({ name, description }) => (
				name.toLowerCase().includes(searchInput.trim().toLowerCase()) ||
				description.toLowerCase().includes(searchInput.trim().toLowerCase())
			));
			return auxActivities;
		} else {
			return activities;
		}
	}

	const filterByType = (activities) => {
		if (filterType !== 'NA') {
			const auxActivities = activities.filter(({ type }) => (
				type === filterType
			));
			return auxActivities;
		} else {
			return activities;
		}
	}

	const filterByDifficulty = (activities) => {
		if (filterDifficulty !== 'NA') {
			const auxActivities = activities.filter(({ difficulty }) => (
				difficulty === filterDifficulty
			));
			return auxActivities;
		} else {
			return activities;
		}
	}

	// Method to empty to the search field
	const handleClearSearchInput = () => {
		setSearchInput(''); // Set the input to empty
	}

	const handleClearFilters = () => {
		setFilterType('NA');
		setFilterDifficulty('NA')
		setFilteredActivities(activities);
	}

	return (
		<div className='mb-3'>
			<form onSubmit={changeFilterText} className="search-form d-flex justify-content-between">
				<div className="text-field form-group mr-3">
					<input className="form-control text-center w-100" value={searchInput} onChange={evt => setSearchInput(evt.target.value)} />
					{
						searchInput !== '' ?
							<IconButton onClick={handleClearSearchInput} className='clear-button' size="small">
								<Clear />
							</IconButton>
							:
							''
					}
				</div>
				<div className="form-group">
					<button type="submit" className="btn-search custom-btn custom-btn-search">
						Buscar
					</button>
				</div>
			</form>
			<div className="d-flex">
				<div className="d-flex justify-content-center align-items-center">
					<label className="my-auto mr-2">Tipo:</label>
					<select className="form-control mr-2" onChange={evt => { setFilterType(evt.target.value); }} value={filterType} aria-label="ComboBox to Filter by type" required>
						<option value="NA" selected>Todas</option>
						<option value="logic_sequence">Secuencia lógica</option>
						<option value="maze">Laberinto</option>
						<option value="questionnaire">Selección multiple</option>
					</select>

					<label className="my-auto mr-2">Dificultad:</label>
					<select className="form-control" onChange={evt => { setFilterDifficulty(evt.target.value); }} value={filterDifficulty} aria-label="ComboBox to Filter by difficulty" required>
						<option value="NA" selected>Todas</option>
						<option value="beginner">Principiante</option>
						<option value="intermediate">Intermedio</option>
						<option value="advance">Avanzado</option>
					</select>
				</div>
				{
					filterType !== 'NA' || filterDifficulty !== 'NA' ?
						<IconButton onClick={handleClearFilters} className='clear-button' size="small">
							<Clear />
						</IconButton>
						:
						<label className="text-start m-0 text-muted font-italic align-self-end mb-2 ml-2">Sin filtros</label>
				}
			</div>
		</div>
	)
}
