import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';

const products = [
	{ name: 'Product 3', desc: 'Something else', price: '$6.51' },
	{ name: 'Product 4', desc: 'Best thing of all', price: '$14.11' },
	{ name: 'Shipping', desc: '', price: 'Free' },
];
const addresses = ['1 Material-UI Drive', 'Reactville', 'Anytown', '99999', 'USA'];
const payments = [
	{ name: 'Card number', detail: 'xxxx-xxxx-xxxx-1234' },
	{ name: 'Expiry date', detail: '04/2024' },
];

const useStyles = makeStyles((theme) => ({
	listItem: {
		padding: theme.spacing(1, 0),
	},
	total: {
		fontWeight: 700,
	},
	title: {
		marginTop: theme.spacing(2),
	},
}));

export default function Review({ form }) {
	const classes = useStyles();

	return (
		<React.Fragment>
			<Grid container spacing={2}>
				<Grid item xs={12} sm={6}>
					<Typography variant="h6" gutterBottom className={classes.title}>
						Personal Details
					</Typography>
					<Typography gutterBottom>
						Name:- {form.firstName} {''} {form.lastName}
					</Typography>
					<Typography gutterBottom>
						Address:- {form.address},{form.city},{form.state},{form.Country} - {form.pinCode}
					</Typography>
					<Typography gutterBottom>AdharCard No.:- {form.adharCard}</Typography>
				</Grid>
				<Grid item container direction="column" xs={12} sm={6}>
					<Grid item xs={12} sm={6}>
						<Typography variant="h6" gutterBottom className={classes.title}>
							Health Details
						</Typography>
						<Typography gutterBottom>Blood-Group:- {form.bloodGroup}</Typography>
						<Typography gutterBottom>BirthDate:- {form.birth}</Typography>
						<Typography gutterBottom>Health Problem:- {form.problem}</Typography>
					</Grid>
				</Grid>
			</Grid>
		</React.Fragment>
	);
}
