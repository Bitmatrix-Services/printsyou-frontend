import {FC, useEffect} from 'react';
import {useFormContext} from 'react-hook-form';
import posthog from 'posthog-js';

export const UserInfoCapture: FC<{nameField: string; emailField: string}> = ({nameField, emailField}) => {
  const {watch} = useFormContext();

  const nameValue = watch(nameField);
  const emailFieldValue = watch(emailField);

  useEffect(() => {
    const interval = setInterval(() => {
      posthog.setPersonProperties({name: nameValue});
    }, 3000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [nameValue]);

  useEffect(() => {
    const interval = setInterval(() => {
      posthog.setPersonProperties({email: emailFieldValue});
    }, 3000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [emailFieldValue]);

  return null;
};
