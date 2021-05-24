import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Toolbar, Typography, IconButton, Paper, Grid, ButtonBase, Button } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
	root1: {
		flexGrow: 1,
	},
	header: {
		backgroundColor: 'black',
		color: 'white',
		boxShadow: '0px 0px 0px 0px',
	},

	toolbarLink: {
		padding: theme.spacing(1),
		flexShrink: 0,
		color: 'white',
	},

	paper: {
		padding: theme.spacing(2),
		backgroundColor: 'lightgrey',
		margin: 'auto',
		marginTop: 20,
		maxWidth: 500,
	},
	image: {
		width: 128,
		height: 128,
	},
	img: {
		margin: 'auto',
		display: 'block',
		maxWidth: '100%',
		maxHeight: '100%',
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 220,
		backgroundColor: 'grey',
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}));

const Call = ({ firestore, user }) => {
	const classes = useStyles();
	const [data, setData] = useState([]);
	const [city, setCity] = React.useState('Visnagar');

	const handleChange = (event) => {
		setCity(event.target.value);
	};
	const getData = () => {
		firestore.collection(user.mobileNo).onSnapshot((snapshot) => {
			setData(
				snapshot.docs.map((doc) => ({
					id: doc.id,
					mobileNo: doc.data().mobileNo,
					address: doc.data().address,
					name: doc.data().name,
					city: doc.data().city,
					latitude: doc.data().latitude,
					longitude: doc.data().longitude,
					link: doc.data().link,
				}))
			);
		});
	};
	const preventDefault = (event) => event.preventDefault();

	useEffect(() => {
		getData();
	}, []);

	return (
		<div>
			<div>
				<h2 style={{ marginLeft: 10 }}>Someone is calling you help them...</h2>
				<FormControl className={classes.formControl}>
					<Select native value={city} onChange={handleChange} style={{ marginLeft: 10 }}>
						{data.map((item) => (
							<option value={item.city}>{item.city}</option>
						))}
					</Select>
				</FormControl>
			</div>

			<div>
				{data.length === 0 ? (
					<h1>Your Watchlist is empty</h1>
				) : (
					<div>
						{data
							.filter((item) => item.city === city)
							.map((items) => (
								<Paper className={classes.paper}>
									<Grid container spacing={2}>
										<Grid item xs={12} sm container>
											<Grid item xs container direction="column" spacing={2}>
												<Grid item xs>
													<Typography gutterBottom variant="subtitle1">
														<strong>Name of caller:</strong> {items.name}
													</Typography>
													<Typography variant="body2" gutterBottom>
														<strong>Address:</strong> {items.address}
													</Typography>
													<Typography variant="body2" gutterBottom>
														<strong>City:</strong>
														{items.city}
													</Typography>

													<Typography variant="body2">
														<strong>Mobile No.:</strong> {'  '} {items.mobileNo}
													</Typography>
												</Grid>
											</Grid>
											<Grid item>
												<Grid item xs>
													<Typography variant="body2" gutterBottom>
														<strong>Latitude</strong> {items.latitude}
													</Typography>
													<Typography variant="body2" gutterBottom>
														<strong>Longitude:</strong> {items.longitude}
													</Typography>

													<Button color="secondary" onClick={() => window.open(items.link)}>
														Link to help on video-call
													</Button>
												</Grid>
											</Grid>
										</Grid>
									</Grid>
								</Paper>
							))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Call;
