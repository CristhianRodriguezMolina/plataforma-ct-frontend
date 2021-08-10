import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router';

// SCSS
import './SearchUser.scss'

// COMPONENTS

// Material UI Core
import { IconButton } from '@material-ui/core';

// Icons
import { Clear } from '@material-ui/icons';

export default function SearchUser(props) {

	let location = useLocation();

	// The users to filter and the setFiltered users to manage the search of users
	const { users, filteredUsers, setFilteredUsers, setPage } = props;

	// Text of the filed that is used to filter the students list
	const [searchInput, setSearchInput] = useState('');

	const [filterGenre, setFilterGenre] = useState('NA');

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
			console.log('Is entering here')
			filterUsers();
		}
	}, [users])

	// Method to change the variable that filter the users in the list of users    
	const changeFilterText = (e) => {
		e.preventDefault();

		filterUsers();
	}

	const filterUsers = () => {
		let auxUsers = users;
		console.log(auxUsers)
		auxUsers = filterByText(auxUsers);
		// console.log(auxUsers)
		auxUsers = filterByGenre(auxUsers);
		// console.log(auxUsers)

		setFilteredUsers(auxUsers);
	}

	const filterByText = (users) => {
		if (setPage) {
			setPage(1); // This line is for, when you clean the search input then put the page in 1
		}
		if (searchInput.trim() !== '') {
			console.log(searchInput, users)
			const auxUsers = users.filter(({ first_name, last_name, phone, id, email }) => (
				first_name.toLowerCase().includes(searchInput.trim().toLowerCase()) ||
				last_name.toLowerCase().includes(searchInput.trim().toLowerCase()) ||
				phone.includes(searchInput.trim()) ||
				id.includes(searchInput.trim()) ||
				email.includes(searchInput.trim())
			));
			console.log(auxUsers)
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
			console.log(filterGenre, users)
			const auxUsers = users.filter(({ genre }) => (
				genre === filterGenre
			));
			console.log(auxUsers)
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
		setFilteredUsers(users);
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
					<label className="mr-2">Genero</label>
					<select className="form-control" onChange={evt => { setFilterGenre(evt.target.value); }} value={filterGenre} aria-label="Default select example" required>
						<option value="NA" selected>N/A</option>
						<option value="F">Femenino</option>
						<option value="M">Masculino</option>
						<option value="NB">No binario</option>
					</select>
				</div>
				{
					filterGenre !== 'NA' ?
						<IconButton onClick={handleClearFilters} className='clear-button' size="small">
							<Clear />
						</IconButton>
						: ''
				}
			</div>
		</div>
	)
}
