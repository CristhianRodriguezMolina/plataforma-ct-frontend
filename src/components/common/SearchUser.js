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

	// If the location change then the search input is cleaned
	useEffect(() => {
		setSearchInput('');
	}, [location]);

	// UseEffect to set the filter text to empty if the input is changed to empty
	useEffect(() => {
		if (searchInput === '') {
			setFilteredUsers(users);
			if (setPage) {
				setPage(1); // This line is for, when you clean the search input then put the page in 1
			}
		}
	}, [searchInput])

	// When the students list change only if the students list is different to the filtered list then change the filtered list to the filtered
	useEffect(() => {
		if (users !== filteredUsers) {
			setFilteredUsers(users);
		}
	}, [users])

	// Method to change the variable that filter the users in the list of users    
	const changeFilterText = (e) => {
		e.preventDefault();

		if (searchInput.trim() !== '') {
			setFilteredUsers(users.filter(({ first_name, last_name, phone, id }) => (
				first_name.toLowerCase().includes(searchInput.trim().toLowerCase()) ||
				last_name.toLowerCase().includes(searchInput.trim().toLowerCase()) ||
				phone.includes(searchInput.trim()) ||
				id.includes(searchInput.trim())
			)));
		} else {
			setFilteredUsers(users);
			if (setPage) {
				setPage(1); // This line is for, when you clean the search input then put the page in 1
			}
		}
	}

	// Method to empty to the search field
	const handleClearSearchInput = () => {
		setSearchInput(''); // Set the input to empty
	}

	return (
		<form onSubmit={changeFilterText} className="search-form d-flex justify-content-between mb-3">
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
	)
}
