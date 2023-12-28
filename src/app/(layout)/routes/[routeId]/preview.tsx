'use client';
import { useEffect, useRef } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import type { RouteResult } from './types';

type LabelData = {
	lat: number;
	lng: number;
	text: string;
	color: string;
	size: number;
	altitude: number;
};

type PreviewProps = {
	route: RouteResult;
};

const Preview = ({ route }: PreviewProps) => {
	const globeEl = useRef<GlobeMethods>();

	const startLatitude = parseFloat(route.origin_latitude);
	const startLongitude = parseFloat(route.origin_longitude);
	const endLatitude = parseFloat(route.destination_latitude);
	const endLongitude = parseFloat(route.destination_longitude);

	const arcsData = [
		{
			startLat: startLatitude,
			startLng: startLongitude,
			endLat: endLatitude,
			endLng: endLongitude,
			color: 'rgba(255, 0, 0, 1)',
		},
	];

	const labelsData: LabelData[] = [
		{
			lat: startLatitude,
			lng: startLongitude,
			text: route.origin_name,
			color: 'lightblue',
			size: 1.5,
			altitude: 0.01,
		},
		{
			lat: endLatitude,
			lng: endLongitude,
			text: route.destination_name,
			color: 'lightgreen',
			size: 1.5,
			altitude: 0.01,
		},
	];

	useEffect(() => {
		const midpoint = calculateMidpoint({
			latitudeOne: startLatitude,
			longitudeOne: startLongitude,
			latitudeTwo: endLatitude,
			longitudeTwo: endLongitude,
		});
		if (globeEl.current) {
			const altitude = 1.75;
			globeEl.current.pointOfView(
				{ lat: midpoint.latitude, lng: midpoint.longitude, altitude },
				1000,
			);
		}
	}, [startLatitude, startLongitude, endLatitude, endLongitude]);

	return (
		<div className="flex justify-center items-center w-full h-full">
			<Globe
				ref={globeEl}
				globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
				arcsData={arcsData}
				arcColor="color"
				showAtmosphere={false}
				arcDashLength={1}
				arcDashGap={1}
				arcDashAnimateTime={3000}
				arcStroke={1}
				labelsData={labelsData}
				labelLat={(d) => (d as LabelData).lat}
				labelLng={(d) => (d as LabelData).lng}
				labelText={(d) => (d as LabelData).text}
				labelColor={(d) => (d as LabelData).color}
				labelSize={(d) => (d as LabelData).size}
				labelAltitude={(d) => (d as LabelData).altitude}
				labelDotRadius={0.3}
				width={300}
				height={300}
				backgroundColor="rgba(0,0,0,0)"
			/>
		</div>
	);
};

export default Preview;

const calculateMidpoint = ({
	latitudeOne,
	longitudeOne,
	latitudeTwo,
	longitudeTwo,
}: {
	latitudeOne: number;
	latitudeTwo: number;
	longitudeOne: number;
	longitudeTwo: number;
}) => {
	const dLng = Math.abs(longitudeTwo - longitudeOne);
	const rad = Math.PI / 180;
	const a = Math.cos(latitudeTwo * rad) * Math.cos(dLng * rad);
	const b = Math.cos(latitudeTwo * rad) * Math.sin(dLng * rad);
	const latMid = Math.atan2(
		Math.sin(latitudeOne * rad) + Math.sin(latitudeTwo * rad),
		Math.sqrt(
			(Math.cos(latitudeOne * rad) + a) * (Math.cos(latitudeOne * rad) + a) +
				b * b,
		),
	);
	const lngMid =
		longitudeOne * rad + Math.atan2(b, Math.cos(latitudeOne * rad) + a);

	return { latitude: latMid / rad, longitude: lngMid / rad };
};
