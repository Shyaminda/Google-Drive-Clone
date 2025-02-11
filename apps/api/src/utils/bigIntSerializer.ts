export const serializeBigInt = (data: unknown) =>
	JSON.parse(
		JSON.stringify(data, (_, value) =>
			typeof value === "bigint" ? value.toString() : value,
		),
	);
