'use client';
import CountUp from 'react-countup';

const Stat = ({ value }: { value: number }) => {
	return (
		<CountUp
			start={value * 0.8}
			end={value}
			enableScrollSpy
			scrollSpyOnce
			useEasing
		>
			{({ countUpRef }) => {
				return <span ref={countUpRef}>{value.toLocaleString()}</span>;
			}}
		</CountUp>
	);
};

export { Stat };
