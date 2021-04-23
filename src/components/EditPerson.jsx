import React from "react";
import DatePicker from "react-datepicker";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import { API_ROOT } from '../api-config';

import "react-datepicker/dist/react-datepicker.css";

export class EditPerson extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.handleChange = this.handleChange.bind(this);
		this.handleDateChange = this.handleDateChange.bind(this);
		this.closeEditModal = this.closeEditModal.bind(this);
		this.updatePerson = this.updatePerson.bind(this);
		this.state = {
			id: '',
			name: '',
			dateOfBirth: '',
			gender: '',
			updateButtonText: 'update',
			titleText: 'edit ' + this.props.personType,
			genderList: [{'value': 'M', 'display_name': 'male'}, {'value': 'F', 'display_name': 'female'}] //set a default, may be overwritten on mount
		};
	}
	componentDidMount() {
		this._isMounted = true;
		this.getGenderOptions()
		//reload person here before editing, in case another user made a change that is not reflected in list view
		//if changes were not a concern, and we wanted to reduce queries, we could pass person data in props
		this.getPerson(this.props.personId)
	}

	componentDidUpdate(prevProps) {
		if (prevProps.personId !== this.props.personId) {
			this.getPerson(this.props.personId);
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	getPerson(personId) {
		var buttonText;
		//if we have a numeric ID, get the data for this person, otherwise load a blank form
		if (personId && typeof(personId) === 'number') {
			buttonText = 'update'
			axios.get(`${API_ROOT}/person/` + personId + '/')
				.then(res => this.setPerson(res)).catch(function (error) {
				alert(error)
			});
		} else {
			buttonText = 'add'
		}
		this.setState({
			updateButtonText: buttonText
		})
	}

	setPerson(res) {
		if (this._isMounted) {
			if (res.status === 200) {
				this.setState({
					id: res.data.id,
					name: res.data.name,
					dateOfBirth: Date.parse(res.data.dateOfBirth),
					gender: res.data.gender
				})
			} else {
				//general error message, can be made more specific
				alert('There was an error loading the '  + this.props.personType + '.')
			}
		}


	}

	getGenderOptions() {
		axios.options(`${API_ROOT}/person/`)
			.then(res => this.setGenderOptions(res)).catch(function (error) {
			alert(error)
		});
	}

	setGenderOptions(res) {
		if (this._isMounted) {
			if (res.data.actions.POST.gender.choices) {
				this.setState({
					genderList: res.data.actions.POST.gender.choices
				})
			}
		}
	}

	handleChange() {
		this.setState({
			[window.event.target.id]: window.event.target.value
		});

	}

	handleDateChange(date) {
		this.setState({
			dateOfBirth: date
		})
	}

	updatePerson() {
		if (this.state.name === '' || this.state.dateOfBirth === '' || this.state.gender === '') {
			alert('Please enter a name, date of birth and gender')
		} else {
			const personData = {
				name: this.state.name,
				dateOfBirth: this.formatDate(this.state.dateOfBirth),
				gender: this.state.gender
			}
			if (typeof(this.state.id) === 'number') {
				axios.put(`${API_ROOT}/person/` + this.state.id + `/` , personData)
					.then(res => this.handleUpdatePerson(res)).catch(function (error) {
					alert(error)
				});
			} else {
				axios.post(`${API_ROOT}/person/`, personData)
					.then(res => this.handleUpdatePerson(res)).catch(function (error) {
					alert(error)
				});
			}
		}
	}

	handleUpdatePerson(res) {
		if (this._isMounted) {
			if (res.status === 200 || res.status === 201) {
				if (this.props.closeEdit) {
					this.props.closeEdit(true)
				}
			} else {
				//general error message, can be made more specific
				alert('There was an error updating the record.')
			}
		}
	}

	closeEditModal() {
		if (this.props.closeEdit) {
			this.props.closeEdit()
		}
	}

	formatDate(date) {
		if (date) {
			var dateObject = new Date(date)
			var month = '' + (dateObject.getMonth() + 1)
			var day = '' + dateObject.getDate()
			var year = dateObject.getFullYear()

			if (month.length < 2)
				month = '0' + month
			if (day.length < 2)
				day = '0' + day

			return [year, month, day].join('-')
		} else {
			return '0000-00-00'
		}

	}
	render() {
		return (
			<div>
				<Form>

					<Form.Group>
						<Form.Label>name</Form.Label>
						<br />
						<Form.Control type="text" value={this.state.name} onChange={this.handleChange} id="name"/>
						<br />
						<Form.Label>date of birth </Form.Label>
						<br />
						<DatePicker selected={this.state.dateOfBirth} onChange={this.handleDateChange} id="dateOfBirth" />
						<br />
						<Form.Label>gender</Form.Label>
						<br />
						<Form.Control as="select" value={this.state.gender} onChange={this.handleChange} id="gender">
							<option key="" value="" >-</option>
							{this.state.genderList.map((genderOption) =>
								<option key={genderOption.value} value={genderOption.value} >{genderOption.display_name}</option>
							)}

						</Form.Control>

					</Form.Group>
				</Form>
				<Button
					variant="primary"
					onClick={this.updatePerson}
				>{this.state.updateButtonText}</Button>

				&nbsp;&nbsp;
				<Button
					variant="secondary"
					onClick={this.closeEditModal}
				>cancel</Button>

			</div>
		);
	}
}

export default (EditPerson);