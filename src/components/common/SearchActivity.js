
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

	const [filterType, setFilterType] = useState('NA');

	// If the location change then the search input is cleaned
	useEffect(() => {
		setSearchInput('');
		setFilterType('NA')
	}, [location]);

	// UseEffect to set the filter text to empty if the input is changed to empty or the genre is changed to N/A
	useEffect(() => {
		if (searchInput === '' && filterType === 'NA') {
			setFilteredActivities(activities);
		}
	}, [searchInput, filterType])

	// When the students list change only if the students list is different to the filtered list then change the filtered list to the filtered
	useEffect(() => {
		if (activities !== filteredActivities) {
			console.log('Is entering here')
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
		console.log(auxActivities);
		auxActivities = filterByText(auxActivities);
		// console.log(auxUsers)
		auxActivities = filterByType(auxActivities);
		// console.log(auxUsers)

		setFilteredActivities(auxActivities);
	}

	const filterByText = (activities) => {
		if (searchInput.trim() !== '') {
			console.log(searchInput, activities);
			const auxActivities = activities.filter(({ name, description }) => (
				name.toLowerCase().includes(searchInput.trim().toLowerCase()) ||
				description.toLowerCase().includes(searchInput.trim().toLowerCase())
			));
			console.log(auxActivities)
			return auxActivities;
		} else {
			return activities;
		}
	}

	const filterByType = (activities) => {
		if (filterType !== 'NA') {
			console.log(filterType, activities)
			const auxActivities = activities.filter(({ type }) => (
				type === filterType
			));
			console.log(auxActivities)
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
					<label className="mr-2">Tipo:</label>
					<select className="form-control" onChange={evt => { setFilterType(evt.target.value); }} value={filterType} aria-label="Default select example" required>
						<option value="NA" selected>Todas</option>
						<option value="logic_sequence">Secuencia lógica</option>
						<option value="maze">Laberinto</option>
						<option value="questionnaire">Selección multiple</option>
					</select>
				</div>
				{
					filterType !== 'NA' ?
						<IconButton onClick={handleClearFilters} className='clear-button' size="small">
							<Clear />
						</IconButton>
						: ''
				}
			</div>
		</div>
	)
}
