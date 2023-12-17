'use client';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { useCallback, useState } from 'react';

type SliderProps = {
	onChange?: (values: number[]) => void;
};

const Slider = ({ onChange }: SliderProps) => {
	const [minValue, setMinValue] = useState<number>(150);
	const [maxValue, setMaxValue] = useState<number>(330);

	const handleChange = useCallback(
		(values: number[]) => {
			setMinValue(values[0]);
			setMaxValue(values[1]);

			if (onChange) onChange(values);
		},
		[onChange],
	);

	return (
		<SliderPrimitive.Root
			onValueChange={handleChange}
			step={30}
			max={1200}
			min={30}
			defaultValue={[150, 330]}
			className="relative pb-5 flex w-full touch-none select-none items-center"
			minStepsBetweenThumbs={2}
		>
			<SliderPrimitive.Track className="relative h-2 w-full bg-neutral-200 grow overflow-hidden rounded-full bg-secondary">
				<SliderPrimitive.Range className="absolute h-full bg-sky-400" />
			</SliderPrimitive.Track>
			<SliderPrimitive.Thumb className="block group cursor-pointer hover:shadow-md h-5 w-5 rounded-full border border-neutral-200 bg-white active:border-neutral-300 focus:outline-none transition-all duration-200 disabled:pointer-events-none disabled:opacity-50">
				<span className="absolute z-10 group-active:z-20 border px-2 py-0.5 border-transparent group-active:rounded-md group-active:bg-neutral-50 group-active:border-neutral-200 group-active:border top-6 w-max -translate-x-[calc(50%-10px)] text-sm text-neutral-600">
					{minValue / 60} hours
				</span>
			</SliderPrimitive.Thumb>
			<SliderPrimitive.Thumb className="block group cursor-pointer hover:shadow-md h-5 w-5 rounded-full border border-neutral-200 bg-white active:border-neutral-300 focus:outline-none transition-all duration-200 disabled:pointer-events-none disabled:opacity-50">
				<span className="absolute z-10 group-active:z-20 border px-2 py-0.5 border-transparent group-active:rounded-md group-active:bg-neutral-50 group-active:border-neutral-200 group-active:border top-6 w-max -translate-x-[calc(50%-10px)] text-sm text-neutral-600">
					{maxValue / 60} hours
				</span>
			</SliderPrimitive.Thumb>
		</SliderPrimitive.Root>
	);
};

Slider.displayName = 'Slider';

export { Slider, type SliderProps };
