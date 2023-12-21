import { airline, airport, db, route } from '@/db';
import { faArrowRight } from '@fortawesome/pro-regular-svg-icons/faArrowRight';
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons/faChevronRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { count } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

const navigation = [
	{
		name: 'Twitter',
		href: 'https://x.com/cnrstvns',
		icon: () => (
			<svg
				className="h-6 w-6"
				aria-hidden
				fill="currentColor"
				viewBox="0 0 24 24"
			>
				<title>X</title>
				<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
			</svg>
		),
	},
	{
		name: 'GitHub',
		href: 'https://github.com/cnrstvns',
		icon: () => (
			<svg
				className="h-6 w-6"
				aria-hidden
				fill="currentColor"
				viewBox="0 0 24 24"
			>
				<title>GitHub</title>
				<path
					fillRule="evenodd"
					d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
					clipRule="evenodd"
				/>
			</svg>
		),
	},
];

const getAirlineCount = unstable_cache(
	async () => db.select({ count: count() }).from(airline),
	['airline-count'],
);

const getRouteCount = unstable_cache(
	async () => db.select({ count: count() }).from(route),
	['route-count'],
);

const getAirportCount = unstable_cache(
	async () => db.select({ count: count() }).from(airport),
	['airport-count'],
);

export default async function Page() {
	const airlineCountResult = await getAirlineCount();
	const routeCountResult = await getRouteCount();
	const airportResult = await getAirportCount();

	const stats = [
		{
			value: airlineCountResult[0].count,
			label: 'Airlines',
		},
		{
			value: routeCountResult[0].count,
			label: 'Routes',
		},
		{
			value: airportResult[0].count,
			label: 'Airports',
		},
	];

	return (
		<div className="bg-white">
			<header className="absolute inset-x-0 top-0 z-50">
				<nav
					className="flex items-center justify-between p-6 lg:px-8"
					aria-label="Global"
				>
					<div className="flex lg:flex-1">
						<a href="/" className="-m-1.5 p-1.5">
							<div className="font-semibold text-xl">
								Route<span className="text-indigo-600">Finder</span>
							</div>
						</a>
					</div>
					<div className="hidden lg:flex lg:flex-1 lg:justify-end">
						<a
							href="/home"
							className="text-sm font-semibold leading-6 text-neutral-900"
						>
							Sign in <span aria-hidden="true">&rarr;</span>
						</a>
					</div>
				</nav>
			</header>

			<div className="relative isolate pt-14">
				<svg
					className="absolute inset-0 -z-10 h-full w-full stroke-neutral-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
					aria-hidden="true"
				>
					<defs>
						<pattern
							id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
							width={200}
							height={200}
							x="50%"
							y={-1}
							patternUnits="userSpaceOnUse"
						>
							<path d="M100 200V.5M.5 .5H200" fill="none" />
						</pattern>
					</defs>
					<svg x="50%" y={-1} className="overflow-visible fill-neutral-50">
						<title>background</title>
						<path
							d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
							strokeWidth={0}
						/>
					</svg>
					<rect
						width="100%"
						height="100%"
						strokeWidth={0}
						fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"
					/>
				</svg>
				<div className="flex items-center justify-center py-40 px-10 md:px-0 text-center">
					<div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
						<div className="flex items-center w-full justify-center">
							<div className="relative flex items-center gap-x-4 rounded-full px-4 py-1 text-sm leading-6 text-neutral-600 ring-1 transition-all ring-neutral-900/10 hover:ring-neutral-900/20">
								<span className="font-semibold text-indigo-600">
									Beta Release
								</span>
								<span
									className="h-4 w-px bg-neutral-900/10"
									aria-hidden="true"
								/>
								<a href="/home" className="flex items-center gap-x-1">
									<span className="absolute inset-0" aria-hidden="true" />
									Available now for all users
									<FontAwesomeIcon
										className="-mr-2 h-3 w-3 text-neutral-500"
										icon={faChevronRight}
									/>
								</a>
							</div>
						</div>
						<h1 className="mt-10 max-w-4xl text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl">
							Find real-world routes to fly in your simulator
						</h1>
						<p className="mt-6 text-lg leading-8 text-neutral-600">
							We've curated over 15,000 real-world routes flown by dozens of
							airlines. Figuring out where to fly shouldn't be a chore. Get
							started today.
						</p>
						<div className="mt-10 justify-center flex items-center gap-x-6">
							<a
								href="/home"
								className="rounded-md group flex items-center bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								Get started for free
								<FontAwesomeIcon
									className="h-5 w-5 ml-3 pr-1 group-hover:translate-x-1 transition-transform"
									icon={faArrowRight}
								/>
							</a>
						</div>
					</div>
				</div>
				<div className="bg-white py-24 sm:py-32">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="mx-auto max-w-2xl lg:max-w-none">
							<div className="text-center">
								<h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
									Trusted by enthusiasts{' '}
									<span className="underline text-indigo-600">like you</span>
								</h2>
								<p className="mt-4 max-w-xl mx-auto text-lg leading-8 text-neutral-600">
									RouteFinder is loaded with thousands of data points to enhance
									your simulation. Our datasets are constantly being expanded to
									improve your experience.
								</p>
							</div>
							<dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-1 lg:grid-cols-3">
								{stats.map((stat) => (
									<div
										key={stat.label}
										className="flex flex-col bg-neutral-400/5 p-8"
									>
										<dt className="text-sm pt-2 font-semibold leading-6 text-neutral-600">
											{stat.label}
										</dt>
										<dd className="order-first text-5xl font-bold tracking-tight text-neutral-900">
											{stat.value.toLocaleString()}
										</dd>
									</div>
								))}
							</dl>
						</div>
					</div>
				</div>
				<footer className="bg-white">
					<div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
						<div className="flex justify-center space-x-6 md:order-2">
							{navigation.map((item) => (
								<a
									key={item.name}
									href={item.href}
									className="text-neutral-400 hover:text-neutral-500"
								>
									<span className="sr-only">{item.name}</span>
									<item.icon />
								</a>
							))}
						</div>
						<div className="mt-8 md:order-1 md:mt-0">
							<p className="text-center text-xs leading-5 text-neutral-500">
								&copy; 2023 Connor Stevens. All rights reserved.
							</p>
						</div>
					</div>
				</footer>
			</div>
		</div>
	);
}
