import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Checkout from './Form';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import PersonIcon from '@material-ui/icons/Person';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import SignIn from './SignIn';
import Map from './Map';
import Fav from './Fav';
import Profile from './profile';
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
export default function App() {
	const matches = useMediaQuery('(min-width:600px)');
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
						{(value === 'nearby' && <Map user={user} firestore={firestore} />) ||
							(value === 'recents' && (
								<div>
									<Checkout firestore={firestore} />
								</div>
							)) ||
							(value === 'favorites' && <Fav firestore={firestore} />) ||
							(value === 'folder' && <Profile user={user} />)}
					</div>

					<BottomNavigation value={value} onChange={handleChange} className={classes.root}>
						<BottomNavigationAction
							label="Nearby"
							value="nearby"
							style={{ color: 'white' }}
							icon={<LocationOnIcon />}
						/>
						<BottomNavigationAction
							label="Donate"
							value="recents"
							style={{ color: 'white' }}
							icon={<FolderSharedIcon />}
						/>
						<BottomNavigationAction
							label="Resources"
							value="favorites"
							style={{ color: 'white' }}
							icon={<LibraryBooksIcon />}
						/>
						<BottomNavigationAction
							label="Profile"
							value="folder"
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
