import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import Review from './Review';
import Appbar from './Appbar';
import { Group } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
	layout: {
		width: '96vw',
		height: 1200,
		marginLeft: '2vw',
		[theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
			width: 700,
			height: 1000,
			marginLeft: 'auto',
			marginRight: 'auto',
		},
	},
	paper: {
		marginTop: theme.spacing(0),
		marginBottom: theme.spacing(0),
		padding: theme.spacing(2),
		[theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
			marginTop: theme.spacing(0),
			marginBottom: theme.spacing(0),
			padding: theme.spacing(3),
		},
	},
	stepper: {
		padding: theme.spacing(3, 0, 5),
		marginLeft: -5,
	},
	buttons: {
		display: 'flex',
		justifyContent: 'flex-end',
	},
	button: {
		backgroundColor: 'black',
		color: 'white',
		marginTop: theme.spacing(3),
		marginLeft: theme.spacing(1),
	},
	formControl: {
		marginTop: theme.spacing(-2),
		marginBottom: theme.spacing(2.5),
		marginLeft: theme.spacing(2.5),
		minWidth: 160,
	},
}));

const steps = ['Personal', 'Health', 'Review'];

export default function Checkout({ firestore }) {
	const classes = useStyles();
	const [activeStep, setActiveStep] = React.useState(0);

	const [form, setForm] = React.useState({
		type: 'blood',
		firstName: '',
		lastName: '',
		address: '',
		adharCard: null,
		mobileNo: null,
		city: '',
		state: '',
		pinCode: null,
		country: '',
		birth: null,
		bloodGroup: null,
		problem: null,
	});
	const sendData = async (e) => {
		e.preventDefault();
		await firestore.collection('userListings').add({
			firstName: form.firstName,
			lastName: form.lastName,
			address: form.address,
			city: form.city,
			state: form.state,
			pinCode: form.pinCode,
			country: form.country,
			adharCard: form.adharCard,
			birthDate: form.birth,
			bloodGroup: form.bloodGroup,
			proble: form.problem,
			type: form.type,
			mobileNo: form.mobileNo,
		});
	};

	const handleChange = (event) => {
		setForm({ ...form, [event.target.name]: event.target.value });
		console.log([event.target.name]);
	};

	const handleNext = () => {
		setActiveStep(activeStep + 1);
	};

	const handleBack = () => {
		setActiveStep(activeStep - 1);
	};
	function getStepContent(step) {
		switch (step) {
			case 0:
				return <AddressForm form={form} setForm={setForm} />;
			case 1:
				return <PaymentForm form={form} setForm={setForm} />;
			case 2:
				return <Review form={form} />;
			default:
				throw new Error('Unknown step');
		}
	}

	return (
		<React.Fragment>
			<CssBaseline />

			<main className={classes.layout}>
				<div>
					<h1>
						<img src="/india.png" style={{ width: 50, height: 50 }} alt="hospital doesn't pay" /> Needs You
					</h1>
					<h2>
						Donate
						<span>
							<img
								src="/plasma.png"
								style={{ width: 50, height: 50, marginLeft: 10 }}
								alt="hospital doesn't pay"
							/>
						</span>
						,
						<span>
							<img
								src="/iv-bag.png"
								style={{ width: 50, height: 50, marginLeft: 10 }}
								alt="hospital doesn't pay"
							/>
						</span>
						,
						<span>
							<img
								src="/oxygen-tank.png"
								style={{ width: 50, height: 50, marginLeft: 10 }}
								alt="hospital doesn't pay"
							/>
						</span>
						<span>
							and Be The Avenger
							<img
								src="/superhero.png"
								style={{ width: 50, height: 50, marginLeft: 20 }}
								alt="hospital doesn't pay"
							/>
						</span>
					</h2>
				</div>

				<Paper className={classes.paper}>
					<Typography style={{ marginTop: 20 }} component="h1" variant="h4" align="center">
						Donate:
						<FormControl className={classes.formControl}>
							<InputLabel color="secondary" id="demo-simple-select-label">
								Type
							</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={form.type}
								color="secondary"
								onChange={handleChange}
								inputProps={{
									name: 'type',
								}}
							>
								<MenuItem value={'blood'}>Blood</MenuItem>
								<MenuItem value={'plasma'}>Plasma</MenuItem>
								<MenuItem value={'oxygen'}>Oxygen</MenuItem>
							</Select>
						</FormControl>
					</Typography>

					<Stepper activeStep={activeStep} className={classes.stepper}>
						{steps.map((label) => (
							<Step key={label}>
								<StepLabel>{label}</StepLabel>
							</Step>
						))}
					</Stepper>
					<React.Fragment>
						{activeStep === steps.length ? (
							<React.Fragment>
								<Typography variant="h5" gutterBottom>
									Thank you for Liveliness {form.firstName}!!!
								</Typography>
								<Typography variant="subtitle1">
									{form.firstName}, You are The Real Hero of India.
								</Typography>
							</React.Fragment>
						) : (
							<React.Fragment>
								{getStepContent(activeStep)}
								<div className={classes.buttons}>
									{activeStep !== 0 && (
										<Button onClick={handleBack} className={classes.button}>
											Back
										</Button>
									)}

									<Button
										variant="contained"
										onClick={(e) => {
											if (activeStep === steps.length - 1) {
												console.log(form);
												sendData(e);
												handleNext();
											} else {
												handleNext();
											}
										}}
										className={classes.button}
									>
										{activeStep === steps.length - 1 ? 'Place order' : 'Next'}
									</Button>
								</div>
							</React.Fragment>
						)}
					</React.Fragment>
				</Paper>
			</main>
		</React.Fragment>
	);
}
