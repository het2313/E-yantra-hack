import React, { useRef, useEffect, useState } from 'react';
import Map from './map';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import PersonIcon from '@material-ui/icons/Person';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import SignIn from './signIn';
import Profile from './profile';
import Call from './calls';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
var firebaseConfig = {
	apiKey: 'AIzaSyA1A0eWheR4Bn3jK-ENCXq9Ll4ymEqhKdQ',
	authDomain: 'e-yantra-hack-e4bf1.firebaseapp.com',
	projectId: 'e-yantra-hack-e4bf1',
	storageBucket: 'e-yantra-hack-e4bf1.appspot.com',
	messagingSenderId: '978609944187',
	appId: '1:978609944187:web:5c1a4668f970720b3ad4de',
	measurementId: 'G-BXMVPVZGDV',
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const firestore = app.firestore();

const useStyles = makeStyles({
	root: {
		width: '100%',
		height: '7vh',
		position: 'fixed',
		bottom: 0,
		display: 'flex',
		backgroundColor: 'black',
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
});

function App() {
	const classes = useStyles();
	const [value, setValue] = React.useState('nearby');
	var user = JSON.parse(localStorage.getItem('user'));
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	return (
		<div>
			{user ? (
				<div>
					<div>
						{(value === 'nearby' && <Map user={user} />) ||
							(value === 'recents' && <Profile user={user} />) ||
							(value === 'favorites' && <Call firestore={firestore} user={user} />) ||
							(value === 'folder' && <h1>folder</h1>)}
					</div>

					<BottomNavigation value={value} onChange={handleChange} className={classes.root}>
						<BottomNavigationAction
							label="Location"
							value="nearby"
							style={{ color: 'white' }}
							icon={<LocationOnIcon />}
						/>
						<BottomNavigationAction
							label="Notification"
							value="favorites"
							style={{ color: 'white' }}
							icon={<NotificationsActiveIcon />}
						/>
						<BottomNavigationAction
							label="Profile"
							value="recents"
							style={{ color: 'white' }}
							icon={<PersonIcon />}
						/>
					</BottomNavigation>
				</div>
			) : (
				<SignIn />
			)}
		</div>
	);
}

export default App;
