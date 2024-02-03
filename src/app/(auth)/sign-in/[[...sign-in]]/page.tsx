'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSignIn } from '@clerk/nextjs';
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

const initialValues = {
  email: '',
  password: '',
};

type FormValues = typeof initialValues;

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Please enter an email address'),
  password: yup.string().required('Please enter your password'),
});

export default function Page() {
  const router = useRouter();
  const createOauthHandler = useCreateOauthHandler();
  const [usingEmail, setUsingEmail] = useState(false);
  const { isLoaded, signIn, setActive } = useSignIn();

  const handleUseEmail = () => {
    setUsingEmail(true);
  };

  const handleSubmit = useCallback(
    async (values: FormValues, actions: FormikHelpers<FormValues>) => {
      if (!isLoaded) return;

      try {
        const result = await signIn.create({
          identifier: values.email,
          password: values.password,
        });

        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId });
          router.push('/home');
        } else {
          console.log(result);
        }
      } catch (err: unknown) {
        const error = err as { errors: { message: string }[] };
        if (error.errors[0].message === 'Session already exists') {
          router.push('/home');
          return;
        }

        if (error.errors[0].message === 'Invalid authentication strategy') {
          actions.setFieldError(
            'password',
            'Try signing in with a different provider.',
          );
          return;
        }

        actions.setFieldError('password', error.errors[0].message);
      }
    },
    [isLoaded, signIn, setActive, router],
  );

  if (!isLoaded) {
    return (
      <div className="flex w-screen h-screen bg-neutral-50 dark:bg-neutral-900" />
    );
  }

  return (
    <div className="flex w-screen h-screen items-center justify-center dark:bg-neutral-900">
      <Card className="p-5 w-full md:w-[350px] space-y-5">
        <div>
          <div className="text-xl font-medium">Welcome back</div>
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
            Sign in with Google
          </Button>
          <Button
            size="md"
            variant="secondary"
            onClick={createOauthHandler('oauth_discord')}
          >
            <FontAwesomeIcon icon={faDiscord} className="size-6 mr-2" />
            Sign in with Discord
          </Button>
        </div>

        <div className="flex items-center justify-center before:content-[''] after:content-[''] before:flex-1 after:flex-1 before:border-b after:border-b before:mr-2 after:ml-2 before:border-neutral-400 dark:before:border-zinc-600 after:border-neutral-400 dark:after:border-zinc-600 text-neutral-400 dark:text-zinc-400">
          or
        </div>

        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validateOnChange={false}
        >
          {({ isValid, isSubmitting, errors, getFieldProps }) => (
            <Form>
              <div className="space-y-3">
                <div>
                  <Label>
                    {usingEmail ? 'Email address' : 'Sign in with email'}
                  </Label>
                  <Input
                    placeholder="gavin@hooli.xyz"
                    {...getFieldProps('email')}
                  />
                  {errors.email && (
                    <div className="text-red-400 mt-1 text-xs">
                      {errors.email}
                    </div>
                  )}
                </div>

                {usingEmail && (
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
                )}
                {!usingEmail && (
                  <Button
                    size="md"
                    variant="secondary"
                    className="w-full mt-3"
                    onClick={handleUseEmail}
                    disabled={!!errors.email}
                  >
                    Continue with email
                  </Button>
                )}
                {usingEmail && (
                  <Button
                    type="submit"
                    size="md"
                    variant="secondary"
                    className="w-full mt-3"
                    loading={isSubmitting}
                    disabled={!isValid || isSubmitting}
                  >
                    Submit
                  </Button>
                )}
              </div>
            </Form>
          )}
        </Formik>

        <div className="text-sm text-neutral-700 dark:text-zinc-400">
          Don't have an account?{' '}
          <Link
            className="font-medium dark:text-zinc-200 hover:underline"
            href="/sign-up"
          >
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
}
