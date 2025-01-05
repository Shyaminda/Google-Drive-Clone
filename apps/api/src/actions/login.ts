import { loginSchema } from "@repo/types";
import { z } from "zod";

export const login = async (values: z.infer<typeof loginSchema>) => {
	const validateFields = loginSchema.safeParse(values);

	if (!validateFields.success) {
		return { error: "Invalid fields" };
	}

	const { email, password } = validateFields.data;
};
