import { useState } from 'react';
import { Application } from '../../types';
import ApplicationTable from '../dashboard/ApplicationTable/ApplicationTable';
import ApplicationModal from '../dashboard/ApplicationModal/ApplicationModal';
import ApplicationViewModal from '../dashboard/ApplicationViewModal/ApplicationViewModal';
import NotesModal from '../notes/NotesModal/NotesModal';
import { Button, ConfirmDialog } from '../common';
import { useAppDispatch } from '../../redux/hooks';
import { deleteApplicationAsync } from '../../redux/slices/applicationsSlice';
import './DashboardPage.scss';

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewApplication, setViewApplication] = useState<Application | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [notesApplication, setNotesApplication] = useState<Application | null>(null);

  const handleAddApplication = () => {
    setIsAddModalOpen(true);
  };

  const handleEdit = (application: Application) => {
    setSelectedApplication(application);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setApplicationToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (applicationToDelete) {
      dispatch(deleteApplicationAsync(applicationToDelete));
      setApplicationToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setApplicationToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleView = (application: Application) => {
    setViewApplication(application);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewApplication(null);
  };

  const handleEditFromView = (application: Application) => {
    setIsViewModalOpen(false);
    setViewApplication(null);
    setSelectedApplication(application);
    setIsEditModalOpen(true);
  };

  const handleViewNotes = (application: Application) => {
    setNotesApplication(application);
    setIsNotesModalOpen(true);
  };

  const handleCloseNotesModal = () => {
    setIsNotesModalOpen(false);
    setNotesApplication(null);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedApplication(null);
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__container">
        {/* Header */}
        <div className="dashboard-page__header">
          <div>
            <h1 className="dashboard-page__title">Applications</h1>
            <p className="dashboard-page__subtitle">
              Track and manage your job applications
            </p>
          </div>
          <div className="dashboard-page__actions">
            <Button onClick={handleAddApplication}>Add Application</Button>
          </div>
        </div>

        {/* Table */}
        <ApplicationTable
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewNotes={handleViewNotes}
        />
      </div>

      {/* Add Application Modal */}
      <ApplicationModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        mode="add"
      />

      {/* Edit Application Modal */}
      {selectedApplication && (
        <ApplicationModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          mode="edit"
          application={selectedApplication}
        />
      )}

      {/* View Modal */}
      {viewApplication && (
        <ApplicationViewModal
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
          application={viewApplication}
          onEdit={handleEditFromView}
        />
      )}

      {/* Notes Modal */}
      {notesApplication && (
        <NotesModal
          isOpen={isNotesModalOpen}
          onClose={handleCloseNotesModal}
          application={notesApplication}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Application"
        message="Are you sure you want to delete this application? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default DashboardPage;
