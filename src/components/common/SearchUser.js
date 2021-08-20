import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router';

// SCSS
import './SearchUser.scss'

// Util
import * as util from '../../util/util';

// COMPONENTS

// Material UI Core
import { IconButton, Tooltip } from '@material-ui/core';

// Icons
import { Clear } from '@material-ui/icons';

export default function SearchUser(props) {

	let location = useLocation();

	// The users to filter and the setFiltered users to manage the search of users
	const { users, filteredUsers, setFilteredUsers, setPage } = props;

	// Text of the filed that is used to filter the users list
	const [searchInput, setSearchInput] = useState('');

	// Genre to filter the users list
	const [filterGenre, setFilterGenre] = useState('NA');

	// 
	const [ageOne, setAgeOne] = useState(0);
	const [ageTwo, setAgeTwo] = useState(0);

	// If the location change then the search input is cleaned
	useEffect(() => {
		setSearchInput('');
		setFilterGenre('NA')
	}, [location]);

	// UseEffect to set the filter text to empty if the input is changed to empty or the genre is changed to N/A
	useEffect(() => {
		if (searchInput === '' && filterGenre === 'NA') {
			setFilteredUsers(users);
			if (setPage) {
				setPage(1); // This line is for, when you clean the search input then put the page in 1
			}
		}
	}, [searchInput, filterGenre])

	// When the students list change only if the students list is different to the filtered list then change the filtered list to the filtered
	useEffect(() => {
		if (users !== filteredUsers) {
			filterUsers();
		}
	}, [users])

	// This useEffect is just to see if the ageOne increase over the ageTwo, then the ageTwo is to the same value than ageOne
	useEffect(() => {
		if (ageOne > ageTwo) {
			setAgeTwo(ageOne);
		}
	}, [ageOne])

	// Method to change the variable that filter the users in the list of users    
	const changeFilterText = (e) => {
		e.preventDefault();

		filterUsers();
	}

	const filterUsers = () => {
		let auxUsers = users;
		auxUsers = filterByText(auxUsers);
		auxUsers = filterByGenre(auxUsers);
		auxUsers = filterByAge(auxUsers);

		setFilteredUsers(auxUsers);
	}

	const filterByText = (users) => {
		if (setPage) {
			setPage(1); // This line is for, when you clean the search input then put the page in 1
		}
		if (searchInput.trim() !== '') {
			const auxUsers = users.filter(({ first_name, last_name, phone, id, email }) => (
				first_name.toLowerCase().includes(searchInput.trim().toLowerCase()) ||
				last_name.toLowerCase().includes(searchInput.trim().toLowerCase()) ||
				phone.includes(searchInput.trim()) ||
				id.includes(searchInput.trim()) ||
				email.includes(searchInput.trim())
			));
			return auxUsers;
		} else {
			return users;
		}
	}

	const filterByGenre = (users) => {
		if (setPage) {
			setPage(1); // This line is for, when you clean the search input then put the page in 1
		}
		if (filterGenre !== 'NA') {
			const auxUsers = users.filter(({ genre }) => (
				genre === filterGenre
			));
			return auxUsers;
		} else {
			return users;
		}
	}

	const filterByAge = (users) => {
		if (setPage) {
			setPage(1); // This line is for, when you clean the search input then put the page in 1
		}
		if (ageOne > 0 || ageTwo > 0) {
			const auxUsers = users.filter(({ birth_date }) => (
				util.getAge(birth_date) >= ageOne &&
				util.getAge(birth_date) <= ageTwo
			));
			return auxUsers;
		} else {
			return users;
		}
	}

	// Method to empty to the search field
	const handleClearSearchInput = () => {
		setSearchInput(''); // Set the input to empty
	}

	const handleClearFilters = () => {
		setFilterGenre('NA');
		setAgeOne(0);
		setAgeTwo(0);
		setFilteredUsers(users);
	}

	return (
		<div className='mb-3'>
			<form onSubmit={changeFilterText} className="search-form d-flex justify-content-between">
				<div className="text-field form-group mr-3">
					<input className="form-control text-center w-100" value={searchInput} onChange={evt => setSearchInput(evt.target.value)} />
					{
						searchInput !== '' ?
							<Tooltip title="Limpiar" aria-label="clean_input">
								<IconButton onClick={handleClearSearchInput} className='clear-button' size="small">
									<Clear />
								</IconButton>
							</Tooltip>
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
			<div className="d-flex justify-content-start align-items-center">
				<div className="d-flex flex-column align-items-start mr-4">
					<label className="text-start m-0 text-muted fst-italic">Genero</label>
					<select className="form-control" onChange={evt => { setFilterGenre(evt.target.value); }} value={filterGenre} aria-label="Default select example" required>
						<option value="NA" selected>N/A</option>
						<option value="F">Femenino</option>
						<option value="M">Masculino</option>
						<option value="NB">No binario</option>
					</select>
				</div>
				<div className="age-filter d-flex flex-column align-items-start mr-2">
					<label className="text-start m-0 text-muted fst-italic">Edad entre</label>
					<div className='d-flex justify-content-center align-items-center'>
						<input className="form-control text-center" type='number' min={0} value={ageOne} onChange={evt => setAgeOne(evt.target.value)} />
						<p className='m-0 align-self-center mx-2'>y</p>
						<input className="form-control text-center" type='number' min={ageOne} value={ageTwo} onChange={evt => setAgeTwo(evt.target.value)} />
					</div>
				</div>
				{
					filterGenre !== 'NA' || ageOne > 0 || ageTwo > 0 ?
						<Tooltip title="Limpiar filtros" aria-label="clean_filters">
							<IconButton onClick={handleClearFilters} className='align-self-end mb-1' size="small">
								<Clear />
							</IconButton>
						</Tooltip>
						:
						<label className="text-start m-0 text-muted font-italic align-self-end mb-2 ml-2">Sin filtros</label>
				}
			</div>
		</div>
	)
}
