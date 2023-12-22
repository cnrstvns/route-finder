'use client';
import { useEffect, useRef } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';

type RouteResult = {
	id: number;
	average_duration: number;
	airline_iata: string;
	airline_name: string;
	airline_logo: string;
	origin_iata: string;
	origin_icao: string;
	origin_name: string;
	origin_city: string;
	origin_country: string;
	origin_elevation: string;
	origin_latitude: string;
	origin_longitude: string;
	destination_iata: string;
	destination_icao: string;
	destination_name: string;
	destination_city: string;
	destination_country: string;
	destination_latitude: string;
	destination_longitude: string;
	destination_elevation: string;
};

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

export default function Preview({ route }: PreviewProps) {
	const globeEl = useRef<GlobeMethods>();

	const startLat = parseFloat(route.origin_latitude);
	const startLng = parseFloat(route.origin_longitude);
	const endLat = parseFloat(route.destination_latitude);
	const endLng = parseFloat(route.destination_longitude);

	const arcsData = [
		{ startLat, startLng, endLat, endLng, color: 'rgba(255, 0, 0, 1)' },
	];

	const labelsData: LabelData[] = [
		{
			lat: startLat,
			lng: startLng,
			text: route.origin_name,
			color: 'lightblue',
			size: 1.5,
			altitude: 0.01,
		},
		{
			lat: endLat,
			lng: endLng,
			text: route.destination_name,
			color: 'lightgreen',
			size: 1.5,
			altitude: 0.01,
		},
	];

	useEffect(() => {
		const midpoint = calculateMidpoint(startLat, startLng, endLat, endLng);
		if (globeEl.current) {
			const altitude = 1.75;
			globeEl.current.pointOfView(
				{ lat: midpoint.latitude, lng: midpoint.longitude, altitude },
				1000,
			);
		}
	}, [startLat, startLng, endLat, endLng]);

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
				backgroundColor="white"
			/>
		</div>
	);
}

function calculateMidpoint(
	lat1: number,
	lng1: number,
	lat2: number,
	lng2: number,
) {
	const dLng = Math.abs(lng2 - lng1);
	const rad = Math.PI / 180;
	const a = Math.cos(lat2 * rad) * Math.cos(dLng * rad);
	const b = Math.cos(lat2 * rad) * Math.sin(dLng * rad);
	const latMid = Math.atan2(
		Math.sin(lat1 * rad) + Math.sin(lat2 * rad),
		Math.sqrt((Math.cos(lat1 * rad) + a) * (Math.cos(lat1 * rad) + a) + b * b),
	);
	const lngMid = lng1 * rad + Math.atan2(b, Math.cos(lat1 * rad) + a);

	return { latitude: latMid / rad, longitude: lngMid / rad };
}
