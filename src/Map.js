import React, { useState, useRef, useEffect, useCallback } from 'react';
import useSwr from 'swr';
import ReactMapGL, { Marker, FlyToInterpolator, Popup } from 'react-map-gl';
import useSupercluster from 'use-supercluster';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { makeStyles } from '@material-ui/core/styles';
import Geocoder from 'react-map-gl-geocoder';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Modal from '@material-ui/core/Modal';
import AppBar from './Appbar';
import io from 'socket.io-client';

import './App.css';
import { Button } from '@material-ui/core';

const fetcher = (...args) => fetch(...args).then((response) => response.json());

const PurpleSwitch = withStyles({
	switchBase: {
		color: '#162131',
		'&$checked': {
			color: '#7bada5',
		},
		'&$checked + $track': {
			backgroundColor: '#a2c3be',
		},
	},
	checked: {},
	track: {},
})(Switch);
function rand() {
	return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
	const top = 50 + rand();
	const left = 50 + rand();

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}
const useStyles = makeStyles((theme) => ({
	paper: {
		position: 'relative',
		width: '25%',
		backgroundColor: theme.palette.background.paper,
		alignSelf: 'center',
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
	paper_: {
		position: 'absolute',
		width: '70%',
		backgroundColor: theme.palette.background.paper,
		alignSelf: 'center',
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
}));
export default function Map({ user, firestore }) {
	const classes = useStyles();
	// getModalStyle is not a pure function, we roll the style only on the first render
	const [modalStyle] = React.useState(getModalStyle);
	const [open, setOpen] = React.useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const [position, setPosition] = useState();
	const [current, setCurrent] = useState(null);
	const [viewport, setViewport] = useState({
		latitude: 23.7024,
		longitude: 72.5426,
		position: 'absolute',
		top: 0,
		bottom: 0,
		width: '100%',
		height: '93vh',
		zoom: 12,
	});
	const [newview, setNewview] = useState({
		latitude: 23.7024,
		longitude: 72.5426,
		position: 'absolute',
		top: 0,
		bottom: 0,
		width: '100%',
		height: '84vh',
		zoom: 12,
	});
	const [selectedPark, setSelectedPark] = useState(null);
	const [state, setState] = useState(false);
	const matches = useMediaQuery('(min-width:600px)');
	const mapRef = useRef();

	const ENDPOINT = 'https://jivni.herokuapp.com/';
	const socket = io(ENDPOINT);

	const url =
		'https://api.data.gov.in/resource/0dfebd78-bac4-44be-9291-025a983323f4?api-key=579b464db66ec23bdd000001a291f79cd51847996d1e0293329075f4&format=json&offset=0&limit=10000';
	const secondUrl =
		'https://api.data.gov.in/resource/fced6df9-a360-4e08-8ca0-f283fc74ce15?api-key=579b464db66ec23bdd000001a291f79cd51847996d1e0293329075f4&format=json&offset=0&limit=10000&filters[__state]=Gujarat';
	const { data: hospital, error } = useSwr(url, { fetcher });
	const { data: blood_data, blood_error } = useSwr(secondUrl, { fetcher });
	const hospitals = hospital && !error ? hospital.records : [];
	const blood_banks = blood_data && !blood_error ? blood_data.records : [];
	const points = hospitals.map((hospital) => ({
		type: 'Feature',
		properties: {
			cluster: false,
			hospitalId: hospital.srno,
			state: hospital.state_name,
			name: hospital.health_facility_name,
			city: hospital.block_name,
		},
		geometry: {
			type: 'Point',
			coordinates: [parseFloat(hospital.longitude), parseFloat(hospital.latitude)],
		},
	}));

	const bounds = mapRef.current ? mapRef.current.getMap().getBounds().toArray().flat() : null;

	const { clusters, supercluster } = useSupercluster({
		points,
		bounds,
		zoom: viewport.zoom,
		options: { radius: 75, maxZoom: 20 },
	});

	useEffect(() => {
		socket.on('marker', (data) => {
			setCurrent(data[Object.keys(data).length - 1]);
			console.log(data[Object.keys(data).length - 1]);
		});
	}, []);
	const sendData = async (e) => {
		e.preventDefault();
		await firestore.collection(current.id).add({
			mobileNo: user.mobileNo,
			address: user.address,
			name: user.name,
			city: user.city,
			latitude: viewport.latitude,
			longitude: viewport.longitude,
			link: `https://emergency-video-call.netlify.app/room/${current.id}`,
		});
	};

	const getPosition = async () => {
		await navigator.geolocation.getCurrentPosition(function (position) {
			setViewport({
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
				position: 'absolute',
				top: 0,
				bottom: 0,
				width: '100%',
				height: '84vh',
				zoom: 15,
			});
			setNewview({
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
				position: 'absolute',
				top: 0,
				bottom: 0,
				width: '100%',
				height: '84vh',
				zoom: 15,
			});
		});
	};

	const handleViewportChange = useCallback((newViewport) => setViewport(newViewport), []);

	useEffect(() => {
		getPosition();
		const listener = (e) => {
			if (e.key === 'Escape') {
				setSelectedPark(null);
			}
		};
		window.addEventListener('keydown', listener);

		return () => {
			window.removeEventListener('keydown', listener);
		};
	}, []);

	return (
		<div style={{ position: 'relative', width: '100%' }}>
			<AppBar
				setNewview={setNewview}
				setViewport={setViewport}
				isMap={true}
				link={`https://emergency-video-call.netlify.app/room/${current != null ? current.id : 'hello'}`}
			/>
			<ReactMapGL
				{...viewport}
				maxZoom={15}
				mapboxApiAccessToken="pk.eyJ1IjoiaGV0LXBhdGVsIiwiYSI6ImNrb3FxMjQ1cDB4cGsycGw0dHh1Zzc5YnQifQ.Bn3AwbxQpIJbmiDglpZoQA"
				mapStyle={
					state
						? 'mapbox://styles/het-patel/ckoqqpgp58fmz18plnhruj8ts'
						: 'mapbox://styles/het-patel/ckoqs44pr1l9u17kc0s3wjkzd'
				}
				onViewportChange={handleViewportChange}
				ref={mapRef}
			>
				{matches ? (
					<div>
						<FormControlLabel
							style={{ marginTop: 15, marginLeft: '90%' }}
							control={<PurpleSwitch checked={state} onChange={() => setState(!state)} name="checkedA" />}
						/>
						<IconButton
							style={{ marginTop: 0, marginLeft: '90%' }}
							aria-label="delete"
							onClick={getPosition}
						>
							<GpsFixedIcon color="secondary" />
						</IconButton>
					</div>
				) : (
					<div>
						<FormControlLabel
							style={{ marginTop: 15, marginLeft: 10 }}
							control={<PurpleSwitch checked={state} onChange={() => setState(!state)} name="checkedA" />}
						/>
						<IconButton style={{ marginTop: 15, right: 20 }} aria-label="delete" onClick={getPosition}>
							<GpsFixedIcon color="secondary" />
						</IconButton>
					</div>
				)}

				{current != null ? (
					<Marker
						key={current.loc.lat}
						latitude={current.loc.lat}
						longitude={current.loc.lng}
						offsetLeft={-20}
						offsetTop={-10}
					>
						<button className="hospital-marker" onClick={handleOpen}>
							<img src="/amb.png" style={{ width: 40, height: 40 }} alt="hospital doesn't pay" />
						</button>
					</Marker>
				) : (
					<Marker
						key={newview.latitude}
						latitude={newview.latitude}
						longitude={newview.longitude}
						offsetLeft={-20}
						offsetTop={-10}
					>
						<button className="hospital-marker">
							<img src="/marker.png" alt="hospital doesn't pay" />
						</button>
					</Marker>
				)}
				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description"
				>
					<div style={modalStyle} className={matches ? classes.paper : classes.paper_}>
						<h2 id="simple-modal-title">Name: {current ? current.name : 'hello'}</h2>
						<p id="simple-modal-description">Mobile No.: {current ? current.id : 'hello'} </p>
						<p id="simple-modal-description">Number Plate No.: {current ? current.noPlate : 'hello'} </p>
						<p id="simple-modal-description">Latitude: {current ? current.loc.lat : 'hello'} </p>
						<p id="simple-modal-description">longitude: {current ? current.loc.lng : 'hello'} </p>
						<Button
							variant="contained"
							color="secondary"
							onClick={(e) => {
								sendData(e);
								handleClose();
							}}
						>
							Call the Ambulance
						</Button>
					</div>
				</Modal>

				<Marker
					key={'hello'}
					latitude={newview.latitude}
					longitude={newview.longitude}
					offsetLeft={-20}
					offsetTop={-10}
				>
					<button className="hospital-marker">
						<img src="/marker.png" alt="hospital doesn't pay" />
					</button>
				</Marker>

				{clusters.map((cluster) => {
					const [longitude, latitude] = cluster.geometry.coordinates;
					const { cluster: isCluster, point_count: pointCount } = cluster.properties;

					if (isCluster) {
						return (
							<Marker key={`cluster-${cluster.id}`} latitude={latitude} longitude={longitude}>
								<div
									className="cluster-marker"
									style={{
										width: `${10 + (pointCount / points.length) * 20}px`,
										height: `${10 + (pointCount / points.length) * 20}px`,
									}}
									onClick={() => {
										const expansionZoom = Math.min(
											supercluster.getClusterExpansionZoom(cluster.id),
											20
										);

										setViewport({
											...viewport,
											latitude,
											longitude,
											zoom: expansionZoom,
											transitionInterpolator: new FlyToInterpolator({
												speed: 2,
											}),
											transitionDuration: 'auto',
										});
									}}
								>
									{pointCount}
								</div>
							</Marker>
						);
					}

					return (
						<Marker
							key={`hospital-${cluster.properties.hospitalId}`}
							latitude={latitude}
							longitude={longitude}
						>
							<button
								className="hospital-marker"
								onClick={(e) => {
									e.preventDefault();
									setSelectedPark(cluster);
								}}
							>
								<img src="/hospital.png" alt="hospital doesn't pay" />
							</button>
						</Marker>
					);
				})}

				{selectedPark ? (
					<Popup
						latitude={selectedPark.geometry.coordinates[1]}
						longitude={selectedPark.geometry.coordinates[0]}
						onClose={() => {
							setSelectedPark(null);
						}}
					>
						<div>
							<h2> Hospital Id: {selectedPark.properties.hospitalId}</h2>

							<p>Name: {selectedPark.properties.name}</p>
							<p>City: {selectedPark.properties.city}</p>
							<p> State: {selectedPark.properties.state}</p>
						</div>
					</Popup>
				) : null}
			</ReactMapGL>
		</div>
	);
}
