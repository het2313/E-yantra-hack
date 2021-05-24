import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
	root: {
		'& > *': {
			margin: theme.spacing(2),
			width: '60vw',
		},
	},
}));
export default function SignIn() {
	const classes = useStyles();
	const [data, setData] = React.useState({
		name: '',
		address: '',
		adharCard: null,
		mobileNo: null,
		city: '',
	});
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<h1 style={{ color: 'Black', alignSelf: 'center' }}>Fill this form to logIn</h1>
			<form className={classes.root} noValidate autoComplete="off">
				<TextField
					value={data.name}
					onChange={(e) => setData({ ...data, ['name']: e.target.value })}
					style={{ backgroundColor: 'white', borderRadius: 8, borderColor: 'black' }}
					color="secondary"
					id="outlined-basic"
					label="Name"
					variant="outlined"
				/>
			</form>
			<form className={classes.root} noValidate autoComplete="off">
				<TextField
					id="outlined-basic"
					value={data.mobileNo}
					style={{ backgroundColor: 'white', borderRadius: 8, borderColor: 'black' }}
					color="secondary"
					type="number"
					onChange={(e) => setData({ ...data, ['mobileNo']: e.target.value })}
					label="Mobile No."
					variant="outlined"
				/>
			</form>
			<form className={classes.root} noValidate autoComplete="off">
				<TextField
					id="outlined-basic"
					value={data.adharCard}
					style={{ backgroundColor: 'white', borderRadius: 8, borderColor: 'black' }}
					color="secondary"
					type="number"
					onChange={(e) => setData({ ...data, ['adharCard']: e.target.value })}
					label="Adhar-Card No."
					variant="outlined"
				/>
			</form>
			<form className={classes.root} noValidate autoComplete="off">
				<TextField
					id="outlined-basic"
					value={data.address}
					style={{ backgroundColor: 'white', borderRadius: 8, borderColor: 'black' }}
					color="secondary"
					onChange={(e) => setData({ ...data, ['address']: e.target.value })}
					label="Ambulance Number"
					variant="outlined"
				/>
			</form>
			<form className={classes.root} noValidate autoComplete="off">
				<TextField
					id="outlined-basic"
					value={data.city}
					style={{ backgroundColor: 'white', borderRadius: 8, borderColor: 'black' }}
					color="secondary"
					onChange={(e) => setData({ ...data, ['city']: e.target.value })}
					label="City."
					variant="outlined"
				/>
			</form>
			<Button
				variant="contained"
				color="secondary"
				disabled={data.name === '' || data.city === '' ? true : false}
				onClick={() => {
					localStorage.setItem('user', JSON.stringify(data));
					window.location.reload(true);
				}}
			>
				Enter
			</Button>
		</div>
	);
}
