import {FC, useEffect} from 'react';
import {useFormContext} from 'react-hook-form';
import posthog from 'posthog-js';

export const UserInfoCapture: FC<{nameField: string; emailField: string}> = ({nameField, emailField}) => {
  const {watch} = useFormContext();

  const nameValue = watch(nameField);
  const emailFieldValue = watch(emailField);

  useEffect(() => {
    posthog.setPersonProperties({name: nameValue});
  }, [nameValue]);

  useEffect(() => {
    posthog.setPersonProperties({email: emailFieldValue});
  }, [emailFieldValue]);

  return null;
};
