import React from 'react';
import type { Report } from '../types';
import { Card } from './Card';
import { DocumentTextIcon } from './IconComponents';
import { useTranslations } from '../hooks/useTranslations';

interface ReportsProps {
  reports: Report[];
}

export const Reports: React.FC<ReportsProps> = ({ reports }) => {
  const { t } = useTranslations();

  const getReportTypeName = (type: Report['type']) => {
    if (type === 'Fertilizer Plan') return t('reportTypeFertilizer');
    if (type === 'Image Analysis') return t('reportTypeImage');
    return type;
  }

  return (
    <Card>
      <h2 className="text-xl font-bold font-display text-gray-800 border-b pb-3 mb-4">{t('reportsAndRecords')}</h2>
      {reports.length === 0 ? (
        <p className="text-gray-500 text-center py-8">{t('noReports')}</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {reports.map((report, index) => (
            <div key={index} className="flex items-start p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
              <DocumentTextIcon className="w-6 h-6 text-primary-500 mt-1 flex-shrink-0" />
              <div className="ml-4">
                <p className="font-semibold text-gray-800">{getReportTypeName(report.type)}: <span className="font-normal">{report.name}</span></p>
                <p className="text-sm text-gray-500">{report.summary}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(report.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};