import React from 'react';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import EditPerson from './EditPerson.jsx'
import axios from "axios";
import { API_ROOT } from '../api-config';

export class ListPeople extends React.Component {
	constructor(props) {
		super(props);
		this.toggleEdit = this.toggleEdit.bind(this);
		this.setPeople = this.setPeople.bind(this);
		this.editPerson = this.editPerson.bind(this);
		this.deletePerson = this.deletePerson.bind(this);
		this.getPagination = this.getPagination.bind(this);
		this._isMounted = false;
		this.state = {
			personList: [{'name': 'loading...','id': 0}],
			nextPeople: null,
			previousPeople: null,
			showEdit: false,
			activePersonId: '',
			personModalTitle: ''
		}
	}
	componentDidMount() {
		this._isMounted = true;
		this.getPeople()
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	getPeople() {
		axios.get(`${API_ROOT}/person/`)
			.then(res => this.setPeople(res));
	}

	getPagination(paginationDirection) {
		var url;
		if (paginationDirection === 'previous') {
			url = this.state.previousPeople
		} else if (paginationDirection === 'next') {
			url = this.state.nextPeople
		}
		axios.get(url)
			.then(res => this.setPeople(res));
	}
	setPeople(res) {
		if (this._isMounted) {
			this.setState({
				personList: res.data.results,
				nextPeople: res.data.next,
				previousPeople: res.data.previous
			});
		}
	}

	getAge(dob) {
		if (dob) {
			var today = new Date();
			var birthDate = new Date(dob);
			var age = today.getFullYear() - birthDate.getFullYear();
			var m = today.getMonth() - birthDate.getMonth();
			if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
				age--;
			}
			return age;
		} else {
			return '-'
		}
	}

	editPerson(personId) {
		var personModalTitle;
		if (personId === 'add') {
			personModalTitle = 'add ' + this.props.personType
		} else {
			personModalTitle = 'edit ' + this.props.personType
		}
		this.setState({
			activePersonId: personId,
			showEdit: true,
			personModalTitle: personModalTitle
		});
	}

	deletePerson(personId) {
		var forSure = window.confirm('Are you sure you want to delete this ' + this.props.personType + '?')
		if (forSure) {
			axios.delete(`${API_ROOT}/person/` + personId + '/')
				.then(res => this.handledeletePerson(res)).catch(function (error) {
				alert(error)
			});
		}
	}

	handledeletePerson(res) {
		if (res.status === 204) {
			this.getPeople()
		} else {
			alert('There was an issue deleting the '  + this.props.personType + '.')
		}
	}

	toggleEdit(refreshList=false) {
		this.setState({
			showEdit: !this.state.showEdit
		});
		if (refreshList) {
			this.getPeople()
		}
	}

	render() {
		return (
			<div>
				<link
					rel="stylesheet"
					href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
					integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
					crossOrigin="anonymous"
				/>
				{/*Modal to add/edit entries*/}
				<Modal show={this.state.showEdit} onHide={this.toggleEdit}>
					<Modal.Header closeButton onClick={this.toggleEdit} >
						<Modal.Title>{this.state.personModalTitle}</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						<EditPerson
							personId={this.state.activePersonId}
							personType={this.props.personType}
							closeEdit={this.toggleEdit}
							reloadList={this.getPeople}
						/>
					</Modal.Body>
				</Modal>
				{/*List of people from backend*/}
				<Card style={{ width: '60%', marginLeft: "20%", marginRight: "20%", marginTop: "5%" }}>
					{/*<Card.Img variant="top" src="holder.js/100px180" />*/}
					<Card.Body>
						<Card.Title>{this.props.personType}s</Card.Title>
							<Table striped>
								<tbody>
									<tr>
										<th>name</th>
										<th>age</th>
										<th>gender</th>
										<th>&nbsp;</th>
										<th>&nbsp;</th>
									</tr>
									{this.state.personList.map((person) =>
										<tr key={person.id}>
											<td align="center">{person.name}</td>
											<td align="center">{this.getAge(person.dateOfBirth)}</td>
											<td align="center">{person.gender}</td>
											<td align="center">
												<Button
													id={'editPerson_' + person.id}
													onClick={() => this.editPerson(person.id)}
													variant="primary">
													Edit
												</Button>
											</td>
											<td align="center">
												<Button
													id={'deletePerson_' + person.id}
													onClick={() => this.deletePerson(person.id)}
													variant="primary">
													Delete
												</Button>
											</td>
										</tr>
									)}
								</tbody>
							</Table>
						<p>
							<span style={this.state.previousPeople ? {} : { display: 'none' }} >
								<Button
									id={'previousPeople'}
									onClick={() => this.getPagination('previous')}
									variant="primary">
									{'<-- previous'}
								</Button>
							</span>
							&nbsp;&nbsp;
							<span style={this.state.nextPeople ? {} : { display: 'none' }} >
								<Button
									id={'nextPeople'}
									onClick={() => this.getPagination('next')}
									variant="primary">
									{'next -->'}
								</Button>
							</span>
						</p>
							<Button
								id={'editPerson_Add'}

								onClick={() => this.editPerson('add')}
								variant="primary">
								Add a {this.props.personType}
							</Button>

					</Card.Body>
				</Card>

			</div>
		);
	}
}

export default (ListPeople);