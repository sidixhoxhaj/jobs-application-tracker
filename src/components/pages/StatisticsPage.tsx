// Statistics Page
// Display charts and analytics for job applications

import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { Button, ConfirmDialog } from '../common';
import DynamicChart from '../statistics/DynamicChart/DynamicChart';
import DynamicOverviewCard from '../statistics/DynamicOverviewCard/DynamicOverviewCard';
import ChartConfigModal from '../statistics/ChartConfigModal/ChartConfigModal';
import OverviewCardConfigModal from '../statistics/OverviewCardConfigModal/OverviewCardConfigModal';
import {
  initializeConfigs,
  deleteChart,
  deleteOverviewCard,
} from '../../redux/slices/chartConfigsSlice';
import { ChartConfig, OverviewCardConfig } from '../../types';
import './StatisticsPage.scss';

const StatisticsPage = () => {
  const dispatch = useAppDispatch();
  const customFields = useAppSelector((state) => state.customFields.fields);
  const charts = useAppSelector((state) => state.chartConfigs.charts);
  const overviewCards = useAppSelector((state) => state.chartConfigs.overviewCards);
  const initialized = useAppSelector((state) => state.chartConfigs.initialized);

  // Chart Config Modal state
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [chartModalMode, setChartModalMode] = useState<'add' | 'edit'>('add');
  const [editingChart, setEditingChart] = useState<ChartConfig | undefined>();

  // Overview Card Config Modal state
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [cardModalMode, setCardModalMode] = useState<'add' | 'edit'>('add');
  const [editingCard, setEditingCard] = useState<OverviewCardConfig | undefined>();

  // Delete confirmation state
  const [isDeleteChartDialogOpen, setIsDeleteChartDialogOpen] = useState(false);
  const [deletingChartId, setDeletingChartId] = useState<string | null>(null);
  const [isDeleteCardDialogOpen, setIsDeleteCardDialogOpen] = useState(false);
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);

  // Initialize configurations on mount
  useEffect(() => {
    if (!initialized) {
      // Find status field ID for default chart
      const statusField = customFields.find(
        (f) =>
          f.name.toLowerCase() === 'status' ||
          f.type === 'select'
      );
      dispatch(initializeConfigs({ statusFieldId: statusField?.id }));
    }
  }, [initialized, customFields, dispatch]);

  // Chart handlers
  const handleCreateChart = () => {
    if (charts.length >= 4) {
      alert('Maximum 4 charts allowed. Please delete a chart before adding a new one.');
      return;
    }
    setChartModalMode('add');
    setEditingChart(undefined);
    setIsChartModalOpen(true);
  };

  const handleEditChart = (config: ChartConfig) => {
    setChartModalMode('edit');
    setEditingChart(config);
    setIsChartModalOpen(true);
  };

  const handleDeleteChart = (id: string) => {
    setDeletingChartId(id);
    setIsDeleteChartDialogOpen(true);
  };

  const confirmDeleteChart = () => {
    if (deletingChartId) {
      dispatch(deleteChart(deletingChartId));
      setDeletingChartId(null);
      setIsDeleteChartDialogOpen(false);
    }
  };

  // Overview card handlers
  const handleCreateCard = () => {
    if (overviewCards.length >= 4) {
      alert('Maximum 4 overview cards allowed. Please delete a card before adding a new one.');
      return;
    }
    setCardModalMode('add');
    setEditingCard(undefined);
    setIsCardModalOpen(true);
  };

  const handleEditCard = (config: OverviewCardConfig) => {
    setCardModalMode('edit');
    setEditingCard(config);
    setIsCardModalOpen(true);
  };

  const handleDeleteCard = (id: string) => {
    setDeletingCardId(id);
    setIsDeleteCardDialogOpen(true);
  };

  const confirmDeleteCard = () => {
    if (deletingCardId) {
      dispatch(deleteOverviewCard(deletingCardId));
      setDeletingCardId(null);
      setIsDeleteCardDialogOpen(false);
    }
  };

  return (
    <div className="statistics-page">
      <div className="statistics-page__container">
        <div className="statistics-page__header">
          <div>
              <h1 className="statistics-page__title">Statistics Dashboard</h1>
            <p className="statistics-page__description">
              Create custom charts and metrics to track what matters most to you
            </p>
          </div>
        </div>

        {/* Overview Section */}
        <div className="statistics-page__overview">
          <div className="statistics-page__section-header">
            <h2 className="statistics-page__section-title">Overview</h2>
            <Button
              onClick={handleCreateCard}
              disabled={overviewCards.length >= 4}
              size="small"
            >
              + Add Metric
            </Button>
          </div>

          {overviewCards.length === 0 ? (
            <div className="statistics-page__empty-state">
              <p>No overview metrics configured.</p>
              <p className="statistics-page__empty-hint">
                Click "Add Metric" to create your first metric card.
              </p>
            </div>
          ) : (
            <div className="statistics-page__overview-grid">
              {overviewCards.map((card) => (
                <DynamicOverviewCard
                  key={card.id}
                  config={card}
                  onEdit={handleEditCard}
                  onDelete={handleDeleteCard}
                />
              ))}
            </div>
          )}
        </div>

        {/* Charts Section */}
        <div className="statistics-page__charts">
          <div className="statistics-page__section-header">
            <h2 className="statistics-page__section-title">Charts</h2>
            <Button
              onClick={handleCreateChart}
              disabled={charts.length >= 4}
              size="small"
            >
              + Create Chart
            </Button>
          </div>

          {charts.length === 0 ? (
            <div className="statistics-page__empty-state">
              <p>No charts configured.</p>
              <p className="statistics-page__empty-hint">
                Click "Create Chart" to visualize your data.
              </p>
            </div>
          ) : (
            <div className="statistics-page__charts-grid">
              {charts.map((chart) => (
                <DynamicChart
                  key={chart.id}
                  config={chart}
                  onEdit={handleEditChart}
                  onDelete={handleDeleteChart}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart Config Modal */}
      <ChartConfigModal
        isOpen={isChartModalOpen}
        onClose={() => setIsChartModalOpen(false)}
        mode={chartModalMode}
        existingConfig={editingChart}
      />

      {/* Overview Card Config Modal */}
      <OverviewCardConfigModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        mode={cardModalMode}
        existingConfig={editingCard}
      />

      {/* Delete Chart Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteChartDialogOpen}
        onClose={() => setIsDeleteChartDialogOpen(false)}
        onConfirm={confirmDeleteChart}
        title="Delete Chart"
        message="Are you sure you want to delete this chart? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Delete Card Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteCardDialogOpen}
        onClose={() => setIsDeleteCardDialogOpen(false)}
        onConfirm={confirmDeleteCard}
        title="Delete Metric"
        message="Are you sure you want to delete this metric card? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default StatisticsPage;
