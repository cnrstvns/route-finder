'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSignUp } from '@clerk/nextjs';
import { Form, Formik, FormikHelpers } from 'formik';
import { useCallback, useState } from 'react';
import * as yup from 'yup';
import { faDiscord } from '@fortawesome/free-brands-svg-icons/faDiscord';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons/faGoogle';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateOauthHandler } from '../../use-create-oauth-handler';
import { PasswordInput } from '@/components/ui/password-input';

const accountInitialValues = {
  email: '',
  password: '',
};

type AccountFormValues = typeof accountInitialValues;

const accountValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Please enter an email address'),
  password: yup.string().required('Please enter your password'),
});

const verificationInitialValues = {
  code: '',
};

type VerificationValues = typeof verificationInitialValues;

const verificationValidationSchema = yup.object().shape({
  code: yup.string().required('Please enter your verification code'),
});

export default function Page() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const createOauthHandler = useCreateOauthHandler();
  const { isLoaded, signUp, setActive } = useSignUp();

  const handleSubmitAccount = useCallback(
    async (
      values: AccountFormValues,
      actions: FormikHelpers<AccountFormValues>,
    ) => {
      if (!isLoaded) return;

      try {
        await signUp.create({
          emailAddress: values.email,
          password: values.password,
        });

        await signUp.prepareEmailAddressVerification({
          strategy: 'email_code',
        });

        setIsPending(true);
      } catch (err: unknown) {
        const error = err as { errors: { code: string }[] };

        if (error.errors[0].code === 'form_password_pwned') {
          actions.setFieldError('password', 'Please use a stronger password');
        }
        console.error(JSON.stringify(err, null, 2));
      }
    },
    [isLoaded, signUp],
  );

  const handleSubmitVerification = useCallback(
    async (
      values: VerificationValues,
      actions: FormikHelpers<VerificationValues>,
    ) => {
      if (!isLoaded) return;
      setIsVerifying(true);

      try {
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code: values.code,
        });

        if (completeSignUp.status !== 'complete') {
          console.log(JSON.stringify(completeSignUp, null, 2));
          setIsVerifying(false);
        }

        if (completeSignUp.status === 'complete') {
          await setActive({ session: completeSignUp.createdSessionId });
          router.push('/home');
        }
      } catch (err: unknown) {
        const error = err as { errors: { message: string }[] };

        actions.setFieldError('code', error.errors[0].message);
        setIsVerifying(false);
      }
    },
    [isLoaded, router, setActive, signUp],
  );

  if (!isLoaded) {
    return <div className="flex w-screen h-screen dark:bg-neutral-900" />;
  }

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <Card className="p-5 w-full md:w-[350px] space-y-5 bg-white">
        <div>
          <div className="text-xl font-medium">Welcome to RouteFinder</div>
          <div className="text-sm text-neutral-500 dark:text-zinc-400">
            Choose a sign-in method
          </div>
        </div>

        <div className="flex flex-col space-y-3 w-full">
          <Button
            size="md"
            variant="secondary"
            onClick={createOauthHandler('oauth_google')}
          >
            <FontAwesomeIcon icon={faGoogle} className="size-5 mr-2" />
            Continue with Google
          </Button>
          <Button
            size="md"
            variant="secondary"
            onClick={createOauthHandler('oauth_discord')}
          >
            <FontAwesomeIcon icon={faDiscord} className="size-6 mr-2" />
            Continue with Discord
          </Button>
        </div>

        <div className="flex items-center justify-center before:content-[''] after:content-[''] before:flex-1 after:flex-1 before:border-b after:border-b before:mr-2 after:ml-2 before:border-neutral-400 dark:before:border-zinc-600 after:border-neutral-400 dark:after:border-zinc-600 text-neutral-400 dark:text-zinc-400">
          or
        </div>

        {!isPending && (
          <Formik
            validationSchema={accountValidationSchema}
            initialValues={accountInitialValues}
            onSubmit={handleSubmitAccount}
            validateOnChange={false}
          >
            {({ isValid, isSubmitting, errors, getFieldProps }) => (
              <Form>
                <div className="space-y-3">
                  <div>
                    <Label>Email address</Label>
                    <Input
                      placeholder="gavin@hooli.xyz"
                      {...getFieldProps('email')}
                    />
                    {errors.email && (
                      <div className="text-red-400 mt-2 text-xs">
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Password</Label>
                    <PasswordInput
                      placeholder="hunter2"
                      {...getFieldProps('password')}
                    />
                    {errors.password && (
                      <div className="text-red-400 mt-1 text-xs">
                        {errors.password}
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="md"
                    variant="secondary"
                    className="w-full mt-3"
                    loading={isSubmitting}
                    disabled={!isValid}
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        )}

        {isPending && (
          <Formik
            validationSchema={verificationValidationSchema}
            initialValues={verificationInitialValues}
            onSubmit={handleSubmitVerification}
          >
            {({ isValid, isSubmitting, errors, getFieldProps }) => (
              <Form>
                <div className="space-y-3">
                  <div className="dark:text-zinc-200 !mb-6 font-medium">
                    We&apos;ve sent you a verification code. Check your email.
                  </div>

                  <div>
                    <Label>Verification code</Label>
                    <Input placeholder="123456" {...getFieldProps('code')} />
                    {errors.code && (
                      <div className="text-red-400 mt-1 text-xs">
                        {errors.code}
                      </div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    size="md"
                    variant="secondary"
                    className="w-full mt-3"
                    loading={isSubmitting || isVerifying}
                    disabled={!isValid || isVerifying || isSubmitting}
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        )}

        <div className="text-sm text-neutral-700 dark:text-zinc-400">
          Already have an account?{' '}
          <Link
            className="font-medium dark:text-zinc-200 hover:underline"
            href="/sign-in"
          >
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}
