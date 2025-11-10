// ApplicationModal Component
// Modal for adding or editing job applications

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { addApplicationAsync, updateApplicationAsync } from '../../../redux/slices/applicationsSlice';
import { Application } from '../../../types';
import { Modal, Button, ModalFooter } from '../../common';
import DynamicForm, { FormData, FormErrors } from './DynamicForm';
import './ApplicationModal.scss';

export interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  application?: Application;
}

const ApplicationModal = ({
  isOpen,
  onClose,
  mode,
  application,
}: ApplicationModalProps) => {
  const dispatch = useAppDispatch();
  const fields = useAppSelector((state) => state.customFields.fields);

  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (mode === 'edit' && application) {
      setFormData(application.data);
    } else {
      // Initialize with default values
      const initialData: FormData = {};
      fields.forEach((field) => {
        if (field.defaultValue !== undefined) {
          initialData[field.id] = field.defaultValue;
        } else if (field.type === 'checkbox') {
          initialData[field.id] = false;
        } else {
          initialData[field.id] = '';
        }
      });
      setFormData(initialData);
    }
    setErrors({});
  }, [mode, application, fields, isOpen]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    // Clear error for this field when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    fields.forEach((field) => {
      const value = formData[field.id];

      // Required field validation
      if (field.required) {
        if (
          value === undefined ||
          value === null ||
          value === '' ||
          (field.type === 'checkbox' && !value)
        ) {
          newErrors[field.id] = `${field.name} is required`;
          return;
        }
      }

      // Type-specific validation
      if (value && value !== '') {
        if (field.type === 'number' && isNaN(Number(value))) {
          newErrors[field.id] = `${field.name} must be a valid number`;
        }

        if (field.type === 'date') {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            newErrors[field.id] = `${field.name} must be a valid date`;
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const timestamp = new Date().toISOString();

      if (mode === 'add') {
        const newApplication: Application = {
          id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          data: formData,
          notes: [],
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        dispatch(addApplicationAsync(newApplication));
      } else if (mode === 'edit' && application) {
        const updatedApp: Application = {
          ...application,
          data: formData,
          updatedAt: timestamp,
        };
        dispatch(updateApplicationAsync(updatedApp));
      }

      onClose();
    } catch (error) {
      console.error('Error saving application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'add' ? 'Add Application' : 'Edit Application'}
      size="large"
    >
      <form onSubmit={handleSubmit} className="application-modal">
        <DynamicForm
          fields={fields}
          formData={formData}
          errors={errors}
          onChange={handleFieldChange}
        />

        <ModalFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
            {mode === 'add' ? 'Add Application' : 'Save Changes'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default ApplicationModal;
