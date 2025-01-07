"use client";

import { newVerification } from "@/actions/new-verification";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { FormSuccess } from "@/components/ui/form-success";
import { FormError } from "@/components/ui/form-error";

export const NewVerificationForm = () => {
	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();
	const searchParams = useSearchParams();

	const token = searchParams.get("token");

	const onSubmit = useCallback(async () => {
		if (success || error) return;

		if (!token) {
			setError("Missing token!");
			return;
		}
		newVerification(token)
			.then((data) => {
				setSuccess(data.success);
				setError(data.error);
			})
			.catch(() => {
				setError("An error occurred!");
			});
	}, [token, success, error]);

	useEffect(() => {
		onSubmit();
	}, [onSubmit]);

	return (
		<CardWrapper
			headerLabel="Confirming your verification"
			backButtonLabel="Back to login"
			backButtonHref="/auth/login"
			formLabel="Verification"
		>
			<div className="flex items-center justify-center w-full">
				{!success && !error && <BeatLoader />}
				<FormSuccess message={success} />
				{!success && <FormError message={error} />}
			</div>
		</CardWrapper>
	);
};
