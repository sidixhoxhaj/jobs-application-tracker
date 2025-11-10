import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { addField, updateField, deleteField, reorderFields, saveCustomFieldsAsync } from '../../redux/slices/customFieldsSlice';
import { CustomField } from '../../types';
import Button from '../common/Button/Button';
import FieldList from '../customFields/FieldList/FieldList';
import FieldModal from '../customFields/FieldModal/FieldModal';
import ConfirmDialog from '../common/ConfirmDialog/ConfirmDialog';
import './CustomFieldsPage.scss';

const CustomFieldsPage = () => {
  const dispatch = useAppDispatch();
  const customFields = useAppSelector(state => state.customFields.fields);
  const applications = useAppSelector(state => state.applications.items);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingField, setEditingField] = useState<CustomField | undefined>(undefined);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<CustomField | null>(null);

  const handleAddField = () => {
    setModalMode('add');
    setEditingField(undefined);
    setIsModalOpen(true);
  };

  const handleEditField = (field: CustomField) => {
    setModalMode('edit');
    setEditingField(field);
    setIsModalOpen(true);
  };

  const handleSaveField = (fieldData: Omit<CustomField, 'id' | 'order'>) => {
    if (modalMode === 'add') {
      // Generate new field ID and order
      const newField: CustomField = {
        ...fieldData,
        id: `field_${Date.now()}`,
        order: customFields.length > 0 ? Math.max(...customFields.map(f => f.order)) + 1 : 1,
      };
      dispatch(addField(newField));

      // Save to storage (Supabase or localStorage)
      const updatedFields = [...customFields, newField];
      dispatch(saveCustomFieldsAsync(updatedFields));
    } else if (modalMode === 'edit' && editingField) {
      // Update existing field
      const updatedField: CustomField = {
        ...editingField,
        ...fieldData,
      };
      dispatch(updateField(updatedField));

      // Save to storage (Supabase or localStorage)
      const updatedFields = customFields.map(f =>
        f.id === updatedField.id ? updatedField : f
      );
      dispatch(saveCustomFieldsAsync(updatedFields));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingField(undefined);
  };

  const handleDeleteField = (field: CustomField) => {
    setFieldToDelete(field);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!fieldToDelete) return;

    // Delete field from Redux
    dispatch(deleteField(fieldToDelete.id));

    // Save to storage (Supabase or localStorage)
    const updatedFields = customFields.filter(f => f.id !== fieldToDelete.id);
    dispatch(saveCustomFieldsAsync(updatedFields));

    setFieldToDelete(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setFieldToDelete(null);
  };

  // Count how many applications use this field
  const getFieldUsageCount = (fieldId: string): number => {
    return applications.filter((app: any) => {
      const fieldValue = app.data[fieldId];
      return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
    }).length;
  };

  const getDeleteMessage = (): string => {
    if (!fieldToDelete) return '';

    const usageCount = getFieldUsageCount(fieldToDelete.id);

    if (usageCount === 0) {
      return `Are you sure you want to delete the field "${fieldToDelete.name}"? This action cannot be undone.`;
    }

    return `Are you sure you want to delete the field "${fieldToDelete.name}"? This field contains data in ${usageCount} application${usageCount > 1 ? 's' : ''}. The data will be preserved but will no longer be visible.`;
  };

  const handleMoveFieldUp = (field: CustomField) => {
    const sortedFields = [...customFields].sort((a, b) => a.order - b.order);
    const currentIndex = sortedFields.findIndex(f => f.id === field.id);

    if (currentIndex <= 0) return; // Already at top

    // Swap with previous field
    const updatedFields = [...sortedFields];
    const temp = updatedFields[currentIndex];
    updatedFields[currentIndex] = updatedFields[currentIndex - 1];
    updatedFields[currentIndex - 1] = temp;

    // Update order values
    const fieldsWithUpdatedOrder = updatedFields.map((f, index) => ({
      ...f,
      order: index + 1,
    }));

    // Dispatch to Redux
    dispatch(reorderFields(fieldsWithUpdatedOrder));

    // Save to storage (Supabase or localStorage)
    dispatch(saveCustomFieldsAsync(fieldsWithUpdatedOrder));
  };

  const handleMoveFieldDown = (field: CustomField) => {
    const sortedFields = [...customFields].sort((a, b) => a.order - b.order);
    const currentIndex = sortedFields.findIndex(f => f.id === field.id);

    if (currentIndex >= sortedFields.length - 1) return; // Already at bottom

    // Swap with next field
    const updatedFields = [...sortedFields];
    const temp = updatedFields[currentIndex];
    updatedFields[currentIndex] = updatedFields[currentIndex + 1];
    updatedFields[currentIndex + 1] = temp;

    // Update order values
    const fieldsWithUpdatedOrder = updatedFields.map((f, index) => ({
      ...f,
      order: index + 1,
    }));

    // Dispatch to Redux
    dispatch(reorderFields(fieldsWithUpdatedOrder));

    // Save to storage (Supabase or localStorage)
    dispatch(saveCustomFieldsAsync(fieldsWithUpdatedOrder));
  };

  return (
    <div className="custom-fields-page">
      <div className="custom-fields-page__container">
        <div className="custom-fields-page__header">
          <div>
            <h1 className="custom-fields-page__title">Custom Fields</h1>
            <p className="custom-fields-page__subtitle">
              Manage your application fields. Add, edit, remove, or reorder fields to customize your tracking experience.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleAddField}
          >
            Add New Field
          </Button>
        </div>
        <div className="custom-fields-page__content">
          <FieldList
            fields={customFields}
            onEditField={handleEditField}
            onDeleteField={handleDeleteField}
            onMoveUp={handleMoveFieldUp}
            onMoveDown={handleMoveFieldDown}
          />
        </div>

        <FieldModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveField}
          mode={modalMode}
          field={editingField}
        />

        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleConfirmDelete}
          title="Delete Field"
          message={getDeleteMessage()}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          confirmButtonVariant="danger"
        />
      </div>
    </div>  
  );
};

export default CustomFieldsPage;
