import { AddGameDTO } from '@Collection/application/dtos/AddGameDTO';
import type { AddGameUseCaseInterface } from '@Collection/application/use-cases/AddGameUseCaseInterface';
import { Format } from '@Collection/domain/value-objects/Format';
import { GameDescription } from '@Collection/domain/value-objects/GameDescription';
import { GameTitle } from '@Collection/domain/value-objects/GameTitle';
import { Platform } from '@Collection/domain/value-objects/Platform';
import { COLLECTION_SERVICES } from '@Collection/serviceIdentifiers';
import { Alert, Button, RadioOption } from '@pplancq/shelter-ui-react';
import { FormDevTool } from '@Shared/ui/components/FormDevTool/FormDevTool';
import { FormInputField } from '@Shared/ui/components/formField/FormInputField/FormInputField';
import { FormRadioGroup } from '@Shared/ui/components/formField/FormRadioGroup/FormRadioGroup';
import { FormSelectField } from '@Shared/ui/components/formField/FormSelectField/FormSelectField';
import { FormTextAreaField } from '@Shared/ui/components/formField/FormTextAreaField/FormTextAreaField';
import type { DateFormatterInterface } from '@Shared/domain/utils/DateFormatterInterface';
import { SHARED_SERVICES } from '@Shared/serviceIdentifiers';
import { useService } from '@Shared/ui/hooks/useService/useService';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const PLATFORMS = ['PlayStation 5', 'PlayStation 4', 'Xbox Series X|S', 'Xbox One', 'Nintendo Switch', 'PC'];

const FORMATS = ['Physical', 'Digital'] as const;

const ERROR_MESSAGES: Record<string, string> = {
  Repository: 'An error occurred while saving the game. Please try again.',
  Validation: 'Please check your input and try again.',
};

type GameFormData = {
  title: string;
  platform: string;
  format: string;
  purchaseDate: string;
  description: string;
};

export const GameForm = () => {
  const addGameUseCase = useService<AddGameUseCaseInterface>(COLLECTION_SERVICES.AddGameUseCase);
  const dateFormatter = useService<DateFormatterInterface>(SHARED_SERVICES.DateFormatter);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const methods = useForm<GameFormData>({
    defaultValues: {
      title: '',
      platform: '',
      format: 'Physical',
      purchaseDate: dateFormatter.toLocalDateString(new Date()),
      description: '',
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: GameFormData) => {
    setSuccessMessage(null);
    setGlobalError(null);

    const dto = new AddGameDTO(
      crypto.randomUUID(),
      data.title,
      data.description,
      data.platform,
      data.format,
      data.purchaseDate ? dateFormatter.fromLocalDateString(data.purchaseDate) : null,
      'Owned',
    );

    const result = await addGameUseCase.execute(dto);

    if (result.isOk()) {
      setSuccessMessage('Game added successfully');
      reset();
    } else {
      setGlobalError(ERROR_MESSAGES[result.getError().type] ?? 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <FormProvider {...methods}>
      <FormDevTool />
      <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Add game form">
        {successMessage ? (
          <Alert
            variant="success"
            title={successMessage}
            role="status"
            onClose={() => setSuccessMessage(null)}
            buttonLabel="Close"
          />
        ) : null}
        {globalError ? (
          <Alert
            variant="error"
            title="Unable to add game"
            role="alert"
            onClose={() => setGlobalError(null)}
            buttonLabel="Close"
          >
            {globalError}
          </Alert>
        ) : null}

        <FormInputField
          name="title"
          label="Game title"
          required
          autoComplete="off"
          rules={{
            validate: value => {
              const result = GameTitle.create(value);

              return result.isOk() || result.getError().message;
            },
          }}
        />

        <FormSelectField
          name="platform"
          label="Platform"
          required
          rules={{
            validate: value => {
              const result = Platform.create(value);

              return result.isOk() || result.getError().message;
            },
          }}
        >
          <option value="">Select a platform</option>
          {PLATFORMS.map(platform => (
            <option key={platform} value={platform}>
              {platform}
            </option>
          ))}
        </FormSelectField>

        <FormRadioGroup
          name="format"
          label="Format"
          required
          itemsLayout="inline"
          rules={{
            validate: value => {
              const result = Format.create(value);

              return result.isOk() || result.getError().message;
            },
          }}
        >
          {FORMATS.map(format => (
            <RadioOption key={format} label={format} value={format} />
          ))}
        </FormRadioGroup>

        <FormInputField name="purchaseDate" label="Purchase date" type="date" />

        <FormTextAreaField
          name="description"
          label="Description"
          textHelper="Optional — max 1000 characters"
          rules={{
            validate: value => {
              const result = GameDescription.create(value);

              return result.isOk() || result.getError().message;
            },
          }}
          rows={4}
        />

        <Button type="submit" disabled={isSubmitting}>
          Add game
        </Button>
      </form>
    </FormProvider>
  );
};
