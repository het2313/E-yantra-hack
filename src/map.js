import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import io from 'socket.io-client';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiaGV0LXBhdGVsIiwiYSI6ImNrb3FxMjQ1cDB4cGsycGw0dHh1Zzc5YnQifQ.Bn3AwbxQpIJbmiDglpZoQA';

export default function Map({ user }) {
	const mapContainer = useRef(null);
	const map = useRef(null);
	const [lng, setLng] = useState(72);
	const [lat, setLat] = useState(23.052287999999997);
	const [zoom, setZoom] = useState(10);
	const [current, setCurrent] = useState(null);
	const ENDPOINT = 'https://jivni.herokuapp.com/';

	const getPosition = async () => {
		const socket = io(ENDPOINT);
		await navigator.geolocation.getCurrentPosition(function (position) {
			map.current.flyTo({
				center: [position.coords.longitude, position.coords.latitude],
				essential: true, // this animation is considered essential with respect to prefers-reduced-motion
				speed: 0.5,
			});
			var el = document.createElement('div');
			el.className = 'marker';
			new mapboxgl.Marker(el)
				.setLngLat([position.coords.longitude, position.coords.latitude])
				.setPopup(
					new mapboxgl.Popup().setHTML(`<h1>${(position.coords.longitude, position.coords.latitude)}</h1>`)
				)
				.addTo(map.current);
			var marker = new mapboxgl.Marker({
				draggable: true,
			})
				.setLngLat([position.coords.longitude - 0.03, position.coords.latitude + 0.02])
				.addTo(map.current);

			function onDragEnd() {
				var lngLat = marker.getLngLat();
				socket.emit('marker', { name: user.name, noPlate: user.address, id: user.mobileNo, loc: lngLat });

				socket.on('marker', (data) => {
					setCurrent(data[Object.keys(data).length - 1].loc);
					console.log(data[Object.keys(data).length - 1].name);
					console.log(data[Object.keys(data).length - 1].id);
				});
			}
			marker.on('dragend', onDragEnd);
		});
	};
	useEffect(() => {
		console.log(current);
	}, [current]);

	useEffect(() => {
		if (map.current) return; // initialize map only once
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: 'mapbox://styles/het-patel/ckoqqpgp58fmz18plnhruj8ts',
			center: [lng, lat],
			zoom: zoom,
		});
		map.current.addControl(
			new MapboxDirections({
				accessToken: mapboxgl.accessToken,
			}),
			'top-left'
		);

		getPosition();
	}, []);

	useEffect(() => {
		if (!map.current) return; // wait for map to initialize
		map.current.on('move', () => {
			setLng(map.current.getCenter().lng.toFixed(4));
			setLat(map.current.getCenter().lat.toFixed(4));
			setZoom(map.current.getZoom().toFixed(2));
		});
	});

	return (
		<div>
			<div ref={mapContainer} className="map-container" />
		</div>
	);
}
