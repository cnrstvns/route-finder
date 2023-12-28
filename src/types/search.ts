export type Paginated = {
	searchParams: {
		page?: string;
	};
};

export type PaginatedWithQuery = {
	searchParams: {
		q?: string;
		page?: string;
	};
};

export type SearchWithQuery = {
	searchParams: {
		q?: string;
	};
};
