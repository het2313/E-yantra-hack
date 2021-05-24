import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({}));

const Profile = ({ user }) => {
	const classes = useStyles();
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',

				alignItems: 'center',
				height: 800,
			}}
		>
			<h1>{user.name}'s Profile</h1>
			<Avatar alt="Remy Sharp" style={{ width: 100, height: 100 }} />
			<h1>
				Name: <span style={{ color: 'grey' }}>{user.name}</span>{' '}
			</h1>
			<h1>
				Ambulance No.: <br /> <span style={{ color: 'grey' }}>{user.address}</span>{' '}
			</h1>
			<h1>
				AdharCard No.: <span style={{ color: 'grey' }}>{user.adharCard}</span>{' '}
			</h1>
			<h1>
				Mobile No.: <span style={{ color: 'grey' }}>{user.mobileNo}</span>{' '}
			</h1>
			<h1>
				City: <span style={{ color: 'grey' }}>{user.city}</span>{' '}
			</h1>
		</div>
	);
};

export default Profile;
