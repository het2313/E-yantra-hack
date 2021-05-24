import React from 'react';
import ServerAutoSuggest from './geocoder';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import SearchIcon from '@material-ui/icons/Search';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import EditLocationIcon from '@material-ui/icons/EditLocation';
import VideocamIcon from '@material-ui/icons/Videocam';
import Select from '@material-ui/core/Select';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Button } from '@material-ui/core';

const drawerWidth = 'auto';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
	appBarShift: {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginRight: theme.spacing(-3),
	},
	hide: {
		display: 'none',
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
		backgroundColor: 'black',
		color: 'white',
		height: '70vh',
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		marginLeft: -drawerWidth,
	},
	contentShift: {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginLeft: 0,
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
		backgroundColor: 'white',
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}));

export default function Appbar({ isMap, setNewview, setViewport, link }) {
	const classes = useStyles();
	const [state, setState] = React.useState(true);
	const theme = useTheme();
	const [open, setOpen] = React.useState(false);
	const [type, setType] = React.useState('hospital');

	const handleChange = (event) => {
		setType(event.target.value);
	};

	const matches = useMediaQuery('(max-width:600px)');

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	return (
		<div className={classes.root}>
			<AppBar position="static" style={{ backgroundColor: 'black', height: '9vh' }}>
				<Toolbar>
					<Typography variant="h6" className={classes.title}>
						Jivni
					</Typography>
					{isMap ? (
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between',
								marginRight: 10,
							}}
						>
							<IconButton
								color="inherit"
								aria-label="open drawer"
								onClick={() => window.open(link)}
								edge="start"
							>
								<VideocamIcon />
							</IconButton>

							<FormControl className={classes.formControl}>
								<Select native value={type} onChange={handleChange} style={{ marginLeft: 10 }}>
									<option value={'hospital'}>Hospital</option>
									<option value={'blood-bank'}>Blood-bank</option>
									<option value={'oxygen'}>Oxygen-center</option>
								</Select>
							</FormControl>

							<IconButton
								color="inherit"
								aria-label="open drawer"
								onClick={handleDrawerOpen}
								edge="start"
								className={clsx(classes.menuButton, open && classes.hide)}
								value={type}
							>
								<SearchIcon />
							</IconButton>
						</div>
					) : (
						<></>
					)}
				</Toolbar>
			</AppBar>
			<Drawer
				className={classes.drawer}
				variant="persistent"
				anchor="top"
				open={open}
				classes={{
					paper: classes.drawerPaper,
				}}
			>
				<div className={classes.drawerHeader}>
					{matches ? (
						<h1 style={{ marginRight: 10 }}>
							Search Location <EditLocationIcon />
						</h1>
					) : (
						<h1 style={{ marginRight: '33%' }}>
							Search Your Location Here
							<EditLocationIcon />
						</h1>
					)}

					<IconButton onClick={handleDrawerClose}>
						{theme.direction === 'ltr' ? (
							<ChevronLeftIcon style={{ color: 'white' }} />
						) : (
							<ChevronRightIcon style={{ color: 'white' }} />
						)}
					</IconButton>
				</div>
				<Divider />
				<div style={{ alignSelf: 'center' }}>
					<ServerAutoSuggest setOpen={setOpen} setNewview={setNewview} setViewport={setViewport} />
				</div>
			</Drawer>
		</div>
	);
}
