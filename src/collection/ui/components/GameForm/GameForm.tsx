import { AddGameDTO } from '@Collection/application/dtos/AddGameDTO';
import { EditGameDTO } from '@Collection/application/dtos/EditGameDTO';
import type { ApplicationErrorInterface } from '@Collection/application/errors/ApplicationErrorInterface';
import type { Game } from '@Collection/domain/entities/Game';
import { Format } from '@Collection/domain/value-objects/Format';
import { GameDescription } from '@Collection/domain/value-objects/GameDescription';
import { GameTitle } from '@Collection/domain/value-objects/GameTitle';
import { Platform } from '@Collection/domain/value-objects/Platform';
import { Status, StatusType } from '@Collection/domain/value-objects/Status';
import cloudIcon from '@pplancq/shelter-ui-icon/icon/cloud.svg';
import compactDiscIcon from '@pplancq/shelter-ui-icon/icon/compact-disc.svg';
import { Button } from '@pplancq/shelter-ui-react';
import type { Result } from '@Shared/domain/result/Result';
import type { DateFormatterInterface } from '@Shared/domain/utils/DateFormatterInterface';
import { SHARED_SERVICES } from '@Shared/serviceIdentifiers';
import { FormatToggleOption } from '@Shared/ui/components/FormatToggleOption/FormatToggleOption';
import { FormDevTool } from '@Shared/ui/components/FormDevTool/FormDevTool';
import { FormInputField } from '@Shared/ui/components/formField/FormInputField/FormInputField';
import { FormRadioGroup } from '@Shared/ui/components/formField/FormRadioGroup/FormRadioGroup';
import { FormSelectField } from '@Shared/ui/components/formField/FormSelectField/FormSelectField';
import { FormTextAreaField } from '@Shared/ui/components/formField/FormTextAreaField/FormTextAreaField';
import { useService } from '@Shared/ui/hooks/useService/useService';
import { FormProvider, useForm } from 'react-hook-form';

const PLATFORMS = ['PlayStation 5', 'PlayStation 4', 'Xbox Series X|S', 'Xbox One', 'Nintendo Switch', 'PC'];

const FORMATS = [
  { value: 'Physical', label: 'Physical', icon: compactDiscIcon as string },
  { value: 'Digital', label: 'Digital', icon: cloudIcon as string },
] as const;

const STATUS_OPTIONS = Object.values(StatusType);

type GameFormData = {
  title: string;
  platform: string;
  format: string;
  purchaseDate: string;
  description: string;
  status: string;
};

export type GameFormInitialData = {
  title: string;
  platform: string;
  format: string;
  purchaseDate: string;
  description: string;
  status: string;
};

type GameFormAddProps = {
  edit?: false;
  gameId?: never;
  initialData?: never;
  /**
   * Called with the built AddGameDTO when the form is submitted in add mode.
   * Typically bound to `store.addGame`.
   */
  onSubmit: (dto: AddGameDTO) => Promise<Result<Game, ApplicationErrorInterface>>;
  /** Called after a successful add submission */
  onSuccess?: () => void;
  /** Called when the cancel button is clicked */
  onCancel?: () => void;
};

type GameFormEditProps = {
  /** When true, switches to edit mode (pre-populated form, cancel button) */
  edit: true;
  /** The ID of the game being edited */
  gameId: string;
  /** Pre-populated values for edit mode */
  initialData: GameFormInitialData;
  /**
   * Called with the built EditGameDTO when the form is submitted in edit mode.
   * Typically bound to `store.editGame`.
   */
  onSubmit: (dto: EditGameDTO) => Promise<Result<Game, ApplicationErrorInterface>>;
  /** Called after a successful edit submission */
  onSuccess?: () => void;
  /** Called when the cancel button is clicked */
  onCancel?: () => void;
};

type GameFormProps = GameFormAddProps | GameFormEditProps;

export const GameForm = ({ edit = false, gameId, initialData, onSuccess, onCancel, onSubmit }: GameFormProps) => {
  const dateFormatter = useService<DateFormatterInterface>(SHARED_SERVICES.DateFormatter);

  const methods = useForm<GameFormData>({
    defaultValues:
      edit && initialData
        ? {
            title: initialData.title,
            platform: initialData.platform,
            format: initialData.format,
            purchaseDate: initialData.purchaseDate,
            description: initialData.description,
            status: initialData.status,
          }
        : {
            title: '',
            platform: '',
            format: 'Physical',
            purchaseDate: dateFormatter.toLocalDateString(new Date()),
            description: '',
            status: StatusType.OWNED,
          },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onFormSubmit = async (data: GameFormData) => {
    if (edit && onSubmit && gameId) {
      const dto = new EditGameDTO(
        gameId,
        data.title,
        data.description,
        data.purchaseDate ? dateFormatter.fromLocalDateString(data.purchaseDate) : null,
        data.status,
      );

      const result = await onSubmit(dto);

      if (result.isOk()) {
        onSuccess?.();
      }
    } else {
      const dto = new AddGameDTO(
        crypto.randomUUID(),
        data.title,
        data.description,
        data.platform,
        data.format,
        data.purchaseDate ? dateFormatter.fromLocalDateString(data.purchaseDate) : null,
        'Owned',
      );

      const result = await onSubmit(dto);

      if (result.isOk()) {
        reset();
        onSuccess?.();
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <FormDevTool />
      <form onSubmit={handleSubmit(onFormSubmit)} noValidate aria-label={edit ? 'Edit game form' : 'Add game form'}>
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

        {edit ? null : (
          <>
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
              {FORMATS.map(({ value, label, icon }) => (
                <FormatToggleOption key={value} label={label} value={value} icon={icon} />
              ))}
            </FormRadioGroup>
          </>
        )}

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

        {edit ? (
          <FormSelectField
            name="status"
            label="Status"
            required
            rules={{
              validate: value => {
                const result = Status.create(value);

                return result.isOk() || result.getError().message;
              },
            }}
          >
            {STATUS_OPTIONS.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </FormSelectField>
        ) : null}

        <Button type="submit" disabled={isSubmitting}>
          {edit ? 'Save changes' : 'Add game'}
        </Button>

        {edit ? (
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </form>
    </FormProvider>
  );
};
